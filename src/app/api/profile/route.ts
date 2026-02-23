import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const profileUpdateSchema = z.object({
  display_name: z.string().min(1).max(30).optional(),
  year_group: z.number().int().min(10).max(13).optional(),
  stream: z.enum(["trade", "uni", "early-leaver", "military", "unsure"]).optional(),
  pathway_detail: z.string().max(100).nullable().optional(),
  has_part_time_job: z.boolean().optional(),
  financial_confidence: z.number().int().min(1).max(5).optional(),
  goals: z.array(z.string()).optional(),
  profile_tag_emoji: z.string().max(4).optional(),
  profile_tag: z.string().max(50).optional(),
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileUpdateSchema.parse(body);

    const { data: updated, error } = await supabase
      .from("profiles")
      .update(parsed)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Invalid data" },
      { status: 400 }
    );
  }
}
