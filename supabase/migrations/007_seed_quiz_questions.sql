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
