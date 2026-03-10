import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLevelProgress, getXpForNextLevel } from "@/lib/constants";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getStreakCalendarData } from "@/lib/streaks/get-streak-data";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Run ALL queries in parallel — single round-trip wait
  const [
    { data: profile },
    { data: modules },
    { data: moduleProgress },
    { data: recentBadges },
    streakData,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, total_xp, current_streak, lessons_completed, current_level")
      .eq("id", user.id)
      .single(),
    supabase
      .from("modules")
      .select("id, slug, title, icon_emoji, color, description, lesson_count, estimated_minutes, total_xp, module_order")
      .eq("is_published", true)
      .order("module_order"),
    supabase
      .from("user_module_progress")
      .select("module_id, status, lessons_completed")
      .eq("user_id", user.id),
    supabase
      .from("user_badges")
      .select("id, badge:badges(emoji, name)")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })
      .limit(3),
    getStreakCalendarData(supabase, user.id),
  ]);

  if (!profile) redirect("/quiz");

  const progressMap = new Map(
    (moduleProgress || []).map((p) => [p.module_id, p])
  );

  const inProgressModule = modules?.find((m) => {
    const p = progressMap.get(m.id);
    return p?.status === "in-progress";
  });

  const nextModule =
    inProgressModule || modules?.find((m) => !progressMap.has(m.id));

  return (
    <DashboardView
      displayName={profile.display_name}
      totalXp={profile.total_xp}
      currentStreak={profile.current_streak}
      lessonsCompleted={profile.lessons_completed}
      currentLevel={profile.current_level}
      levelProgress={getLevelProgress(profile.total_xp)}
      nextLevelXp={getXpForNextLevel(profile.current_level)}
      nextModule={
        nextModule
          ? {
              slug: nextModule.slug,
              title: nextModule.title,
              icon_emoji: nextModule.icon_emoji,
              description: nextModule.description,
              lesson_count: nextModule.lesson_count,
              estimated_minutes: nextModule.estimated_minutes,
              total_xp: nextModule.total_xp,
            }
          : null
      }
      isResuming={!!inProgressModule}
      modules={(modules || []).map((mod) => ({
        id: mod.id,
        slug: mod.slug,
        title: mod.title,
        icon_emoji: mod.icon_emoji,
        color: mod.color,
        lesson_count: mod.lesson_count,
        total_xp: mod.total_xp,
        completedLessons: progressMap.get(mod.id)?.lessons_completed || 0,
        status: progressMap.get(mod.id)?.status || null,
      }))}
      recentBadges={(recentBadges || []).map((ub) => {
        const b = ub.badge as unknown as { emoji: string; name: string } | null;
        return {
          id: ub.id,
          badge: b ? { emoji: b.emoji, name: b.name } : null,
        };
      })}
      streakDays={streakData.streakDays}
      hasActivityToday={streakData.hasActivityToday}
    />
  );
}
