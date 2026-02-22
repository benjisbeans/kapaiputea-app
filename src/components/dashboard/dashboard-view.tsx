"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Flame,
  BookOpen,
  Trophy,
  ChevronRight,
  Medal,
} from "lucide-react";
import { LEVEL_NAMES } from "@/lib/constants";
import { StreakCalendar } from "./streak-calendar";
import { StreakMilestone } from "@/components/gamification/streak-milestone";
import type { StreakDay } from "@/lib/streaks/get-streak-data";

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

/* ── animated counter ── */
function useCounter(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end === 0) return;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * end));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return count;
}

/* ── types ── */
interface ModuleData {
  id: string;
  slug: string;
  title: string;
  icon_emoji: string;
  color: string;
  lesson_count: number;
  total_xp: number;
  completedLessons: number;
  status: string | null;
}
interface BadgeData {
  id: string;
  badge: { emoji: string; name: string } | null;
}
interface Props {
  displayName: string;
  totalXp: number;
  currentStreak: number;
  lessonsCompleted: number;
  currentLevel: number;
  levelProgress: number;
  nextLevelXp: number;
  nextModule: {
    slug: string;
    title: string;
    icon_emoji: string;
    description: string;
    lesson_count: number;
    estimated_minutes: number;
    total_xp: number;
  } | null;
  isResuming: boolean;
  modules: ModuleData[];
  recentBadges: BadgeData[];
  streakDays: StreakDay[];
  hasActivityToday: boolean;
}

const CARD = "rounded-2xl border border-gray-200 bg-white";

export function DashboardView({
  displayName,
  totalXp,
  currentStreak,
  lessonsCompleted,
  currentLevel,
  levelProgress,
  nextLevelXp,
  nextModule,
  isResuming,
  modules,
  recentBadges,
  streakDays,
  hasActivityToday,
}: Props) {
  const xp = useCounter(totalXp);
  const streak = useCounter(currentStreak, 800);
  const lessons = useCounter(lessonsCompleted, 800);

  return (
    <motion.div
      className="mx-auto max-w-4xl space-y-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* greeting */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Kia ora, {displayName}! 👋
        </h1>
        <p className="mt-1 text-gray-500">
          Keep learning, keep earning.
        </p>
      </motion.div>

      {/* stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[
          {
            icon: Zap,
            color: "text-kpp-yellow-dark",
            bg: "bg-kpp-yellow/10",
            value: xp.toLocaleString(),
            label: "Total XP",
          },
          {
            icon: Flame,
            color: "text-kpp-orange",
            bg: "bg-kpp-orange/10",
            value: String(streak),
            label: "Day Streak",
          },
          {
            icon: BookOpen,
            color: "text-kpp-blue",
            bg: "bg-kpp-blue/10",
            value: String(lessons),
            label: "Lessons Done",
          },
          {
            icon: Trophy,
            color: "text-kpp-purple",
            bg: "bg-kpp-purple/10",
            value: `Lvl ${currentLevel}`,
            label: LEVEL_NAMES[currentLevel - 1],
          },
        ].map((s) => (
          <div key={s.label} className={`${CARD} p-4`}>
            <div className={`inline-flex rounded-lg p-2 ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-gray-900">
              {s.value}
            </p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* streak calendar */}
      <motion.div variants={fadeUp}>
        <StreakCalendar
          streakDays={streakDays}
          currentStreak={currentStreak}
          hasActivityToday={hasActivityToday}
        />
      </motion.div>

      {/* level progress */}
      <motion.div variants={fadeUp} className={`${CARD} p-5`}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900">
            Level {currentLevel} &middot; {LEVEL_NAMES[currentLevel - 1]}
          </span>
          <span className="tabular-nums text-gray-500">
            {totalXp} / {nextLevelXp} XP
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-kpp-yellow to-kpp-yellow-dark"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* continue learning */}
      {nextModule && (
        <motion.div variants={fadeUp}>
          <Link
            href={`/modules/${nextModule.slug}`}
            className={`${CARD} group flex items-center justify-between p-5 transition-colors hover:border-kpp-yellow-dark/30 hover:bg-kpp-yellow/5`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-kpp-yellow-dark">
                {isResuming ? "Continue Learning" : "Up Next"}
              </p>
              <h3 className="mt-1.5 text-lg font-bold text-gray-900">
                {nextModule.icon_emoji} {nextModule.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                {nextModule.description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <span>{nextModule.lesson_count} lessons</span>
                <span>&middot;</span>
                <span>{nextModule.estimated_minutes} min</span>
                <span>&middot;</span>
                <span className="text-kpp-yellow-dark font-medium">
                  {nextModule.total_xp} XP
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-kpp-yellow-dark" />
          </Link>
        </motion.div>
      )}

      {/* recent badges */}
      {recentBadges.length > 0 && (
        <motion.div variants={fadeUp} className={`${CARD} p-5`}>
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Medal className="h-4 w-4 text-kpp-yellow-dark" />
              Recent Badges
            </h3>
            <Link
              href="/achievements"
              className="text-xs text-gray-500 transition-colors hover:text-kpp-yellow-dark"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="mt-4 flex gap-4">
            {recentBadges.map((ub) => (
              <div key={ub.id} className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                  {ub.badge?.emoji || "🏆"}
                </div>
                <span className="text-xs text-gray-500">
                  {ub.badge?.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* modules */}
      <motion.div variants={fadeUp}>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Your Modules
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const pct =
              mod.lesson_count > 0
                ? Math.round(
                    (mod.completedLessons / mod.lesson_count) * 100
                  )
                : 0;
            return (
              <Link
                key={mod.id}
                href={`/modules/${mod.slug}`}
                className={`${CARD} group p-5 transition-colors hover:border-gray-300 hover:shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{mod.icon_emoji}</span>
                  {mod.status === "completed" && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Done
                    </span>
                  )}
                </div>
                <h4 className="mt-2 font-semibold text-gray-900">
                  {mod.title}
                </h4>
                <p className="mt-0.5 text-xs text-gray-500">
                  {mod.lesson_count} lessons &middot; {mod.total_xp} XP
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-kpp-yellow to-kpp-yellow-dark transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      <StreakMilestone currentStreak={currentStreak} />
    </motion.div>
  );
}
