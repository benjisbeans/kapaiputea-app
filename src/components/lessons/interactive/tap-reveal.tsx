"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TapRevealProps {
  data: {
    cards: { front: string; back: string }[];
  };
  xpBonus: number;
  onComplete: () => void;
  disabled: boolean;
}

export function TapReveal({ data, xpBonus, onComplete, disabled }: TapRevealProps) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);

  const handleFlip = (index: number) => {
    if (disabled) return;
    const newFlipped = new Set(flipped);
    if (newFlipped.has(index)) {
      newFlipped.delete(index);
    } else {
      newFlipped.add(index);
    }
    setFlipped(newFlipped);

    // Check if all cards have been flipped at least once
    if (newFlipped.size === data.cards.length && !completed) {
      setCompleted(true);
      onComplete();
    }
  };

  return (
    <div className="rounded-2xl border border-kpp-blue/20 bg-kpp-blue/5 p-5">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kpp-blue">
        <Zap className="h-3 w-3" />
        Tap to Reveal &middot; +{xpBonus} XP
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {data.cards.length === 1 ? "Tap the card to reveal" : "Tap each card to learn more"}
      </p>

      <div className={cn(
        "mt-4 gap-3",
        data.cards.length === 1 ? "flex" : "grid grid-cols-2"
      )}>
        {data.cards.map((card, i) => {
          const isFlipped = flipped.has(i);
          return (
            <motion.button
              key={i}
              onClick={() => handleFlip(i)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative min-h-[80px] rounded-xl p-4 text-left text-sm transition-all",
                data.cards.length === 1 && "w-full",
                isFlipped
                  ? "bg-kpp-blue/20 text-gray-900"
                  : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
              )}
            >
              {isFlipped ? (
                <p className="text-sm">{card.back}</p>
              ) : (
                <p className={cn(
                  "font-bold",
                  data.cards.length > 1 && "text-center"
                )}>{card.front}</p>
              )}
            </motion.button>
          );
        })}
      </div>

      {completed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-sm font-medium text-kpp-green"
        >
          All cards revealed! +{xpBonus} XP
        </motion.p>
      )}
    </div>
  );
}
