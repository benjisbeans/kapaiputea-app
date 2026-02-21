-- ============================================================================
-- 003_create_quiz.sql
-- Onboarding quiz questions and user responses
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Quiz Questions (admin-defined)
-- ---------------------------------------------------------------------------
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_order INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single-select', 'multi-select', 'slider', 'emoji-scale')),
  field_key TEXT UNIQUE NOT NULL,
  options JSONB,
  is_required BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are public"
  ON public.quiz_questions
  FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- Quiz Responses (per user)
-- ---------------------------------------------------------------------------
CREATE TABLE public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer_value TEXT,
  answered_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, question_id)
);

ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Users can read their own responses
CREATE POLICY "Users can view own quiz responses"
  ON public.quiz_responses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert own quiz responses"
  ON public.quiz_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own quiz responses"
  ON public.quiz_responses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own quiz responses"
  ON public.quiz_responses
  FOR DELETE
  USING (auth.uid() = user_id);
