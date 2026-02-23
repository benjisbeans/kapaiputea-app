"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

/**
 * Split content blocks into pages.
 * Interactive blocks always get their own page.
 * Non-interactive blocks are grouped (max 3 per page).
 */
function paginateBlocks(
  blocks: ContentBlockType[]
): { blocks: ContentBlockType[]; indices: number[] }[] {
  const pages: { blocks: ContentBlockType[]; indices: number[] }[] = [];
  let currentPage: { blocks: ContentBlockType[]; indices: number[] } = {
    blocks: [],
    indices: [],
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isInteractive = INTERACTIVE_TYPES.includes(block.type);

    if (isInteractive) {
      // Flush any pending non-interactive blocks first
      if (currentPage.blocks.length > 0) {
        pages.push(currentPage);
        currentPage = { blocks: [], indices: [] };
      }
      // Interactive block gets its own page
      pages.push({ blocks: [block], indices: [i] });
    } else {
      currentPage.blocks.push(block);
      currentPage.indices.push(i);

      // Max 3 non-interactive blocks per page
      if (currentPage.blocks.length >= 3) {
        pages.push(currentPage);
        currentPage = { blocks: [], indices: [] };
      }
    }
  }

  // Flush remaining
  if (currentPage.blocks.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

const pageVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export function LessonPlayer({
  lesson,
  moduleSlug,
  isCompleted: initialCompleted,
  nextLesson,
}: LessonPlayerProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [currentPage, setCurrentPage] = useState(0);
  const [xpResult, setXpResult] = useState<{
    total: number;
    breakdown: Record<string, number>;
    leveledUp: boolean;
    newLevel?: number;
    badges: { name: string; emoji: string }[];
    moduleCompleted?: boolean;
    moduleName?: string;
    currentStreak?: number;
    currentLevel?: number;
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

  const pages = useMemo(
    () => paginateBlocks(lesson.content_blocks),
    [lesson.content_blocks]
  );

  const interactiveCount = lesson.content_blocks.filter((b) =>
    INTERACTIVE_TYPES.includes(b.type)
  ).length;

  useEffect(() => {
    setLesson(lesson.id, interactiveCount);
  }, [lesson.id, interactiveCount, setLesson]);

  const allDone = completedInteractions.size >= totalInteractions;
  const isLastPage = currentPage >= pages.length - 1;

  // Check if current page has an uncompleted interactive block
  const currentPageData = pages[currentPage];
  const currentPageHasInteractive = currentPageData?.blocks.some((b) =>
    INTERACTIVE_TYPES.includes(b.type)
  );
  const currentPageInteractiveComplete = currentPageData?.indices.every(
    (idx) => {
      const block = lesson.content_blocks[idx];
      if (!INTERACTIVE_TYPES.includes(block.type)) return true;
      return completedInteractions.has(String(idx));
    }
  );

  // Can advance if: no interactive on page, or interactive is completed
  const canAdvance = !currentPageHasInteractive || currentPageInteractiveComplete;

  const goNext = useCallback(() => {
    if (isLastPage || !canAdvance) return;
    setCurrentPage((p) => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isLastPage, canAdvance]);

  const goBack = useCallback(() => {
    if (currentPage <= 0) return;
    setCurrentPage((p) => p - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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

  const progressPercent = Math.round(
    ((currentPage + 1) / pages.length) * 100
  );

  return (
    <div className="mx-auto max-w-2xl">
      {showCelebration && xpResult && (
        <XpCelebration
          xpEarned={xpResult.total}
          breakdown={xpResult.breakdown}
          leveledUp={xpResult.leveledUp}
          newLevel={xpResult.newLevel}
          badges={xpResult.badges}
          moduleName={xpResult.moduleName}
          moduleCompleted={xpResult.moduleCompleted}
          currentStreak={xpResult.currentStreak}
          currentLevel={xpResult.currentLevel}
          onDone={() => {
            setShowCelebration(false);
          }}
        />
      )}

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
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

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span className="font-bold">
            {currentPage + 1} / {pages.length}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-kpp-yellow to-kpp-yellow-dark"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Content — current page only */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-6"
        >
          {currentPageData?.blocks.map((block, i) => {
            const globalIndex = currentPageData.indices[i];
            return (
              <motion.div
                key={globalIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ContentBlock
                  block={block}
                  index={globalIndex}
                  onInteractionComplete={(blockIndex) =>
                    markInteractionComplete(String(blockIndex))
                  }
                  isLessonCompleted={isCompleted}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 space-y-3 pb-28">
        {isCompleted && isLastPage ? (
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
        ) : isLastPage ? (
          /* Last page — show Complete button */
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
        ) : (
          /* Not last page — show Next */
          <button
            onClick={goNext}
            disabled={!canAdvance}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40"
          >
            {currentPageHasInteractive && !currentPageInteractiveComplete
              ? "Complete the activity to continue"
              : "Next"}
            <ArrowRight className="h-5 w-5" />
          </button>
        )}

        {/* Back button (not on first page) */}
        {currentPage > 0 && (
          <button
            onClick={goBack}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-8 py-3 text-sm font-bold text-gray-500 transition-all hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
      </div>
    </div>
  );
}
