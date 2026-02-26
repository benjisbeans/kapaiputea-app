import { calculateXpAward } from "@/lib/gamification/xp-calculator";

describe("calculateXpAward", () => {
  it("returns base XP with no streak and not first lesson", () => {
    const result = calculateXpAward({
      baseXp: 50,
      streakDays: 0,
      isFirstLessonToday: false,
    });

    expect(result).toEqual({
      base: 50,
      total: 50,
    });
  });

  it("returns base XP when streak is 1 (no bonus for day 1)", () => {
    const result = calculateXpAward({
      baseXp: 50,
      streakDays: 1,
      isFirstLessonToday: false,
    });

    expect(result).toEqual({
      base: 50,
      total: 50,
    });
  });

  it("adds 10% streak bonus at 2-day streak", () => {
    const result = calculateXpAward({
      baseXp: 100,
      streakDays: 2,
      isFirstLessonToday: false,
    });

    expect(result.base).toBe(100);
    expect(result.streak).toBe(20); // 100 * 0.2
    expect(result.total).toBe(120);
  });

  it("adds 30% streak bonus at 3-day streak", () => {
    const result = calculateXpAward({
      baseXp: 100,
      streakDays: 3,
      isFirstLessonToday: false,
    });

    expect(result.streak).toBe(30);
    expect(result.total).toBe(130);
  });

  it("caps streak bonus at 50%", () => {
    const result = calculateXpAward({
      baseXp: 100,
      streakDays: 10,
      isFirstLessonToday: false,
    });

    // 10 * 0.1 = 1.0, but capped at 0.5
    expect(result.streak).toBe(50);
    expect(result.total).toBe(150);
  });

  it("caps streak bonus at 50% even with very long streaks", () => {
    const result = calculateXpAward({
      baseXp: 200,
      streakDays: 100,
      isFirstLessonToday: false,
    });

    expect(result.streak).toBe(100); // 200 * 0.5
    expect(result.total).toBe(300);
  });

  it("adds daily bonus of 25 XP for first lesson today", () => {
    const result = calculateXpAward({
      baseXp: 50,
      streakDays: 0,
      isFirstLessonToday: true,
    });

    expect(result.dailyBonus).toBe(25);
    expect(result.total).toBe(75); // 50 + 25
  });

  it("combines streak bonus and daily bonus", () => {
    const result = calculateXpAward({
      baseXp: 100,
      streakDays: 5,
      isFirstLessonToday: true,
    });

    expect(result.base).toBe(100);
    expect(result.streak).toBe(50); // 100 * 0.5
    expect(result.dailyBonus).toBe(25);
    expect(result.total).toBe(175); // 100 + 50 + 25
  });

  it("floors streak bonus to whole numbers", () => {
    const result = calculateXpAward({
      baseXp: 33,
      streakDays: 2,
      isFirstLessonToday: false,
    });

    // 33 * 0.2 = 6.6, floored to 6
    expect(result.streak).toBe(6);
    expect(result.total).toBe(39);
  });

  it("handles zero base XP", () => {
    const result = calculateXpAward({
      baseXp: 0,
      streakDays: 5,
      isFirstLessonToday: true,
    });

    expect(result.base).toBe(0);
    expect(result.streak).toBe(0);
    expect(result.dailyBonus).toBe(25);
    expect(result.total).toBe(25);
  });
});
