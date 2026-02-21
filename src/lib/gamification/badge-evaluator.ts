import type { Badge, Profile } from "@/types/database";

type BadgeCriteria = {
  type: string;
  threshold?: number;
  module_slug?: string;
  key?: string;
};

type EvalContext = {
  profile: Profile;
  lessonsCompletedToday?: number;
  justCompletedModuleSlug?: string;
};

export function evaluateBadge(badge: Badge, ctx: EvalContext): boolean {
  const criteria = badge.criteria as BadgeCriteria;

  switch (criteria.type) {
    case "lessons_completed":
      return ctx.profile.lessons_completed >= (criteria.threshold ?? 0);

    case "modules_completed":
      return ctx.profile.modules_completed >= (criteria.threshold ?? 0);

    case "streak_days":
      return ctx.profile.current_streak >= (criteria.threshold ?? 0);

    case "total_xp":
      return ctx.profile.total_xp >= (criteria.threshold ?? 0);

    case "module_completed":
      return ctx.justCompletedModuleSlug === criteria.module_slug;

    case "quiz_completed":
      return ctx.profile.onboarding_completed;

    case "lessons_in_day":
      return (ctx.lessonsCompletedToday ?? 0) >= (criteria.threshold ?? 0);

    case "all_interactions_in_lesson":
      // This is checked at lesson completion time
      return false;

    default:
      return false;
  }
}

export function findNewBadges(
  allBadges: Badge[],
  earnedBadgeIds: Set<string>,
  ctx: EvalContext
): Badge[] {
  return allBadges.filter(
    (badge) => !earnedBadgeIds.has(badge.id) && evaluateBadge(badge, ctx)
  );
}
