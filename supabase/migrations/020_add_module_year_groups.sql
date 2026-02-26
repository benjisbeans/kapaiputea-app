-- ============================================================================
-- 020_add_module_year_groups.sql
-- Add target year groups to modules so some modules only show for certain years
-- ============================================================================

ALTER TABLE public.modules
  ADD COLUMN target_year_groups INTEGER[] DEFAULT ARRAY[11,12,13];

-- Money Basics is too easy for Year 12/13 — restrict to Year 11 only
UPDATE public.modules
  SET target_year_groups = ARRAY[11]
  WHERE slug = 'money-basics';
