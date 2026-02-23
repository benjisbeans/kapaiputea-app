"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ChevronDown,
  Minus,
  Plus,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import type { Stock, UserHolding } from "@/types/database";
import {
  getStockPrice,
  getDailyChange,
  getPriceHistory,
} from "@/lib/stock-prices";

/* ── animation ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const CARD = "rounded-3xl border border-gray-200/60 bg-white shadow-sm";

/* ── animated counter ── */
function useCounter(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * end * 100) / 100);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return count;
}

/* ── sparkline ── */
function Sparkline({ prices, color }: { prices: number[]; color: string }) {
  if (prices.length < 2) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── types ── */
type StockWithPrice = Stock & {
  currentPrice: number;
  change: number;
  changePercent: number;
  history: number[];
};

type PortfolioData = {
  stocks: Stock[];
  bankBalance: number;
  holdings: (UserHolding & { stock?: Stock })[];
  trades: { id: string; stock_id: string; trade_type: string; shares: number; price_per_share: number; total_amount: number; created_at: string; stock?: Stock }[];
};

export function InvestClient() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<StockWithPrice | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [shareCount, setShareCount] = useState(1);
  const [trading, setTrading] = useState(false);
  const [tab, setTab] = useState<"market" | "holdings" | "history">("market");

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/invest");
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const today = new Date();

  // Enrich stocks with prices
  const enrichedStocks: StockWithPrice[] = (data?.stocks || []).map((s) => {
    const currentPrice = getStockPrice(
      Number(s.base_price),
      s.symbol,
      Number(s.volatility),
      today
    );
    const { change, changePercent } = getDailyChange(
      Number(s.base_price),
      s.symbol,
      Number(s.volatility),
      today
    );
    const history = getPriceHistory(
      Number(s.base_price),
      s.symbol,
      Number(s.volatility),
      7
    );
    return { ...s, currentPrice, change, changePercent, history };
  });

  const cashBalance = data?.bankBalance ?? 10000;

  // Calculate portfolio value
  const holdingsValue = (data?.holdings || []).reduce((sum, h) => {
    const stock = enrichedStocks.find((s) => s.id === h.stock_id);
    if (!stock) return sum;
    return sum + h.shares * stock.currentPrice;
  }, 0);

  const totalValue = cashBalance + holdingsValue;
  const totalGain = totalValue - 10000;
  const totalGainPercent = ((totalGain / 10000) * 100);

  const animatedTotal = useCounter(totalValue);
  const animatedCash = useCounter(cashBalance);

  // Get holding for selected stock
  const selectedHolding = selectedStock
    ? data?.holdings?.find((h) => h.stock_id === selectedStock.id)
    : null;

  const maxBuyable = selectedStock
    ? Math.floor(cashBalance / selectedStock.currentPrice)
    : 0;
  const maxSellable = selectedHolding?.shares || 0;

  async function executeTrade() {
    if (!selectedStock || shareCount < 1) return;
    setTrading(true);
    try {
      const res = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock_id: selectedStock.id,
          trade_type: tradeType,
          shares: shareCount,
          price_per_share: selectedStock.currentPrice,
        }),
      });
      if (res.ok) {
        await fetchData();
        setShareCount(1);
        setSelectedStock(null);
      }
    } finally {
      setTrading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <motion.div
      className="mx-auto max-w-4xl space-y-5 pb-28"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          Stock Market 📈
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Buy and sell NZ stocks. Prices change daily.
        </p>
      </motion.div>

      {/* Portfolio Summary */}
      <motion.div
        variants={fadeUp}
        className={`${CARD} overflow-hidden`}
      >
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Portfolio Value
          </p>
          <p className="mt-1 text-3xl font-black tabular-nums">
            ${animatedTotal.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              {totalGain >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-bold">
                {totalGain >= 0 ? "+" : ""}
                ${totalGain.toFixed(2)} ({totalGainPercent.toFixed(1)}%)
              </span>
            </span>
          </div>
        </div>
        <div className="flex divide-x divide-gray-100">
          <div className="flex-1 px-5 py-3">
            <p className="text-xs text-gray-500">Cash</p>
            <p className="text-lg font-black tabular-nums text-gray-900">
              ${animatedCash.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex-1 px-5 py-3">
            <p className="text-xs text-gray-500">Invested</p>
            <p className="text-lg font-black tabular-nums text-gray-900">
              ${holdingsValue.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex gap-1 rounded-2xl bg-gray-100 p-1">
        {(["market", "holdings", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "market" ? "Market" : t === "holdings" ? "My Stocks" : "History"}
          </button>
        ))}
      </motion.div>

      {/* Market Tab */}
      {tab === "market" && (
        <motion.div variants={fadeUp} className="space-y-3">
          {enrichedStocks.map((stock) => (
            <button
              key={stock.id}
              onClick={() => {
                setSelectedStock(stock);
                setShareCount(1);
                setTradeType("buy");
              }}
              className={`${CARD} flex w-full items-center gap-4 p-4 text-left transition-all hover:border-gray-300 hover:shadow-sm`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                {stock.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">
                    {stock.symbol}
                  </span>
                  <span className="text-xs text-gray-400">{stock.sector}</span>
                </div>
                <p className="font-bold text-gray-900 truncate">{stock.name}</p>
              </div>
              <Sparkline
                prices={stock.history}
                color={stock.change >= 0 ? "#10b981" : "#ef4444"}
              />
              <div className="text-right shrink-0">
                <p className="font-black tabular-nums text-gray-900">
                  ${stock.currentPrice.toFixed(2)}
                </p>
                <p
                  className={`text-xs font-bold tabular-nums ${
                    stock.change >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(1)}%
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-300" />
            </button>
          ))}
        </motion.div>
      )}

      {/* Holdings Tab */}
      {tab === "holdings" && (
        <motion.div variants={fadeUp} className="space-y-3">
          {(data?.holdings || []).length === 0 ? (
            <div className={`${CARD} p-8 text-center`}>
              <BarChart3 className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 font-bold text-gray-900">No stocks yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Head to the Market tab to buy your first stock!
              </p>
            </div>
          ) : (
            (data?.holdings || []).map((h) => {
              const stock = enrichedStocks.find((s) => s.id === h.stock_id);
              if (!stock) return null;
              const value = h.shares * stock.currentPrice;
              const cost = h.shares * Number(h.avg_buy_price);
              const gain = value - cost;
              const gainPct = ((gain / cost) * 100);
              return (
                <button
                  key={h.id}
                  onClick={() => {
                    setSelectedStock(stock);
                    setShareCount(1);
                    setTradeType("sell");
                  }}
                  className={`${CARD} flex w-full items-center gap-4 p-4 text-left transition-all hover:border-gray-300 hover:shadow-sm`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                    {stock.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{stock.name}</p>
                    <p className="text-xs text-gray-500">
                      {h.shares} shares &middot; avg ${Number(h.avg_buy_price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black tabular-nums text-gray-900">
                      ${value.toFixed(2)}
                    </p>
                    <p
                      className={`text-xs font-bold tabular-nums ${
                        gain >= 0 ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {gain >= 0 ? "+" : ""}${gain.toFixed(2)} ({gainPct.toFixed(1)}%)
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </motion.div>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <motion.div variants={fadeUp} className="space-y-2">
          {(data?.trades || []).length === 0 ? (
            <div className={`${CARD} p-8 text-center`}>
              <DollarSign className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 font-bold text-gray-900">No trades yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Your trade history will appear here.
              </p>
            </div>
          ) : (
            (data?.trades || []).map((t) => (
              <div
                key={t.id}
                className={`${CARD} flex items-center gap-3 px-4 py-3`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white ${
                    t.trade_type === "buy" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                >
                  {t.trade_type === "buy" ? "B" : "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    {t.trade_type === "buy" ? "Bought" : "Sold"}{" "}
                    {t.shares} {t.stock?.symbol || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    @ ${Number(t.price_per_share).toFixed(2)} each
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold tabular-nums text-gray-900">
                    ${Number(t.total_amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.created_at).toLocaleDateString("en-NZ", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Trade Sheet */}
      <AnimatePresence>
        {selectedStock && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStock(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

              {/* Stock header */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedStock(null)}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                  {selectedStock.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900">
                    {selectedStock.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedStock.symbol} &middot; {selectedStock.sector}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black tabular-nums text-gray-900">
                    ${selectedStock.currentPrice.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      selectedStock.change >= 0
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {selectedStock.change >= 0 ? "+" : ""}
                    {selectedStock.changePercent.toFixed(1)}% today
                  </p>
                </div>
              </div>

              {/* 30-day chart */}
              <div className="mt-4 flex justify-center">
                <Sparkline
                  prices={getPriceHistory(
                    Number(selectedStock.base_price),
                    selectedStock.symbol,
                    Number(selectedStock.volatility),
                    30
                  )}
                  color={
                    selectedStock.change >= 0 ? "#10b981" : "#ef4444"
                  }
                />
              </div>

              {/* Current holding info */}
              {selectedHolding && (
                <div className="mt-4 rounded-2xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">You own</p>
                  <p className="font-bold text-gray-900">
                    {selectedHolding.shares} shares &middot; avg $
                    {Number(selectedHolding.avg_buy_price).toFixed(2)}
                  </p>
                </div>
              )}

              {/* Buy/Sell toggle */}
              <div className="mt-4 flex gap-1 rounded-2xl bg-gray-100 p-1">
                <button
                  onClick={() => { setTradeType("buy"); setShareCount(1); }}
                  className={`flex-1 rounded-xl py-2 text-sm font-bold transition-all ${
                    tradeType === "buy"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => { setTradeType("sell"); setShareCount(1); }}
                  className={`flex-1 rounded-xl py-2 text-sm font-bold transition-all ${
                    tradeType === "sell"
                      ? "bg-red-500 text-white shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Share count */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Shares</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShareCount(Math.max(1, shareCount - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-xl font-black tabular-nums text-gray-900">
                    {shareCount}
                  </span>
                  <button
                    onClick={() =>
                      setShareCount(
                        Math.min(
                          shareCount + 1,
                          tradeType === "buy" ? maxBuyable : maxSellable
                        )
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick buttons */}
              <div className="mt-3 flex gap-2">
                {[1, 5, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() =>
                      setShareCount(
                        Math.min(
                          n,
                          tradeType === "buy" ? maxBuyable : maxSellable
                        )
                      )
                    }
                    className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setShareCount(
                      tradeType === "buy" ? maxBuyable : maxSellable
                    )
                  }
                  className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Max
                </button>
              </div>

              {/* Total */}
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-lg font-black tabular-nums text-gray-900">
                  $
                  {(shareCount * selectedStock.currentPrice).toFixed(2)}
                </p>
              </div>

              {/* Execute button */}
              <button
                onClick={executeTrade}
                disabled={
                  trading ||
                  shareCount < 1 ||
                  (tradeType === "buy" && shareCount > maxBuyable) ||
                  (tradeType === "sell" && shareCount > maxSellable)
                }
                className={`mt-4 w-full rounded-2xl py-3.5 text-sm font-black text-white transition-all disabled:opacity-40 ${
                  tradeType === "buy"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {trading
                  ? "Processing..."
                  : tradeType === "buy"
                    ? `Buy ${shareCount} Share${shareCount > 1 ? "s" : ""}`
                    : `Sell ${shareCount} Share${shareCount > 1 ? "s" : ""}`}
              </button>

              {/* Info text */}
              <p className="mt-2 text-center text-xs text-gray-400">
                {tradeType === "buy"
                  ? `You can buy up to ${maxBuyable} shares`
                  : `You own ${maxSellable} shares`}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
