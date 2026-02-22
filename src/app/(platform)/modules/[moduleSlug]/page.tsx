import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Zap, Check, Lock, Play } from "lucide-react";
import { ShareButton } from "@/components/sharing/share-button";

interface Props {
  params: Promise<{ moduleSlug: string }>;
}

export default async function ModuleDetailPage({ params }: Props) {
  const { moduleSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("slug", moduleSlug)
    .single();

  if (!module) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", module.id)
    .eq("is_published", true)
    .order("lesson_order");

  const { data: lessonProgress } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("module_id", module.id);

  const progressMap = new Map(
    (lessonProgress || []).map((p) => [p.lesson_id, p])
  );

  const completedCount =
    lessonProgress?.filter((p) => p.status === "completed").length || 0;
  const totalLessons = lessons?.length || 0;
  const progressPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const colorMap: Record<string, string> = {
    yellow: "from-kpp-yellow to-kpp-yellow-dark",
    blue: "from-kpp-blue to-kpp-blue-light",
    green: "from-kpp-green to-kpp-green-light",
    purple: "from-kpp-purple to-kpp-purple-light",
    pink: "from-kpp-pink to-kpp-pink-light",
    orange: "from-kpp-orange to-kpp-yellow",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/modules"
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All Modules
      </Link>

      {/* Module header */}
      <div
        className={`rounded-2xl bg-gradient-to-br ${
          colorMap[module.color] || colorMap.yellow
        } p-6 text-white`}
      >
        <div className="flex items-start justify-between">
          <span className="text-4xl">{module.icon_emoji}</span>
          {module.category && module.category !== "core" && (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
              {module.category === "advanced"
                ? "Advanced"
                : module.category === "stream"
                ? "Your Path"
                : "Explore"}
            </span>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-bold">{module.title}</h1>
        <p className="mt-1 text-white/80">{module.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {module.estimated_minutes} min
          </span>
          <span>&middot;</span>
          <span className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            {module.total_xp} XP
          </span>
          <span>&middot;</span>
          <span>{totalLessons} lessons</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Progress</span>
            <span>
              {completedCount}/{totalLessons}
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct === 100 && (
            <div className="mt-3">
              <ShareButton
                shareData={{
                  title: `I completed ${module.title} on Ka Pai Pūtea!`,
                  text: `Just finished the ${module.title} module and earned ${module.total_xp} XP! 💰`,
                  url: `/share?type=module&name=${encodeURIComponent(module.title)}&xp=${module.total_xp}&emoji=${encodeURIComponent(module.icon_emoji)}`,
                }}
                variant="inline"
              />
            </div>
          )}
        </div>
      </div>

      {/* Lesson list */}
      <div className="space-y-2">
        {lessons?.map((lesson, index) => {
          const progress = progressMap.get(lesson.id);
          const isCompleted = progress?.status === "completed";
          const prevLesson = index > 0 ? lessons[index - 1] : null;
          const prevCompleted = prevLesson
            ? progressMap.get(prevLesson.id)?.status === "completed"
            : true;
          const isLocked = index > 0 && !prevCompleted;

          return (
            <Link
              key={lesson.id}
              href={isLocked ? "#" : `/modules/${moduleSlug}/${lesson.slug}`}
              className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all ${
                isCompleted
                  ? "border-green-200"
                  : isLocked
                  ? "cursor-not-allowed opacity-40"
                  : "hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  isCompleted
                    ? "bg-kpp-green text-white"
                    : isLocked
                    ? "bg-gray-100 text-gray-400"
                    : "bg-kpp-yellow/20 text-kpp-yellow-dark"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isLocked ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`text-sm font-semibold ${
                    isLocked ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {lesson.title}
                </h3>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  <span>{lesson.estimated_minutes} min</span>
                  <span>&middot;</span>
                  <span className="text-kpp-yellow-dark font-medium">{lesson.xp_reward} XP</span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-400">
                {index + 1}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
