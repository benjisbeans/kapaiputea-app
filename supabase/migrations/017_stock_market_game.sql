-- ============================================================================
-- 017_stock_market_game.sql
-- Stock Market Game + Hustle Empire Tycoon tables
-- ============================================================================

-- ── Stocks (fictional NZ companies) ──
CREATE TABLE public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  emoji TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  volatility NUMERIC(3,2) NOT NULL DEFAULT 0.50,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read stocks" ON public.stocks FOR SELECT USING (true);

-- ── User Portfolios ──
CREATE TABLE public.user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cash_balance NUMERIC(12,2) NOT NULL DEFAULT 10000.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own portfolio" ON public.user_portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own portfolio" ON public.user_portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own portfolio" ON public.user_portfolios FOR UPDATE USING (auth.uid() = user_id);

-- ── User Holdings ──
CREATE TABLE public.user_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  shares INTEGER NOT NULL DEFAULT 0,
  avg_buy_price NUMERIC(10,2) NOT NULL,
  UNIQUE(user_id, stock_id)
);

ALTER TABLE public.user_holdings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own holdings" ON public.user_holdings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own holdings" ON public.user_holdings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own holdings" ON public.user_holdings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own holdings" ON public.user_holdings FOR DELETE USING (auth.uid() = user_id);

-- ── User Trades ──
CREATE TABLE public.user_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES public.stocks(id),
  trade_type TEXT NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  shares INTEGER NOT NULL,
  price_per_share NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own trades" ON public.user_trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own trades" ON public.user_trades FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_trades_user ON public.user_trades (user_id);
CREATE INDEX idx_user_trades_created ON public.user_trades (created_at DESC);

-- ── Seed Stocks ──
INSERT INTO public.stocks (symbol, name, sector, emoji, base_price, volatility) VALUES
  ('KPT', 'Ka Pai Tech',        'Technology',   '💻', 24.50, 0.65),
  ('FLD', 'Fernleaf Dairy',     'Agriculture',  '🐄', 45.00, 0.35),
  ('KWI', 'Kiwi Airlines',      'Transport',    '✈️', 32.00, 0.55),
  ('HBT', 'Hobbiton Tours',     'Tourism',      '🏔️', 15.25, 0.50),
  ('MNK', 'Mānuka Gold',        'Health',       '🍯', 28.50, 0.40),
  ('WKE', 'Waikato Energy',     'Energy',       '⚡', 38.00, 0.30),
  ('OTG', 'Otago Mining',       'Resources',    '⛏️', 22.00, 0.45),
  ('CRK', 'CryptoKiwi',         'Crypto',       '🪙',  8.50, 0.90),
  ('SLV', 'Silver Fern Meats',  'Agriculture',  '🥩', 18.75, 0.35),
  ('AKP', 'Auckland Property',  'Real Estate',  '🏠', 56.00, 0.25);

-- ── Hustle Empire: User Businesses ──
CREATE TABLE public.user_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_type TEXT NOT NULL,
  business_level INTEGER NOT NULL DEFAULT 1,
  revenue_per_hour NUMERIC(10,2) NOT NULL DEFAULT 5.00,
  cost_per_hour NUMERIC(10,2) NOT NULL DEFAULT 1.00,
  cash_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_earned NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  upgrades JSONB NOT NULL DEFAULT '[]',
  last_collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own business" ON public.user_businesses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own business" ON public.user_businesses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own business" ON public.user_businesses FOR UPDATE USING (auth.uid() = user_id);
