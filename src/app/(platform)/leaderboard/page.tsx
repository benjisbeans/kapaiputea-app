import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Zap, Flame, Trophy } from "lucide-react";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: leaders } = await supabase
    .from("profiles")
    .select(
      "id, display_name, profile_tag, profile_tag_emoji, total_xp, current_level, current_streak"
    )
    .eq("onboarding_completed", true)
    .order("total_xp", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Leaderboard
        </h1>
        <p className="mt-1 text-gray-500">
          See how you stack up against other learners
        </p>
      </div>

      {/* Top 3 podium */}
      {leaders && leaders.length >= 3 && (
        <div className="flex items-end justify-center gap-3 pb-4">
          {/* 2nd */}
          <div className="flex flex-col items-center">
            <span className="text-3xl">{leaders[1].profile_tag_emoji}</span>
            <div className="mt-2 flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
              <span className="text-lg font-bold text-gray-400">2</span>
              <span className="text-xs text-gray-500">
                {leaders[1].total_xp} XP
              </span>
            </div>
            <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-gray-900">
              {leaders[1].display_name}
            </p>
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center">
            <span className="text-4xl">{leaders[0].profile_tag_emoji}</span>
            <div className="mt-2 flex h-28 w-24 flex-col items-center justify-center rounded-2xl border border-kpp-yellow-dark/20 bg-kpp-yellow/10">
              <span className="text-2xl font-bold text-kpp-yellow-dark">1</span>
              <span className="text-xs text-kpp-yellow-dark">
                {leaders[0].total_xp} XP
              </span>
            </div>
            <p className="mt-1 max-w-[96px] truncate text-xs font-bold text-gray-900">
              {leaders[0].display_name}
            </p>
          </div>
          {/* 3rd */}
          <div className="flex flex-col items-center">
            <span className="text-3xl">{leaders[2].profile_tag_emoji}</span>
            <div className="mt-2 flex h-16 w-20 flex-col items-center justify-center rounded-2xl border border-kpp-orange/20 bg-kpp-orange/5">
              <span className="text-lg font-bold text-kpp-orange">3</span>
              <span className="text-xs text-kpp-orange">
                {leaders[2].total_xp} XP
              </span>
            </div>
            <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-gray-900">
              {leaders[2].display_name}
            </p>
          </div>
        </div>
      )}

      {/* Full list */}
      <div className="space-y-1.5">
        {leaders?.map((entry, index) => {
          const isCurrentUser = entry.id === user.id;
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 rounded-xl border p-3.5 ${
                isCurrentUser
                  ? "border-kpp-yellow-dark/20 bg-kpp-yellow/5"
                  : "border-gray-200 bg-white"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0
                    ? "bg-kpp-yellow/20 text-kpp-yellow-dark"
                    : index === 2
                    ? "bg-kpp-orange/15 text-kpp-orange"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-xl">{entry.profile_tag_emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {entry.display_name}
                  {isCurrentUser && (
                    <span className="ml-1.5 text-xs text-kpp-yellow-dark">
                      (You)
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {entry.profile_tag} &middot; Lvl {entry.current_level}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                  <Zap className="h-3.5 w-3.5 text-kpp-yellow-dark" />
                  {entry.total_xp.toLocaleString()}
                </div>
                {entry.current_streak > 0 && (
                  <div className="flex items-center gap-1 text-xs text-kpp-orange">
                    <Flame className="h-3 w-3" />
                    {entry.current_streak}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {(!leaders || leaders.length === 0) && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <Trophy className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              No one on the leaderboard yet. Be the first!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
