export type BusinessType = {
  id: string;
  name: string;
  emoji: string;
  baseRevenue: number;
  baseCost: number;
  description: string;
};

export type Upgrade = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  revenueBoost: number;
  costIncrease: number;
  /** Cost for each level (index 0 = level 1, etc.) */
  levelCosts: number[];
};

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: "food-truck",
    name: "Food Truck",
    emoji: "🚚",
    baseRevenue: 50,
    baseCost: 10,
    description: "Serve up kai on wheels",
  },
  {
    id: "lawn-care",
    name: "Lawn Care",
    emoji: "🌿",
    baseRevenue: 40,
    baseCost: 5,
    description: "Mow lawns, stack cash",
  },
  {
    id: "online-store",
    name: "Online Store",
    emoji: "🛒",
    baseRevenue: 60,
    baseCost: 20,
    description: "Sell products to the world",
  },
  {
    id: "tutoring",
    name: "Tutoring",
    emoji: "📚",
    baseRevenue: 70,
    baseCost: 15,
    description: "Help others learn, get paid",
  },
  {
    id: "car-detailing",
    name: "Car Detailing",
    emoji: "🚗",
    baseRevenue: 55,
    baseCost: 10,
    description: "Make rides shine",
  },
];

export const UPGRADES: Upgrade[] = [
  {
    id: "marketing",
    name: "Marketing",
    emoji: "📢",
    description: "Get the word out",
    revenueBoost: 20,
    costIncrease: 0,
    levelCosts: [500, 1500, 4000],
  },
  {
    id: "equipment",
    name: "Better Gear",
    emoji: "🔧",
    description: "Work smarter, not harder",
    revenueBoost: 30,
    costIncrease: 5,
    levelCosts: [800, 2000, 5000],
  },
  {
    id: "staff",
    name: "Hire Staff",
    emoji: "👥",
    description: "Build your team",
    revenueBoost: 50,
    costIncrease: 15,
    levelCosts: [1200, 3000, 7500],
  },
  {
    id: "location",
    name: "Better Location",
    emoji: "📍",
    description: "Prime spot, more customers",
    revenueBoost: 40,
    costIncrease: 5,
    levelCosts: [2000, 5000, 12000],
  },
  {
    id: "branding",
    name: "Branding",
    emoji: "✨",
    description: "Look professional",
    revenueBoost: 25,
    costIncrease: 0,
    levelCosts: [1000, 2500, 6000],
  },
];

/** Calculate pending income since last collection */
export function calculatePendingIncome(
  revenuePerHour: number,
  costPerHour: number,
  lastCollectedAt: string
): { income: number; hours: number } {
  const now = Date.now();
  const last = new Date(lastCollectedAt).getTime();
  const diffMs = now - last;
  const hours = Math.min(diffMs / (1000 * 60 * 60), 24); // Cap at 24 hours
  const profitPerHour = revenuePerHour - costPerHour;
  const income = Math.round(profitPerHour * hours * 100) / 100;
  return { income: Math.max(income, 0), hours: Math.round(hours * 10) / 10 };
}

/** Get upgrade level for a specific upgrade from the upgrades array */
export function getUpgradeLevel(
  upgrades: string[],
  upgradeId: string
): number {
  return upgrades.filter((u) => u === upgradeId).length;
}

/** Get cost for next level of an upgrade */
export function getUpgradeCost(
  upgrade: Upgrade,
  currentLevel: number
): number | null {
  if (currentLevel >= upgrade.levelCosts.length) return null; // Max level
  return upgrade.levelCosts[currentLevel];
}
