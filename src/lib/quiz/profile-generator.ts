import type { Stream } from "@/types/database";

type QuizAnswers = Record<string, string | string[]>;

type ProfileTag = {
  name: string;
  emoji: string;
};

type TagRule = {
  conditions: {
    stream?: string;
    gender?: string;
    financial_confidence?: string[];
    money_personality?: string;
    goals_includes?: string[];
    has_part_time_job?: string;
  };
  tags: ProfileTag[];
};

const TAG_RULES: TagRule[] = [
  // Trade-focused males
  {
    conditions: { stream: "trade", gender: "male" },
    tags: [
      { name: "Mr. Ute", emoji: "🚗" },
      { name: "Sparky", emoji: "⚡" },
      { name: "Tradie Legend", emoji: "🔧" },
      { name: "Hammer Time", emoji: "🔨" },
    ],
  },
  // Trade-focused females
  {
    conditions: { stream: "trade", gender: "female" },
    tags: [
      { name: "She Builds", emoji: "👷‍♀️" },
      { name: "Boss Tradie", emoji: "💪" },
      { name: "Grind Queen", emoji: "👑" },
    ],
  },
  // Trade-focused (any gender)
  {
    conditions: { stream: "trade" },
    tags: [
      { name: "Tool Belt", emoji: "🧰" },
      { name: "Hard Yakka", emoji: "💪" },
      { name: "Sparky", emoji: "⚡" },
    ],
  },
  // Uni-bound + high confidence
  {
    conditions: { stream: "uni", financial_confidence: ["4", "5"] },
    tags: [
      { name: "Finance Bro", emoji: "📈" },
      { name: "Wolf of Wall Street", emoji: "🐺" },
      { name: "Scholarship Hunter", emoji: "🎯" },
    ],
  },
  // Uni-bound + wants job/business
  {
    conditions: { stream: "uni", goals_includes: ["job", "business"] },
    tags: [
      { name: "LinkedIn Warrior", emoji: "💼" },
      { name: "CEO in Training", emoji: "🚀" },
      { name: "Hustle Student", emoji: "📚" },
    ],
  },
  // Uni-bound + low confidence
  {
    conditions: { stream: "uni", financial_confidence: ["1", "2"] },
    tags: [
      { name: "Noodle Budget", emoji: "🍜" },
      { name: "Textbook Broke", emoji: "📖" },
      { name: "Study Grinder", emoji: "☕" },
    ],
  },
  // Uni-bound general
  {
    conditions: { stream: "uni" },
    tags: [
      { name: "Campus Cash", emoji: "🎓" },
      { name: "Degree Dealer", emoji: "📜" },
      { name: "Study Saver", emoji: "🐷" },
    ],
  },
  // Military
  {
    conditions: { stream: "military" },
    tags: [
      { name: "Navy Captain", emoji: "⚓" },
      { name: "Cadet Cash", emoji: "🎖️" },
      { name: "Sergeant Savings", emoji: "💂" },
      { name: "Boot Camp Boss", emoji: "🪖" },
    ],
  },
  // Early leaver + spender
  {
    conditions: { stream: "early-leaver", money_personality: "spender" },
    tags: [
      { name: "YOLO Earner", emoji: "🔥" },
      { name: "Pay Day King", emoji: "👑" },
      { name: "Cash Flash", emoji: "💸" },
    ],
  },
  // Early leaver + saver
  {
    conditions: { stream: "early-leaver", money_personality: "saver" },
    tags: [
      { name: "Stack Builder", emoji: "🏗️" },
      { name: "Silent Grinder", emoji: "🤫" },
      { name: "Kiwi Saver", emoji: "🥝" },
    ],
  },
  // Early leaver general
  {
    conditions: { stream: "early-leaver" },
    tags: [
      { name: "Real World Ready", emoji: "🌏" },
      { name: "Boss Mode", emoji: "😎" },
      { name: "Grind Time", emoji: "⏰" },
    ],
  },
  // Unsure + saver
  {
    conditions: { stream: "unsure", money_personality: "saver" },
    tags: [
      { name: "Secret Saver", emoji: "🤫" },
      { name: "Quiet Achiever", emoji: "🧠" },
    ],
  },
  // Unsure + has job
  {
    conditions: { stream: "unsure", has_part_time_job: "true" },
    tags: [
      { name: "Side Hustler", emoji: "💰" },
      { name: "Working It Out", emoji: "🤔" },
    ],
  },
  // Unsure general
  {
    conditions: { stream: "unsure" },
    tags: [
      { name: "Fresh Start", emoji: "🌱" },
      { name: "Open Book", emoji: "📖" },
      { name: "Vibe Check", emoji: "✌️" },
    ],
  },
];

function matchesConditions(
  conditions: TagRule["conditions"],
  answers: QuizAnswers
): boolean {
  for (const [key, expected] of Object.entries(conditions)) {
    if (key === "goals_includes") {
      const goals = answers.goals;
      if (!Array.isArray(goals)) return false;
      if (!(expected as string[]).some((g) => goals.includes(g))) return false;
      continue;
    }
    if (key === "financial_confidence") {
      const val = answers.financial_confidence;
      if (typeof val !== "string") return false;
      if (!(expected as string[]).includes(val)) return false;
      continue;
    }
    const answerVal = answers[key];
    if (typeof answerVal !== "string") return false;
    if (answerVal !== expected) return false;
  }
  return true;
}

export function generateProfileTag(answers: QuizAnswers): ProfileTag {
  for (const rule of TAG_RULES) {
    if (matchesConditions(rule.conditions, answers)) {
      // Pick a random tag from matching rule
      const idx = Math.floor(Math.random() * rule.tags.length);
      return rule.tags[idx];
    }
  }
  // Fallback
  const fallbacks: ProfileTag[] = [
    { name: "Money Rookie", emoji: "💰" },
    { name: "Kiwi Learner", emoji: "🥝" },
    { name: "Fresh Start", emoji: "🌱" },
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export function resolveStream(streamAnswer: string): Stream {
  const valid: Stream[] = ["trade", "uni", "early-leaver", "military", "unsure"];
  if (valid.includes(streamAnswer as Stream)) return streamAnswer as Stream;
  return "unsure";
}
