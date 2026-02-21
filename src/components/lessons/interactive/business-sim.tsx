"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, DollarSign, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessSimProps {
  data: {
    scenario_id: string;
    title: string;
    description: string;
    starting_cash: number;
    decisions: {
      id: string;
      prompt: string;
      options: {
        label: string;
        cost: number;
        revenue_per_turn: number;
        risk: number;
        explanation: string;
      }[];
    }[];
    turns: number;
    success_threshold: number;
  };
  xpBonus: number;
  onComplete: () => void;
  disabled: boolean;
}

interface Choice {
  decisionId: string;
  optionIndex: number;
  cost: number;
  revenuePerTurn: number;
}

export function BusinessSim({ data, xpBonus, onComplete, disabled }: BusinessSimProps) {
  const [currentDecision, setCurrentDecision] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);

  const totalDecisions = data.decisions.length;
  const isFinished = showResult;

  // Calculate current cash based on choices made so far
  const calculateCash = (choicesMade: Choice[]) => {
    let cash = data.starting_cash;
    choicesMade.forEach((choice, idx) => {
      cash -= choice.cost;
      // Revenue accumulates for remaining turns after the decision
      const turnsRemaining = data.turns - idx;
      cash += choice.revenuePerTurn * turnsRemaining;
    });
    return cash;
  };

  const currentCash = calculateCash(choices);
  const finalCash = showResult ? currentCash : null;
  const isSuccess = finalCash !== null && finalCash >= data.success_threshold;

  const handleChoice = (optionIndex: number) => {
    if (disabled || showResult) return;

    const decision = data.decisions[currentDecision];
    const option = decision.options[optionIndex];

    const newChoice: Choice = {
      decisionId: decision.id,
      optionIndex,
      cost: option.cost,
      revenuePerTurn: option.revenue_per_turn,
    };

    const newChoices = [...choices, newChoice];
    setChoices(newChoices);
    setLastExplanation(option.explanation);

    if (currentDecision + 1 >= totalDecisions) {
      // All decisions made — show results
      setTimeout(() => {
        setShowResult(true);
        const finalAmount = calculateCash(newChoices);
        if (finalAmount >= data.success_threshold) {
          onComplete();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setCurrentDecision((d) => d + 1);
        setLastExplanation(null);
      }, 1500);
    }
  };

  const handleRetry = () => {
    setCurrentDecision(0);
    setChoices([]);
    setShowResult(false);
    setLastExplanation(null);
  };

  const decision = data.decisions[currentDecision];

  return (
    <div className="rounded-2xl border border-kpp-pink/20 bg-gradient-to-br from-kpp-pink/5 to-kpp-purple/5 p-5">
      {/* Header */}
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kpp-pink">
        <Zap className="h-3 w-3" />
        Business Sim &middot; +{xpBonus} XP
      </div>

      <h4 className="mt-2 font-bold text-gray-900">{data.title}</h4>
      <p className="mt-1 text-sm text-gray-500">{data.description}</p>

      {/* Cash display */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-white border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-kpp-green" />
          <span className="text-sm font-medium text-gray-500">Your Cash</span>
        </div>
        <span className={cn(
          "text-xl font-bold",
          currentCash >= data.starting_cash ? "text-kpp-green" : "text-kpp-orange"
        )}>
          ${currentCash.toLocaleString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-gray-400">
          Decision {Math.min(currentDecision + 1, totalDecisions)}/{totalDecisions}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-kpp-pink transition-all"
            style={{ width: `${(choices.length / totalDecisions) * 100}%` }}
          />
        </div>
      </div>

      {/* Current decision */}
      {!showResult && decision && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900">{decision.prompt}</p>
          <div className="mt-3 space-y-2">
            {decision.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                disabled={disabled || lastExplanation !== null}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border-2 p-3 text-left text-sm transition-all",
                  lastExplanation !== null
                    ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                    : "border-gray-200 bg-white hover:border-kpp-pink/40 hover:bg-kpp-pink/5"
                )}
              >
                <div>
                  <span className="font-medium text-gray-900">{option.label}</span>
                  {option.cost > 0 && (
                    <span className="ml-2 text-xs text-red-500">-${option.cost.toLocaleString()}</span>
                  )}
                </div>
                {option.revenue_per_turn > 0 && (
                  <span className="text-xs text-kpp-green font-medium">
                    +${option.revenue_per_turn.toLocaleString()}/turn
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Explanation after choosing */}
      <AnimatePresence>
        {lastExplanation && !showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="rounded-xl bg-kpp-blue/10 p-3 text-sm text-gray-600">
              {lastExplanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className={cn(
              "rounded-xl p-4 text-center",
              isSuccess ? "bg-kpp-green/10" : "bg-kpp-orange/10"
            )}>
              <div className="flex items-center justify-center gap-2">
                {isSuccess ? (
                  <TrendingUp className="h-6 w-6 text-kpp-green" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-kpp-orange" />
                )}
                <span className={cn(
                  "text-2xl font-bold",
                  isSuccess ? "text-kpp-green" : "text-kpp-orange"
                )}>
                  ${finalCash?.toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {isSuccess
                  ? `You made it! Target was $${data.success_threshold.toLocaleString()}.`
                  : `Not quite — you needed $${data.success_threshold.toLocaleString()}.`}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {isSuccess
                  ? "Smart financial decisions pay off!"
                  : "Every entrepreneur fails before they succeed. Try different strategies!"}
              </p>
            </div>

            {isSuccess && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 text-center text-sm font-medium text-kpp-green"
              >
                +{xpBonus} XP earned!
              </motion.p>
            )}

            {!isSuccess && (
              <button
                onClick={handleRetry}
                className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-kpp-pink hover:underline mx-auto"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try again
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
