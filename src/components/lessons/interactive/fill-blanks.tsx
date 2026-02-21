"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FillBlanksProps {
  data: {
    template: string;
    blanks: { id: string; answer: string; options: string[] }[];
  };
  xpBonus: number;
  onComplete: () => void;
  disabled: boolean;
}

export function FillBlanks({ data, xpBonus, onComplete, disabled }: FillBlanksProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChange = (blankId: string, value: string) => {
    if (submitted || disabled) return;
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = data.blanks.every(
      (blank) => answers[blank.id] === blank.answer
    );
    setIsCorrect(correct);
    if (correct) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setIsCorrect(false);
    setAnswers({});
  };

  const allFilled = data.blanks.every((b) => answers[b.id]);

  // Parse template and replace {{blank_id}} with dropdowns
  const parts = data.template.split(/(\{\{[^}]+\}\})/);

  return (
    <div className="rounded-2xl border border-kpp-pink/20 bg-kpp-pink/5 p-5">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kpp-pink-dark">
        <Zap className="h-3 w-3" />
        Fill in the Blanks &middot; +{xpBonus} XP
      </div>

      <div className="mt-4 text-sm leading-8 text-gray-900">
        {parts.map((part, i) => {
          const match = part.match(/\{\{(.+)\}\}/);
          if (!match) return <span key={i}>{part}</span>;

          const blankId = match[1];
          const blank = data.blanks.find((b) => b.id === blankId);
          if (!blank) return <span key={i}>{part}</span>;

          const isBlankCorrect = submitted && answers[blankId] === blank.answer;
          const isBlankWrong = submitted && answers[blankId] !== blank.answer;

          return (
            <select
              key={i}
              value={answers[blankId] || ""}
              onChange={(e) => handleChange(blankId, e.target.value)}
              disabled={submitted || disabled}
              className={cn(
                "mx-1 inline-block rounded-lg border-2 px-2 py-1 text-sm font-medium",
                isBlankCorrect
                  ? "border-kpp-green bg-kpp-green/10"
                  : isBlankWrong
                  ? "border-red-400 bg-red-400/10"
                  : "border-gray-200 bg-white"
              )}
            >
              <option value="">Select...</option>
              {blank.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        })}
      </div>

      {!submitted && !disabled && (
        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className="mt-4 w-full rounded-xl bg-kpp-pink-dark px-4 py-2.5 text-sm font-bold text-white hover:bg-kpp-pink-dark/90 disabled:opacity-40"
        >
          Check Answers
        </button>
      )}

      {submitted && !isCorrect && (
        <button
          onClick={handleRetry}
          className="mt-3 text-sm font-medium text-kpp-pink-dark hover:underline"
        >
          Try again
        </button>
      )}

      {submitted && isCorrect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-kpp-green"
        >
          <Check className="h-4 w-4" />
          All correct! +{xpBonus} XP
        </motion.p>
      )}
    </div>
  );
}
