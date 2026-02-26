-- ============================================================================
-- 019_add_increment_xp_rpc.sql
-- RPC function to atomically increment a user's XP
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_xp(user_id UUID, amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET total_xp = total_xp + amount
  WHERE id = user_id;
END;
$$;
