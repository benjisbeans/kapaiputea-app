import {
  generateProfileTag,
  resolveStream,
} from "@/lib/quiz/profile-generator";

describe("resolveStream", () => {
  it("returns 'trade' for valid trade input", () => {
    expect(resolveStream("trade")).toBe("trade");
  });

  it("returns 'uni' for valid uni input", () => {
    expect(resolveStream("uni")).toBe("uni");
  });

  it("returns 'early-leaver' for valid early-leaver input", () => {
    expect(resolveStream("early-leaver")).toBe("early-leaver");
  });

  it("returns 'military' for valid military input", () => {
    expect(resolveStream("military")).toBe("military");
  });

  it("returns 'unsure' for valid unsure input", () => {
    expect(resolveStream("unsure")).toBe("unsure");
  });

  it("defaults to 'unsure' for invalid input", () => {
    expect(resolveStream("invalid")).toBe("unsure");
  });

  it("defaults to 'unsure' for empty string", () => {
    expect(resolveStream("")).toBe("unsure");
  });

  it("defaults to 'unsure' for random text", () => {
    expect(resolveStream("something-else")).toBe("unsure");
  });
});

describe("generateProfileTag", () => {
  it("returns a tag with name and emoji", () => {
    const tag = generateProfileTag({ stream: "trade", gender: "male" });

    expect(tag).toHaveProperty("name");
    expect(tag).toHaveProperty("emoji");
    expect(typeof tag.name).toBe("string");
    expect(typeof tag.emoji).toBe("string");
    expect(tag.name.length).toBeGreaterThan(0);
  });

  it("returns trade male tags for male tradies", () => {
    const validTags = ["Mr. Ute", "Sparky", "Tradie Legend", "Hammer Time"];
    // Run multiple times since it's random
    for (let i = 0; i < 20; i++) {
      const tag = generateProfileTag({ stream: "trade", gender: "male" });
      expect(validTags).toContain(tag.name);
    }
  });

  it("returns trade female tags for female tradies", () => {
    const validTags = ["She Builds", "Boss Tradie", "Grind Queen"];
    for (let i = 0; i < 20; i++) {
      const tag = generateProfileTag({ stream: "trade", gender: "female" });
      expect(validTags).toContain(tag.name);
    }
  });

  it("returns uni tags for uni-bound students", () => {
    const validTags = [
      "Finance Bro", "Wolf of Wall Street", "Scholarship Hunter",
      "LinkedIn Warrior", "CEO in Training", "Hustle Student",
      "Noodle Budget", "Textbook Broke", "Study Grinder",
      "Campus Cash", "Degree Dealer", "Study Saver",
    ];
    for (let i = 0; i < 20; i++) {
      const tag = generateProfileTag({ stream: "uni" });
      expect(validTags).toContain(tag.name);
    }
  });

  it("returns high-confidence uni tags when confidence is 4-5", () => {
    const validTags = ["Finance Bro", "Wolf of Wall Street", "Scholarship Hunter"];
    for (let i = 0; i < 20; i++) {
      const tag = generateProfileTag({
        stream: "uni",
        financial_confidence: "5",
      });
      expect(validTags).toContain(tag.name);
    }
  });

  it("returns military tags for military stream", () => {
    const validTags = ["Navy Captain", "Cadet Cash", "Sergeant Savings", "Boot Camp Boss"];
    for (let i = 0; i < 20; i++) {
      const tag = generateProfileTag({ stream: "military" });
      expect(validTags).toContain(tag.name);
    }
  });

  it("returns fallback tag for completely empty answers", () => {
    const validFallbacks = ["Money Rookie", "Kiwi Learner", "Fresh Start"];
    for (let i = 0; i < 20; i++) {
      const tag = generateProfileTag({});
      expect(validFallbacks).toContain(tag.name);
    }
  });

  it("returns unsure tags for unsure stream with saver personality", () => {
    const validTags = ["Secret Saver", "Quiet Achiever"];
    for (let i = 0; i < 20; i++) {
      const tag = generateProfileTag({
        stream: "unsure",
        money_personality: "saver",
      });
      expect(validTags).toContain(tag.name);
    }
  });

  it("returns early-leaver spender tags", () => {
    const validTags = ["YOLO Earner", "Pay Day King", "Cash Flash"];
    for (let i = 0; i < 20; i++) {
      const tag = generateProfileTag({
        stream: "early-leaver",
        money_personality: "spender",
      });
      expect(validTags).toContain(tag.name);
    }
  });
});
