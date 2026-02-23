import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LeaderboardClient } from "@/components/leaderboard/leaderboard-client";

const GENERIC_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "me.com",
  "protonmail.com",
];

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Global leaderboard
  const { data: leaders } = await supabase
    .from("profiles")
    .select(
      "id, display_name, profile_tag, profile_tag_emoji, total_xp, current_level, current_streak, bank_balance, email"
    )
    .eq("onboarding_completed", true)
    .order("total_xp", { ascending: false })
    .limit(50);

  // Determine school domain
  const currentUser = leaders?.find((l) => l.id === user.id);
  const userEmail = currentUser?.email || user.email;
  const domain = userEmail?.split("@")[1]?.toLowerCase() || null;
  const isSchoolDomain = domain && !GENERIC_DOMAINS.includes(domain);

  type LeaderEntry = {
    id: string;
    display_name: string;
    profile_tag: string;
    profile_tag_emoji: string;
    total_xp: number;
    current_level: number;
    current_streak: number;
    bank_balance: number;
  };

  // Strip email before sending to client
  const globalLeaders: LeaderEntry[] = (leaders || []).map(
    ({ email: _e, ...rest }) => rest
  );

  // School leaderboard (only if school domain)
  let schoolLeaders: LeaderEntry[] = [];
  if (isSchoolDomain && domain) {
    const { data } = await supabase
      .from("profiles")
      .select(
        "id, display_name, profile_tag, profile_tag_emoji, total_xp, current_level, current_streak, bank_balance"
      )
      .eq("onboarding_completed", true)
      .ilike("email", `%@${domain}`)
      .order("total_xp", { ascending: false })
      .limit(50);
    schoolLeaders = (data || []) as LeaderEntry[];
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          Leaderboard
        </h1>
        <p className="mt-1 text-gray-500">
          See how you stack up against other learners
        </p>
      </div>

      <LeaderboardClient
        leaders={globalLeaders}
        schoolLeaders={schoolLeaders}
        currentUserId={user.id}
        schoolDomain={isSchoolDomain ? domain : null}
      />
    </div>
  );
}
