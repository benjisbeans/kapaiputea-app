-- ============================================================================
-- 014_seed_new_badges.sql
-- Badges for new modules (advanced, stream, explore)
-- ============================================================================

INSERT INTO public.badges (slug, name, description, emoji, category, criteria, xp_bonus, is_secret, rarity)
VALUES

-- Advanced module badges
(
  'credit-scores-done',
  'Credit Guru',
  'Complete the Credit Scores & Reports module. You know the score!',
  '📊',
  'module',
  '{"type": "module_completed", "module_slug": "credit-scores"}'::jsonb,
  150,
  false,
  'uncommon'
),
(
  'kiwisaver-invest-done',
  'KiwiSaver Pro',
  'Complete the KiwiSaver Investment Levels module. Growing that nest egg!',
  '🥝',
  'module',
  '{"type": "module_completed", "module_slug": "kiwisaver-investment"}'::jsonb,
  150,
  false,
  'uncommon'
),
(
  'investing-done',
  'Baby Investor',
  'Complete the Simple Investing Simulation module. Warren Buffett would be proud!',
  '📈',
  'module',
  '{"type": "module_completed", "module_slug": "simple-investing"}'::jsonb,
  150,
  false,
  'uncommon'
),
(
  'tax-gst-done',
  'Tax Whiz',
  'Complete the Tax & GST Basics module. Even the IRD is impressed!',
  '🧾',
  'module',
  '{"type": "module_completed", "module_slug": "tax-gst-basics"}'::jsonb,
  150,
  false,
  'uncommon'
),

-- Explore module badges
(
  'hustle-empire-done',
  'Hustle Boss',
  'Complete the Hustle Empire module. You''re ready to run a business!',
  '🏢',
  'module',
  '{"type": "module_completed", "module_slug": "hustle-empire"}'::jsonb,
  250,
  false,
  'rare'
),
(
  'confidence-done',
  'Confidence King',
  'Complete the Money Confidence Builder module. You''ve got this!',
  '💛',
  'module',
  '{"type": "module_completed", "module_slug": "money-confidence"}'::jsonb,
  150,
  false,
  'uncommon'
),

-- Milestone badges
(
  'fifteen-lessons',
  'Fifteen & Thriving',
  'Complete 15 lessons total. You''re on a roll!',
  '🌟',
  'milestone',
  '{"type": "lessons_completed", "count": 15}'::jsonb,
  300,
  false,
  'rare'
),
(
  'twenty-five-lessons',
  'Quarter Century',
  'Complete 25 lessons total. Knowledge machine!',
  '🎯',
  'milestone',
  '{"type": "lessons_completed", "count": 25}'::jsonb,
  400,
  false,
  'rare'
),
(
  'five-modules',
  'Module Maniac',
  'Complete 5 modules. You''re mastering money!',
  '🏅',
  'milestone',
  '{"type": "modules_completed", "count": 5}'::jsonb,
  500,
  false,
  'epic'
);
