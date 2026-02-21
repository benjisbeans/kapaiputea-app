import { create } from "zustand";
import type { QuizQuestion } from "@/types/database";

type QuizAnswers = Record<string, string | string[]>;

interface QuizState {
  currentStep: number;
  totalSteps: number;
  answers: QuizAnswers;
  questions: QuizQuestion[];
  isSubmitting: boolean;
  isComplete: boolean;
  setQuestions: (questions: QuizQuestion[]) => void;
  setAnswer: (fieldKey: string, value: string | string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSubmitting: (submitting: boolean) => void;
  setComplete: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentStep: 0,
  totalSteps: 0,
  answers: {},
  questions: [],
  isSubmitting: false,
  isComplete: false,

  setQuestions: (questions) =>
    set({ questions, totalSteps: questions.length }),

  setAnswer: (fieldKey, value) =>
    set((state) => ({
      answers: { ...state.answers, [fieldKey]: value },
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),

  setComplete: () => set({ isComplete: true }),

  reset: () =>
    set({
      currentStep: 0,
      answers: {},
      isSubmitting: false,
      isComplete: false,
    }),
}));
