"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmojiScaleProps {
  options: { value: string; label: string; emoji?: string }[];
  selected: string | undefined;
  onSelect: (value: string) => void;
}

export function EmojiScale({ options, selected, onSelect }: EmojiScaleProps) {
  return (
    <div className="flex w-full justify-center gap-3">
      {options.map((opt) => (
        <motion.button
          key={opt.value}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-3 transition-colors",
            selected === opt.value
              ? "border-kpp-yellow-dark bg-kpp-yellow/10"
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <span className="text-4xl">{opt.emoji}</span>
          <span className="text-xs text-gray-500">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
