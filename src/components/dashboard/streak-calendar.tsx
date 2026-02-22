"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { StreakDay } from "@/lib/streaks/get-streak-data";

interface StreakCalendarProps {
  streakDays: StreakDay[];
  currentStreak: number;
  hasActivityToday: boolean;
}

export function StreakCalendar({
  streakDays,
  currentStreak,
  hasActivityToday,
}: StreakCalendarProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Flame className="h-4 w-4 text-kpp-orange" />
          Streak Calendar
        </h3>
        <span className="text-xs text-gray-500">Last 14 days</span>
      </div>

      {/* Day circles */}
      <div className="flex items-center justify-between gap-1">
        {streakDays.map((day, i) => (
          <div key={day.date} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-gray-400">{day.dayLabel}</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 300 }}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                day.active
                  ? "bg-kpp-orange text-white"
                  : day.isToday
                  ? "border-2 border-dashed border-kpp-orange/50 text-kpp-orange"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {day.active ? (
                <Flame className="h-3.5 w-3.5" />
              ) : day.isToday ? (
                <span className="text-[10px]">today</span>
              ) : null}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Streak message */}
      <div className="mt-4 text-center">
        {currentStreak > 0 && hasActivityToday ? (
          <p className="text-sm font-medium text-kpp-orange">
            {currentStreak} day{currentStreak !== 1 ? "s" : ""} and counting!
          </p>
        ) : currentStreak > 0 && !hasActivityToday ? (
          <p className="text-sm font-medium text-kpp-orange">
            Don&apos;t break your {currentStreak}-day streak! Complete a lesson today.
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Complete a lesson to start your streak!
          </p>
        )}
      </div>
    </div>
  );
}
