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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/quiz");

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("is_published", true)
    .order("module_order");

  const { data: moduleProgress } = await supabase
    .from("user_module_progress")
    .select("*")
    .eq("user_id", user.id);

  const progressMap = new Map(
    (moduleProgress || []).map((p) => [p.module_id, p])
  );

  const inProgressModule = modules?.find((m) => {
    const p = progressMap.get(m.id);
    return p?.status === "in-progress";
  });

  const nextModule =
    inProgressModule || modules?.find((m) => !progressMap.has(m.id));

  const { data: recentBadges } = await supabase
    .from("user_badges")
    .select("*, badge:badges(*)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })
    .limit(3);

  const { streakDays, hasActivityToday } = await getStreakCalendarData(
    supabase,
    user.id
  );

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
      recentBadges={(recentBadges || []).map((ub) => ({
        id: ub.id,
        badge: ub.badge
          ? { emoji: ub.badge.emoji, name: ub.badge.name }
          : null,
      }))}
      streakDays={streakDays}
      hasActivityToday={hasActivityToday}
    />
  );
}
