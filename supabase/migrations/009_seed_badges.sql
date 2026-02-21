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
