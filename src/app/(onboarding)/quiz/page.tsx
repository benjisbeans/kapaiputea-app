import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QuizShell } from "@/components/quiz/quiz-shell";
import type { QuizQuestion } from "@/types/database";

export default async function QuizPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if quiz already completed
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  // Fetch quiz questions
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .order("question_order", { ascending: true });

  return (
    <QuizShell questions={(questions as QuizQuestion[]) || []} />
  );
}
