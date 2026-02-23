"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export function LessonGate({ lessonsCompleted }: { lessonsCompleted: number }) {
  return (
    <motion.div
      className="flex min-h-[60vh] items-center justify-center px-4"
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      <div className="mx-auto max-w-sm text-center">
        <motion.div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-kpp-yellow via-kpp-orange to-kpp-pink shadow-lg"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="h-10 w-10 text-white" />
        </motion.div>

        <h2 className="mt-6 text-2xl font-black tracking-tight text-gray-900">
          Learn to Earn
        </h2>
        <p className="mt-2 text-gray-500">
          Complete a lesson today to unlock the games. Knowledge is your best
          investment!
        </p>

        {lessonsCompleted > 0 && (
          <p className="mt-3 text-sm text-gray-400">
            You&apos;ve completed {lessonsCompleted} lesson
            {lessonsCompleted !== 1 && "s"} so far — keep it up!
          </p>
        )}

        <Link
          href="/modules"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-kpp-dark px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
        >
          Go to Modules
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
