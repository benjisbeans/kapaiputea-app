"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUp,
  Loader2,
  Zap,
} from "lucide-react";
import type { UserBusiness } from "@/types/database";
import {
  BUSINESS_TYPES,
  UPGRADES,
  calculatePendingIncome,
  getUpgradeLevel,
  getUpgradeCost,
} from "@/lib/hustle-config";

/* ── animation ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
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

export function HustleClient() {
  const [business, setBusiness] = useState<UserBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [bankBalance, setBankBalance] = useState(10000);
  const [collecting, setCollecting] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [pendingIncome, setPendingIncome] = useState(0);
  const [pendingHours, setPendingHours] = useState(0);
  const [lastCollected, setLastCollected] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/hustle");
    if (res.ok) {
      const json = await res.json();
      setBusiness(json.business);
      if (json.bankBalance !== undefined) setBankBalance(json.bankBalance);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update pending income every second
  useEffect(() => {
    if (!business) return;
    function update() {
      const { income, hours } = calculatePendingIncome(
        Number(business!.revenue_per_hour),
        Number(business!.cost_per_hour),
        business!.last_collected_at
      );
      setPendingIncome(income);
      setPendingHours(hours);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [business]);

  async function startBusiness(typeId: string) {
    setLoading(true);
    const res = await fetch("/api/hustle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", business_type: typeId }),
    });
    if (res.ok) {
      const json = await res.json();
      setBusiness(json.business);
    }
    setLoading(false);
  }

  async function collect() {
    if (collecting) return;
    setCollecting(true);
    const res = await fetch("/api/hustle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "collect" }),
    });
    if (res.ok) {
      const json = await res.json();
      setBusiness(json.business);
      if (json.bankBalance !== undefined) setBankBalance(json.bankBalance);
      setLastCollected(json.collected);
      setTimeout(() => setLastCollected(null), 2000);
    }
    setCollecting(false);
  }

  async function buyUpgrade(upgradeId: string) {
    setUpgrading(upgradeId);
    const res = await fetch("/api/hustle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upgrade", upgrade_id: upgradeId }),
    });
    if (res.ok) {
      const json = await res.json();
      setBusiness(json.business);
      if (json.bankBalance !== undefined) setBankBalance(json.bankBalance);
    }
    setUpgrading(null);
  }

  const animatedBank = useCounter(bankBalance);
  const totalEarned = useCounter(business ? Number(business.total_earned) : 0);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── No business yet: picker ──
  if (!business) {
    return (
      <motion.div
        className="mx-auto max-w-4xl space-y-6 pb-28"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Start Your Empire 🏢
          </h1>
          <p className="mt-2 text-gray-500">
            Pick a business. Earn passive income. Upgrade and grow.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="grid gap-4 sm:grid-cols-2"
        >
          {BUSINESS_TYPES.map((biz) => (
            <button
              key={biz.id}
              onClick={() => startBusiness(biz.id)}
              className={`${CARD} group p-6 text-left transition-all hover:border-kpp-pink/30 hover:shadow-md`}
            >
              <div className="text-4xl">{biz.emoji}</div>
              <h3 className="mt-3 text-lg font-black text-gray-900">
                {biz.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{biz.description}</p>
              <div className="mt-4 flex items-center gap-3 text-xs">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-bold text-emerald-700">
                  ${biz.baseRevenue}/hr
                </span>
                <span className="text-gray-400">
                  ${biz.baseCost}/hr costs
                </span>
              </div>
            </button>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  // ── Business dashboard ──
  const bizType = BUSINESS_TYPES.find((b) => b.id === business.business_type);
  const profitPerHour =
    Number(business.revenue_per_hour) - Number(business.cost_per_hour);
  const upgrades = (business.upgrades as string[]) || [];

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
          Hustle Empire 🏢
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your business is earning while you sleep.
        </p>
      </motion.div>

      {/* Business Hero */}
      <motion.div
        variants={fadeUp}
        className={`${CARD} overflow-hidden`}
      >
        <div className="bg-gradient-to-r from-kpp-pink to-kpp-purple p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
              {bizType?.emoji || "🏢"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white/70">
                {bizType?.name}
              </p>
              <p className="text-2xl font-black">Level {business.business_level}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <p className="text-white/70">Revenue</p>
              <p className="font-black">${Number(business.revenue_per_hour).toFixed(2)}/hr</p>
            </div>
            <div>
              <p className="text-white/70">Costs</p>
              <p className="font-black">${Number(business.cost_per_hour).toFixed(2)}/hr</p>
            </div>
            <div>
              <p className="text-white/70">Profit</p>
              <p className="font-black text-white">
                ${profitPerHour.toFixed(2)}/hr
              </p>
            </div>
          </div>
        </div>

        {/* Collect section */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Pending ({pendingHours}hrs)
              </p>
              <p className="text-2xl font-black tabular-nums text-emerald-600">
                ${pendingIncome.toFixed(2)}
              </p>
            </div>
            <button
              onClick={collect}
              disabled={collecting || pendingIncome <= 0}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white transition-all hover:bg-emerald-600 disabled:opacity-40"
            >
              {collecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              Collect
            </button>
          </div>
          {lastCollected !== null && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm font-bold text-emerald-500"
            >
              +${lastCollected.toFixed(2)} collected!
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 gap-3"
      >
        <div className={`${CARD} p-4`}>
          <div className="inline-flex rounded-lg bg-emerald-100 p-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-black tabular-nums text-gray-900">
            ${animatedBank.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Bank Balance</p>
        </div>
        <div className={`${CARD} p-4`}>
          <div className="inline-flex rounded-lg bg-kpp-purple/10 p-2">
            <TrendingUp className="h-5 w-5 text-kpp-purple" />
          </div>
          <p className="mt-3 text-2xl font-black tabular-nums text-gray-900">
            ${totalEarned.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Total Earned</p>
        </div>
        <div className={`${CARD} p-4`}>
          <div className="inline-flex rounded-lg bg-kpp-yellow/10 p-2">
            <Zap className="h-5 w-5 text-kpp-yellow-dark" />
          </div>
          <p className="mt-3 text-2xl font-black tabular-nums text-gray-900">
            ${profitPerHour.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Profit / Hour</p>
        </div>
        <div className={`${CARD} p-4`}>
          <div className="inline-flex rounded-lg bg-kpp-blue/10 p-2">
            <Clock className="h-5 w-5 text-kpp-blue" />
          </div>
          <p className="mt-3 text-2xl font-black tabular-nums text-gray-900">
            {Math.floor(
              (Date.now() - new Date(business.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
            )}d
          </p>
          <p className="text-xs text-gray-500">Days Running</p>
        </div>
      </motion.div>

      {/* Upgrades */}
      <motion.div variants={fadeUp}>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
          Upgrades
        </h3>
        <div className="space-y-3">
          {UPGRADES.map((upgrade) => {
            const level = getUpgradeLevel(upgrades, upgrade.id);
            const cost = getUpgradeCost(upgrade, level);
            const maxed = cost === null;
            const canAfford = !maxed && bankBalance >= cost;
            const isUpgrading = upgrading === upgrade.id;

            return (
              <div
                key={upgrade.id}
                className={`${CARD} flex items-center gap-4 p-4`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  {upgrade.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{upgrade.name}</p>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
                      Lv {level}/{upgrade.levelCosts.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {upgrade.description}
                    {!maxed && (
                      <span className="text-emerald-600">
                        {" "}
                        &middot; +${upgrade.revenueBoost}/hr
                      </span>
                    )}
                  </p>
                </div>
                {maxed ? (
                  <span className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-400">
                    MAX
                  </span>
                ) : (
                  <button
                    onClick={() => buyUpgrade(upgrade.id)}
                    disabled={!canAfford || isUpgrading}
                    className="flex items-center gap-1.5 rounded-xl bg-kpp-dark px-4 py-2 text-xs font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-30"
                  >
                    {isUpgrading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ArrowUp className="h-3.5 w-3.5" />
                    )}
                    ${cost}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
