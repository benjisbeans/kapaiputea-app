-- ============================================================================
-- 016_add_pathway_detail.sql
-- Adds pathway_detail column for stream-specific career/pathway info
-- e.g. "Electrician" for trade, "Engineering" for uni
-- ============================================================================

ALTER TABLE public.profiles
  ADD COLUMN pathway_detail TEXT;
