export const LEVEL_THRESHOLDS = [
  0,      // Level 1 (starting)
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2200,   // Level 7
  3000,   // Level 8
  4000,   // Level 9
  5200,   // Level 10
  6500,   // Level 11
  8000,   // Level 12
  10000,  // Level 13
  12500,  // Level 14
  15500,  // Level 15 (max for MVP)
];

export const LEVEL_NAMES = [
  "Money Newbie",        // 1
  "Penny Pincher",       // 2
  "Cash Curious",        // 3
  "Budget Beginner",     // 4
  "Savings Starter",     // 5
  "Finance Fan",         // 6
  "Money Maker",         // 7
  "Wealth Builder",      // 8
  "Investment Intern",   // 9
  "Portfolio Pro",       // 10
  "Market Master",       // 11
  "Finance Guru",        // 12
  "Money Mogul",         // 13
  "Wealth Wizard",       // 14
  "Ka Pai Legend",        // 15
];

export const STREAM_LABELS: Record<string, string> = {
  trade: "Trades Life",
  uni: "Uni-Bound",
  "early-leaver": "Straight to Work",
  military: "Military / Services",
  unsure: "Still Figuring It Out",
};

export const STREAM_EMOJIS: Record<string, string> = {
  trade: "🔧",
  uni: "🎓",
  "early-leaver": "💼",
  military: "🎖️",
  unsure: "🤷",
};

export function getLevelFromXp(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[currentLevel];
}

export function getLevelProgress(xp: number): number {
  const level = getLevelFromXp(xp);
  if (level >= LEVEL_THRESHOLDS.length) return 100;
  const currentThreshold = LEVEL_THRESHOLDS[level - 1];
  const nextThreshold = LEVEL_THRESHOLDS[level];
  return Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
}
