import Link from "next/link";
import { Zap, BookOpen, Trophy, Users, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-bold">Ka Pai Putea</span>
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

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-kpp-yellow/20 px-4 py-2 text-sm font-medium text-kpp-dark">
          <Zap className="h-4 w-4 text-kpp-yellow-dark" />
          Free for NZ schools
        </div>
        <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
          Learn money skills
          <br />
          <span className="text-kpp-yellow-dark">
            that actually matter
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
          Ka Pai Putea is a gamified financial literacy platform built for young
          New Zealanders. Learn about budgeting, KiwiSaver, tax, credit, and
          more — all tailored to your goals.
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
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-blue-50 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kpp-blue/20 text-2xl">
              🎯
            </div>
            <h3 className="mt-4 text-lg font-bold">Take the Quiz</h3>
            <p className="mt-2 text-sm text-gray-500">
              Answer a few quick questions about your goals and money habits.
              We&apos;ll create your unique financial profile.
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-purple-50 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kpp-purple/20 text-2xl">
              📚
            </div>
            <h3 className="mt-4 text-lg font-bold">Learn Your Way</h3>
            <p className="mt-2 text-sm text-gray-500">
              Get personalised modules based on whether you&apos;re headed to
              uni, trades, the workforce, or still figuring it out.
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-green-50 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kpp-green/20 text-2xl">
              🏆
            </div>
            <h3 className="mt-4 text-lg font-bold">Level Up</h3>
            <p className="mt-2 text-sm text-gray-500">
              Earn XP, unlock badges, climb the leaderboard, and compete with
              your mates. Financial literacy has never been this fun.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-gray-200 bg-kpp-yellow/5 p-12">
          <div className="grid gap-8 text-center sm:grid-cols-4">
            <div>
              <BookOpen className="mx-auto h-8 w-8 text-kpp-yellow-dark" />
              <p className="mt-2 text-3xl font-bold text-gray-900">15+</p>
              <p className="text-sm text-gray-500">Lessons</p>
            </div>
            <div>
              <Zap className="mx-auto h-8 w-8 text-kpp-orange" />
              <p className="mt-2 text-3xl font-bold text-gray-900">1,500</p>
              <p className="text-sm text-gray-500">XP to earn</p>
            </div>
            <div>
              <Trophy className="mx-auto h-8 w-8 text-kpp-purple" />
              <p className="mt-2 text-3xl font-bold text-gray-900">14</p>
              <p className="text-sm text-gray-500">Badges</p>
            </div>
            <div>
              <Users className="mx-auto h-8 w-8 text-kpp-green" />
              <p className="mt-2 text-3xl font-bold text-gray-900">NZ</p>
              <p className="text-sm text-gray-500">Made for Kiwis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module previews */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">
          What you&apos;ll learn
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
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
          ].map((mod) => (
            <div
              key={mod.title}
              className={`rounded-2xl border p-6 ${mod.color}`}
            >
              <span className="text-4xl">{mod.emoji}</span>
              <h3 className="mt-3 text-lg font-bold">{mod.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Ready to level up your money game?
        </h2>
        <p className="mt-4 text-gray-500">
          Join Ka Pai Putea and start learning financial skills that&apos;ll set
          you up for life. It&apos;s free.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105"
        >
          Start Now — It&apos;s Free
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400">
        <p>
          Ka Pai Putea &copy; {new Date().getFullYear()}. Built for young New
          Zealanders.
        </p>
        <p className="mt-1">
          &quot;Ka Pai Putea&quot; means &quot;Good Money&quot; in Te Reo Maori.
        </p>
      </footer>
    </div>
  );
}
