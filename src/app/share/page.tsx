import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Flame, Trophy } from "lucide-react";

interface Props {
  searchParams: Promise<{
    type?: string;
    name?: string;
    xp?: string;
    streak?: string;
    level?: string;
    emoji?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const name = params.name || "Ka Pai Pūtea";
  const imageParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) imageParams.set(key, value);
  });

  const imageUrl = `/api/share/image?${imageParams.toString()}`;

  return {
    title: `${name} — Ka Pai Pūtea`,
    description: "Check out this achievement on Ka Pai Pūtea! Learn money skills that actually matter.",
    openGraph: {
      title: `${name} — Ka Pai Pūtea`,
      description: "Check out this achievement on Ka Pai Pūtea!",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Ka Pai Pūtea`,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const type = params.type || "achievement";
  const name = params.name || "Achievement";
  const xp = params.xp || "0";
  const streak = params.streak || "0";
  const level = params.level || "1";
  const emoji = params.emoji || "💰";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      {/* Achievement card */}
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-gray-200">
        <div className="text-6xl">{emoji}</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {type === "module" ? `Completed ${name}!` : name}
        </h1>

        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <Zap className="h-5 w-5 text-kpp-yellow-dark" />
            <span className="mt-1 text-xl font-bold text-gray-900">{xp}</span>
            <span className="text-xs text-gray-500">XP</span>
          </div>
          <div className="flex flex-col items-center">
            <Flame className="h-5 w-5 text-kpp-orange" />
            <span className="mt-1 text-xl font-bold text-gray-900">{streak}</span>
            <span className="text-xs text-gray-500">Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <Trophy className="h-5 w-5 text-kpp-purple" />
            <span className="mt-1 text-xl font-bold text-gray-900">Lvl {level}</span>
            <span className="text-xs text-gray-500">Level</span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-kpp-yellow/10 p-4">
          <p className="text-sm font-medium text-gray-900">
            Ka Pai Putea
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Learn money skills that actually matter. Free for NZ students.
          </p>
        </div>

        <Link
          href="/signup"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-kpp-dark px-8 py-3 font-bold text-white transition-transform hover:scale-105"
        >
          Join Ka Pai Putea
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
