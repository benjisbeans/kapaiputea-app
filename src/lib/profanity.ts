// Blocked words list — kept short and targeted for NZ school context.
// Checks whole-word boundaries so e.g. "class" won't flag "classification".
const BLOCKED_WORDS = [
  // English slurs & profanity
  "fuck", "shit", "bitch", "cunt", "dick", "cock", "ass",
  "asshole", "bastard", "wanker", "piss", "slut", "whore",
  "fag", "faggot", "retard", "nigger", "nigga",
  // Common leetspeak / evasions
  "f u c k", "sh1t", "b1tch", "d1ck", "c0ck",
  "fck", "fuk", "fuq", "sht", "btch",
  // NZ-specific slurs
  "hori",
  // Sexual
  "penis", "vagina", "porn", "sex",
  // Violence
  "kill", "rape",
];

// Build a single regex with word boundaries for each term
const pattern = new RegExp(
  BLOCKED_WORDS.map((w) => `\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).join("|"),
  "i"
);

/**
 * Returns true if the input contains inappropriate language.
 * Works for display names, profile tags, etc.
 */
export function containsProfanity(input: string): boolean {
  // Also strip common substitutions before checking
  const normalised = input
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/\$/g, "s")
    .replace(/@/g, "a");

  return pattern.test(input) || pattern.test(normalised);
}
