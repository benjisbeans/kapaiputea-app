import { createClient } from "@/lib/supabase/server";
import { generateProfileTag, resolveStream } from "@/lib/quiz/profile-generator";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const quizSubmitSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 quiz submissions per minute per user
    const rl = rateLimit(`quiz-submit:${user.id}`, 5);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests — slow down a bit." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = quizSubmitSchema.parse(body);
    const { answers } = parsed;

    // Generate profile tag and stream
    const profileTag = generateProfileTag(answers);
    const stream = resolveStream(answers.stream as string);

    // Update profile with quiz data
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        year_group: parseInt(answers.year_group as string),
        gender: answers.gender as string,
        stream,
        profile_tag: profileTag.name,
        profile_tag_emoji: profileTag.emoji,
        financial_confidence: parseInt(answers.financial_confidence as string),
        has_part_time_job: answers.has_part_time_job === "true",
        goals: Array.isArray(answers.goals) ? answers.goals : [],
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Save quiz responses
    const { data: questions } = await supabase
      .from("quiz_questions")
      .select("id, field_key");

    if (questions) {
      const questionMap = new Map(questions.map((q) => [q.field_key, q.id]));
      const responses = Object.entries(answers)
        .filter(([key]) => questionMap.has(key))
        .map(([key, value]) => ({
          user_id: user.id,
          question_id: questionMap.get(key)!,
          answer_value: Array.isArray(value) ? JSON.stringify(value) : value,
        }));

      if (responses.length > 0) {
        await supabase.from("quiz_responses").upsert(responses, {
          onConflict: "user_id,question_id",
        });
      }
    }

    // Award quiz completion XP
    await supabase.from("xp_transactions").insert({
      user_id: user.id,
      amount: 100,
      source: "quiz-complete",
      description: "Completed onboarding quiz",
    });

    // Update total XP atomically
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("total_xp")
      .eq("id", user.id)
      .single();

    await supabase
      .from("profiles")
      .update({ total_xp: (currentProfile?.total_xp ?? 0) + 100 })
      .eq("id", user.id);

    // Get suggested modules for this stream
    const { data: modules } = await supabase
      .from("modules")
      .select("*")
      .contains("streams", [stream])
      .eq("is_published", true)
      .order("module_order");

    return NextResponse.json({
      profile: {
        tag: profileTag,
        stream,
      },
      suggestedModules: modules || [],
      xpAwarded: 100,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Invalid quiz data" },
      { status: 400 }
    );
  }
}
