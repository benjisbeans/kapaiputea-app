import {
  getLevelFromXp,
  getXpForNextLevel,
  getLevelProgress,
  LEVEL_THRESHOLDS,
  LEVEL_NAMES,
} from "@/lib/constants";

describe("getLevelFromXp", () => {
  it("returns level 1 for 0 XP", () => {
    expect(getLevelFromXp(0)).toBe(1);
  });

  it("returns level 1 for XP below level 2 threshold", () => {
    expect(getLevelFromXp(99)).toBe(1);
  });

  it("returns level 2 at exactly 100 XP", () => {
    expect(getLevelFromXp(100)).toBe(2);
  });

  it("returns level 2 for XP between level 2 and 3", () => {
    expect(getLevelFromXp(250)).toBe(2);
  });

  it("returns level 5 at exactly 1000 XP", () => {
    expect(getLevelFromXp(1000)).toBe(5);
  });

  it("returns level 15 (max) at 15500 XP", () => {
    expect(getLevelFromXp(15500)).toBe(15);
  });

  it("returns level 15 for XP above max threshold", () => {
    expect(getLevelFromXp(99999)).toBe(15);
  });

  it("returns level 1 for negative XP", () => {
    expect(getLevelFromXp(-10)).toBe(1);
  });

  it("returns correct level at each threshold boundary", () => {
    LEVEL_THRESHOLDS.forEach((threshold, index) => {
      expect(getLevelFromXp(threshold)).toBe(index + 1);
    });
  });
});

describe("getXpForNextLevel", () => {
  it("returns 100 XP needed for level 2 (from level 1)", () => {
    expect(getXpForNextLevel(1)).toBe(100);
  });

  it("returns 300 XP needed for level 3 (from level 2)", () => {
    expect(getXpForNextLevel(2)).toBe(300);
  });

  it("returns the max threshold for max level", () => {
    expect(getXpForNextLevel(15)).toBe(15500);
  });

  it("returns the max threshold for levels above max", () => {
    expect(getXpForNextLevel(20)).toBe(15500);
  });
});

describe("getLevelProgress", () => {
  it("returns 0% at the start of level 1", () => {
    expect(getLevelProgress(0)).toBe(0);
  });

  it("returns 50% halfway through level 1", () => {
    // Level 1: 0-100, halfway = 50
    expect(getLevelProgress(50)).toBe(50);
  });

  it("returns 0% at the start of level 2", () => {
    // Level 2 starts at 100, next at 300
    expect(getLevelProgress(100)).toBe(0);
  });

  it("returns 50% halfway through level 2", () => {
    // Level 2: 100-300, range = 200, halfway = 200
    expect(getLevelProgress(200)).toBe(50);
  });

  it("returns 100% at max level", () => {
    expect(getLevelProgress(15500)).toBe(100);
  });

  it("returns 100% above max level", () => {
    expect(getLevelProgress(99999)).toBe(100);
  });
});

describe("constants integrity", () => {
  it("has 15 level thresholds", () => {
    expect(LEVEL_THRESHOLDS).toHaveLength(15);
  });

  it("has 15 level names", () => {
    expect(LEVEL_NAMES).toHaveLength(15);
  });

  it("level thresholds are in ascending order", () => {
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      expect(LEVEL_THRESHOLDS[i]).toBeGreaterThan(LEVEL_THRESHOLDS[i - 1]);
    }
  });

  it("starts at 0 XP", () => {
    expect(LEVEL_THRESHOLDS[0]).toBe(0);
  });

  it("first level is Money Newbie", () => {
    expect(LEVEL_NAMES[0]).toBe("Money Newbie");
  });

  it("max level is Ka Pai Legend", () => {
    expect(LEVEL_NAMES[14]).toBe("Ka Pai Legend");
  });
});
