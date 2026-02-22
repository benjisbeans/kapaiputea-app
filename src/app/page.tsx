"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  BookOpen,
  Trophy,
  Users,
  ArrowRight,
  Star,
  Heart,
} from "lucide-react";
import { STREAM_LABELS, STREAM_EMOJIS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  useCounter — animate a number from 0 to `end` when triggered      */
/* ------------------------------------------------------------------ */
function useCounter(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started || end === 0) return;
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
  }, [end, duration, started]);

  return { count, ref, setStarted };
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const FLOATING_EMOJIS = [
  { emoji: "💰", x: "10%", y: "20%", delay: 0 },
  { emoji: "📊", x: "85%", y: "15%", delay: 0.4 },
  { emoji: "🏦", x: "5%",  y: "65%", delay: 0.8 },
  { emoji: "💳", x: "90%", y: "60%", delay: 1.2 },
  { emoji: "🥝", x: "50%", y: "5%",  delay: 1.6 },
];

const HOW_IT_WORKS = [
  {
    emoji: "🎯",
    title: "Take the Quiz",
    desc: "Answer a few quick questions about your goals and money habits. We\u2019ll create your unique financial profile.",
    bg: "bg-blue-50",
    border: "border-gray-200",
    iconBg: "bg-kpp-blue/20",
  },
  {
    emoji: "📚",
    title: "Learn Your Way",
    desc: "Get personalised modules based on whether you\u2019re headed to uni, trades, the workforce, or still figuring it out.",
    bg: "bg-purple-50",
    border: "border-gray-200",
    iconBg: "bg-kpp-purple/20",
  },
  {
    emoji: "🏆",
    title: "Level Up",
    desc: "Earn XP, unlock badges, climb the leaderboard, and compete with your mates. Financial literacy has never been this fun.",
    bg: "bg-green-50",
    border: "border-gray-200",
    iconBg: "bg-kpp-green/20",
  },
];

const STREAM_DESCRIPTIONS: Record<string, string> = {
  trade: "Apprentices & trades \u2014 tool costs, ute finance, managing irregular pay",
  uni: "Uni-bound students \u2014 StudyLink, student loans, flat budgets",
  "early-leaver":
    "Heading straight to work \u2014 payslips, tax, building savings fast",
  military:
    "Military & services \u2014 NZDF pay, allowances, deployment savings",
  unsure: "Still deciding \u2014 core money skills for any path you choose",
};

const STREAM_COLORS: Record<string, string> = {
  trade: "bg-orange-50 border-orange-200",
  uni: "bg-blue-50 border-blue-200",
  "early-leaver": "bg-green-50 border-green-200",
  military: "bg-purple-50 border-purple-200",
  unsure: "bg-yellow-50 border-yellow-200",
};

const MODULES = [
  {
    emoji: "💰",
    title: "Money Basics",
    desc: "Budgeting, saving, wants vs needs",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    emoji: "🏦",
    title: "Banking & Credit",
    desc: "Accounts, cards, overdrafts",
    color: "bg-blue-50 border-blue-200",
  },
  {
    emoji: "💼",
    title: "Pay & Work",
    desc: "Payslips, tax, KiwiSaver, rights",
    color: "bg-green-50 border-green-200",
  },
  {
    emoji: "📊",
    title: "Credit Scores",
    desc: "Build your credit history early",
    color: "bg-purple-50 border-purple-200",
  },
  {
    emoji: "🥝",
    title: "KiwiSaver",
    desc: "Grow your retirement fund from day one",
    color: "bg-green-50 border-green-200",
  },
  {
    emoji: "🏢",
    title: "Hustle Empire",
    desc: "Start a virtual business & learn enterprise",
    color: "bg-pink-50 border-pink-200",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Ka Pai P\u016btea actually made me understand KiwiSaver. Now I know I\u2019m not just throwing money away!",
    name: "Aroha",
    detail: "Year 12, Auckland",
    accent: "border-l-kpp-yellow",
    bg: "bg-kpp-yellow",
  },
  {
    quote:
      "I had no idea how credit scores worked until I did this. Way more fun than a textbook.",
    name: "Jayden",
    detail: "Year 13, Wellington",
    accent: "border-l-kpp-purple",
    bg: "bg-kpp-purple",
  },
  {
    quote:
      "The business sim was sick. Made me want to start a side hustle for real.",
    name: "Maia",
    detail: "Year 11, Christchurch",
    accent: "border-l-kpp-pink",
    bg: "bg-kpp-pink",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const containerStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  StatCard sub-component                                             */
/* ------------------------------------------------------------------ */
function StatCard({
  icon,
  end,
  suffix,
  label,
  isNZ,
}: {
  icon: React.ReactNode;
  end: number;
  suffix: string;
  label: string;
  isNZ?: boolean;
}) {
  const { count, ref, setStarted } = useCounter(end);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView, setStarted]);

  return (
    <div ref={ref}>
      {icon}
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {isNZ ? "NZ" : `${count.toLocaleString()}${suffix}`}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

/* ================================================================== */
/*  LANDING PAGE                                                       */
/* ================================================================== */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* -------- Sticky Nav -------- */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-bold">Ka Pai P&#363;tea</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-kpp-dark px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Sign up free
          </Link>
        </div>
      </nav>

      {/* -------- Hero -------- */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl overflow-hidden px-6 py-24 text-center sm:py-32"
      >
        {/* Floating emojis */}
        {FLOATING_EMOJIS.map((item) => (
          <motion.div
            key={item.emoji}
            className="pointer-events-none absolute hidden text-3xl opacity-20 select-none sm:block sm:text-4xl"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            {item.emoji}
          </motion.div>
        ))}

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-kpp-yellow/20 px-4 py-2 text-sm font-medium text-kpp-dark">
            <Zap className="h-4 w-4 text-kpp-yellow-dark" />
            Free for NZ schools
          </div>

          <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Learn money skills
            <br />
            <span className="bg-gradient-to-r from-kpp-yellow-dark to-kpp-orange bg-clip-text text-transparent">
              that actually matter
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Ka Pai P&#363;tea is a gamified financial literacy platform built for
            young New Zealanders. Learn about budgeting, KiwiSaver, tax, credit,
            and more &mdash; all tailored to your goals.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-sm text-gray-400">
              Takes 2 minutes. No credit card needed.
            </p>
          </div>
        </div>
      </motion.section>

      {/* -------- Ka Pai Explanation -------- */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl px-6 py-12"
      >
        <div className="rounded-3xl border border-kpp-yellow/20 bg-kpp-yellow/5 p-10 text-center sm:p-14">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ka Pai P&#363;tea
          </h2>
          <p className="mt-2 text-lg font-medium text-gray-500">
            (kah-pie poo-teh-ah)
          </p>
          <p className="mt-4 text-xl font-semibold text-kpp-yellow-dark">
            means &ldquo;Good Money&rdquo; in te reo M&#257;ori
          </p>
          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            We believe every young New Zealander deserves to feel confident about
            money.
          </p>
        </div>
      </motion.section>

      {/* -------- How It Works -------- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-3xl font-bold"
        >
          How it works
        </motion.h2>

        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-3"
        >
          {HOW_IT_WORKS.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className={`rounded-3xl border ${item.border} ${item.bg} p-8`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg} text-2xl`}
              >
                {item.emoji}
              </div>
              <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* -------- Who Is This For? -------- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center text-3xl font-bold"
        >
          Built for{" "}
          <span className="bg-gradient-to-r from-kpp-yellow-dark to-kpp-orange bg-clip-text text-transparent">
            YOUR
          </span>{" "}
          path
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center text-gray-500"
        >
          No matter where life takes you after school, we&apos;ve got you
          covered.
        </motion.p>

        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {Object.keys(STREAM_LABELS).map((key) => (
            <motion.div
              key={key}
              variants={fadeUp}
              className={`w-full rounded-2xl border p-6 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] ${STREAM_COLORS[key]}`}
            >
              <span className="text-4xl">{STREAM_EMOJIS[key]}</span>
              <h3 className="mt-3 text-lg font-bold">{STREAM_LABELS[key]}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {STREAM_DESCRIPTIONS[key]}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* -------- What You'll Learn -------- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-3xl font-bold"
        >
          What you&apos;ll learn
        </motion.h2>

        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MODULES.map((mod) => (
            <motion.div
              key={mod.title}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`cursor-default rounded-2xl border p-6 ${mod.color}`}
            >
              <span className="text-4xl">{mod.emoji}</span>
              <h3 className="mt-3 text-lg font-bold">{mod.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{mod.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* -------- Stats -------- */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl px-6 py-16"
      >
        <div className="rounded-3xl border border-gray-200 bg-kpp-yellow/5 p-12">
          <div className="grid gap-8 text-center sm:grid-cols-4">
            <StatCard
              icon={
                <BookOpen className="mx-auto h-8 w-8 text-kpp-yellow-dark" />
              }
              end={50}
              suffix="+"
              label="Lessons"
            />
            <StatCard
              icon={<Zap className="mx-auto h-8 w-8 text-kpp-orange" />}
              end={5000}
              suffix="+"
              label="XP to earn"
            />
            <StatCard
              icon={<Trophy className="mx-auto h-8 w-8 text-kpp-purple" />}
              end={20}
              suffix="+"
              label="Badges"
            />
            <StatCard
              icon={<Users className="mx-auto h-8 w-8 text-kpp-green" />}
              end={0}
              suffix=""
              label="Made for Kiwis"
              isNZ
            />
          </div>
        </div>
      </motion.section>

      {/* -------- Social Proof -------- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-3xl font-bold"
        >
          What students are saying
        </motion.h2>

        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className={`rounded-2xl border border-gray-200 bg-white p-6 border-l-4 ${t.accent}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${t.bg} text-sm font-bold text-white`}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.detail}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex gap-0.5 text-kpp-yellow-dark">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* -------- CTA -------- */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl px-6 py-20 text-center"
      >
        <Heart className="mx-auto mb-4 h-10 w-10 text-kpp-pink" />
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to level up your money game?
        </h2>
        <p className="mt-4 text-gray-500">
          Join Ka Pai P&#363;tea and start learning financial skills that&apos;ll
          set you up for life. It&apos;s free.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105"
        >
          Start Now &mdash; It&apos;s Free
          <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.section>

      {/* -------- Footer -------- */}
      <footer className="border-t border-gray-200 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="text-lg font-bold">Ka Pai P&#363;tea</span>
            </div>
            <p className="text-sm text-gray-400">
              Financial literacy for young New Zealanders
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Sign up
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-5xl border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
          <p>Made with aroha in Aotearoa 🇳🇿</p>
          <p className="mt-1">
            Ka Pai P&#363;tea &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
