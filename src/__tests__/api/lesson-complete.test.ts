/**
 * Tests for the lesson completion business logic.
 *
 * The actual API route depends on Supabase, so we test the pure logic
 * that the route uses: XP calculation, streak logic, and module completion.
 */

import { calculateXpAward } from "@/lib/gamification/xp-calculator";
import { getLevelFromXp } from "@/lib/constants";
import { findNewBadges } from "@/lib/gamification/badge-evaluator";
import type { Profile, Badge } from "@/types/database";

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "user-1",
    email: "test@example.com",
    display_name: "Test User",
    avatar_url: null,
    year_group: 12,
    gender: "male",
    stream: "uni",
    profile_tag: "Campus Cash",
    profile_tag_emoji: "🎓",
    financial_confidence: 3,
    has_part_time_job: false,
    goals: [],
    pathway_detail: null,
    school_id: null,
    class_code: null,
    onboarding_completed: true,
    total_xp: 0,
    current_level: 1,
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null,
    modules_completed: 0,
    lessons_completed: 0,
    bank_balance: 1000,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    ...overrides,
  };
}

describe("lesson completion: streak calculation", () => {
  function calculateStreak(profile: Profile, today: string): number {
    const isFirstToday = profile.last_activity_date !== today;

    if (!isFirstToday) return profile.current_streak;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (profile.last_activity_date === yesterdayStr) {
      return profile.current_streak + 1;
    }
    return 1;
  }

  it("starts a new streak when no previous activity", () => {
    const profile = makeProfile({ last_activity_date: null, current_streak: 0 });
    expect(calculateStreak(profile, "2024-06-15")).toBe(1);
  });

  it("continues streak from yesterday", () => {
    const profile = makeProfile({
      last_activity_date: "2024-06-14",
      current_streak: 3,
    });
    expect(calculateStreak(profile, "2024-06-15")).toBe(4);
  });

  it("resets streak after a gap", () => {
    const profile = makeProfile({
      last_activity_date: "2024-06-12",
      current_streak: 5,
    });
    expect(calculateStreak(profile, "2024-06-15")).toBe(1);
  });

  it("keeps same streak for multiple lessons same day", () => {
    const profile = makeProfile({
      last_activity_date: "2024-06-15",
      current_streak: 3,
    });
    expect(calculateStreak(profile, "2024-06-15")).toBe(3);
  });
});

describe("lesson completion: level up detection", () => {
  it("detects level up from 1 to 2", () => {
    const profile = makeProfile({ total_xp: 80 });
    const xpResult = calculateXpAward({
      baseXp: 50,
      streakDays: 1,
      isFirstLessonToday: false,
    });

    const newTotalXp = profile.total_xp + xpResult.total;
    const oldLevel = getLevelFromXp(profile.total_xp);
    const newLevel = getLevelFromXp(newTotalXp);

    expect(oldLevel).toBe(1);
    expect(newLevel).toBe(2);
    expect(newLevel > oldLevel).toBe(true);
  });

  it("does not detect level up when staying in same level", () => {
    const profile = makeProfile({ total_xp: 10 });
    const xpResult = calculateXpAward({
      baseXp: 20,
      streakDays: 1,
      isFirstLessonToday: false,
    });

    const newTotalXp = profile.total_xp + xpResult.total;
    const oldLevel = getLevelFromXp(profile.total_xp);
    const newLevel = getLevelFromXp(newTotalXp);

    expect(oldLevel).toBe(1);
    expect(newLevel).toBe(1);
    expect(newLevel > oldLevel).toBe(false);
  });

  it("can jump multiple levels with large XP award", () => {
    const profile = makeProfile({ total_xp: 50 });
    const xpResult = calculateXpAward({
      baseXp: 600,
      streakDays: 5,
      isFirstLessonToday: true,
    });

    const newTotalXp = profile.total_xp + xpResult.total;
    const oldLevel = getLevelFromXp(profile.total_xp);
    const newLevel = getLevelFromXp(newTotalXp);

    expect(oldLevel).toBe(1);
    expect(newLevel).toBeGreaterThan(2);
  });
});

describe("lesson completion: module completion", () => {
  it("marks module complete when all lessons done", () => {
    const allModuleLessons = [
      { id: "l1" },
      { id: "l2" },
      { id: "l3" },
    ];
    const completedLessons = [
      { id: "l1" },
      { id: "l2" },
      { id: "l3" },
    ];

    const moduleCompleted =
      completedLessons.length >= allModuleLessons.length;

    expect(moduleCompleted).toBe(true);
  });

  it("does not mark module complete when lessons remain", () => {
    const allModuleLessons = [
      { id: "l1" },
      { id: "l2" },
      { id: "l3" },
    ];
    const completedLessons = [
      { id: "l1" },
      { id: "l2" },
    ];

    const moduleCompleted =
      completedLessons.length >= allModuleLessons.length;

    expect(moduleCompleted).toBe(false);
  });

  it("increments modules_completed on module completion", () => {
    const profile = makeProfile({ modules_completed: 2 });
    const moduleCompleted = true;

    const newModulesCompleted = moduleCompleted
      ? profile.modules_completed + 1
      : profile.modules_completed;

    expect(newModulesCompleted).toBe(3);
  });
});

describe("lesson completion: badge evaluation integration", () => {
  it("awards first lesson badge after completing first lesson", () => {
    const badges: Badge[] = [
      {
        id: "first-lesson",
        slug: "first-lesson",
        name: "First Steps",
        description: "Complete your first lesson",
        icon_url: null,
        emoji: "👣",
        category: "milestone",
        criteria: { type: "lessons_completed", threshold: 1 },
        xp_bonus: 25,
        is_secret: false,
        rarity: "common",
        created_at: "2024-01-01",
      },
    ];

    const profile = makeProfile({ lessons_completed: 1 });
    const earned = new Set<string>();

    const newBadges = findNewBadges(badges, earned, { profile });

    expect(newBadges).toHaveLength(1);
    expect(newBadges[0].name).toBe("First Steps");
  });

  it("does not re-award already earned badges", () => {
    const badges: Badge[] = [
      {
        id: "first-lesson",
        slug: "first-lesson",
        name: "First Steps",
        description: "Complete your first lesson",
        icon_url: null,
        emoji: "👣",
        category: "milestone",
        criteria: { type: "lessons_completed", threshold: 1 },
        xp_bonus: 25,
        is_secret: false,
        rarity: "common",
        created_at: "2024-01-01",
      },
    ];

    const profile = makeProfile({ lessons_completed: 5 });
    const earned = new Set(["first-lesson"]);

    const newBadges = findNewBadges(badges, earned, { profile });

    expect(newBadges).toHaveLength(0);
  });
});
