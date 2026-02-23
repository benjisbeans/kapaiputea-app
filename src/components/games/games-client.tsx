"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart3, Building2, ChevronRight } from "lucide-react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
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

export function GamesClient() {
  return (
    <motion.div
      className="mx-auto max-w-4xl space-y-6 pb-28"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          Games 🎮
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Learn by playing. Your progress saves automatically.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/invest"
          className={`${CARD} group overflow-hidden transition-all hover:border-emerald-300 hover:shadow-md`}
        >
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
            <BarChart3 className="h-10 w-10" />
            <h2 className="mt-3 text-xl font-black">Stock Market</h2>
            <p className="mt-1 text-sm text-white/80">
              Trade NZ stocks with $10k virtual cash
            </p>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                Buy & Sell
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">
                Daily Prices
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        <Link
          href="/hustle"
          className={`${CARD} group overflow-hidden transition-all hover:border-kpp-pink/30 hover:shadow-md`}
        >
          <div className="bg-gradient-to-br from-kpp-pink to-kpp-purple p-6 text-white">
            <Building2 className="h-10 w-10" />
            <h2 className="mt-3 text-xl font-black">Hustle Empire</h2>
            <p className="mt-1 text-sm text-white/80">
              Start a business and grow your empire
            </p>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-2">
              <span className="rounded-full bg-kpp-pink/10 px-2.5 py-1 text-xs font-bold text-kpp-pink">
                Passive Income
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">
                Upgrades
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
