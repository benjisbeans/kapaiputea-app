-- ============================================================================
-- 004_create_modules.sql
-- Learning modules and lessons for Ka Pai Putea
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Modules
-- ---------------------------------------------------------------------------
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_emoji TEXT,
  color TEXT,
  module_order INTEGER NOT NULL,
  streams TEXT[] DEFAULT '{}',
  estimated_minutes INTEGER DEFAULT 30,
  total_xp INTEGER DEFAULT 500,
  lesson_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  prerequisite_module_id UUID REFERENCES public.modules(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are public"
  ON public.modules
  FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- Lessons
-- ---------------------------------------------------------------------------
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  lesson_order INTEGER NOT NULL,
  estimated_minutes INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 50,
  content_blocks JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (module_id, slug)
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are public"
  ON public.lessons
  FOR SELECT
  USING (true);

-- Index for fast ordered lesson lookups within a module
CREATE INDEX idx_lessons_module_order ON public.lessons (module_id, lesson_order);
