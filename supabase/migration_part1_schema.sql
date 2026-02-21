-- ============================================================================
-- PART 1: Schema (tables, RLS, triggers, indexes)
-- Run this FIRST in Supabase SQL Editor
-- ============================================================================

-- Clean slate: drop everything in reverse dependency order
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

DROP TABLE IF EXISTS public.streak_history CASCADE;
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.xp_transactions CASCADE;
DROP TABLE IF EXISTS public.user_lesson_progress CASCADE;
DROP TABLE IF EXISTS public.user_module_progress CASCADE;
DROP TABLE IF EXISTS public.quiz_responses CASCADE;
DROP TABLE IF EXISTS public.quiz_questions CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.schools CASCADE;

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
