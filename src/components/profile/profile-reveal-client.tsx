"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Share2, ArrowRight } from "lucide-react";
import { LEVEL_NAMES, STREAM_LABELS, STREAM_EMOJIS } from "@/lib/constants";
import type { Profile } from "@/types/database";

interface ProfileRevealClientProps {
  profile: Profile;
}

export function ProfileRevealClient({ profile }: ProfileRevealClientProps) {
  const router = useRouter();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => setStage(4), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12">
      {/* Confetti dots */}
      <AnimatePresence>
        {stage >= 2 && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: 0,
                  x: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -200 - Math.random() * 300],
                  x: [(Math.random() - 0.5) * 400],
                  scale: [0, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
                className="pointer-events-none fixed"
                style={{
                  top: "50%",
                  left: "50%",
                  width: 8 + Math.random() * 8,
                  height: 8 + Math.random() * 8,
                  borderRadius: "50%",
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
          </>
        )}
      </AnimatePresence>

      {/* Pre-reveal text */}
      <AnimatePresence>
        {stage === 0 && (
          <motion.div
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-6xl"
            >
              🎯
            </motion.div>
            <p className="mt-4 text-xl text-gray-500">Generating your profile...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Card */}
      <AnimatePresence>
        {stage >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-sm"
          >
            <div className="overflow-hidden rounded-3xl border-2 border-kpp-yellow-dark/20 bg-white shadow-2xl shadow-kpp-yellow/10">
              {/* Card header */}
              <div className="bg-gradient-to-r from-kpp-yellow via-kpp-orange to-kpp-pink p-1">
                <div className="bg-white px-6 py-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-kpp-yellow-dark">
                      Ka Pai Putea ID
                    </span>
                    <Sparkles className="h-5 w-5 text-kpp-yellow-dark" />
                  </div>

                  {/* Avatar + Name */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kpp-yellow text-3xl">
                      {profile.profile_tag_emoji}
                    </div>
                    <div>
                      <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-black text-gray-900"
                      >
                        {profile.display_name}
                      </motion.h1>
                      <AnimatePresence>
                        {stage >= 2 && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            className="mt-1 inline-flex items-center gap-1 rounded-full bg-kpp-yellow/15 px-3 py-1"
                          >
                            <span className="text-sm font-bold text-kpp-yellow-dark">
                              {profile.profile_tag}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="px-6 py-5">
                <AnimatePresence>
                  {stage >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-400">Year</p>
                          <p className="text-lg font-black text-gray-900">
                            {profile.year_group}
                          </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-400">Path</p>
                          <p className="text-lg font-black text-gray-900">
                            {STREAM_EMOJIS[profile.stream]}{" "}
                            {STREAM_LABELS[profile.stream]}
                          </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-400">Level</p>
                          <p className="text-lg font-bold text-kpp-yellow-dark">
                            {LEVEL_NAMES[0]}
                          </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-400">XP</p>
                          <p className="text-lg font-bold text-kpp-green">
                            100
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <AnimatePresence>
        {stage >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex w-full max-w-sm flex-col gap-3"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-black text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Learning
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `I'm ${profile.profile_tag} on Ka Pai Putea!`,
                    text: `Just got my financial profile: ${profile.profile_tag} ${profile.profile_tag_emoji}. Learning money skills with Ka Pai Putea!`,
                  });
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-8 py-4 text-lg font-black text-gray-900 transition-colors hover:bg-gray-50"
            >
              <Share2 className="h-5 w-5" />
              Share Your Card
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
