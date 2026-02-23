/**
 * Deterministic stock price algorithm.
 * Prices are consistent for all users on the same day — no external API needed.
 */

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Get the price of a stock on a given date.
 * Uses overlapping sin waves seeded per-stock for realistic-looking daily movement.
 */
export function getStockPrice(
  basePrice: number,
  symbol: string,
  volatility: number,
  date: Date
): number {
  const dayNum = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const seed = hashCode(symbol);

  // Three overlapping waves at different frequencies for natural-looking movement
  const wave1 = Math.sin(dayNum * 0.05 + seed * 0.01) * 0.12;
  const wave2 = Math.sin(dayNum * 0.15 + seed * 0.03) * 0.06;
  const wave3 = Math.sin(dayNum * 0.4 + seed * 0.07) * 0.03;

  // Per-day micro-noise based on hash of symbol+day
  const dayHash = hashCode(`${symbol}-${dayNum}`);
  const noise = ((dayHash % 100) - 50) / 1000; // -0.05 to +0.05

  // Slight upward drift over time (stocks generally go up)
  const drift = dayNum * 0.00008;

  // Scale movement by volatility
  const change = (wave1 + wave2 + wave3 + noise) * volatility + drift;

  const price = basePrice * (1 + change);
  return Math.round(Math.max(price, 0.01) * 100) / 100;
}

/**
 * Get the daily change percentage between today and yesterday.
 */
export function getDailyChange(
  basePrice: number,
  symbol: string,
  volatility: number,
  date: Date
): { change: number; changePercent: number } {
  const today = getStockPrice(basePrice, symbol, volatility, date);
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayPrice = getStockPrice(basePrice, symbol, volatility, yesterday);

  const change = today - yesterdayPrice;
  const changePercent = ((change / yesterdayPrice) * 100);

  return {
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  };
}

/**
 * Get price history for sparkline charts.
 * Returns array of prices for the last N days (oldest first).
 */
export function getPriceHistory(
  basePrice: number,
  symbol: string,
  volatility: number,
  days: number
): number[] {
  const today = new Date();
  const prices: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    prices.push(getStockPrice(basePrice, symbol, volatility, date));
  }

  return prices;
}
