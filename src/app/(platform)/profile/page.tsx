import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfilePageClient } from "@/components/profile/profile-page-client";
import { getLevelProgress, getXpForNextLevel } from "@/lib/constants";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: badges }, { data: allBadges }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single(),
      supabase
        .from("user_badges")
        .select("*, badge:badges(*)")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false }),
      supabase
        .from("badges")
        .select("*")
        .eq("is_secret", false)
        .order("rarity"),
    ]);

  if (!profile) redirect("/quiz");

  const levelProgress = getLevelProgress(profile.total_xp);
  const nextLevelXp = getXpForNextLevel(profile.current_level);

  return (
    <ProfilePageClient
      profile={profile}
      earnedBadges={badges || []}
      allBadges={allBadges || []}
      levelProgress={levelProgress}
      nextLevelXp={nextLevelXp}
    />
  );
}
