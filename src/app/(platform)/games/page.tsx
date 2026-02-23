import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GamesClient } from "@/components/games/games-client";

export default async function GamesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <GamesClient />;
}
