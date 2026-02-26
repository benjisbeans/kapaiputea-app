import { createClient } from "@/lib/supabase/server";
import { calculateXpAward } from "@/lib/gamification/xp-calculator";
import { findNewBadges } from "@/lib/gamification/badge-evaluator";
import { getLevelFromXp } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export async function POST(request: Request, { params }: Props) {
  try {
    const { lessonId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 30 lesson completions per minute per user
    const rl = rateLimit(`lesson-complete:${user.id}`, 30);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests — slow down a bit." },
        { status: 429 }
      );
    }

    // Check if lesson exists
    const { data: lesson } = await supabase
      .from("lessons")
      .select("*, module:modules(*)")
      .eq("id", lessonId)
      .single();

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if already completed
    const { data: existingProgress } = await supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .single();

    if (existingProgress?.status === "completed") {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }

    // Get current profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Calculate streak
    const today = new Date().toISOString().split("T")[0];
    const isFirstToday = profile.last_activity_date !== today;

    let newStreak = profile.current_streak;
    if (isFirstToday) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (profile.last_activity_date === yesterdayStr) {
        newStreak = profile.current_streak + 1;
      } else {
        newStreak = 1;
      }
    }

    // Calculate XP
    const xpResult = calculateXpAward({
      baseXp: lesson.xp_reward,
      streakDays: newStreak,
      isFirstLessonToday: isFirstToday,
    });

    const newTotalXp = profile.total_xp + xpResult.total;
    const oldLevel = getLevelFromXp(profile.total_xp);
    const newLevel = getLevelFromXp(newTotalXp);
    const leveledUp = newLevel > oldLevel;

    // Upsert lesson progress
    await supabase.from("user_lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        module_id: lesson.module_id,
        status: "completed",
        started_at: existingProgress?.started_at || new Date().toISOString(),
        completed_at: new Date().toISOString(),
        xp_earned: xpResult.total,
      },
      { onConflict: "user_id,lesson_id" }
    );

    // Check module completion
    const { data: allModuleLessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("module_id", lesson.module_id);

    const { data: completedLessons } = await supabase
      .from("user_lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("module_id", lesson.module_id)
      .eq("status", "completed");

    const moduleCompleted =
      (completedLessons?.length || 0) >= (allModuleLessons?.length || 0);

    // Upsert module progress
    await supabase.from("user_module_progress").upsert(
      {
        user_id: user.id,
        module_id: lesson.module_id,
        status: moduleCompleted ? "completed" : "in-progress",
        started_at: new Date().toISOString(),
        completed_at: moduleCompleted ? new Date().toISOString() : null,
        lessons_completed: completedLessons?.length || 0,
        xp_earned: 0,
      },
      { onConflict: "user_id,module_id" }
    );

    // Record XP transaction
    await supabase.from("xp_transactions").insert({
      user_id: user.id,
      amount: xpResult.total,
      source: "lesson-complete",
      reference_id: lessonId,
      description: `Completed: ${lesson.title}`,
    });

    // Update streak history
    await supabase.from("streak_history").upsert(
      {
        user_id: user.id,
        activity_date: today,
        xp_earned: xpResult.total,
        lessons_completed: 1,
      },
      { onConflict: "user_id,activity_date" }
    );

    // Count lessons completed today for badge checking
    const { data: todayLessons } = await supabase
      .from("user_lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("completed_at", `${today}T00:00:00`);

    // Update profile
    const newLessonsCompleted = profile.lessons_completed + 1;
    const newModulesCompleted = moduleCompleted
      ? profile.modules_completed + 1
      : profile.modules_completed;

    await supabase
      .from("profiles")
      .update({
        total_xp: newTotalXp,
        current_level: newLevel,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, profile.longest_streak),
        last_activity_date: today,
        lessons_completed: newLessonsCompleted,
        modules_completed: newModulesCompleted,
      })
      .eq("id", user.id);

    // Check for new badges
    const { data: allBadges } = await supabase.from("badges").select("*");
    const { data: earnedBadges } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user.id);

    const earnedBadgeIds = new Set(
      (earnedBadges || []).map((b) => b.badge_id)
    );

    const updatedProfile = {
      ...profile,
      total_xp: newTotalXp,
      current_level: newLevel,
      current_streak: newStreak,
      lessons_completed: newLessonsCompleted,
      modules_completed: newModulesCompleted,
      onboarding_completed: true,
    };

    const newBadges = findNewBadges(allBadges || [], earnedBadgeIds, {
      profile: updatedProfile,
      lessonsCompletedToday: todayLessons?.length || 0,
      justCompletedModuleSlug: moduleCompleted
        ? lesson.module?.slug
        : undefined,
    });

    // Award new badges
    if (newBadges.length > 0) {
      await supabase.from("user_badges").insert(
        newBadges.map((badge) => ({
          user_id: user.id,
          badge_id: badge.id,
        }))
      );

      // Award badge bonus XP
      const badgeBonusXp = newBadges.reduce((sum, b) => sum + b.xp_bonus, 0);
      if (badgeBonusXp > 0) {
        await supabase.from("xp_transactions").insert({
          user_id: user.id,
          amount: badgeBonusXp,
          source: "badge-bonus",
          description: `Badges: ${newBadges.map((b) => b.name).join(", ")}`,
        });
        await supabase
          .from("profiles")
          .update({ total_xp: newTotalXp + badgeBonusXp })
          .eq("id", user.id);
      }
    }

    // Revalidate cached pages so progress shows immediately
    const moduleSlug = lesson.module?.slug;
    if (moduleSlug) {
      revalidatePath(`/modules/${moduleSlug}`);
      revalidatePath(`/modules/${moduleSlug}/${lesson.slug}`);
    }
    revalidatePath("/modules");
    revalidatePath("/dashboard");

    return NextResponse.json({
      total: xpResult.total,
      breakdown: xpResult,
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
      badges: newBadges.map((b) => ({ name: b.name, emoji: b.emoji })),
      moduleCompleted,
      moduleName: lesson.module?.title,
      currentStreak: newStreak,
      currentLevel: newLevel,
    });
  } catch (error) {
    console.error("Lesson complete error:", error);
    return NextResponse.json(
      { error: "Failed to complete lesson" },
      { status: 500 }
    );
  }
}
