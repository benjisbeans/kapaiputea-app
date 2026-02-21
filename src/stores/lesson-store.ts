import { create } from "zustand";

interface LessonState {
  lessonId: string | null;
  completedInteractions: Set<string>;
  interactionData: Record<string, unknown>;
  isSubmitting: boolean;
  setLesson: (lessonId: string, totalInteractions: number) => void;
  markInteractionComplete: (blockIndex: string, data?: unknown) => void;
  isAllComplete: () => boolean;
  totalInteractions: number;
  setSubmitting: (submitting: boolean) => void;
  reset: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessonId: null,
  completedInteractions: new Set(),
  interactionData: {},
  isSubmitting: false,
  totalInteractions: 0,

  setLesson: (lessonId, totalInteractions) =>
    set({
      lessonId,
      totalInteractions,
      completedInteractions: new Set(),
      interactionData: {},
      isSubmitting: false,
    }),

  markInteractionComplete: (blockIndex, data) =>
    set((state) => {
      const newCompleted = new Set(state.completedInteractions);
      newCompleted.add(blockIndex);
      return {
        completedInteractions: newCompleted,
        interactionData: data
          ? { ...state.interactionData, [blockIndex]: data }
          : state.interactionData,
      };
    }),

  isAllComplete: () => {
    const state = get();
    return state.completedInteractions.size >= state.totalInteractions;
  },

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),

  reset: () =>
    set({
      lessonId: null,
      completedInteractions: new Set(),
      interactionData: {},
      isSubmitting: false,
      totalInteractions: 0,
    }),
}));
