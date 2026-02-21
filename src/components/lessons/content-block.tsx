"use client";

import React from "react";
import { MiniQuiz } from "./interactive/mini-quiz";
import { TapReveal } from "./interactive/tap-reveal";
import { SortOrder } from "./interactive/sort-order";
import { FillBlanks } from "./interactive/fill-blanks";
import { BusinessSim } from "./interactive/business-sim";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ContentBlockProps {
  block: any;
  index: number;
  onInteractionComplete: (index: number) => void;
  isLessonCompleted: boolean;
}

/**
 * Simple inline markdown: **bold**, bullet lists (- item), and line breaks.
 */
function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split on double newlines to get paragraphs
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((para, pi) => {
    const trimmed = para.trim();

    // Check if this paragraph is a bullet list (lines starting with -)
    const lines = trimmed.split("\n");
    const isList = lines.every(
      (l) => l.trim().startsWith("- ") || l.trim() === ""
    );

    if (isList) {
      return (
        <ul key={pi} className="my-2 space-y-1.5 pl-1">
          {lines
            .filter((l) => l.trim().startsWith("- "))
            .map((line, li) => (
              <li
                key={li}
                className="flex items-start gap-2 text-sm"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>{inlineMd(line.replace(/^-\s*/, ""))}</span>
              </li>
            ))}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <span key={pi}>
        {pi > 0 && <br />}
        {inlineMd(trimmed)}
      </span>
    );
  });
}

/** Render inline markdown: **bold** */
function inlineMd(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/**
 * Handles both flat seed format (properties on block) and
 * nested format (properties under block.data).
 */
function d(block: any): any {
  return block.data ?? block;
}

export function ContentBlock({
  block,
  index,
  onInteractionComplete,
  isLessonCompleted,
}: ContentBlockProps) {
  const data = d(block);

  switch (block.type) {
    case "heading": {
      const level = data.level ?? 2;
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag
          className={
            level === 1
              ? "text-2xl font-bold text-gray-900"
              : level === 2
              ? "text-xl font-bold text-gray-900"
              : "text-lg font-semibold text-gray-900"
          }
        >
          {data.text}
        </Tag>
      );
    }

    case "text":
      return (
        <div className="leading-relaxed text-gray-600">
          {renderMarkdown(data.text)}
        </div>
      );

    case "callout": {
      const variant = data.variant ?? data.style ?? "info";
      const variantStyles: Record<string, string> = {
        info: "border-kpp-blue/30 bg-kpp-blue/10",
        warning: "border-kpp-orange/30 bg-kpp-orange/10",
        tip: "border-kpp-green/30 bg-kpp-green/10",
        success: "border-kpp-green/30 bg-kpp-green/10",
      };
      const variantIcons: Record<string, React.ReactNode> = {
        info: <Info className="h-5 w-5 text-kpp-blue" />,
        warning: <AlertTriangle className="h-5 w-5 text-kpp-orange" />,
        tip: <Lightbulb className="h-5 w-5 text-kpp-green" />,
        success: <Lightbulb className="h-5 w-5 text-kpp-green" />,
      };
      return (
        <div
          className={`flex gap-3 rounded-2xl border p-4 ${
            variantStyles[variant] ?? variantStyles.info
          }`}
        >
          <div className="shrink-0 pt-0.5">
            {variantIcons[variant] ?? variantIcons.info}
          </div>
          <div className="text-sm text-gray-600">
            {renderMarkdown(data.text)}
          </div>
        </div>
      );
    }

    case "stat-card":
      return (
        <div className="rounded-2xl bg-gradient-to-br from-kpp-yellow/10 to-kpp-orange/10 p-6 text-center">
          <p className="text-4xl font-bold text-gray-900">
            {data.stat ?? data.value}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {data.label}
          </p>
          {(data.source ?? data.description) && (
            <p className="mt-2 text-xs text-gray-400">
              {data.source ?? data.description}
            </p>
          )}
        </div>
      );

    case "tip-box": {
      const tips: string[] = data.tips ?? (data.text ? [data.text] : []);
      return (
        <div className="rounded-2xl border border-kpp-green/20 bg-kpp-green/5 p-5">
          <h4 className="font-bold text-gray-900">{data.title}</h4>
          <ul className="mt-3 space-y-2">
            {tips.map((tip: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="mt-0.5 text-kpp-green">&#x2713;</span>
                <span>{renderMarkdown(tip)}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case "image":
      return (
        <figure className="overflow-hidden rounded-2xl">
          <img
            src={data.src}
            alt={data.alt ?? ""}
            className="w-full object-cover"
          />
          {data.caption && (
            <figcaption className="mt-2 text-center text-xs text-gray-400">
              {data.caption}
            </figcaption>
          )}
        </figure>
      );

    case "mini-quiz": {
      const quizData = {
        question: data.question,
        explanation: data.explanation,
        options: Array.isArray(data.options)
          ? data.options.map((opt: any, i: number) =>
              typeof opt === "string"
                ? { label: opt, correct: i === data.correct_index }
                : opt
            )
          : [],
      };
      return (
        <MiniQuiz
          data={quizData}
          xpBonus={block.xp_bonus ?? data.xp_bonus ?? 10}
          onComplete={() => onInteractionComplete(index)}
          disabled={isLessonCompleted}
        />
      );
    }

    case "tap-reveal": {
      const tapData = data.cards
        ? data
        : { cards: [{ front: data.prompt, back: data.reveal_text }] };
      return (
        <TapReveal
          data={tapData}
          xpBonus={block.xp_bonus ?? data.xp_bonus ?? 10}
          onComplete={() => onInteractionComplete(index)}
          disabled={isLessonCompleted}
        />
      );
    }

    case "sort-order": {
      let sortData;
      if (
        Array.isArray(data.items) &&
        data.items.length > 0 &&
        typeof data.items[0] === "string"
      ) {
        const correctOrder: string[] = data.correct_order ?? data.items;
        const midpoint = Math.ceil(correctOrder.length / 2);
        const groupA = new Set(correctOrder.slice(0, midpoint));

        // Extract category names from instruction
        const { catA, catB } = extractCategories(data.instruction);

        sortData = {
          instruction: data.instruction,
          categoryA: catA,
          categoryB: catB,
          items: data.items.map((item: string) => ({
            id: item,
            label: item,
            category: groupA.has(item) ? ("a" as const) : ("b" as const),
          })),
        };
      } else {
        sortData = data;
      }
      return (
        <SortOrder
          data={sortData}
          xpBonus={block.xp_bonus ?? data.xp_bonus ?? 10}
          onComplete={() => onInteractionComplete(index)}
          disabled={isLessonCompleted}
        />
      );
    }

    case "fill-blanks": {
      let fillData;
      if (Array.isArray(data.blanks) && typeof data.blanks[0] === "string") {
        const answers: string[] = data.blanks;
        let template = data.sentence ?? data.template ?? "";
        answers.forEach((_: string, i: number) => {
          template = template.replace("_____", `{{blank_${i}}}`);
        });
        const allOptions = [...answers];
        fillData = {
          template,
          blanks: answers.map((answer: string, i: number) => ({
            id: `blank_${i}`,
            answer,
            options: shuffleArray([...allOptions]),
          })),
        };
      } else {
        fillData = data;
      }
      return (
        <FillBlanks
          data={fillData}
          xpBonus={block.xp_bonus ?? data.xp_bonus ?? 10}
          onComplete={() => onInteractionComplete(index)}
          disabled={isLessonCompleted}
        />
      );
    }

    case "business-sim": {
      return (
        <BusinessSim
          data={data}
          xpBonus={block.xp_bonus ?? data.xp_bonus ?? 25}
          onComplete={() => onInteractionComplete(index)}
          disabled={isLessonCompleted}
        />
      );
    }

    default:
      return null;
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Extract two short category names from sort-order instructions.
 */
function extractCategories(instruction: string): { catA: string; catB: string } {
  const lower = instruction.toLowerCase();

  // Known pairs
  if (lower.includes("income") && lower.includes("expense"))
    return { catA: "Income", catB: "Expense" };
  if (lower.includes("need") && lower.includes("want"))
    return { catA: "Needs", catB: "Wants" };
  if (lower.includes("most") && lower.includes("least"))
    return { catA: "More", catB: "Less" };
  if (lower.includes("highest") && lower.includes("lowest"))
    return { catA: "Higher", catB: "Lower" };
  if (lower.includes("important"))
    return { catA: "Important", catB: "Less important" };
  if (lower.includes("first") && lower.includes("last"))
    return { catA: "First", catB: "Last" };

  return { catA: "Group A", catB: "Group B" };
}
