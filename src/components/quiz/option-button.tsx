"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptionButtonProps {
  emoji?: string;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionButton({
  emoji,
  label,
  description,
  selected,
  onClick,
}: OptionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors",
        selected
          ? "border-kpp-yellow-dark bg-kpp-yellow/10 text-gray-900"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      {emoji && <span className="text-3xl">{emoji}</span>}
      <div className="flex-1">
        <p className="text-lg font-semibold">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-kpp-yellow-dark"
        >
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
