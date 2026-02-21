-- ============================================================================
-- 010_add_module_category.sql
-- Add category column to modules for tab-based grouping
-- ============================================================================

ALTER TABLE public.modules
  ADD COLUMN category TEXT NOT NULL DEFAULT 'core'
  CHECK (category IN ('core', 'advanced', 'stream', 'explore'));

-- Existing 3 modules are already 'core' via the DEFAULT
-- Add index for filtering by category
CREATE INDEX idx_modules_category ON public.modules (category);
