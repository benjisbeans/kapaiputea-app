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

const LEADER_FIELDS =
  "id, display_name, profile_tag, profile_tag_emoji, total_xp, current_level, current_streak, bank_balance";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Determine school domain from auth email (no extra query needed)
  const domain = user.email?.split("@")[1]?.toLowerCase() || null;
  const isSchoolDomain = domain && !GENERIC_DOMAINS.includes(domain);

  // Run global + school queries in parallel
  const [{ data: leaders }, schoolResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(LEADER_FIELDS)
      .eq("onboarding_completed", true)
      .order("total_xp", { ascending: false })
      .limit(50),
    isSchoolDomain && domain
      ? supabase
          .from("profiles")
          .select(LEADER_FIELDS)
          .eq("onboarding_completed", true)
          .ilike("email", `%@${domain}`)
          .order("total_xp", { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] as never[] }),
  ]);

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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          Leaderboard
        </h1>
        <p className="mt-1 text-gray-500">
          See how you stack up against other learners
        </p>
      </div>

      <LeaderboardClient
        leaders={(leaders || []) as LeaderEntry[]}
        schoolLeaders={(schoolResult.data || []) as LeaderEntry[]}
        currentUserId={user.id}
        schoolDomain={isSchoolDomain ? domain : null}
      />
    </div>
  );
}
