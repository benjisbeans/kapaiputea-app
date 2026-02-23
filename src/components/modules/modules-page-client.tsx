"use client";

import Link from "next/link";
import { Lock, Sparkles, TrendingUp, Compass } from "lucide-react";
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import type { Module, UserModuleProgress } from "@/types/database";

interface ModulesPageClientProps {
  modules: Module[];
  progressMap: Record<string, UserModuleProgress>;
  userStream: string;
}

function ModuleCard({
  mod,
  progressMap,
}: {
  mod: Module;
  progressMap: Record<string, UserModuleProgress>;
}) {
  const progress = progressMap[mod.id];
  const pct = progress
    ? Math.round((progress.lessons_completed / mod.lesson_count) * 100)
    : 0;
  const isLocked =
    mod.prerequisite_module_id &&
    progressMap[mod.prerequisite_module_id]?.status !== "completed";

  return (
    <Link
      href={isLocked ? "#" : `/modules/${mod.slug}`}
      className={`group relative block rounded-3xl border border-gray-200 bg-white p-5 transition-all ${
        isLocked
          ? "cursor-not-allowed opacity-40"
          : "hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {isLocked && (
        <div className="absolute right-4 top-4">
          <Lock className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-3xl">{mod.icon_emoji}</span>
        {mod.category !== "core" && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
              mod.category === "advanced"
                ? "bg-purple-100 text-purple-600"
                : mod.category === "stream"
                ? "bg-kpp-blue/10 text-kpp-blue"
                : "bg-pink-100 text-pink-600"
            }`}
          >
            {mod.category === "advanced"
              ? "Advanced"
              : mod.category === "stream"
              ? "Your Path"
              : "Explore"}
          </span>
        )}
        {progress?.status === "completed" && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Done
          </span>
        )}
      </div>
      <h3 className="mt-2 font-bold text-gray-900">{mod.title}</h3>
      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
        {mod.description}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span>{mod.lesson_count} lessons</span>
        <span>&middot;</span>
        <span>{mod.estimated_minutes} min</span>
        <span>&middot;</span>
        <span className="font-medium text-kpp-yellow-dark">
          {mod.total_xp} XP
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-kpp-yellow to-kpp-yellow-dark transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}

function ModuleGrid({
  modules,
  progressMap,
  emptyMessage,
}: {
  modules: Module[];
  progressMap: Record<string, UserModuleProgress>;
  emptyMessage: string;
}) {
  if (modules.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">{emptyMessage}</p>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((mod) => (
        <ModuleCard key={mod.id} mod={mod} progressMap={progressMap} />
      ))}
    </div>
  );
}

export function ModulesPageClient({
  modules,
  progressMap,
  userStream,
}: ModulesPageClientProps) {
  const forYou = modules.filter(
    (m) =>
      (m.category === "core" && m.streams.includes(userStream)) ||
      (m.category === "stream" && m.streams.includes(userStream))
  );

  const advanced = modules.filter((m) => m.category === "advanced");
  const explore = modules.filter((m) => m.category === "explore");

  return (
    <TabsRoot defaultValue="for-you">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="for-you" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          For You
          <span className="ml-1 rounded-full bg-kpp-yellow/20 px-1.5 py-0.5 text-[10px] font-bold text-kpp-yellow-dark">
            {forYou.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="level-up" className="gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" />
          Level Up
          <span className="ml-1 rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-600">
            {advanced.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="explore" className="gap-1.5">
          <Compass className="h-3.5 w-3.5" />
          Explore
          <span className="ml-1 rounded-full bg-pink-100 px-1.5 py-0.5 text-[10px] font-bold text-pink-600">
            {explore.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="for-you" className="mt-6">
        <ModuleGrid
          modules={forYou}
          progressMap={progressMap}
          emptyMessage="No modules yet — check back soon!"
        />
      </TabsContent>

      <TabsContent value="level-up" className="mt-6">
        <p className="mb-4 text-sm text-gray-500">
          Advanced topics to deepen your financial knowledge. Complete the basics
          first to unlock these.
        </p>
        <ModuleGrid
          modules={advanced}
          progressMap={progressMap}
          emptyMessage="Advanced modules coming soon!"
        />
      </TabsContent>

      <TabsContent value="explore" className="mt-6">
        <p className="mb-4 text-sm text-gray-500">
          Fun extras and games to level up your money skills.
        </p>
        <ModuleGrid
          modules={explore}
          progressMap={progressMap}
          emptyMessage="Explore modules coming soon!"
        />
      </TabsContent>
    </TabsRoot>
  );
}
