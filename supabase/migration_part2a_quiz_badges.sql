-- ============================================================================
-- PART 2A: Quiz questions + Badges
-- Run SECOND (after Part 1)
-- ============================================================================

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
