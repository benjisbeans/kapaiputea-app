"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortOrderProps {
  data: {
    instruction: string;
    categoryA: string;
    categoryB: string;
    items: { id: string; label: string; category: "a" | "b" }[];
  };
  xpBonus: number;
  onComplete: () => void;
  disabled: boolean;
}

export function SortOrder({ data, xpBonus, onComplete, disabled }: SortOrderProps) {
  const [placements, setPlacements] = useState<Record<string, "a" | "b">>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const unplaced = data.items.filter((item) => !placements[item.id]);
  const bucketA = data.items.filter((item) => placements[item.id] === "a");
  const bucketB = data.items.filter((item) => placements[item.id] === "b");
  const allPlaced = Object.keys(placements).length === data.items.length;

  const placeItem = (itemId: string, category: "a" | "b") => {
    if (submitted || disabled) return;
    setPlacements((prev) => ({ ...prev, [itemId]: category }));
  };

  const removeItem = (itemId: string) => {
    if (submitted || disabled) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = data.items.every(
      (item) => placements[item.id] === item.category
    );
    setIsCorrect(correct);
    if (correct) onComplete();
  };

  const handleRetry = () => {
    setSubmitted(false);
    setIsCorrect(false);
    setPlacements({});
  };

  const getItemResult = (item: { id: string; category: "a" | "b" }) => {
    if (!submitted) return null;
    return placements[item.id] === item.category ? "correct" : "wrong";
  };

  return (
    <div className="rounded-2xl border border-kpp-orange/20 bg-kpp-orange/5 p-5">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kpp-orange">
        <Zap className="h-3 w-3" />
        Sort It &middot; +{xpBonus} XP
      </div>
      <p className="mt-2 text-sm text-gray-900">{data.instruction}</p>

      {/* Category buckets */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Bucket A */}
        <div className="rounded-xl border-2 border-dashed border-kpp-blue/30 bg-kpp-blue/5 p-3">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-kpp-blue">
            {data.categoryA}
          </p>
          <div className="min-h-[60px] space-y-1.5">
            <AnimatePresence>
              {bucketA.map((item) => {
                const result = getItemResult(item);
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => removeItem(item.id)}
                    disabled={submitted || disabled}
                    className={cn(
                      "flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                      result === "correct"
                        ? "bg-kpp-green/20 text-kpp-green"
                        : result === "wrong"
                        ? "bg-red-100 text-red-600"
                        : "bg-white text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <span className="flex-1">{item.label}</span>
                    {result === "correct" && <Check className="h-3 w-3 shrink-0" />}
                    {result === "wrong" && <X className="h-3 w-3 shrink-0" />}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bucket B */}
        <div className="rounded-xl border-2 border-dashed border-kpp-purple/30 bg-kpp-purple/5 p-3">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-kpp-purple">
            {data.categoryB}
          </p>
          <div className="min-h-[60px] space-y-1.5">
            <AnimatePresence>
              {bucketB.map((item) => {
                const result = getItemResult(item);
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => removeItem(item.id)}
                    disabled={submitted || disabled}
                    className={cn(
                      "flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                      result === "correct"
                        ? "bg-kpp-green/20 text-kpp-green"
                        : result === "wrong"
                        ? "bg-red-100 text-red-600"
                        : "bg-white text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <span className="flex-1">{item.label}</span>
                    {result === "correct" && <Check className="h-3 w-3 shrink-0" />}
                    {result === "wrong" && <X className="h-3 w-3 shrink-0" />}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Unplaced items */}
      {unplaced.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-400">Tap a category to sort each item:</p>
          {unplaced.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white p-2.5"
            >
              <span className="flex-1 text-sm font-medium text-gray-900 pl-1">
                {item.label}
              </span>
              <button
                onClick={() => placeItem(item.id, "a")}
                className="rounded-lg bg-kpp-blue/10 px-3 py-1.5 text-xs font-bold text-kpp-blue transition-colors hover:bg-kpp-blue/20"
              >
                {data.categoryA}
              </button>
              <button
                onClick={() => placeItem(item.id, "b")}
                className="rounded-lg bg-kpp-purple/10 px-3 py-1.5 text-xs font-bold text-kpp-purple transition-colors hover:bg-kpp-purple/20"
              >
                {data.categoryB}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Check / Retry */}
      {!submitted && !disabled && allPlaced && (
        <button
          onClick={handleSubmit}
          className="mt-4 w-full rounded-xl bg-kpp-orange px-4 py-2.5 text-sm font-bold text-white hover:bg-kpp-orange/90"
        >
          Check
        </button>
      )}

      {submitted && !isCorrect && (
        <button
          onClick={handleRetry}
          className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-kpp-orange hover:underline mx-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}

      {submitted && isCorrect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-sm font-medium text-kpp-green"
        >
          All sorted correctly! +{xpBonus} XP
        </motion.p>
      )}
    </div>
  );
}
