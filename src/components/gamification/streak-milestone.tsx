"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X } from "lucide-react";

const MILESTONES = [7, 14, 30, 60, 100];

const MILESTONE_MESSAGES: Record<number, { title: string; subtitle: string }> = {
  7: { title: "One Week Strong!", subtitle: "7 days of learning — you're building a real habit!" },
  14: { title: "Two Week Warrior!", subtitle: "14 days straight! Most people don't make it this far." },
  30: { title: "Monthly Legend!", subtitle: "30 days of dedication. You're unstoppable!" },
  60: { title: "Two Month Master!", subtitle: "60 days! Your money knowledge is next level." },
  100: { title: "Century Champion!", subtitle: "100 days! You're a true Ka Pai Legend." },
};

interface StreakMilestoneProps {
  currentStreak: number;
}

export function StreakMilestone({ currentStreak }: StreakMilestoneProps) {
  const [showMilestone, setShowMilestone] = useState<number | null>(null);

  useEffect(() => {
    const milestone = MILESTONES.find((m) => m === currentStreak);
    if (!milestone) return;

    const key = `streak_milestone_${milestone}`;
    if (localStorage.getItem(key)) return;

    setShowMilestone(milestone);
    localStorage.setItem(key, "true");
  }, [currentStreak]);

  const message = showMilestone ? MILESTONE_MESSAGES[showMilestone] : null;

  return (
    <AnimatePresence>
      {showMilestone && message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowMilestone(null)}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMilestone(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Flame animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-kpp-orange/10"
            >
              <Flame className="h-10 w-10 text-kpp-orange" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="mt-4 text-3xl font-bold text-gray-900">
                {showMilestone} Days!
              </p>
              <p className="mt-2 text-lg font-bold text-kpp-orange">
                {message.title}
              </p>
              <p className="mt-2 text-sm text-gray-500">{message.subtitle}</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => setShowMilestone(null)}
              className="mt-6 w-full rounded-2xl bg-kpp-dark px-8 py-3 font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Keep Going!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
