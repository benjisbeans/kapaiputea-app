-- ============================================================================
-- 021_add_year_10.sql
-- Add Year 10 as a valid year group option
-- ============================================================================

-- 1. Widen the CHECK constraint on profiles to include year 10
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_year_group_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_year_group_check CHECK (year_group IN (10, 11, 12, 13));

-- 2. Add target_year_groups column if it doesn't exist (from migration 020)
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS target_year_groups INTEGER[] DEFAULT ARRAY[10,11,12,13];

-- Money Basics stays for lower years only
UPDATE public.modules
  SET target_year_groups = ARRAY[10,11]
  WHERE slug = 'money-basics';

-- 3. Add Year 10 option to the quiz question
UPDATE public.quiz_questions
SET options = '[
  {"value": "10", "label": "Year 10"},
  {"value": "11", "label": "Year 11"},
  {"value": "12", "label": "Year 12"},
  {"value": "13", "label": "Year 13"}
]'::jsonb
WHERE field_key = 'year_group';
