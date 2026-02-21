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
