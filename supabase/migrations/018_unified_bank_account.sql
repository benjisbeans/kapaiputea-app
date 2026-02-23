-- ============================================================================
-- 018_unified_bank_account.sql
-- Adds a unified bank_balance to profiles that both games share
-- ============================================================================

ALTER TABLE public.profiles
  ADD COLUMN bank_balance NUMERIC(12,2) NOT NULL DEFAULT 10000.00;
