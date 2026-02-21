import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Medal } from "lucide-react";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: allBadges } = await supabase
    .from("badges")
    .select("*")
    .order("rarity");

  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("badge_id, earned_at")
    .eq("user_id", user.id);

  const earnedMap = new Map(
    (userBadges || []).map((b) => [b.badge_id, b.earned_at])
  );

  const rarityAccents: Record<string, string> = {
    common: "text-gray-500",
    uncommon: "text-kpp-green",
    rare: "text-kpp-blue",
    epic: "text-kpp-purple",
    legendary: "text-kpp-yellow-dark",
  };

  const rarityBgs: Record<string, string> = {
    common: "bg-gray-100",
    uncommon: "bg-green-50",
    rare: "bg-blue-50",
    epic: "bg-purple-50",
    legendary: "bg-yellow-50",
  };

  const rarityLabels: Record<string, string> = {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };

  const categories = ["milestone", "streak", "module", "special"];
  const categoryLabels: Record<string, string> = {
    milestone: "Milestones",
    streak: "Streaks",
    module: "Module Completion",
    special: "Special",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Achievements
        </h1>
        <p className="mt-1 text-gray-500">
          {userBadges?.length || 0} of {allBadges?.length || 0} badges earned
        </p>
      </div>

      {categories.map((cat) => {
        const catBadges = allBadges?.filter(
          (b) => b.category === cat && !b.is_secret
        );
        if (!catBadges || catBadges.length === 0) return null;

        return (
          <div key={cat}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {categoryLabels[cat]}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {catBadges.map((badge) => {
                const earned = earnedMap.has(badge.id);
                const earnedAt = earnedMap.get(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 ${
                      earned ? "" : "opacity-35 grayscale"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                        earned ? rarityBgs[badge.rarity] : "bg-gray-100"
                      }`}
                    >
                      {badge.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {badge.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`text-[10px] font-medium ${rarityAccents[badge.rarity]}`}
                        >
                          {rarityLabels[badge.rarity]}
                        </span>
                        {badge.xp_bonus > 0 && (
                          <span className="text-[10px] text-kpp-yellow-dark font-medium">
                            +{badge.xp_bonus} XP
                          </span>
                        )}
                        {earned && earnedAt && (
                          <span className="text-[10px] text-kpp-green">
                            {new Date(earnedAt).toLocaleDateString("en-NZ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
