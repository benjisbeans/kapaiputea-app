export type XpBreakdown = {
  base: number;
  streak?: number;
  dailyBonus?: number;
  total: number;
};

export function calculateXpAward(params: {
  baseXp: number;
  streakDays: number;
  isFirstLessonToday: boolean;
}): XpBreakdown {
  let total = params.baseXp;
  const breakdown: XpBreakdown = { base: params.baseXp, total: 0 };

  // Streak multiplier: +10% per streak day, max +50%
  if (params.streakDays > 1) {
    const streakBonus = Math.min(params.streakDays * 0.1, 0.5);
    const bonusXp = Math.floor(params.baseXp * streakBonus);
    total += bonusXp;
    breakdown.streak = bonusXp;
  }

  // Daily first lesson bonus
  if (params.isFirstLessonToday) {
    total += 25;
    breakdown.dailyBonus = 25;
  }

  breakdown.total = total;
  return breakdown;
}
