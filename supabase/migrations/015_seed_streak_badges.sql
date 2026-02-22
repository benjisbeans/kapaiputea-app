-- ============================================================================
-- 015_seed_streak_badges.sql
-- Additional streak badges
-- ============================================================================

INSERT INTO public.badges (slug, name, description, emoji, category, criteria, xp_bonus, is_secret, rarity)
VALUES
(
  'thirty-day-streak',
  'Monthly Legend',
  'Learn for 30 days straight. A whole month of dedication!',
  '🔥',
  'streak',
  '{"type": "streak_days", "count": 30}'::jsonb,
  750,
  false,
  'epic'
);
