export type Profile = {
  id: string;
  email: string | null;
  display_name: string;
  avatar_url: string | null;
  year_group: number;
  gender: string | null;
  stream: Stream;
  profile_tag: string;
  profile_tag_emoji: string;
  financial_confidence: number | null;
  has_part_time_job: boolean;
  goals: string[];
  pathway_detail: string | null;
  school_id: string | null;
  class_code: string | null;
  onboarding_completed: boolean;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  modules_completed: number;
  lessons_completed: number;
  bank_balance: number;
  created_at: string;
  updated_at: string;
};

export type Stream = "trade" | "uni" | "early-leaver" | "military" | "unsure";

export type School = {
  id: string;
  name: string;
  region: string | null;
  decile: number | null;
  school_code: string | null;
  created_at: string;
};

export type QuizQuestion = {
  id: string;
  question_order: number;
  question_text: string;
  question_type: "single-select" | "multi-select" | "slider" | "emoji-scale";
  field_key: string;
  options: QuizOption[];
  is_required: boolean;
};

export type QuizOption = {
  value: string;
  label: string;
  emoji?: string;
  description?: string;
};

export type Module = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_emoji: string;
  color: string;
  module_order: number;
  streams: string[];
  estimated_minutes: number;
  total_xp: number;
  lesson_count: number;
  is_published: boolean;
  prerequisite_module_id: string | null;
  category: "core" | "advanced" | "stream" | "explore";
  target_year_groups: number[];
  created_at: string;
};

export type Lesson = {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  description: string | null;
  lesson_order: number;
  estimated_minutes: number;
  xp_reward: number;
  content_blocks: ContentBlock[];
  is_published: boolean;
  created_at: string;
};

export type ContentBlock =
  | { type: "heading"; data: { text: string; level: 1 | 2 | 3 } }
  | { type: "text"; data: { text: string } }
  | {
      type: "callout";
      data: { emoji: string; text: string; variant: "info" | "warning" | "tip" };
    }
  | {
      type: "stat-card";
      data: { stat: string; label: string; source?: string };
    }
  | { type: "image"; data: { src: string; alt: string; caption?: string } }
  | { type: "tip-box"; data: { title: string; tips: string[] } }
  | {
      type: "mini-quiz";
      data: {
        question: string;
        options: { label: string; correct: boolean }[];
        explanation: string;
      };
      xp_bonus: number;
    }
  | {
      type: "drag-drop";
      data: {
        instruction: string;
        items: { id: string; label: string }[];
        zones: { id: string; label: string; accepts: string[] }[];
      };
      xp_bonus: number;
    }
  | {
      type: "slider-input";
      data: {
        question: string;
        min: number;
        max: number;
        step: number;
        unit: string;
        correct_range: [number, number];
        explanation: string;
      };
      xp_bonus: number;
    }
  | {
      type: "tap-reveal";
      data: { cards: { front: string; back: string }[] };
      xp_bonus: number;
    }
  | {
      type: "sort-order";
      data: {
        instruction: string;
        items: { id: string; label: string; correct_position: number }[];
      };
      xp_bonus: number;
    }
  | {
      type: "fill-blanks";
      data: {
        template: string;
        blanks: { id: string; answer: string; options: string[] }[];
      };
      xp_bonus: number;
    }
  | {
      type: "business-sim";
      data: {
        scenario_id: string;
        title: string;
        description: string;
        starting_cash: number;
        decisions: {
          id: string;
          prompt: string;
          options: {
            label: string;
            cost: number;
            revenue_per_turn: number;
            risk: number;
            explanation: string;
          }[];
        }[];
        turns: number;
        success_threshold: number;
      };
      xp_bonus: number;
    };

export type UserModuleProgress = {
  id: string;
  user_id: string;
  module_id: string;
  status: "not-started" | "in-progress" | "completed";
  started_at: string | null;
  completed_at: string | null;
  lessons_completed: number;
  xp_earned: number;
};

export type UserLessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  module_id: string;
  status: "not-started" | "in-progress" | "completed";
  started_at: string | null;
  completed_at: string | null;
  xp_earned: number;
  interaction_data: Record<string, unknown>;
};

export type XpTransaction = {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  reference_id: string | null;
  description: string | null;
  created_at: string;
};

export type Badge = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_url: string | null;
  emoji: string;
  category: "milestone" | "streak" | "module" | "special" | "social";
  criteria: Record<string, unknown>;
  xp_bonus: number;
  is_secret: boolean;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
};

export type Stock = {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  emoji: string;
  base_price: number;
  volatility: number;
  created_at: string;
};

export type UserPortfolio = {
  id: string;
  user_id: string;
  cash_balance: number;
  created_at: string;
};

export type UserHolding = {
  id: string;
  user_id: string;
  stock_id: string;
  shares: number;
  avg_buy_price: number;
  stock?: Stock;
};

export type UserTrade = {
  id: string;
  user_id: string;
  stock_id: string;
  trade_type: "buy" | "sell";
  shares: number;
  price_per_share: number;
  total_amount: number;
  created_at: string;
  stock?: Stock;
};

export type UserBusiness = {
  id: string;
  user_id: string;
  business_type: string;
  business_level: number;
  revenue_per_hour: number;
  cost_per_hour: number;
  cash_balance: number;
  total_earned: number;
  upgrades: string[];
  last_collected_at: string;
  created_at: string;
};

export type LeaderboardEntry = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  profile_tag: string;
  profile_tag_emoji: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  school_id: string | null;
  class_code: string | null;
  school_name: string | null;
  global_rank: number;
};
