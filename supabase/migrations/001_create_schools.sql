-- ============================================================================
-- 001_create_schools.sql
-- Schools table for Ka Pai Putea
-- ============================================================================

CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT,
  decile INTEGER CHECK (decile BETWEEN 1 AND 10),
  school_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schools are public"
  ON public.schools
  FOR SELECT
  USING (true);
