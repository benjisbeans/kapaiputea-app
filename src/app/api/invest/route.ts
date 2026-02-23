import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const tradeSchema = z.object({
  stock_id: z.string().uuid(),
  trade_type: z.enum(["buy", "sell"]),
  shares: z.number().int().min(1).max(10000),
  price_per_share: z.number().positive(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get profile for bank_balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("bank_balance")
      .eq("id", user.id)
      .single();

    // Get all stocks
    const { data: stocks } = await supabase
      .from("stocks")
      .select("*")
      .order("symbol");

    // Ensure portfolio row exists (tracks that user started the game)
    const { data: portfolio } = await supabase
      .from("user_portfolios")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!portfolio) {
      await supabase
        .from("user_portfolios")
        .insert({ user_id: user.id, cash_balance: 0 });
    }

    // Get holdings with stock info
    const { data: holdings } = await supabase
      .from("user_holdings")
      .select("*, stock:stocks(*)")
      .eq("user_id", user.id);

    // Get recent trades
    const { data: trades } = await supabase
      .from("user_trades")
      .select("*, stock:stocks(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      stocks: stocks || [],
      bankBalance: profile ? Number(profile.bank_balance) : 10000,
      holdings: holdings || [],
      trades: trades || [],
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load portfolio" },
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
    const { stock_id, trade_type, shares, price_per_share } =
      tradeSchema.parse(body);

    const totalAmount = Math.round(shares * price_per_share * 100) / 100;

    // Get current bank balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("bank_balance")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const bankBalance = Number(profile.bank_balance);

    if (trade_type === "buy") {
      if (bankBalance < totalAmount) {
        return NextResponse.json(
          { error: "Not enough cash" },
          { status: 400 }
        );
      }

      // Deduct from bank
      await supabase
        .from("profiles")
        .update({
          bank_balance: Math.round((bankBalance - totalAmount) * 100) / 100,
        })
        .eq("id", user.id);

      // Upsert holding
      const { data: existing } = await supabase
        .from("user_holdings")
        .select("*")
        .eq("user_id", user.id)
        .eq("stock_id", stock_id)
        .single();

      if (existing) {
        const totalShares = existing.shares + shares;
        const totalCost =
          existing.shares * existing.avg_buy_price + shares * price_per_share;
        const newAvg = Math.round((totalCost / totalShares) * 100) / 100;

        await supabase
          .from("user_holdings")
          .update({ shares: totalShares, avg_buy_price: newAvg })
          .eq("id", existing.id);
      } else {
        await supabase.from("user_holdings").insert({
          user_id: user.id,
          stock_id,
          shares,
          avg_buy_price: price_per_share,
        });
      }
    } else {
      // Sell — check holdings
      const { data: holding } = await supabase
        .from("user_holdings")
        .select("*")
        .eq("user_id", user.id)
        .eq("stock_id", stock_id)
        .single();

      if (!holding || holding.shares < shares) {
        return NextResponse.json(
          { error: "Not enough shares" },
          { status: 400 }
        );
      }

      // Add to bank
      await supabase
        .from("profiles")
        .update({
          bank_balance: Math.round((bankBalance + totalAmount) * 100) / 100,
        })
        .eq("id", user.id);

      // Update or delete holding
      const remainingShares = holding.shares - shares;
      if (remainingShares === 0) {
        await supabase
          .from("user_holdings")
          .delete()
          .eq("id", holding.id);
      } else {
        await supabase
          .from("user_holdings")
          .update({ shares: remainingShares })
          .eq("id", holding.id);
      }
    }

    // Log trade
    await supabase.from("user_trades").insert({
      user_id: user.id,
      stock_id,
      trade_type,
      shares,
      price_per_share,
      total_amount: totalAmount,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Trade error:", error);
    return NextResponse.json(
      { error: "Trade failed" },
      { status: 400 }
    );
  }
}
