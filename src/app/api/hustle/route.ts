import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod/v4";
import {
  BUSINESS_TYPES,
  UPGRADES,
  getUpgradeLevel,
  getUpgradeCost,
} from "@/lib/hustle-config";

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("start"),
    business_type: z.string(),
  }),
  z.object({
    action: z.literal("collect"),
  }),
  z.object({
    action: z.literal("upgrade"),
    upgrade_id: z.string(),
  }),
]);

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("bank_balance")
      .eq("id", user.id)
      .single();

    const { data: business } = await supabase
      .from("user_businesses")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      business,
      bankBalance: profile ? Number(profile.bank_balance) : 10000,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load business" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = actionSchema.parse(body);

    if (parsed.action === "start") {
      const bizType = BUSINESS_TYPES.find((b) => b.id === parsed.business_type);
      if (!bizType) {
        return NextResponse.json(
          { error: "Invalid business type" },
          { status: 400 }
        );
      }

      const { data: existing } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "Already have a business" },
          { status: 400 }
        );
      }

      const { data: business, error } = await supabase
        .from("user_businesses")
        .insert({
          user_id: user.id,
          business_type: bizType.id,
          revenue_per_hour: bizType.baseRevenue,
          cost_per_hour: bizType.baseCost,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to start business" },
          { status: 500 }
        );
      }

      return NextResponse.json({ business });
    }

    if (parsed.action === "collect") {
      const { data: business } = await supabase
        .from("user_businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!business) {
        return NextResponse.json(
          { error: "No business found" },
          { status: 404 }
        );
      }

      // Calculate income since last collection (cap at 24hrs)
      const now = new Date();
      const last = new Date(business.last_collected_at);
      const diffMs = now.getTime() - last.getTime();
      const hours = Math.min(diffMs / (1000 * 60 * 60), 24);
      const profitPerHour =
        Number(business.revenue_per_hour) - Number(business.cost_per_hour);
      const income = Math.round(Math.max(profitPerHour * hours, 0) * 100) / 100;

      // Add income to bank_balance
      const { data: profile } = await supabase
        .from("profiles")
        .select("bank_balance")
        .eq("id", user.id)
        .single();

      await supabase
        .from("profiles")
        .update({
          bank_balance: Math.round((Number(profile!.bank_balance) + income) * 100) / 100,
        })
        .eq("id", user.id);

      // Update business stats (total_earned + last_collected_at)
      const { data: updated, error } = await supabase
        .from("user_businesses")
        .update({
          total_earned: Number(business.total_earned) + income,
          last_collected_at: now.toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to collect" },
          { status: 500 }
        );
      }

      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("bank_balance")
        .eq("id", user.id)
        .single();

      return NextResponse.json({
        business: updated,
        collected: income,
        bankBalance: updatedProfile ? Number(updatedProfile.bank_balance) : 0,
      });
    }

    if (parsed.action === "upgrade") {
      const upgrade = UPGRADES.find((u) => u.id === parsed.upgrade_id);
      if (!upgrade) {
        return NextResponse.json(
          { error: "Invalid upgrade" },
          { status: 400 }
        );
      }

      const { data: business } = await supabase
        .from("user_businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!business) {
        return NextResponse.json(
          { error: "No business found" },
          { status: 404 }
        );
      }

      const currentUpgrades = (business.upgrades as string[]) || [];
      const currentLevel = getUpgradeLevel(currentUpgrades, upgrade.id);
      const cost = getUpgradeCost(upgrade, currentLevel);

      if (cost === null) {
        return NextResponse.json(
          { error: "Already max level" },
          { status: 400 }
        );
      }

      // Check bank balance
      const { data: profile } = await supabase
        .from("profiles")
        .select("bank_balance")
        .eq("id", user.id)
        .single();

      const bankBalance = Number(profile!.bank_balance);

      if (bankBalance < cost) {
        return NextResponse.json(
          { error: "Not enough cash" },
          { status: 400 }
        );
      }

      // Deduct from bank
      await supabase
        .from("profiles")
        .update({
          bank_balance: Math.round((bankBalance - cost) * 100) / 100,
        })
        .eq("id", user.id);

      const newUpgrades = [...currentUpgrades, upgrade.id];
      const newRevenue =
        Number(business.revenue_per_hour) + upgrade.revenueBoost;
      const newCost =
        Number(business.cost_per_hour) + upgrade.costIncrease;
      const newLevel = business.business_level + 1;

      const { data: updated, error } = await supabase
        .from("user_businesses")
        .update({
          upgrades: newUpgrades,
          revenue_per_hour: newRevenue,
          cost_per_hour: newCost,
          business_level: newLevel,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Upgrade failed" },
          { status: 500 }
        );
      }

      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("bank_balance")
        .eq("id", user.id)
        .single();

      return NextResponse.json({
        business: updated,
        bankBalance: updatedProfile ? Number(updatedProfile.bank_balance) : 0,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Hustle error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
}
