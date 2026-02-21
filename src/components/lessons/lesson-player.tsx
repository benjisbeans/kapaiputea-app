"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLessonStore } from "@/stores/lesson-store";
import { ContentBlock } from "./content-block";
import { XpCelebration } from "@/components/gamification/xp-celebration";
import type { Lesson, ContentBlock as ContentBlockType } from "@/types/database";

interface LessonPlayerProps {
  lesson: Lesson;
  moduleSlug: string;
  isCompleted: boolean;
  nextLesson: { slug: string; title: string } | null;
}

const INTERACTIVE_TYPES = [
  "mini-quiz",
  "drag-drop",
  "slider-input",
  "tap-reveal",
  "sort-order",
  "fill-blanks",
  "business-sim",
];

export function LessonPlayer({
  lesson,
  moduleSlug,
  isCompleted: initialCompleted,
  nextLesson,
}: LessonPlayerProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [xpResult, setXpResult] = useState<{
    total: number;
    breakdown: Record<string, number>;
    leveledUp: boolean;
    newLevel?: number;
    badges: { name: string; emoji: string }[];
  } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const {
    setLesson,
    markInteractionComplete,
    completedInteractions,
    isSubmitting,
    setSubmitting,
    totalInteractions,
  } = useLessonStore();

  const interactiveCount = lesson.content_blocks.filter((b) =>
    INTERACTIVE_TYPES.includes(b.type)
  ).length;

  useEffect(() => {
    setLesson(lesson.id, interactiveCount);
  }, [lesson.id, interactiveCount, setLesson]);

  const allDone = completedInteractions.size >= totalInteractions;

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug }),
      });

      if (!res.ok) throw new Error("Failed to complete lesson");

      const data = await res.json();
      setIsCompleted(true);
      setXpResult(data);
      setShowCelebration(true);
    } catch (error) {
      console.error("Error completing lesson:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {showCelebration && xpResult && (
        <XpCelebration
          xpEarned={xpResult.total}
          breakdown={xpResult.breakdown}
          leveledUp={xpResult.leveledUp}
          newLevel={xpResult.newLevel}
          badges={xpResult.badges}
          onDone={() => {
            setShowCelebration(false);
          }}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/modules/${moduleSlug}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex items-center gap-1.5 text-sm">
          <Zap className="h-4 w-4 text-kpp-yellow-dark" />
          <span className="font-medium text-kpp-yellow-dark">
            {lesson.xp_reward} XP
          </span>
        </div>
      </div>

      {/* Content blocks */}
      <div className="space-y-6">
        {lesson.content_blocks.map((block: ContentBlockType, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ContentBlock
              block={block}
              index={index}
              onInteractionComplete={(blockIndex) =>
                markInteractionComplete(String(blockIndex))
              }
              isLessonCompleted={isCompleted}
            />
          </motion.div>
        ))}
      </div>

      {/* Complete / Navigation */}
      <div className="mt-8 space-y-3 pb-8">
        {isCompleted ? (
          <>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-6 py-4 text-kpp-green">
              <Check className="h-5 w-5" />
              <span className="font-bold">Lesson Complete!</span>
            </div>

            {nextLesson ? (
              <Link
                href={`/modules/${moduleSlug}/${nextLesson.slug}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
              >
                Next: {nextLesson.title}
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href={`/modules/${moduleSlug}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
              >
                Back to Module
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </>
        ) : (
          <button
            onClick={handleComplete}
            disabled={!allDone || isSubmitting}
            className="w-full rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Completing...
              </span>
            ) : !allDone ? (
              `Complete all activities (${completedInteractions.size}/${totalInteractions})`
            ) : (
              "Complete Lesson"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
