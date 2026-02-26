"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { STREAM_LABELS, STREAM_EMOJIS } from "@/lib/constants";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ka Pai Pūtea",
  alternateName: "Ka Pai Putea",
  url: "https://kapaiputea.com",
  description:
    "Free gamified financial literacy platform for New Zealand secondary school students. Learn budgeting, KiwiSaver, tax, credit scores and more through interactive lessons.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "NZD", availability: "https://schema.org/InStock" },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
    audienceType: "Secondary school students",
  },
  about: {
    "@type": "Thing",
    name: "Financial literacy education",
  },
  areaServed: {
    "@type": "Country",
    name: "New Zealand",
  },
  availableLanguage: "en-NZ",
  inLanguage: "en-NZ",
  keywords: "financial literacy, NZ students, KiwiSaver, budgeting, money skills, gamified learning",
};

/* ------------------------------------------------------------------ */
/*  useCounter                                                         */
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
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const HOW_IT_WORKS = [
  {
    emoji: "🎯",
    title: "Take the Quiz",
    desc: "Answer a few quick questions about your goals and money habits. We\u2019ll create your unique financial profile.",
    color: "bg-blue-400",
    iconBg: "bg-blue-600/30",
    step: "01",
  },
  {
    emoji: "📚",
    title: "Learn Your Way",
    desc: "Get personalised modules based on whether you\u2019re headed to uni, trades, the workforce, or still figuring it out.",
    color: "bg-purple-400",
    iconBg: "bg-purple-600/30",
    step: "02",
  },
  {
    emoji: "🏆",
    title: "Level Up",
    desc: "Earn XP, unlock badges, climb the leaderboard, and compete with your mates. Financial literacy has never been this fun.",
    color: "bg-green-400",
    iconBg: "bg-green-600/30",
    step: "03",
  },
];

const STREAM_DESCRIPTIONS: Record<string, string> = {
  trade: "Apprentices & trades - tool costs, ute finance, managing irregular pay",
  uni: "Uni-bound students - StudyLink, student loans, flat budgets",
  "early-leaver": "Heading straight to work - payslips, tax, building savings fast",
  military: "Military & services - NZDF pay, allowances, deployment savings",
  unsure: "Still deciding - core money skills for any path you choose",
};

const STREAM_CARD_COLORS: Record<string, string> = {
  trade: "bg-orange-400",
  uni: "bg-blue-400",
  "early-leaver": "bg-green-400",
  military: "bg-purple-400",
  unsure: "bg-yellow-300",
};

const MODULES = [
  { emoji: "💰", title: "Money Basics", desc: "Budgeting, saving, wants vs needs", color: "bg-yellow-300" },
  { emoji: "🏦", title: "Banking & Credit", desc: "Accounts, cards, overdrafts", color: "bg-blue-400" },
  { emoji: "💼", title: "Pay & Work", desc: "Payslips, tax, KiwiSaver, rights", color: "bg-green-400" },
  { emoji: "📊", title: "Credit Scores", desc: "Build your credit history early", color: "bg-purple-400" },
  { emoji: "🥝", title: "KiwiSaver", desc: "Grow your retirement fund from day one", color: "bg-orange-400" },
  { emoji: "🏢", title: "Hustle Empire", desc: "Start a virtual business & learn enterprise", color: "bg-pink-300" },
];

const TESTIMONIALS = [
  {
    quote: "Ka Pai P\u016btea actually made me understand KiwiSaver. Now I know I\u2019m not just throwing money away!",
    name: "Aroha",
    detail: "Year 12, Auckland",
    bg: "bg-yellow-300",
  },
  {
    quote: "I had no idea how credit scores worked until I did this. Way more fun than a textbook.",
    name: "Jayden",
    detail: "Year 13, Wellington",
    bg: "bg-purple-400",
  },
  {
    quote: "The business sim was sick. Made me want to start a side hustle for real.",
    name: "Maia",
    detail: "Year 11, Christchurch",
    bg: "bg-pink-300",
  },
];

/* ------------------------------------------------------------------ */
/*  StatCard                                                           */
/* ------------------------------------------------------------------ */
function StatCard({
  end,
  suffix,
  label,
  isNZ,
  color,
}: {
  end: number;
  suffix: string;
  label: string;
  isNZ?: boolean;
  color: string;
}) {
  const { count, ref, setStarted } = useCounter(end);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView, setStarted]);

  return (
    <div ref={ref} className={`${color} rounded-2xl p-6 text-black`}>
      <p className="text-4xl font-black">
        {isNZ ? "NZ" : `${count.toLocaleString()}${suffix}`}
      </p>
      <p className="text-sm font-bold mt-1">{label}</p>
    </div>
  );
}

/* ================================================================== */
/*  LANDING PAGE                                                       */
/* ================================================================== */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* -------- Header / Nav -------- */}
      <header className="absolute top-0 left-0 right-0 z-10 px-8 py-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-2 text-black">
            <span className="text-2xl" aria-hidden="true">💰</span>
            <span className="text-lg font-black">Ka Pai Pūtea</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/for-teachers" className="hidden sm:inline-block text-sm font-medium text-black/60 hover:text-black transition-colors">
              For Teachers
            </Link>
            <Link href="/login" className="text-sm font-medium text-black/60 hover:text-black transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800 transition-colors">
              Sign Up Free
            </Link>
          </div>
        </nav>
      </header>

      <main>
      {/* -------- Hero -------- */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-yellow-300 text-black py-32 px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex gap-3 mb-8 flex-wrap"
          >
            <span className="bg-purple-300 px-6 py-2 rounded-full text-sm font-bold">FREE FOR NZ SCHOOLS</span>
            <span className="bg-purple-300 px-6 py-2 rounded-full text-sm font-bold">GAMIFIED LEARNING</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-8xl md:text-9xl font-black mb-6 leading-none">Ka Pai Pūtea</h1>
              <p className="text-lg mb-2 text-black/60">(kah-pie poo-teh-ah) - &ldquo;Good Money&rdquo; in te reo Māori</p>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Learn money skills that actually matter.
              </h2>
              <p className="text-xl mb-8 leading-relaxed max-w-lg text-black/70">
                A gamified financial literacy platform built for young New Zealanders. Learn about budgeting, KiwiSaver, tax, credit, and more - all tailored to your goals.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/signup"
                  className="bg-black text-white px-10 py-4 rounded-full text-lg font-black hover:scale-105 transition-transform inline-block"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="bg-white/80 text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-white transition-colors inline-block"
                >
                  Log In
                </Link>
              </div>
              <p className="text-sm text-black/50 mt-4">Takes 2 minutes. No credit card needed.</p>
            </motion.div>

            {/* Dashboard preview — floating card cluster */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative hidden lg:block h-[520px]"
            >
              {/* Main XP card — tilted */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-8 w-64 bg-gray-900 rounded-[2rem] p-5 shadow-2xl border border-gray-700 rotate-[-3deg]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center text-xl">🔥</div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Welcome back</p>
                    <p className="text-white font-black">Hey Benji!</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <div className="bg-yellow-300/20 rounded-full px-3 py-1.5">
                    <p className="text-yellow-300 text-sm font-black">1,250 XP</p>
                  </div>
                  <div className="bg-orange-400/20 rounded-full px-3 py-1.5">
                    <p className="text-orange-400 text-sm font-black">7 days</p>
                  </div>
                </div>
                <div className="mb-1 flex justify-between">
                  <p className="text-white text-[10px] font-bold">Money Maker</p>
                  <p className="text-gray-500 text-[10px]">62%</p>
                </div>
                <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" style={{ width: "62%" }} />
                </div>
              </motion.div>

              {/* Continue learning — pill card */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-44 right-0 w-56 bg-green-400 rounded-[1.5rem] p-4 shadow-xl rotate-[2deg]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center text-xl">💰</div>
                  <div className="flex-1">
                    <p className="font-black text-sm">Money Basics</p>
                    <p className="text-[10px] text-black/50">3 / 5 lessons</p>
                  </div>
                </div>
                <div className="h-1.5 bg-black/15 rounded-full mt-2.5 overflow-hidden">
                  <div className="h-full bg-black/40 rounded-full" style={{ width: "60%" }} />
                </div>
              </motion.div>

              {/* Badges — circular cluster */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[300px] left-28 flex items-center"
              >
                <div className="w-16 h-16 bg-yellow-300 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white z-30">
                  <span className="text-xl">⭐</span>
                  <p className="text-[7px] font-black">First Steps</p>
                </div>
                <div className="w-16 h-16 bg-purple-400 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white -ml-3 z-20">
                  <span className="text-xl">📚</span>
                  <p className="text-[7px] font-black">Bookworm</p>
                </div>
                <div className="w-16 h-16 bg-orange-400 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white -ml-3 z-10">
                  <span className="text-xl">🔥</span>
                  <p className="text-[7px] font-black">On Fire</p>
                </div>
              </motion.div>

              {/* Stats — floating card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute top-[270px] right-6 bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-700 rotate-[3deg]"
              >
                <p className="text-white text-[10px] font-bold mb-2">Your Stats</p>
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center mb-1">
                      <p className="text-purple-400 text-sm font-black">Lv.3</p>
                    </div>
                    <p className="text-gray-400 text-[8px]">Level</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mb-1">
                      <p className="text-green-400 text-sm font-black">#42</p>
                    </div>
                    <p className="text-gray-400 text-[8px]">Rank</p>
                  </div>
                </div>
              </motion.div>

              {/* Streak flame — floating accent */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute top-[420px] right-20 w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center text-2xl shadow-lg"
              >
                🔥
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* -------- How It Works -------- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerStagger}
        className="bg-gray-900 py-20 px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-black text-white mb-16">
            How It Works ✨
          </motion.h2>
          <motion.div variants={containerStagger} className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`${item.color} rounded-3xl p-8 text-black relative overflow-hidden`}
              >
                {/* Step number watermark */}
                <span className="absolute top-4 right-6 text-8xl font-black opacity-10 leading-none">{item.step}</span>
                {/* Icon container */}
                <div className={`${item.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6`}>
                  {item.emoji}
                </div>
                <h3 className="text-3xl font-black mb-4">{item.title}</h3>
                <p className="text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* -------- Built For YOUR Path -------- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerStagger}
        className="bg-black py-20 px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-black text-white mb-4">
            Built for YOUR Path
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-16">
            No matter where life takes you after school, we&apos;ve got you covered.
          </motion.p>

          <motion.div variants={containerStagger} className="grid grid-cols-5 gap-6">
            {Object.keys(STREAM_LABELS).map((key) => (
              <motion.div
                key={key}
                variants={fadeUp}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`${STREAM_CARD_COLORS[key]} w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-lg`}>
                  {STREAM_EMOJIS[key]}
                </div>
                <h3 className="mt-4 text-xl font-black text-white leading-tight">{STREAM_LABELS[key]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{STREAM_DESCRIPTIONS[key]}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* -------- What You'll Learn -------- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerStagger}
        className="bg-white py-20 px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-black mb-16 text-black">
            What You&apos;ll Learn 📚
          </motion.h2>

          <motion.div variants={containerStagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MODULES.map((mod) => (
              <motion.div
                key={mod.title}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-5"
              >
                <span className="text-5xl flex-shrink-0">{mod.emoji}</span>
                <div>
                  <h3 className="text-xl font-black">{mod.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{mod.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* -------- Stats -------- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerStagger}
        className="bg-gray-900 py-20 px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-black text-white mb-16">
            By the Numbers 📊
          </motion.h2>
          <motion.div variants={containerStagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard end={50} suffix="+" label="Lessons" color="bg-yellow-300" />
            <StatCard end={5000} suffix="+" label="XP to earn" color="bg-purple-400" />
            <StatCard end={20} suffix="+" label="Badges" color="bg-green-400" />
            <StatCard end={0} suffix="" label="Made for Kiwis" isNZ color="bg-orange-400" />
          </motion.div>
        </div>
      </motion.section>

      {/* -------- Social Proof -------- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerStagger}
        className="bg-black py-20 px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-black text-white mb-16">
            What Students Say 💬
          </motion.h2>

          <motion.div variants={containerStagger} className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-gray-800 rounded-3xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${t.bg} text-lg font-black text-black`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.detail}</p>
                  </div>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* -------- CTA -------- */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-yellow-300 py-20 px-8 text-center"
      >
        <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">
          Ready to level up your money game?
        </h2>
        <p className="text-xl mb-8 text-black/70 max-w-2xl mx-auto">
          Join Ka Pai Pūtea and start learning financial skills that&apos;ll set you up for life. It&apos;s completely free.
        </p>
        <Link
          href="/signup"
          className="bg-black text-white px-16 py-6 rounded-full text-2xl font-black hover:scale-105 transition-transform inline-block"
        >
          Start Now - It&apos;s Free
        </Link>
      </motion.section>

      </main>

      {/* -------- Footer -------- */}
      <footer className="bg-black text-white py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">💰</span>
              <span className="text-lg font-bold">Ka Pai Pūtea</span>
            </div>
            <p className="text-sm text-gray-400">Financial literacy for young New Zealanders</p>
          </div>
          <nav className="flex items-center gap-4" aria-label="Footer navigation">
            <Link href="/for-teachers" className="text-gray-400 hover:text-white transition-colors font-medium">
              For Teachers
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors font-medium">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors font-medium">
              Terms
            </Link>
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors font-medium">
              Log in
            </Link>
            <Link href="/signup" className="text-gray-400 hover:text-white transition-colors font-medium">
              Sign up
            </Link>
          </nav>
        </div>
        <div className="max-w-7xl mx-auto mt-8 border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400">Made with aroha in Aotearoa 🇳🇿</p>
          <p className="text-gray-500 text-sm mt-1">&copy; {new Date().getFullYear()} Ka Pai Pūtea</p>
        </div>
      </footer>
    </div>
  );
}
