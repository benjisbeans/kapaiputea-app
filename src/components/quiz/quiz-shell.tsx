"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useQuizStore } from "@/stores/quiz-store";
import { QuizProgress } from "./quiz-progress";
import { OptionButton } from "./option-button";
import { EmojiScale } from "./emoji-scale";
import { MultiSelectGrid } from "./multi-select-grid";
import type { QuizQuestion } from "@/types/database";

interface QuizShellProps {
  questions: QuizQuestion[];
}

export function QuizShell({ questions }: QuizShellProps) {
  const router = useRouter();
  const {
    currentStep,
    totalSteps,
    answers,
    isSubmitting,
    setQuestions,
    setAnswer,
    nextStep,
    prevStep,
    setSubmitting,
  } = useQuizStore();

  useEffect(() => {
    setQuestions(questions);
  }, [questions, setQuestions]);

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.field_key]
    : undefined;

  const handleSingleSelect = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      setAnswer(currentQuestion.field_key, value);
      if (!isLastStep) {
        setTimeout(nextStep, 400);
      }
    },
    [currentQuestion, isLastStep, nextStep, setAnswer]
  );

  const handleMultiToggle = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      const current = (answers[currentQuestion.field_key] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswer(currentQuestion.field_key, updated);
    },
    [currentQuestion, answers, setAnswer]
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      router.push("/profile-reveal");
    } catch (error) {
      console.error("Quiz submit error:", error);
      setSubmitting(false);
    }
  };

  if (!currentQuestion) return null;

  const hasAnswer =
    currentQuestion.question_type === "multi-select"
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : !!currentAnswer;

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-8">
      {/* Header */}
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-kpp-dark">
            Ka Pai Putea
          </span>
          <div className="w-10" />
        </div>
        <QuizProgress current={currentStep} total={totalSteps} />
      </div>

      {/* Question */}
      <div className="mx-auto mt-8 flex w-full max-w-lg flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-1 flex-col"
          >
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              {currentQuestion.question_text}
            </h2>

            <div className="flex-1 space-y-3">
              {currentQuestion.question_type === "emoji-scale" ? (
                <EmojiScale
                  options={currentQuestion.options}
                  selected={currentAnswer as string | undefined}
                  onSelect={handleSingleSelect}
                />
              ) : currentQuestion.question_type === "multi-select" ? (
                <MultiSelectGrid
                  options={currentQuestion.options}
                  selected={(currentAnswer as string[]) || []}
                  onToggle={handleMultiToggle}
                />
              ) : (
                currentQuestion.options.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    description={opt.description}
                    selected={currentAnswer === opt.value}
                    onClick={() => handleSingleSelect(opt.value)}
                  />
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom actions */}
        <div className="mt-8 pb-4">
          {isLastStep && hasAnswer && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? "Creating your profile..." : "See My Profile!"}
            </motion.button>
          )}
          {currentQuestion.question_type === "multi-select" &&
            hasAnswer &&
            !isLastStep && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={nextStep}
                className="w-full rounded-2xl bg-kpp-dark px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Next
              </motion.button>
            )}
        </div>
      </div>
    </div>
  );
}
