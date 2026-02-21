"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MultiSelectGridProps {
  options: { value: string; label: string; emoji?: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function MultiSelectGrid({
  options,
  selected,
  onToggle,
}: MultiSelectGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(opt.value)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors",
              isSelected
                ? "border-kpp-yellow-dark bg-kpp-yellow/10 text-gray-900"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            )}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="text-sm font-medium">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
