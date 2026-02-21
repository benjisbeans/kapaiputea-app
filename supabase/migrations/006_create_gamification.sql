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
