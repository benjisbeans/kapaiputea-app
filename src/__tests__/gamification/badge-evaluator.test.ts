import {
  evaluateBadge,
  findNewBadges,
} from "@/lib/gamification/badge-evaluator";
import type { Badge, Profile } from "@/types/database";

function makeBadge(overrides: Partial<Badge> & { criteria: Record<string, unknown> }): Badge {
  return {
    id: "badge-1",
    slug: "test-badge",
    name: "Test Badge",
    description: "A test badge",
    icon_url: null,
    emoji: "🏆",
    category: "milestone",
    xp_bonus: 0,
    is_secret: false,
    rarity: "common",
    created_at: "2024-01-01",
    ...overrides,
  };
}

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

describe("evaluateBadge", () => {
  it("awards badge when lessons_completed meets threshold", () => {
    const badge = makeBadge({
      criteria: { type: "lessons_completed", threshold: 5 },
    });
    const profile = makeProfile({ lessons_completed: 5 });

    expect(evaluateBadge(badge, { profile })).toBe(true);
  });

  it("does not award badge when lessons_completed is below threshold", () => {
    const badge = makeBadge({
      criteria: { type: "lessons_completed", threshold: 5 },
    });
    const profile = makeProfile({ lessons_completed: 4 });

    expect(evaluateBadge(badge, { profile })).toBe(false);
  });

  it("awards badge when modules_completed meets threshold", () => {
    const badge = makeBadge({
      criteria: { type: "modules_completed", count: 3 },
    });
    const profile = makeProfile({ modules_completed: 3 });

    expect(evaluateBadge(badge, { profile })).toBe(true);
  });

  it("awards badge when streak_days meets threshold", () => {
    const badge = makeBadge({
      criteria: { type: "streak_days", threshold: 7 },
    });
    const profile = makeProfile({ current_streak: 10 });

    expect(evaluateBadge(badge, { profile })).toBe(true);
  });

  it("does not award streak badge when streak is too low", () => {
    const badge = makeBadge({
      criteria: { type: "streak_days", threshold: 7 },
    });
    const profile = makeProfile({ current_streak: 3 });

    expect(evaluateBadge(badge, { profile })).toBe(false);
  });

  it("awards badge when total_xp meets threshold", () => {
    const badge = makeBadge({
      criteria: { type: "total_xp", threshold: 1000 },
    });
    const profile = makeProfile({ total_xp: 1500 });

    expect(evaluateBadge(badge, { profile })).toBe(true);
  });

  it("awards badge on specific module completion", () => {
    const badge = makeBadge({
      criteria: { type: "module_completed", module_slug: "budgeting-101" },
    });
    const profile = makeProfile();

    expect(
      evaluateBadge(badge, {
        profile,
        justCompletedModuleSlug: "budgeting-101",
      })
    ).toBe(true);
  });

  it("does not award module badge for different module", () => {
    const badge = makeBadge({
      criteria: { type: "module_completed", module_slug: "budgeting-101" },
    });
    const profile = makeProfile();

    expect(
      evaluateBadge(badge, {
        profile,
        justCompletedModuleSlug: "investing-101",
      })
    ).toBe(false);
  });

  it("awards badge on quiz completion", () => {
    const badge = makeBadge({
      criteria: { type: "quiz_completed" },
    });
    const profile = makeProfile({ onboarding_completed: true });

    expect(evaluateBadge(badge, { profile })).toBe(true);
  });

  it("does not award quiz badge when quiz not completed", () => {
    const badge = makeBadge({
      criteria: { type: "quiz_completed" },
    });
    const profile = makeProfile({ onboarding_completed: false });

    expect(evaluateBadge(badge, { profile })).toBe(false);
  });

  it("awards badge when lessons_in_day meets threshold", () => {
    const badge = makeBadge({
      criteria: { type: "lessons_in_day", threshold: 3 },
    });
    const profile = makeProfile();

    expect(
      evaluateBadge(badge, { profile, lessonsCompletedToday: 5 })
    ).toBe(true);
  });

  it("does not award lessons_in_day badge when count is too low", () => {
    const badge = makeBadge({
      criteria: { type: "lessons_in_day", threshold: 3 },
    });
    const profile = makeProfile();

    expect(
      evaluateBadge(badge, { profile, lessonsCompletedToday: 2 })
    ).toBe(false);
  });

  it("returns false for unknown criteria type", () => {
    const badge = makeBadge({
      criteria: { type: "nonexistent_type" },
    });
    const profile = makeProfile();

    expect(evaluateBadge(badge, { profile })).toBe(false);
  });

  it("uses count field when threshold is absent", () => {
    const badge = makeBadge({
      criteria: { type: "lessons_completed", count: 10 },
    });
    const profile = makeProfile({ lessons_completed: 10 });

    expect(evaluateBadge(badge, { profile })).toBe(true);
  });
});

describe("findNewBadges", () => {
  const profile = makeProfile({
    lessons_completed: 10,
    current_streak: 7,
    total_xp: 500,
  });

  const badges: Badge[] = [
    makeBadge({
      id: "b1",
      criteria: { type: "lessons_completed", threshold: 5 },
    }),
    makeBadge({
      id: "b2",
      criteria: { type: "streak_days", threshold: 7 },
    }),
    makeBadge({
      id: "b3",
      criteria: { type: "total_xp", threshold: 1000 },
    }),
  ];

  it("returns only badges not already earned", () => {
    const earned = new Set(["b1"]);
    const newBadges = findNewBadges(badges, earned, { profile });

    expect(newBadges.map((b) => b.id)).toEqual(["b2"]);
  });

  it("returns empty array when all qualifying badges are earned", () => {
    const earned = new Set(["b1", "b2"]);
    const newBadges = findNewBadges(badges, earned, { profile });

    expect(newBadges).toEqual([]);
  });

  it("returns multiple new badges at once", () => {
    const earned = new Set<string>();
    const newBadges = findNewBadges(badges, earned, { profile });

    // b1 (lessons >= 5) and b2 (streak >= 7) qualify, b3 (xp >= 1000) doesn't
    expect(newBadges.map((b) => b.id)).toEqual(["b1", "b2"]);
  });
});
