import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  LEVEL_NAMES,
  STREAM_LABELS,
  STREAM_EMOJIS,
  getLevelProgress,
  getXpForNextLevel,
} from "@/lib/constants";
import { Zap, Flame, BookOpen, Trophy, Medal } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/quiz");

  const { data: badges } = await supabase
    .from("user_badges")
    .select("*, badge:badges(*)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false });

  const { data: allBadges } = await supabase
    .from("badges")
    .select("*")
    .eq("is_secret", false)
    .order("rarity");

  const earnedIds = new Set((badges || []).map((b) => b.badge_id));
  const levelProgress = getLevelProgress(profile.total_xp);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="h-1.5 bg-gradient-to-r from-kpp-yellow via-kpp-orange to-kpp-pink" />
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kpp-yellow text-3xl">
              {profile.profile_tag_emoji}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.display_name}
              </h1>
              <span className="inline-flex items-center rounded-full bg-kpp-yellow/15 px-2.5 py-0.5 text-xs font-semibold text-kpp-yellow-dark">
                {profile.profile_tag}
              </span>
              <p className="mt-1 text-sm text-gray-500">
                Year {profile.year_group} &middot;{" "}
                {STREAM_EMOJIS[profile.stream]}{" "}
                {STREAM_LABELS[profile.stream]}
              </p>
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">
              Level {profile.current_level} &middot;{" "}
              {LEVEL_NAMES[profile.current_level - 1]}
            </span>
            <span className="tabular-nums text-gray-500">
              {profile.total_xp} / {getXpForNextLevel(profile.current_level)} XP
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-kpp-yellow to-kpp-yellow-dark"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-px border-t border-gray-200 bg-gray-200">
          {[
            { icon: Zap, color: "text-kpp-yellow-dark", value: profile.total_xp.toLocaleString(), label: "XP" },
            { icon: Flame, color: "text-kpp-orange", value: String(profile.current_streak), label: "Streak" },
            { icon: BookOpen, color: "text-kpp-blue", value: String(profile.lessons_completed), label: "Lessons" },
            { icon: Trophy, color: "text-kpp-purple", value: String(profile.modules_completed), label: "Modules" },
          ].map((s) => (
            <div key={s.label} className="bg-white p-3 text-center">
              <s.icon className={`mx-auto h-4 w-4 ${s.color}`} />
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-900">
                {s.value}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badge Collection */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Medal className="h-4 w-4 text-kpp-yellow-dark" />
            Badge Collection
          </h3>
          <span className="text-xs text-gray-500">
            {badges?.length || 0}/{allBadges?.length || 0}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {allBadges?.map((badge) => {
            const earned = earnedIds.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 ${
                  earned ? "" : "opacity-25 grayscale"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  {badge.emoji}
                </div>
                <span className="text-center text-[10px] font-medium text-gray-500">
                  {badge.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
