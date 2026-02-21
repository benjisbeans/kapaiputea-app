"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniQuizProps {
  data: {
    question: string;
    options: { label: string; correct: boolean }[];
    explanation: string;
  };
  xpBonus: number;
  onComplete: () => void;
  disabled: boolean;
}

export function MiniQuiz({ data, xpBonus, onComplete, disabled }: MiniQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (submitted || disabled) return;
    setSelected(index);
    setSubmitted(true);

    if (data.options[index].correct) {
      onComplete();
    }
  };

  const isCorrect = selected !== null && data.options[selected].correct;

  return (
    <div className="rounded-2xl border border-kpp-purple/20 bg-kpp-purple/5 p-5">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kpp-purple">
        <Zap className="h-3 w-3" />
        Quick Quiz &middot; +{xpBonus} XP
      </div>
      <h4 className="mt-2 font-bold text-gray-900">{data.question}</h4>

      <div className="mt-4 space-y-2">
        {data.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={submitted || disabled}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left text-sm transition-all",
              submitted && opt.correct
                ? "border-kpp-green bg-kpp-green/10 text-gray-900"
                : submitted && selected === i && !opt.correct
                ? "border-red-400 bg-red-400/10 text-gray-900"
                : selected === i
                ? "border-kpp-purple bg-kpp-purple/10 text-gray-900"
                : "border-gray-200 bg-white text-gray-900 hover:border-kpp-purple/30"
            )}
          >
            <span className="flex-1">{opt.label}</span>
            {submitted && opt.correct && (
              <Check className="h-4 w-4 text-kpp-green" />
            )}
            {submitted && selected === i && !opt.correct && (
              <X className="h-4 w-4 text-red-400" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 overflow-hidden"
          >
            <div
              className={cn(
                "rounded-xl p-4 text-sm",
                isCorrect ? "bg-kpp-green/10" : "bg-kpp-orange/10"
              )}
            >
              <p className="font-bold">
                {isCorrect ? "Correct!" : "Not quite!"}
              </p>
              <p className="mt-1 text-gray-600">{data.explanation}</p>
            </div>
            {!isCorrect && (
              <button
                onClick={() => {
                  setSelected(null);
                  setSubmitted(false);
                }}
                className="mt-2 text-sm font-medium text-kpp-purple hover:underline"
              >
                Try again
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
