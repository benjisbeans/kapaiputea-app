"use client";

import { motion } from "framer-motion";
import { Zap, ArrowUp, Medal, X } from "lucide-react";
import { LEVEL_NAMES } from "@/lib/constants";
import { ShareButton } from "@/components/sharing/share-button";

interface XpCelebrationProps {
  xpEarned: number;
  breakdown: Record<string, number>;
  leveledUp: boolean;
  newLevel?: number;
  badges: { name: string; emoji: string }[];
  onDone: () => void;
  moduleName?: string;
  moduleCompleted?: boolean;
  currentStreak?: number;
  currentLevel?: number;
}

export function XpCelebration({
  xpEarned,
  breakdown,
  leveledUp,
  newLevel,
  badges,
  onDone,
  moduleName,
  moduleCompleted,
  currentStreak,
  currentLevel,
}: XpCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onDone}
    >
      {/* Confetti particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -300 - Math.random() * 200],
            x: [(Math.random() - 0.5) * 500],
          }}
          transition={{
            duration: 2.5,
            delay: Math.random() * 0.8,
            ease: "easeOut",
          }}
          className="pointer-events-none fixed"
          style={{
            top: "60%",
            left: "50%",
            width: 6 + Math.random() * 10,
            height: 6 + Math.random() * 10,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            backgroundColor: [
              "#FDE047",
              "#A855F7",
              "#EC4899",
              "#3B82F6",
              "#22C55E",
              "#F97316",
            ][i % 6],
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onDone}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* XP earned */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Zap className="mx-auto h-12 w-12 text-kpp-yellow-dark" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-5xl font-bold text-kpp-dark"
          >
            +{xpEarned} XP
          </motion.p>
        </motion.div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 space-y-1"
        >
          {Object.entries(breakdown).map(([key, val]) => {
            if (key === "total") return null;
            return (
              <p key={key} className="text-sm text-gray-500">
                {key === "base"
                  ? "Lesson"
                  : key === "streak"
                  ? "Streak bonus"
                  : key === "dailyBonus"
                  ? "Daily bonus"
                  : key}{" "}
                +{val}
              </p>
            );
          })}
        </motion.div>

        {/* Level up */}
        {leveledUp && newLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 rounded-2xl bg-purple-50 p-4"
          >
            <ArrowUp className="mx-auto h-8 w-8 text-kpp-purple" />
            <p className="mt-2 text-lg font-bold text-kpp-purple">
              Level Up!
            </p>
            <p className="text-sm text-gray-500">
              Level {newLevel}: {LEVEL_NAMES[newLevel - 1]}
            </p>
          </motion.div>
        )}

        {/* Badges — show max 3, summarize the rest */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-4 space-y-2"
          >
            {badges.slice(0, 3).map((badge, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2 rounded-2xl bg-kpp-yellow/15 p-3"
              >
                <Medal className="h-5 w-5 text-kpp-yellow-dark" />
                <span className="text-2xl">{badge.emoji}</span>
                <span className="font-bold text-gray-900">{badge.name}</span>
              </div>
            ))}
            {badges.length > 3 && (
              <p className="text-sm text-gray-500">
                +{badges.length - 3} more badge{badges.length - 3 > 1 ? "s" : ""} earned!
              </p>
            )}
          </motion.div>
        )}

        {/* Share */}
        {moduleCompleted && moduleName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-4 flex justify-center"
          >
            <ShareButton
              shareData={{
                title: `I completed ${moduleName} on Ka Pai Pūtea!`,
                text: `Just finished ${moduleName} and earned ${xpEarned} XP! 💰`,
                url: `/share?type=module&name=${encodeURIComponent(moduleName)}&xp=${xpEarned}&streak=${currentStreak || 0}&level=${currentLevel || 1}&emoji=🎉`,
              }}
            />
          </motion.div>
        )}

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onClick={onDone}
          className="mt-8 w-full rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.02]"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
