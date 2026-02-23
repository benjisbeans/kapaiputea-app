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
