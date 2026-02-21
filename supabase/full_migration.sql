-- ============================================================================
-- 001_create_schools.sql
-- Schools table for Ka Pai Putea
-- ============================================================================

CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT,
  decile INTEGER CHECK (decile BETWEEN 1 AND 10),
  school_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schools are public"
  ON public.schools
  FOR SELECT
  USING (true);
-- ============================================================================
-- 002_create_profiles.sql
-- User profiles extending auth.users for Ka Pai Putea
-- ============================================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  avatar_url TEXT,

  -- Demographics (set during onboarding quiz)
  year_group INTEGER CHECK (year_group IN (11, 12, 13)),
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  stream TEXT CHECK (stream IN ('trade', 'uni', 'early-leaver', 'military', 'unsure')),

  -- Profile personalisation
  profile_tag TEXT,
  profile_tag_emoji TEXT DEFAULT '💰',
  financial_confidence INTEGER CHECK (financial_confidence BETWEEN 1 AND 5),
  has_part_time_job BOOLEAN DEFAULT FALSE,
  goals TEXT[] DEFAULT '{}',

  -- School linkage
  school_id UUID REFERENCES public.schools(id),
  class_code TEXT,

  -- Onboarding state
  onboarding_completed BOOLEAN DEFAULT FALSE,

  -- Gamification summary (denormalised for fast reads)
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  modules_completed INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own full profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Anyone authenticated can see leaderboard-safe columns
-- (enforced at the application/view layer; this policy allows SELECT for
-- other authenticated users so leaderboard queries work)
CREATE POLICY "Authenticated users can view others for leaderboard"
  ON public.profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Trigger: auto-create profile when a new auth user signs up
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Trigger: auto-update updated_at on row change
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX idx_profiles_school_id ON public.profiles (school_id);
CREATE INDEX idx_profiles_stream ON public.profiles (stream);
CREATE INDEX idx_profiles_total_xp ON public.profiles (total_xp DESC);
-- ============================================================================
-- 003_create_quiz.sql
-- Onboarding quiz questions and user responses
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Quiz Questions (admin-defined)
-- ---------------------------------------------------------------------------
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_order INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single-select', 'multi-select', 'slider', 'emoji-scale')),
  field_key TEXT UNIQUE NOT NULL,
  options JSONB,
  is_required BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are public"
  ON public.quiz_questions
  FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- Quiz Responses (per user)
-- ---------------------------------------------------------------------------
CREATE TABLE public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer_value TEXT,
  answered_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, question_id)
);

ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Users can read their own responses
CREATE POLICY "Users can view own quiz responses"
  ON public.quiz_responses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert own quiz responses"
  ON public.quiz_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own quiz responses"
  ON public.quiz_responses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own quiz responses"
  ON public.quiz_responses
  FOR DELETE
  USING (auth.uid() = user_id);
-- ============================================================================
-- 004_create_modules.sql
-- Learning modules and lessons for Ka Pai Putea
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Modules
-- ---------------------------------------------------------------------------
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_emoji TEXT,
  color TEXT,
  module_order INTEGER NOT NULL,
  streams TEXT[] DEFAULT '{}',
  estimated_minutes INTEGER DEFAULT 30,
  total_xp INTEGER DEFAULT 500,
  lesson_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  prerequisite_module_id UUID REFERENCES public.modules(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are public"
  ON public.modules
  FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- Lessons
-- ---------------------------------------------------------------------------
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  lesson_order INTEGER NOT NULL,
  estimated_minutes INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 50,
  content_blocks JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (module_id, slug)
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are public"
  ON public.lessons
  FOR SELECT
  USING (true);

-- Index for fast ordered lesson lookups within a module
CREATE INDEX idx_lessons_module_order ON public.lessons (module_id, lesson_order);
-- ============================================================================
-- 005_create_progress.sql
-- User progress tracking for modules and lessons
-- ============================================================================

-- ---------------------------------------------------------------------------
-- User Module Progress
-- ---------------------------------------------------------------------------
CREATE TABLE public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  lessons_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,

  UNIQUE (user_id, module_id)
);

ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own module progress"
  ON public.user_module_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module progress"
  ON public.user_module_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own module progress"
  ON public.user_module_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- User Lesson Progress
-- ---------------------------------------------------------------------------
CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  xp_earned INTEGER DEFAULT 0,
  interaction_data JSONB DEFAULT '{}'::jsonb,

  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress"
  ON public.user_lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON public.user_lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON public.user_lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
-- ============================================================================
-- 006_create_gamification.sql
-- XP transactions, badges, user badges, and streak history
-- ============================================================================

-- ---------------------------------------------------------------------------
-- XP Transactions (immutable ledger)
-- ---------------------------------------------------------------------------
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN (
    'lesson-complete',
    'module-complete',
    'quiz-complete',
    'streak-bonus',
    'badge-bonus',
    'interaction-bonus',
    'daily-login'
  )),
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own xp transactions"
  ON public.xp_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp transactions"
  ON public.xp_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_xp_transactions_user ON public.xp_transactions (user_id);
CREATE INDEX idx_xp_transactions_created ON public.xp_transactions (created_at DESC);

-- ---------------------------------------------------------------------------
-- Badges (admin-defined catalogue)
-- ---------------------------------------------------------------------------
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  emoji TEXT,
  category TEXT NOT NULL CHECK (category IN ('milestone', 'streak', 'module', 'special', 'social')),
  criteria JSONB,
  xp_bonus INTEGER DEFAULT 0,
  is_secret BOOLEAN DEFAULT FALSE,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are public"
  ON public.badges
  FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- User Badges (join table)
-- ---------------------------------------------------------------------------
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON public.user_badges
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Streak History (one row per active day)
-- ---------------------------------------------------------------------------
CREATE TABLE public.streak_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,

  UNIQUE (user_id, activity_date)
);

ALTER TABLE public.streak_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak history"
  ON public.streak_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak history"
  ON public.streak_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak history"
  ON public.streak_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_streak_history_user_date ON public.streak_history (user_id, activity_date DESC);
-- ============================================================================
-- 007_seed_quiz_questions.sql
-- Seed the 8 onboarding quiz questions
-- ============================================================================

INSERT INTO public.quiz_questions (question_order, question_text, question_type, field_key, options, is_required)
VALUES

-- 1. Year Group
(1,
 'What year are you in?',
 'single-select',
 'year_group',
 '[
   {"value": "11", "label": "Year 11"},
   {"value": "12", "label": "Year 12"},
   {"value": "13", "label": "Year 13"}
 ]'::jsonb,
 true),

-- 2. Gender
(2,
 'How do you identify?',
 'single-select',
 'gender',
 '[
   {"value": "male",                "label": "Male"},
   {"value": "female",              "label": "Female"},
   {"value": "non-binary",          "label": "Non-binary"},
   {"value": "prefer-not-to-say",   "label": "Prefer not to say"}
 ]'::jsonb,
 true),

-- 3. Post-school path / stream
(3,
 'What are you thinking after school?',
 'single-select',
 'stream',
 '[
   {"value": "trade",        "label": "Trades / Apprenticeship", "emoji": "🔧", "description": "Sparky, builder, plumber, mechanic — getting stuck in"},
   {"value": "uni",          "label": "University / Polytech",   "emoji": "🎓", "description": "Hitting the books at uni or polytech"},
   {"value": "early-leaver", "label": "Straight to Work",        "emoji": "💼", "description": "Jumping into the workforce ASAP"},
   {"value": "military",     "label": "Military / Defence",      "emoji": "🪖", "description": "NZDF, Army, Navy, or Air Force"},
   {"value": "unsure",       "label": "Still figuring it out",   "emoji": "🤷", "description": "No stress — heaps of time to decide"}
 ]'::jsonb,
 true),

-- 4. Financial confidence (emoji scale 1-5)
(4,
 'How confident are you with money right now?',
 'emoji-scale',
 'financial_confidence',
 '[
   {"value": "1", "emoji": "😵", "label": "No clue"},
   {"value": "2", "emoji": "😬", "label": "A bit lost"},
   {"value": "3", "emoji": "😐", "label": "Getting there"},
   {"value": "4", "emoji": "😊", "label": "Pretty good"},
   {"value": "5", "emoji": "🤑", "label": "Money boss"}
 ]'::jsonb,
 true),

-- 5. Part-time job
(5,
 'Do you have a part-time job?',
 'single-select',
 'has_part_time_job',
 '[
   {"value": "yes", "label": "Yeah, I work part-time"},
   {"value": "no",  "label": "Nah, not right now"}
 ]'::jsonb,
 true),

-- 6. Bank account
(6,
 'Do you have a bank account?',
 'single-select',
 'bank_account',
 '[
   {"value": "yes-use",      "label": "Yes, and I use it regularly",  "emoji": "✅"},
   {"value": "yes-dont-use",  "label": "Yes, but I barely touch it",  "emoji": "😅"},
   {"value": "no",            "label": "Nope, not yet",                "emoji": "❌"}
 ]'::jsonb,
 true),

-- 7. Financial goals (multi-select)
(7,
 'What money goals are you keen on? (Pick as many as you want)',
 'multi-select',
 'goals',
 '[
   {"value": "save",     "label": "Save up some cash",       "emoji": "💰"},
   {"value": "study",    "label": "Pay for study",            "emoji": "📚"},
   {"value": "move-out", "label": "Move out / flatting",      "emoji": "🏠"},
   {"value": "car",      "label": "Buy a car",                "emoji": "🚗"},
   {"value": "travel",   "label": "Travel / OE",              "emoji": "✈️"},
   {"value": "invest",   "label": "Start investing",          "emoji": "📈"},
   {"value": "job",      "label": "Get a better job",         "emoji": "💼"},
   {"value": "business", "label": "Start a business / hustle","emoji": "🚀"}
 ]'::jsonb,
 true),

-- 8. Money personality
(8,
 'Which one sounds most like you?',
 'single-select',
 'money_personality',
 '[
   {"value": "saver",    "label": "The Saver",    "emoji": "🐿️", "description": "You hold onto your money like it might run away"},
   {"value": "spender",  "label": "The Spender",   "emoji": "🛍️", "description": "If you''ve got it, you''re spending it"},
   {"value": "balanced", "label": "The Balancer",   "emoji": "⚖️", "description": "A bit of both — you try to be smart about it"},
   {"value": "no-idea",  "label": "No Idea Yet",    "emoji": "🤷", "description": "Haven''t really thought about it"}
 ]'::jsonb,
 true);
-- ============================================================================
-- 008_seed_modules.sql
-- Seed 3 core modules and 15 lessons with full content blocks
-- ============================================================================

-- ===========================================================================
-- MODULE 1: Money Basics
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count)
VALUES (
  'money-basics',
  'Money Basics',
  'Get your head around income, expenses, budgets, and saving — the foundation of being good with money.',
  '💰',
  'yellow',
  1,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  30,
  500,
  5
);

-- ---------------------------------------------------------------------------
-- Lesson 1.1: Income vs Expenses
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-basics'),
  'income-vs-expenses',
  'Income vs Expenses',
  'Learn the two sides of every dollar — money in and money out.',
  1, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Money In vs Money Out"
    },
    {
      "type": "text",
      "text": "Here''s the most basic money rule you''ll ever learn: **income** is money coming IN, and **expenses** are money going OUT. That''s it. Everything in personal finance comes back to this."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Income doesn''t just mean a salary. It can be your part-time job at Pak''nSave, selling stuff on Trade Me, pocket money from whānau, or even StudyLink payments."
    },
    {
      "type": "stat-card",
      "label": "NZ Minimum Wage",
      "value": "$23.15/hr",
      "description": "As of 2024 — if you''re 16+ and working, this is the least your boss can pay you."
    },
    {
      "type": "text",
      "text": "Expenses are everything you spend money on. Some you HAVE to pay (like your phone plan or bus fare), and some you CHOOSE to pay (like that third iced coffee this week). We''ll get into wants vs needs in the next lesson."
    },
    {
      "type": "mini-quiz",
      "question": "You earn $200 a week and spend $180. What''s left over?",
      "options": ["$10", "$20", "$30", "$180"],
      "correct_index": 1,
      "explanation": "Nice! $200 - $180 = $20. That $20 is your surplus — money you can save or invest.",
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Pro Tip",
      "text": "If your expenses are MORE than your income, you''re in the red. That means you''re either borrowing, using savings, or going into debt. Not ideal, bro."
    },
    {
      "type": "text",
      "text": "Let''s look at a real example. Say you work 10 hours a week at minimum wage:\n\n- **Gross income**: 10 x $23.15 = $231.50/week\n- **After tax** (roughly): ~$200/week\n- **Phone plan**: -$40\n- **Transport**: -$30\n- **Food & snacks**: -$50\n- **Fun stuff**: -$40\n- **Left over**: $40\n\nThat $40? That''s the start of your savings."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: What''s the #1 reason young Kiwis go broke?",
      "reveal_text": "Spending more than they earn without tracking it. Most people don''t even know where their money goes each week!",
      "xp_bonus": 10
    },
    {
      "type": "sort-order",
      "instruction": "Put these in order from INCOME to EXPENSE:",
      "items": ["Part-time wages", "Spotify subscription", "Birthday money from Nan", "Uber Eats order"],
      "correct_order": ["Part-time wages", "Birthday money from Nan", "Spotify subscription", "Uber Eats order"],
      "explanation": "The first two are money coming IN (income), the last two are money going OUT (expenses).",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "The golden rule is simple: **spend less than you earn**. Do that consistently and you''re already ahead of most adults. Seriously."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Ka pai! You''ve learned the most fundamental concept in money management. Every lesson from here builds on this."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 1.2: Wants vs Needs
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-basics'),
  'wants-vs-needs',
  'Wants vs Needs',
  'Figure out the difference between what you NEED and what you just WANT.',
  2, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Wants vs Needs — Know the Difference"
    },
    {
      "type": "text",
      "text": "This is where most people trip up. A **need** is something you literally can''t live without — food, shelter, transport to work or school. A **want** is something that''s nice to have but you''d survive without it."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Here''s the tricky part: your brain is REALLY good at turning wants into \"needs\". No, you don''t NEED the new Jordans. Yes, you DO need shoes — but there''s a difference between $50 shoes and $300 ones."
    },
    {
      "type": "sort-order",
      "instruction": "Sort these into NEEDS first, then WANTS:",
      "items": ["Rent/board", "Netflix", "Groceries", "New AirPods", "Bus pass", "Bubble tea"],
      "correct_order": ["Rent/board", "Groceries", "Bus pass", "Netflix", "New AirPods", "Bubble tea"],
      "explanation": "Rent, groceries, and transport are needs. Netflix, AirPods, and bubble tea are wants — nice to have, but not essential.",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "Here''s a framework that actually works:\n\n**Before you buy something, ask yourself 3 questions:**\n1. Will I die or be seriously stuck without this? (If yes = need)\n2. Will I still want this in 2 weeks? (If no = impulse)\n3. Can I afford it WITHOUT dipping into savings? (If no = wait)"
    },
    {
      "type": "mini-quiz",
      "question": "Your phone screen cracks. Is replacing it a want or a need?",
      "options": ["Always a need", "Always a want", "Depends — if you need it for work/school it''s a need, otherwise it can wait", "Only a need if it''s the latest iPhone"],
      "correct_index": 2,
      "explanation": "Context matters! If you need your phone for work shifts or school, fixing it is a need. But upgrading to the latest model is definitely a want.",
      "xp_bonus": 15
    },
    {
      "type": "stat-card",
      "label": "Average Kiwi teen spending",
      "value": "~$60/week",
      "description": "on wants alone — that''s over $3,000 a year on stuff that isn''t essential."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: The 24-Hour Rule",
      "reveal_text": "Before buying anything over $30 that''s a want, wait 24 hours. If you still want it the next day, go for it. Most of the time, the urge passes. This one trick can save you hundreds a year.",
      "xp_bonus": 10
    },
    {
      "type": "text",
      "text": "Nobody''s saying never buy wants — life would be boring. The key is to handle your needs FIRST, set aside some savings, and THEN spend guilt-free on wants with whatever''s left. That''s how you enjoy your money without going broke."
    },
    {
      "type": "fill-blanks",
      "sentence": "A _____ is something essential for survival, while a _____ is something nice to have. Always cover your _____ before spending on _____.",
      "blanks": ["need", "want", "needs", "wants"],
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Knowing the difference between wants and needs is honestly a superpower. You''re now ahead of most people who never even think about it."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 1.3: Your First Budget
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-basics'),
  'your-first-budget',
  'Your First Budget',
  'Build a simple budget that actually works — no spreadsheet degree required.',
  3, 7, 75,
  '[
    {
      "type": "heading",
      "text": "Your First Budget (It''s Easier Than You Think)"
    },
    {
      "type": "text",
      "text": "The word \"budget\" sounds boring. We get it. But a budget is literally just a plan for your money. Without one, you''re just hoping things work out — and hope is not a financial strategy."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "A budget isn''t about saying NO to everything fun. It''s about saying YES to the stuff that actually matters to you, and cutting the stuff that doesn''t."
    },
    {
      "type": "text",
      "text": "We''re going to use the **50/30/20 rule** — the simplest budget framework on the planet:\n\n- **50% — Needs**: Rent/board, food, transport, phone\n- **30% — Wants**: Fun stuff, eating out, entertainment\n- **20% — Savings/Goals**: Emergency fund, saving for a car, KiwiSaver top-up\n\nLet''s say you earn $200 a week after tax:"
    },
    {
      "type": "stat-card",
      "label": "50% Needs",
      "value": "$100",
      "description": "Board, food, bus, phone"
    },
    {
      "type": "stat-card",
      "label": "30% Wants",
      "value": "$60",
      "description": "Eating out, entertainment, shopping"
    },
    {
      "type": "stat-card",
      "label": "20% Savings",
      "value": "$40",
      "description": "Straight into your savings account"
    },
    {
      "type": "mini-quiz",
      "question": "You get paid $300/week. Using the 50/30/20 rule, how much goes to savings?",
      "options": ["$30", "$50", "$60", "$90"],
      "correct_index": 2,
      "explanation": "20% of $300 = $60. Set it up as an automatic transfer and you won''t even miss it.",
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "The #1 Budget Hack",
      "text": "Set up an automatic transfer the DAY you get paid. Move your savings amount to a separate account before you can spend it. Out of sight, out of mind. All the major NZ banks (ANZ, ASB, BNZ, Kiwibank, Westpac) let you do this in their app in about 2 minutes."
    },
    {
      "type": "text",
      "text": "**But what if I don''t earn much?**\n\nThe 50/30/20 is a guide, not a rule carved in stone. If you only earn $100/week, your split might be more like 70/20/10. The point is you''re PLANNING where your money goes instead of wondering where it went."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: Free NZ budgeting tools",
      "reveal_text": "Check out Sorted.org.nz — it''s a free NZ Government tool that helps you build a budget. Also, most banking apps (ASB, ANZ, BNZ) now have built-in spending trackers that auto-categorise your spending. Use them!",
      "xp_bonus": 10
    },
    {
      "type": "fill-blanks",
      "sentence": "The 50/30/20 rule splits your income into _____% for needs, _____% for wants, and _____% for savings.",
      "blanks": ["50", "30", "20"],
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "Here''s the thing — a budget only works if you actually follow it. Try it for just ONE WEEK. Track every dollar. You''ll be surprised where your money actually goes vs where you thought it was going."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You''ve just built the foundation of your financial life. A budget is the single most powerful money tool you''ll ever use. Ka pai!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 1.4: Saving Strategies
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-basics'),
  'saving-strategies',
  'Saving Strategies',
  'Learn how to actually save money (even when it feels impossible).',
  4, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Saving Strategies That Actually Work"
    },
    {
      "type": "text",
      "text": "Saving sounds simple — just don''t spend money, right? If only. The reality is saving takes a bit of strategy. But once you set it up properly, it basically runs on autopilot."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Fun fact: If you saved just $20 a week from age 16, by the time you''re 25 you''d have over $10,000 (even without interest). That''s a decent car, a trip overseas, or a solid emergency fund."
    },
    {
      "type": "text",
      "text": "**The 3 types of savings every young Kiwi should have:**\n\n1. **Emergency Fund** — 3 months of expenses tucked away for when life goes sideways (car breaks down, lose your job, unexpected bill)\n2. **Goals Fund** — saving for something specific (car, travel, moving out)\n3. **KiwiSaver** — your future self will thank you (we''ll cover this properly in the Pay & Work module)"
    },
    {
      "type": "mini-quiz",
      "question": "What''s the recommended emergency fund size?",
      "options": ["$100", "1 month of expenses", "3 months of expenses", "1 year of expenses"],
      "correct_index": 2,
      "explanation": "The general advice is 3 months of expenses. For a teen, that might only be $500-$1000. Start small — even $200 is better than nothing.",
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "The Pay Yourself First Method",
      "text": "As soon as you get paid, IMMEDIATELY transfer your savings amount. Don''t wait until the end of the week to \"save what''s left\" — there''s never anything left. Pay future-you first, then spend what remains."
    },
    {
      "type": "text",
      "text": "**5 sneaky ways to save more:**\n\n1. **Round-up saving** — Some NZ bank apps round up every purchase to the nearest dollar and save the difference\n2. **No-spend days** — Pick 2 days a week where you spend $0\n3. **The $5 trick** — Every time you get a $5 note, save it in a jar\n4. **Cancel unused subscriptions** — Check your bank statement for things you forgot you were paying for\n5. **Meal prep** — Packing lunch instead of buying saves $10-15/day"
    },
    {
      "type": "stat-card",
      "label": "Buying lunch vs packing",
      "value": "$2,600/yr",
      "description": "If you buy a $12 lunch on school/work days instead of packing, that''s ~$2,600 a year. Just on lunch."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: The best NZ savings accounts for teens",
      "reveal_text": "Most NZ banks offer fee-free savings accounts for under-18s. ASB has Headstart, ANZ has Jumpstart, BNZ has YouMoney, and Kiwibank has a free savings account. Look for one with no fees and a decent interest rate. Even 4-5% adds up over time.",
      "xp_bonus": 10
    },
    {
      "type": "sort-order",
      "instruction": "Rank these savings priorities from most important to least:",
      "items": ["Emergency fund", "New gaming console", "Saving for a car", "Holiday with mates"],
      "correct_order": ["Emergency fund", "Saving for a car", "Holiday with mates", "New gaming console"],
      "explanation": "Emergency fund always comes first — it protects everything else. Then practical goals (car), then experiences (holiday), then wants (console).",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "The hardest part of saving is starting. Set up an automatic transfer today — even if it''s just $5 a week. Once it''s automatic, you don''t have to think about it or rely on willpower."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now know more about saving than most adults. Set up one automatic transfer this week and you''re officially on your way."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 1.5: Money Habits Check
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-basics'),
  'money-habits-check',
  'Money Habits Check',
  'Take stock of your current money habits and set yourself up for success.',
  5, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Money Habits Check-Up"
    },
    {
      "type": "text",
      "text": "You''ve learned about income, expenses, wants vs needs, budgeting, and saving. Now it''s time to look at your actual habits and figure out where you stand."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "No judgement here — this is about awareness, not perfection. Even the best money managers started somewhere. The fact that you''re here already puts you ahead."
    },
    {
      "type": "mini-quiz",
      "question": "How often do you check your bank balance?",
      "options": ["Every day", "A few times a week", "When I think I''m running low", "Almost never — too scared to look"],
      "correct_index": 0,
      "explanation": "Checking daily (or at least a few times a week) is the top habit of people who are good with money. It only takes 10 seconds in your banking app.",
      "xp_bonus": 10
    },
    {
      "type": "text",
      "text": "**The 5 money habits that will change your life:**\n\n1. **Check your balance daily** — Takes 10 seconds in your banking app\n2. **Track your spending** — Know where every dollar goes for at least one month\n3. **Pay yourself first** — Auto-transfer savings on payday\n4. **Wait before impulse buying** — Use the 24-hour rule for anything over $30\n5. **Talk about money** — With mates, whānau, or even online communities"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: Why Kiwis don''t talk about money",
      "reveal_text": "New Zealand has a weird culture of not talking about money — we call it \"Tall Poppy Syndrome\". But talking about money isn''t bragging. It''s how you learn. Ask your mates what they earn, how they budget, where they save. You''ll learn heaps.",
      "xp_bonus": 10
    },
    {
      "type": "text",
      "text": "**Common money traps for young Kiwis:**\n\n- **Afterpay/Laybuy** — It feels like free money but it''s not. You''re spending money you haven''t earned yet\n- **Subscription creep** — $15 here, $20 there... suddenly you''re paying $80/month on subscriptions\n- **Lifestyle inflation** — Getting a pay rise and immediately spending more instead of saving more\n- **\"Treat yourself\" too often** — Occasional treats are fine. Daily treats are just expenses"
    },
    {
      "type": "mini-quiz",
      "question": "What is Afterpay/Laybuy essentially?",
      "options": ["Free money", "A type of savings", "A form of debt / borrowing from your future self", "A bank account"],
      "correct_index": 2,
      "explanation": "Afterpay splits payments into 4, but you''re still spending money you haven''t earned yet. If you can''t afford to buy it outright, you can''t afford it on Afterpay.",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "The top 3 money habits are: check your _____ daily, _____ your spending, and pay yourself _____.",
      "blanks": ["balance", "track", "first"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Your Challenge",
      "text": "For the next 7 days, write down EVERYTHING you spend. Every coffee, every bus fare, every online purchase. At the end of the week, sort your spending into needs and wants. Most people are shocked at the result."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You''ve nailed the fundamentals of money management. These basics will serve you for life. Next up: Banking & Credit — time to level up!"
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 2: Banking & Credit
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count)
VALUES (
  'banking-credit',
  'Banking & Credit',
  'Everything you need to know about bank accounts, fees, credit, and keeping your money safe.',
  '🏦',
  'blue',
  2,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  30,
  500,
  5
);

-- ---------------------------------------------------------------------------
-- Lesson 2.1: Bank Accounts 101
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'banking-credit'),
  'bank-accounts-101',
  'Bank Accounts 101',
  'The different types of bank accounts and how to pick the right one.',
  1, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Bank Accounts 101"
    },
    {
      "type": "text",
      "text": "A bank account is your money''s home. Without one, you''re basically stuffing cash under your mattress — and that''s not a great plan. Let''s break down what''s actually on offer in Aotearoa."
    },
    {
      "type": "text",
      "text": "**The main types of bank accounts in NZ:**\n\n- **Transaction Account (Everyday)** — Where your pay goes in and your spending comes out. You get a debit card with this. Usually zero or low interest.\n- **Savings Account** — Where you park money you don''t want to spend. Higher interest rate. Some restrict how often you can withdraw.\n- **Term Deposit** — Lock your money away for a set time (e.g., 6 months) for a better interest rate. Can''t touch it until the term is up.\n- **Notice Saver** — A middle ground: better interest than savings, but you have to give notice (e.g., 32 days) before withdrawing."
    },
    {
      "type": "mini-quiz",
      "question": "Which account type should your wages go into?",
      "options": ["Savings account", "Transaction/everyday account", "Term deposit", "KiwiSaver"],
      "correct_index": 1,
      "explanation": "Your pay goes into your transaction account — that''s the one linked to your debit card for everyday spending. Then you transfer savings out to a savings account.",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "info",
      "text": "The big 5 banks in NZ are ANZ, ASB, BNZ, Kiwibank, and Westpac. There are also smaller ones like TSB, The Co-operative Bank, Heartland, and SBS Bank. They all offer similar products — shop around!"
    },
    {
      "type": "text",
      "text": "**What to look for when choosing a bank:**\n\n1. **Fees** — Monthly account fees, ATM fees, transaction fees. Some banks have zero-fee accounts for under-18s or students.\n2. **Interest rate** — Especially on savings accounts. Even 0.5% difference adds up.\n3. **App quality** — You''ll use the app way more than a branch. Make sure it''s good.\n4. **Accessibility** — Do they have branches/ATMs near you? Not a big deal if you do everything online.\n5. **KiwiSaver options** — Some banks bundle KiwiSaver with their accounts."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Can you have accounts at multiple banks?",
      "reveal_text": "Yes! There''s no rule saying you can only use one bank. Heaps of Kiwis have their everyday account with one bank and savings with another that offers better interest. It''s called optimising your money!",
      "xp_bonus": 10
    },
    {
      "type": "stat-card",
      "label": "NZ savings interest rates",
      "value": "4-5%",
      "description": "Some NZ banks are currently offering 4-5% on savings accounts. On $1,000, that''s $40-50 a year for doing nothing."
    },
    {
      "type": "sort-order",
      "instruction": "Order these accounts from MOST accessible (easiest to withdraw) to LEAST accessible:",
      "items": ["Transaction account", "Savings account", "Notice saver (32-day)", "Term deposit (6-month)"],
      "correct_order": ["Transaction account", "Savings account", "Notice saver (32-day)", "Term deposit (6-month)"],
      "explanation": "Transaction accounts give instant access. Savings accounts are easy but may have limits. Notice savers require advance warning. Term deposits lock your money away completely.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "The Multi-Account Setup",
      "text": "The best setup is: 1 transaction account (for spending), 1 savings account (for goals), and 1 emergency fund account (don''t touch this). Set up auto-transfers on payday and your money sorts itself."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Now you know your way around NZ bank accounts. Time to learn about the sneaky fees they charge..."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 2.2: Fees, Cards & Online Banking
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'banking-credit'),
  'fees-cards-online-banking',
  'Fees, Cards & Online Banking',
  'Understand bank fees, debit vs credit cards, and how to bank like a pro online.',
  2, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Fees, Cards & Online Banking"
    },
    {
      "type": "text",
      "text": "Banks aren''t charities — they make money from fees and lending. Understanding how fees work means you can avoid most of them."
    },
    {
      "type": "text",
      "text": "**Common bank fees to watch out for:**\n\n- **Monthly account fee**: $2-5/month just for having an account (many banks waive this for under-18s or students)\n- **Overdraft fee**: Spent more than you have? That''ll be $5-15 per occurrence\n- **Unarranged overdraft**: Even worse — going into the red without an arranged overdraft can cost $15-25\n- **International transaction fee**: Using your card overseas or on overseas websites? Usually 2-3% on top\n- **ATM fees**: Using another bank''s ATM can cost $1-2 per withdrawal"
    },
    {
      "type": "mini-quiz",
      "question": "What''s a debit card?",
      "options": ["A card that lets you borrow money", "A card that spends your OWN money from your account", "A card you can only use at ATMs", "Same as a credit card"],
      "correct_index": 1,
      "explanation": "A debit card spends money you already have in your account. A credit card borrows money from the bank (which you have to pay back, usually with interest).",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Debit card = YOUR money. Credit card = the BANK''S money that you borrow. Big difference. For now, stick with debit. We''ll cover credit properly in the next lesson."
    },
    {
      "type": "text",
      "text": "**Online banking tips:**\n\n1. **Download your bank''s app** — It''s the easiest way to manage your money\n2. **Set up notifications** — Get a ping every time money goes in or out\n3. **Use auto-payments** — For bills and savings transfers so you never forget\n4. **Check your statements weekly** — Look for anything dodgy or subscriptions you forgot about\n5. **Use payWave carefully** — It''s convenient but makes spending feel \"painless\" which means you spend more"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: The payWave spending trap",
      "reveal_text": "Studies show that people spend 15-20% MORE when using contactless payment vs cash. Why? Because tapping doesn''t feel like spending. Try using cash for a week and you''ll be amazed how much less you spend.",
      "xp_bonus": 10
    },
    {
      "type": "stat-card",
      "label": "Average NZ bank fees per year",
      "value": "$100-200",
      "description": "The average Kiwi pays $100-200 in avoidable bank fees per year. That''s a weekend away you''re giving to the bank for no reason."
    },
    {
      "type": "fill-blanks",
      "sentence": "A _____ card spends your own money, while a _____ card borrows money from the bank. An overdraft fee is charged when you spend _____ than you have.",
      "blanks": ["debit", "credit", "more"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Fee Hack",
      "text": "Call your bank and ask if you qualify for a fee-free account. If you''re a student or under 18, most NZ banks will waive monthly fees. If they won''t, switch banks. Kiwibank and The Co-operative Bank often have the lowest fees."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Nice one! You now know how to dodge unnecessary fees and use online banking like a boss. Next: the big topic — credit."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 2.3: What is Credit?
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'banking-credit'),
  'what-is-credit',
  'What is Credit?',
  'Credit, interest rates, and credit scores — demystified.',
  3, 6, 75,
  '[
    {
      "type": "heading",
      "text": "What is Credit?"
    },
    {
      "type": "text",
      "text": "Credit is basically borrowing money that you promise to pay back later — usually with interest. Interest is the cost of borrowing. Think of it as \"rent\" you pay for using someone else''s money."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Credit itself isn''t bad. A mortgage is credit (you borrow to buy a house). A student loan is credit (you borrow to study). The problems start when people use credit for stuff they can''t afford and don''t pay it back on time."
    },
    {
      "type": "text",
      "text": "**Types of credit you''ll encounter:**\n\n- **Credit card** — A card that lets you borrow up to a certain limit. If you don''t pay it off in full each month, you get charged interest (usually 18-22% per year in NZ)\n- **Personal loan** — Borrow a lump sum from the bank and pay it back in fixed instalments\n- **Student loan** — Interest-free while you''re in NZ! Borrow from the government for fees and living costs via StudyLink\n- **Afterpay/Laybuy** — Buy now, pay later in 4 instalments. No interest if you pay on time, but late fees are brutal\n- **Car loan** — Borrow specifically to buy a car. Interest rates vary wildly (5-25%)"
    },
    {
      "type": "stat-card",
      "label": "Average NZ credit card interest rate",
      "value": "20.5%",
      "description": "If you owe $1,000 on a credit card and only make minimum payments, it takes over 7 years to pay off — and you''ll pay almost $1,000 in interest alone."
    },
    {
      "type": "mini-quiz",
      "question": "You put $500 on a credit card at 20% interest and only make minimum payments. Roughly how much will you end up paying in total?",
      "options": ["$500", "$600", "$700", "Nearly $1,000"],
      "correct_index": 3,
      "explanation": "With minimum payments only, interest compounds and you end up paying almost double. That''s why credit cards can be dangerous if you don''t pay the full balance each month.",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "**What''s a credit score?**\n\nIn NZ, companies like Centrix and Equifax track your credit history. Every time you borrow money and pay it back (or don''t), it gets recorded. This creates a \"credit score\" — a number that tells lenders how trustworthy you are.\n\n- **Good credit score** = easier to get loans, better interest rates\n- **Bad credit score** = harder to borrow, higher interest rates\n- **No credit history** = tricky to get started (but that''s normal at your age)"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: How to check your credit score for free",
      "reveal_text": "You can check your credit score for FREE at Centrix (centrix.co.nz) or Credit Simple (creditsimple.co.nz). It doesn''t affect your score to check it. Do it at least once a year to make sure nothing looks dodgy.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "The Golden Credit Rule",
      "text": "If you do get a credit card, ALWAYS pay the FULL balance each month. Treat it like a debit card that you pay off. This builds your credit score without paying any interest. Never spend more on credit than you have in your bank account."
    },
    {
      "type": "fill-blanks",
      "sentence": "Credit is _____ money that you pay back with _____. A credit _____ shows lenders how trustworthy you are with money.",
      "blanks": ["borrowed", "interest", "score"],
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now understand credit better than most adults. The key takeaway: credit is a tool — use it wisely and it helps you; misuse it and it can wreck your finances."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 2.4: Overdrafts & Debt Traps
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'banking-credit'),
  'overdrafts-debt-traps',
  'Overdrafts & Debt Traps',
  'How to spot and avoid the common debt traps that catch young Kiwis.',
  4, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Overdrafts & Debt Traps"
    },
    {
      "type": "text",
      "text": "Debt traps are situations where borrowing money becomes a cycle you can''t escape. They''re designed to look easy and harmless — but they can spiral fast."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "In 2023, New Zealanders owed over $8 billion on credit cards alone. The average Kiwi household has $7,800 in consumer debt (not counting mortgages). Don''t become a statistic."
    },
    {
      "type": "text",
      "text": "**Debt Trap #1: Overdrafts**\n\nAn overdraft lets you spend more than you have in your account — the bank \"lends\" you the difference. Sounds helpful, but:\n\n- You get charged interest on the overdrawn amount (often 15-20%)\n- Unarranged overdrafts cop additional fees ($15-25 per occurrence)\n- It''s easy to live in permanent overdraft — always starting the week in the red\n\n**Fix**: Set up a low alert on your banking app so you get notified before you hit $0."
    },
    {
      "type": "mini-quiz",
      "question": "You accidentally go $50 into overdraft. Your bank charges a $20 unarranged overdraft fee plus 20% interest. What do you actually owe?",
      "options": ["$50", "$60", "$70", "$70 plus ongoing interest"],
      "correct_index": 3,
      "explanation": "You owe the $50 overdraft + $20 fee = $70, plus interest keeps accruing until you pay it back. A $50 mistake can easily cost you $80+.",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "**Debt Trap #2: Buy Now Pay Later (BNPL)**\n\nAfterpay, Laybuy, Klarna, Zip — they split purchases into 4 payments. Seems sweet, but:\n\n- It normalises spending money you don''t have\n- Late fees are $8-10 per missed payment and they add up FAST\n- It doesn''t build your credit score (but missed payments CAN hurt it)\n- You can have multiple BNPL accounts running at once and lose track"
    },
    {
      "type": "stat-card",
      "label": "BNPL late fees in NZ",
      "value": "$40-68",
      "description": "Afterpay charges up to $68 in late fees on a single order. That $50 hoodie could end up costing you $118."
    },
    {
      "type": "text",
      "text": "**Debt Trap #3: Payday Loans & Loan Sharks**\n\nThis is the worst one. Payday lenders offer quick cash with INSANE interest rates — sometimes 300-600% per year. They target people who are already struggling.\n\n- In NZ, the maximum interest rate is now capped at 0.8% per day (that''s still 292% per year!)\n- If you EVER need emergency money, talk to your bank, WINZ, or a budgeting service FIRST\n- Free budgeting help: MoneyTalks helpline 0800 345 123"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: How to get out of debt",
      "reveal_text": "If you''re already in debt, don''t panic. Here''s the plan:\n1. List ALL your debts (amount, interest rate, minimum payment)\n2. Pay minimums on everything\n3. Put any extra money toward the SMALLEST debt first (the \"snowball method\")\n4. Once that''s paid off, roll that payment into the next debt\n5. Call MoneyTalks (0800 345 123) for free help — they''re legends and it''s confidential.",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "An _____ lets you spend more than you have in your account. Buy Now Pay Later services charge _____ fees if you miss a payment. Payday loans can charge up to _____% interest per year.",
      "blanks": ["overdraft", "late", "292"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "The Simple Rule",
      "text": "If you can''t afford to buy it with money you already have, you can''t afford it. Period. The only exceptions are a house (mortgage), education (student loan), and sometimes a car. Everything else — save up first."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Knowledge is protection. Now that you know about these traps, you''re way less likely to fall into them. Ka pai for learning the hard truths."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 2.5: Protecting Your Money
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'banking-credit'),
  'protecting-your-money',
  'Protecting Your Money',
  'Online safety, scam awareness, and keeping your money secure.',
  5, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Protecting Your Money"
    },
    {
      "type": "text",
      "text": "You''ve learned how to earn, save, and spend smart. Now you need to learn how to protect it. Scams, fraud, and identity theft are real — and young people are actually one of the most targeted groups."
    },
    {
      "type": "stat-card",
      "label": "NZ scam losses (2023)",
      "value": "$200M+",
      "description": "Kiwis lost over $200 million to scams in 2023 alone. The most common? Online shopping scams and phishing texts."
    },
    {
      "type": "text",
      "text": "**The most common scams targeting young Kiwis:**\n\n1. **Phishing texts/emails** — \"Your bank account has been locked. Click here to verify.\" (It''s NEVER your bank)\n2. **Instagram/TikTok scams** — Fake giveaways, \"money flipping\" schemes, influencer promotion scams\n3. **Trade Me / Marketplace scams** — Paying for items that don''t exist or never arrive\n4. **Job scams** — \"Earn $500/day from home!\" If it sounds too good to be true, it is\n5. **Money mule schemes** — Someone asks to deposit money in your account and send it on. This is illegal and YOU could be charged"
    },
    {
      "type": "mini-quiz",
      "question": "You get a text from \"ANZ\" saying your account is locked and to click a link. What should you do?",
      "options": ["Click the link and log in to check", "Reply to the text asking if it''s real", "Delete it and call ANZ directly on their official number", "Forward it to your mates"],
      "correct_index": 2,
      "explanation": "NEVER click links in texts claiming to be from your bank. Banks will never ask you to log in via a text link. If you''re worried, call the bank directly using the number on their official website or the back of your card.",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Your bank will NEVER: ask for your password via text/email, ask you to transfer money to a ''safe'' account, pressure you to act urgently, or send you a link to log in. If any of these happen, it''s a scam."
    },
    {
      "type": "text",
      "text": "**How to protect your money online:**\n\n1. **Use strong, unique passwords** — Different password for your bank than your Instagram\n2. **Turn on 2FA** (two-factor authentication) — An extra code when you log in\n3. **Never share your PIN** — Not even with mates\n4. **Check your statements** — Look for any transactions you don''t recognise\n5. **Be careful on public WiFi** — Don''t log into banking on the school/cafe WiFi without a VPN"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: What to do if you get scammed",
      "reveal_text": "If you think you''ve been scammed:\n1. Contact your bank IMMEDIATELY — they can sometimes freeze or reverse transactions\n2. Change your passwords right away\n3. Report it to Netsafe (netsafe.org.nz) — they help for free\n4. Report it to the NZ Police online\n5. Don''t be embarrassed — scammers are professional criminals and it can happen to anyone.",
      "xp_bonus": 10
    },
    {
      "type": "text",
      "text": "**The Money Mule Warning**\n\nThis is a big one for young people. Someone (often via social media or even at school) asks you to receive money into your account and transfer it somewhere else, keeping a cut for yourself.\n\nThis is **money laundering** — a serious criminal offence in NZ. You can get a criminal record that follows you for life. No amount of \"easy money\" is worth that."
    },
    {
      "type": "fill-blanks",
      "sentence": "If you get a suspicious text from your ''bank'', you should _____ the text and call the bank on their _____ number. Never share your _____ with anyone.",
      "blanks": ["delete", "official", "PIN"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Quick Security Checklist",
      "text": "Right now, check these off:\n- Banking app has a PIN/biometric lock? Check.\n- 2FA turned on for email and banking? Check.\n- No shared passwords with friends? Check.\n- Bank notifications turned on? Check.\nIf not, sort these out today — it takes 5 minutes."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You''re now banking-literate and scam-aware. That''s a powerful combo. Next module: Pay & Work — time to understand your payslip and your rights."
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 3: Pay & Work
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count)
VALUES (
  'pay-work',
  'Pay & Work',
  'Understand your payslip, taxes, KiwiSaver, your rights at work, and how to earn more.',
  '💼',
  'green',
  3,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  30,
  500,
  5
);

-- ---------------------------------------------------------------------------
-- Lesson 3.1: Your First Payslip
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'pay-work'),
  'your-first-payslip',
  'Your First Payslip',
  'Decode your payslip — gross pay, net pay, deductions, and where your money actually goes.',
  1, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Your First Payslip — Decoded"
    },
    {
      "type": "text",
      "text": "You worked hard, payday arrives... and the number in your account is less than you expected. Welcome to the world of deductions. Don''t worry — it''s completely normal. Let''s break down what actually happens to your pay."
    },
    {
      "type": "text",
      "text": "**Key terms on your payslip:**\n\n- **Gross Pay** — Your total earnings BEFORE any deductions. This is the \"headline\" number.\n- **PAYE** — Pay As You Earn. This is income tax that your employer takes out and sends straight to IRD (Inland Revenue).\n- **KiwiSaver** — Your retirement savings contribution (3%, 4%, 6%, 8%, or 10% of gross pay).\n- **Student Loan** — If you have one, 12% of every dollar over $24,128/year gets deducted.\n- **Net Pay** — What actually lands in your bank account. Gross pay minus all deductions."
    },
    {
      "type": "stat-card",
      "label": "Example: 10hrs @ $23.15/hr",
      "value": "$231.50 gross",
      "description": "After PAYE (~$24) and KiwiSaver 3% (~$7), your take-home is roughly $200. That''s normal!"
    },
    {
      "type": "mini-quiz",
      "question": "What does ''net pay'' mean?",
      "options": ["Your total earnings before deductions", "Your hourly rate times hours worked", "The money that actually lands in your bank account", "Your KiwiSaver balance"],
      "correct_index": 2,
      "explanation": "Net pay (also called take-home pay) is what you actually receive after tax, KiwiSaver, and any other deductions are taken out.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**A typical payslip breakdown for a part-time teen:**\n\nSay you work 12 hours at $23.15/hr:\n- Gross pay: $277.80\n- PAYE tax (10.5% rate): -$29.17\n- KiwiSaver (3%): -$8.33\n- **Net pay: $240.30**\n\nThat roughly $37 you \"lost\" went to tax and your KiwiSaver (which is actually saving for YOUR future)."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Your employer should give you a payslip every payday. If they don''t, ask for one — it''s your legal right under NZ employment law. You need this to check you''re being paid correctly."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: How to check you''re being paid correctly",
      "reveal_text": "Use the IRD''s online PAYE calculator (ird.govt.nz/calculators/tool-name/tools-t/calculator-paye.html) to check your deductions. Also check: are you being paid at least minimum wage ($23.15/hr)? Are you getting time-and-a-half on public holidays? Are your hours correct?",
      "xp_bonus": 10
    },
    {
      "type": "fill-blanks",
      "sentence": "_____ pay is your earnings before deductions. _____ pay is what lands in your bank. _____ is the income tax taken from your pay.",
      "blanks": ["Gross", "Net", "PAYE"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Payslip Checklist",
      "text": "Every payday, check these 4 things:\n1. Hours are correct\n2. Pay rate is at least $23.15/hr\n3. PAYE looks right for your tax code\n4. KiwiSaver is deducted at your chosen rate"
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You can now read a payslip like a pro. No more confusion about where your money went — you''ll know exactly what every line means."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 3.2: Tax Codes & IRD
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'pay-work'),
  'tax-codes-ird',
  'Tax Codes & IRD',
  'IRD numbers, tax codes, and why getting them right saves you money.',
  2, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Tax Codes & IRD"
    },
    {
      "type": "text",
      "text": "In New Zealand, everyone who earns money needs an IRD number. It''s your unique tax ID — like a social security number but for tax. If you don''t have one yet, you need to sort that before you start any job."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "You can apply for an IRD number online at ird.govt.nz. You''ll need your NZ birth certificate or passport, and a NZ bank account in your name. It''s free and usually takes 5-10 working days."
    },
    {
      "type": "text",
      "text": "**Tax codes — what do they mean?**\n\nYour tax code tells your employer how much PAYE to deduct. The main ones:\n\n- **M** — Your main (or only) job. This is the most common one.\n- **ME** — Main job + you have a student loan.\n- **S** — Secondary job (you already have an M job somewhere else).\n- **SH** — Secondary job where you earn over $48,000 total.\n\nUsing the wrong tax code = paying too much or too little tax. Both are annoying."
    },
    {
      "type": "mini-quiz",
      "question": "You have one part-time job at a cafe. What tax code should you use?",
      "options": ["S", "M", "ME", "SH"],
      "correct_index": 1,
      "explanation": "M is for your main (or only) job. If you only have one job and no student loan, M is your code. Easy!",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**NZ income tax rates (2024/25):**\n\n| Income bracket | Tax rate |\n|---|---|\n| $0 - $15,600 | 10.5% |\n| $15,601 - $53,500 | 17.5% |\n| $53,501 - $78,100 | 30% |\n| $78,101 - $180,000 | 33% |\n| $180,001+ | 39% |\n\nAs a part-time teen, you''ll almost certainly be in the 10.5% bracket. That''s less than 11 cents in every dollar!"
    },
    {
      "type": "stat-card",
      "label": "Earning under $15,600/yr?",
      "value": "10.5% tax",
      "description": "If you earn under $300/week, you''re only paying 10.5% tax. That''s one of the lowest rates in the world."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: How to get a tax refund",
      "reveal_text": "If you''ve been overtaxed (e.g., wrong tax code), IRD will automatically calculate your tax at the end of the financial year (31 March) and send you a refund if you''re owed one. You can also check anytime by logging into myIR at ird.govt.nz. Don''t pay a \"tax refund company\" to do this for you — they charge fees for something you can do for free!",
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "NEVER pay a tax refund company. They charge 15-30% of your refund for something that takes 5 minutes on the IRD website. If you''re owed $200, they''ll take $40-60 for doing basically nothing."
    },
    {
      "type": "fill-blanks",
      "sentence": "Your _____ number is your unique tax ID in NZ. Tax code _____ is for your main job, and tax code _____ is for a second job.",
      "blanks": ["IRD", "M", "S"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Action Step",
      "text": "If you don''t have an IRD number yet, go to ird.govt.nz and apply today. If you do have one, log into myIR and make sure your tax code is correct. It takes 2 minutes and could save you money."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Tax doesn''t have to be scary. You now understand the NZ tax system better than most adults. Next up: KiwiSaver — your secret weapon for building wealth."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 3.3: KiwiSaver Explained
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'pay-work'),
  'kiwisaver-explained',
  'KiwiSaver Explained',
  'The free money scheme that most young Kiwis don''t fully understand.',
  3, 7, 75,
  '[
    {
      "type": "heading",
      "text": "KiwiSaver — Free Money You''re Probably Missing"
    },
    {
      "type": "text",
      "text": "KiwiSaver is New Zealand''s retirement savings scheme, but calling it \"retirement savings\" makes it sound boring and far away. Here''s the real deal: **it''s one of the best wealth-building tools available to you RIGHT NOW**, and it includes actual free money."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "KiwiSaver isn''t just for retirement. You can also use it to buy your first home! For most young Kiwis, that''s the real reason to care about it NOW."
    },
    {
      "type": "text",
      "text": "**How KiwiSaver works:**\n\n1. **You contribute** — 3%, 4%, 6%, 8%, or 10% of your gross pay (you choose the rate)\n2. **Your employer contributes** — At least 3% on top of your pay. This is FREE MONEY.\n3. **The government contributes** — Up to $521.43 per year if you put in at least $1,042.86. More FREE MONEY.\n\nThat''s THREE sources of money flowing into your KiwiSaver. The employer and government contributions are literally free — you''d be mad not to take them."
    },
    {
      "type": "stat-card",
      "label": "Government contribution",
      "value": "$521.43/yr",
      "description": "Put in $1,042.86 per year ($20.05/week) and the government gives you $521.43 for free. That''s a 50% return for doing nothing."
    },
    {
      "type": "mini-quiz",
      "question": "You contribute 3% of your pay to KiwiSaver. Your employer contributes at least:",
      "options": ["Nothing extra", "1%", "3%", "6%"],
      "correct_index": 2,
      "explanation": "Your employer must contribute at least 3% — that''s on top of your pay, not taken from it. So if you put in 3%, you''re actually getting 6% going into your KiwiSaver. Plus the government tops it up too!",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "**KiwiSaver fund types (from safest to riskiest):**\n\n- **Conservative** — Low risk, low returns (~3-5%/yr). Good if you need the money soon.\n- **Balanced** — Medium risk, medium returns (~5-7%/yr). A solid middle ground.\n- **Growth** — Higher risk, higher returns (~7-10%/yr). Best if you''re young and won''t need it for 10+ years.\n- **Aggressive** — Highest risk, highest potential returns (~8-12%/yr). Might drop 20% in a bad year but historically recovers.\n\n**If you''re a teenager**, most financial advisors recommend a Growth or Aggressive fund because you have decades for it to grow."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: KiwiSaver for your first home",
      "reveal_text": "After 3 years in KiwiSaver, you can withdraw most of your balance to buy your first home. You might also qualify for a First Home Grant from Kainga Ora:\n- $1,000 for each year you''ve been in KiwiSaver (up to $5,000)\n- $2,000/year for new builds (up to $10,000)\nStarting KiwiSaver now means more money when you buy your first house!",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Don''t just stay with the default KiwiSaver provider your employer signed you up with. Compare fees and returns on sorted.org.nz/kiwisaver. The difference in fees alone could cost you tens of thousands over your lifetime."
    },
    {
      "type": "text",
      "text": "**The power of compound interest:**\n\nIf you start KiwiSaver at 16 with $50/week going in (your contribution + employer), with 7% average returns:\n\n- At age 25: ~$38,000 (hello, house deposit!)\n- At age 35: ~$115,000\n- At age 65: ~$750,000+\n\nStart at 25 instead? You''d have ~$500,000 at 65. Starting 9 years earlier is worth an extra $250,000. Time is literally money."
    },
    {
      "type": "fill-blanks",
      "sentence": "KiwiSaver has three sources of money: your _____, your employer''s _____, and the _____ contribution. After _____ years you can use it for your first home.",
      "blanks": ["contribution", "contribution", "government", "3"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "KiwiSaver Action Plan",
      "text": "1. Check you''re enrolled (ask your employer or log into myIR)\n2. Make sure you''re contributing at least $20/week to get the full government contribution\n3. Check your fund type — if you''re under 25, consider Growth or Aggressive\n4. Compare providers at sorted.org.nz/kiwisaver"
    },
    {
      "type": "callout",
      "style": "success",
      "text": "KiwiSaver is literally free money and compound interest working for you. The earlier you start, the more you benefit. Future you is going to be stoked."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 3.4: Your Rights at Work
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'pay-work'),
  'your-rights-at-work',
  'Your Rights at Work',
  'Know your employment rights — minimum wage, breaks, holidays, and what to do if things go wrong.',
  4, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Your Rights at Work"
    },
    {
      "type": "text",
      "text": "Just because you''re young doesn''t mean you have fewer rights at work. NZ has strong employment laws that protect everyone — including part-time and casual workers. Knowing your rights means no one can take advantage of you."
    },
    {
      "type": "text",
      "text": "**Your basic rights as a worker in NZ:**\n\n- **Minimum wage**: $23.15/hour (adult rate, 16+). Starting-out rate is $18.52/hr but ONLY applies in very specific situations\n- **Written employment agreement**: Your employer MUST give you one BEFORE you start\n- **Rest breaks**: 10-min paid break after 2 hours, 30-min meal break after 4 hours\n- **Holidays**: 4 weeks annual leave after 12 months. Plus 11 public holidays.\n- **Sick leave**: 10 days per year after 6 months of employment\n- **Time and a half**: You must be paid 1.5x on public holidays you work"
    },
    {
      "type": "stat-card",
      "label": "NZ Minimum Wage (adult)",
      "value": "$23.15/hr",
      "description": "This is the legal minimum for anyone 16+. If you''re being paid less, your employer is breaking the law."
    },
    {
      "type": "mini-quiz",
      "question": "You work a 5-hour shift. What breaks are you entitled to?",
      "options": ["No breaks", "Just a 10-minute break", "A 10-minute paid break AND a 30-minute meal break", "Whatever your boss decides"],
      "correct_index": 2,
      "explanation": "After 2 hours you get a 10-min paid rest break, and after 4 hours you get a 30-min meal break. These are your legal rights — not optional extras your boss can skip.",
      "xp_bonus": 20
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Red flags at work:\n- No written employment agreement\n- Being paid below minimum wage\n- No breaks during long shifts\n- Being asked to work \"cash in hand\" (no tax = no KiwiSaver, no ACC, no employment rights)\n- Threats if you call in sick\nAny of these? Something''s not right."
    },
    {
      "type": "text",
      "text": "**Trial periods vs probation:**\n\n- **Trial period**: Up to 90 days, but ONLY for businesses with fewer than 20 employees. Must be in your employment agreement BEFORE you start.\n- **Probation**: Can be any length. You can still be dismissed during probation, but your employer has to follow a fair process.\n\nEither way, you still have ALL your other rights (minimum wage, breaks, holidays, etc.) from day one."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: What to do if your employer isn''t following the rules",
      "reveal_text": "Steps to take:\n1. Talk to your employer first — sometimes it''s a genuine mistake\n2. Contact Employment New Zealand (employment.govt.nz) for free advice\n3. Call the Employment NZ helpline: 0800 20 90 20\n4. If it''s serious, you can lodge a complaint with the Employment Relations Authority\n5. Community Law Centres offer free legal advice for employment issues\n\nDon''t be afraid to stand up for yourself — the law is on your side.",
      "xp_bonus": 10
    },
    {
      "type": "text",
      "text": "**Things your employer CANNOT do:**\n\n- Deduct money from your pay without your written consent\n- Force you to work on a public holiday (unless it''s in your agreement)\n- Dismiss you without following proper process\n- Discriminate based on age, gender, ethnicity, or disability\n- Prevent you from joining a union"
    },
    {
      "type": "fill-blanks",
      "sentence": "The adult minimum wage is $_____ per hour. You must receive a _____ employment agreement. On public holidays you get paid _____ and a half.",
      "blanks": ["23.15", "written", "time"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Before You Start Any Job",
      "text": "Checklist:\n- Get a written employment agreement\n- Check the pay rate is at least minimum wage\n- Confirm your hours, breaks, and leave entitlements\n- Make sure KiwiSaver is set up\n- Know who to contact if there''s a problem\n\nKeep a copy of your employment agreement somewhere safe."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Knowing your rights makes you a better employee AND protects you from being taken advantage of. You deserve fair treatment at work — full stop."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 3.5: Side Hustles & Extra Income
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'pay-work'),
  'side-hustles-extra-income',
  'Side Hustles & Extra Income',
  'Ways to earn extra cash beyond your main job — legally and smartly.',
  5, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Side Hustles & Extra Income"
    },
    {
      "type": "text",
      "text": "Your part-time job isn''t your only option for making money. Side hustles are extra ways to earn on your own terms. Some of the richest people in the world started with a side hustle as a teenager."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "A side hustle is any way you earn money outside your main job. It can be a few hours a week, completely flexible, and often based on skills you already have."
    },
    {
      "type": "text",
      "text": "**Side hustle ideas that actually work for NZ teens:**\n\n🏠 **Services:**\n- Lawn mowing / gardening ($30-50/hr)\n- Babysitting / pet sitting ($15-25/hr)\n- Tutoring younger students ($20-40/hr)\n- Car washing / detailing ($30-60/car)\n\n💻 **Digital:**\n- Selling on Trade Me or Facebook Marketplace\n- Social media management for small businesses\n- Graphic design (Canva skills = money)\n- Freelance writing or content creation\n\n🎨 **Creative:**\n- Selling art/crafts on Etsy or local markets\n- Photography (events, portraits)\n- Music lessons if you play an instrument"
    },
    {
      "type": "mini-quiz",
      "question": "You start a lawn mowing side hustle and earn $200 in a weekend. Do you need to pay tax on this?",
      "options": ["No, side hustles are tax-free", "Only if you earn over $1,000", "Yes — all income is taxable in NZ", "Only if you have an ABN"],
      "correct_index": 2,
      "explanation": "All income is taxable in NZ, including side hustles. You''ll need to declare it as self-employment income in your tax return. You might want to get an IR3 form from IRD. (ABN is an Australian thing — we don''t have those here!)",
      "xp_bonus": 15
    },
    {
      "type": "stat-card",
      "label": "Top teen side hustle",
      "value": "Tutoring: $20-40/hr",
      "description": "If you''re good at a subject, tutoring younger students pays well and looks great on your CV."
    },
    {
      "type": "text",
      "text": "**How to start a side hustle:**\n\n1. **Pick something you''re already decent at** — Don''t try to learn a whole new skill first\n2. **Start small** — One customer, one sale, one gig. See if you like it.\n3. **Tell everyone** — Post on your socials, tell your whānau, ask around at school\n4. **Set your prices fairly** — Don''t undersell yourself. Check what others charge for similar services\n5. **Track your income and expenses** — You''ll need this for tax time"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: Side hustle tax tips",
      "reveal_text": "If your side hustle earns over $200/year, you need to declare it to IRD. But here''s the good news: you can deduct expenses! If you mow lawns, the cost of fuel, mower maintenance, and even a portion of your phone bill are deductible. Keep ALL your receipts. Log into myIR to file your tax return or ask a parent for help.",
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Watch out for \"side hustle\" scams: MLM / pyramid schemes (Herbalife, Amway, etc.), \"money flipping\" on Instagram, paid survey sites that promise hundreds, and anything that asks you to pay money upfront to \"get started\". If you have to pay to work, it''s a scam."
    },
    {
      "type": "sort-order",
      "instruction": "Rank these side hustles from highest typical hourly rate to lowest:",
      "items": ["Tutoring NCEA subjects", "Babysitting", "Selling old stuff on Trade Me", "Lawn mowing"],
      "correct_order": ["Tutoring NCEA subjects", "Lawn mowing", "Babysitting", "Selling old stuff on Trade Me"],
      "explanation": "Tutoring can earn $25-40/hr, lawn mowing $25-50/hr, babysitting $15-25/hr. Selling on Trade Me varies hugely but typically works out to a lower hourly rate when you factor in time listing and shipping.",
      "xp_bonus": 20
    },
    {
      "type": "fill-blanks",
      "sentence": "All side hustle income is _____ in NZ. You can deduct _____ to reduce your tax bill. Watch out for _____ schemes disguised as side hustles.",
      "blanks": ["taxable", "expenses", "pyramid"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Your Side Hustle Starter Pack",
      "text": "This week:\n1. Write down 3 skills or things you''re good at\n2. Think about who would pay for each one\n3. Set a price (check what others charge)\n4. Tell 5 people you''re available\n5. Do your first gig and see how it goes!"
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You now understand pay, tax, KiwiSaver, your rights, and how to earn extra income. You''re officially financially literate. Ka pai rawa atu — you''re absolutely smashing it!"
    }
  ]'::jsonb
);
-- ============================================================================
-- 009_seed_badges.sql
-- Seed ~14 badges for the gamification system
-- ============================================================================

INSERT INTO public.badges (slug, name, description, emoji, category, criteria, xp_bonus, is_secret, rarity)
VALUES

-- Milestone badges
(
  'first-lesson',
  'First Steps',
  'Complete your first lesson. Every journey starts with a single step!',
  '👣',
  'milestone',
  '{"type": "lessons_completed", "count": 1}'::jsonb,
  50,
  false,
  'common'
),
(
  'five-lessons',
  'Getting Started',
  'Complete 5 lessons. You''re building momentum!',
  '🔥',
  'milestone',
  '{"type": "lessons_completed", "count": 5}'::jsonb,
  100,
  false,
  'common'
),
(
  'ten-lessons',
  'Knowledge is Power',
  'Complete 10 lessons. You''re officially a financial learner!',
  '🧠',
  'milestone',
  '{"type": "lessons_completed", "count": 10}'::jsonb,
  200,
  false,
  'uncommon'
),
(
  'first-module',
  'Module Master',
  'Complete an entire module from start to finish. That''s commitment!',
  '🏆',
  'milestone',
  '{"type": "modules_completed", "count": 1}'::jsonb,
  200,
  false,
  'uncommon'
),

-- Streak badges
(
  'three-day-streak',
  'On a Roll',
  'Learn for 3 days in a row. Consistency is key!',
  '⚡',
  'streak',
  '{"type": "streak_days", "count": 3}'::jsonb,
  75,
  false,
  'common'
),
(
  'seven-day-streak',
  'Week Warrior',
  'A full week of learning. You''re unstoppable!',
  '🗓️',
  'streak',
  '{"type": "streak_days", "count": 7}'::jsonb,
  200,
  false,
  'uncommon'
),
(
  'fourteen-day-streak',
  'Unstoppable',
  '14 days straight! You''re in the zone and nothing can stop you.',
  '💪',
  'streak',
  '{"type": "streak_days", "count": 14}'::jsonb,
  500,
  false,
  'rare'
),

-- Module-specific badges
(
  'money-basics-done',
  'Budget Boss',
  'Complete the Money Basics module. You''ve nailed the fundamentals!',
  '💰',
  'module',
  '{"type": "module_completed", "module_slug": "money-basics"}'::jsonb,
  150,
  false,
  'uncommon'
),
(
  'banking-done',
  'Bank Manager',
  'Complete the Banking & Credit module. You''re banking like a pro!',
  '🏦',
  'module',
  '{"type": "module_completed", "module_slug": "banking-credit"}'::jsonb,
  150,
  false,
  'uncommon'
),
(
  'pay-work-done',
  'Pay Day',
  'Complete the Pay & Work module. You know your worth!',
  '💼',
  'module',
  '{"type": "module_completed", "module_slug": "pay-work"}'::jsonb,
  150,
  false,
  'uncommon'
),

-- Special badges
(
  'quiz-complete',
  'Identity Found',
  'Complete the onboarding quiz. We know who you are now!',
  '🪪',
  'special',
  '{"type": "quiz_completed"}'::jsonb,
  50,
  false,
  'common'
),
(
  'xp-1000',
  'Thousandaire',
  'Earn 1,000 XP. You''re racking up the points!',
  '💎',
  'milestone',
  '{"type": "total_xp", "count": 1000}'::jsonb,
  100,
  false,
  'uncommon'
),
(
  'xp-5000',
  'Five Grand',
  'Earn 5,000 XP. You''re a financial knowledge powerhouse!',
  '👑',
  'milestone',
  '{"type": "total_xp", "count": 5000}'::jsonb,
  250,
  false,
  'rare'
),
(
  'speed-learner',
  'Speed Learner',
  'Complete 3 lessons in a single day. Speedy and smart!',
  '⚡',
  'special',
  '{"type": "lessons_in_day", "count": 3}'::jsonb,
  100,
  false,
  'uncommon'
);
