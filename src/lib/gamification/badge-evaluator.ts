import type { Badge, Profile } from "@/types/database";

type BadgeCriteria = {
  type: string;
  threshold?: number;
  count?: number;
  module_slug?: string;
  key?: string;
};

type EvalContext = {
  profile: Profile;
  lessonsCompletedToday?: number;
  justCompletedModuleSlug?: string;
};

function getThreshold(criteria: BadgeCriteria): number {
  return criteria.threshold ?? criteria.count ?? 0;
}

export function evaluateBadge(badge: Badge, ctx: EvalContext): boolean {
  const criteria = badge.criteria as BadgeCriteria;

  switch (criteria.type) {
    case "lessons_completed":
      return ctx.profile.lessons_completed >= getThreshold(criteria);

    case "modules_completed":
      return ctx.profile.modules_completed >= getThreshold(criteria);

    case "streak_days":
      return ctx.profile.current_streak >= getThreshold(criteria);

    case "total_xp":
      return ctx.profile.total_xp >= getThreshold(criteria);

    case "module_completed":
      return ctx.justCompletedModuleSlug === criteria.module_slug;

    case "quiz_completed":
      return ctx.profile.onboarding_completed;

    case "lessons_in_day":
      return (ctx.lessonsCompletedToday ?? 0) >= getThreshold(criteria);

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
