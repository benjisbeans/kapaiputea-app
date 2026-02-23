import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InvestClient } from "@/components/invest/invest-client";
import { LessonGate } from "@/components/games/lesson-gate";

export default async function InvestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, last_activity_date, lessons_completed")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/quiz");

  const today = new Date().toISOString().split("T")[0];
  if (profile.last_activity_date !== today) {
    return <LessonGate lessonsCompleted={profile.lessons_completed} />;
  }

  return <InvestClient />;
}
