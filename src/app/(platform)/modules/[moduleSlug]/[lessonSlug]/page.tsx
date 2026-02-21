import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lessons/lesson-player";

interface Props {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { moduleSlug, lessonSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get module
  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("slug", moduleSlug)
    .single();

  if (!module) notFound();

  // Get lesson
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", module.id)
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) notFound();

  // Get existing progress
  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .single();

  // Get next lesson in this module
  const { data: nextLesson } = await supabase
    .from("lessons")
    .select("slug, title")
    .eq("module_id", module.id)
    .gt("lesson_order", lesson.lesson_order)
    .order("lesson_order", { ascending: true })
    .limit(1)
    .single();

  return (
    <LessonPlayer
      lesson={lesson}
      moduleSlug={moduleSlug}
      isCompleted={progress?.status === "completed"}
      nextLesson={nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null}
    />
  );
}
