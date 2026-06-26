'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizAnswer } from '@/types/quiz';
import type { CareerRecommendation } from '@/types/api';

interface QuizStore {
  answers: QuizAnswer[];
  currentQuestion: number;
  recommendations: CareerRecommendation[];
  personalityProfile: string;
  isLoading: boolean;
  error: string | null;
  setAnswer: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setRecommendations: (recs: CareerRecommendation[], profile: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      answers: [],
      currentQuestion: 0,
      recommendations: [],
      personalityProfile: '',
      isLoading: false,
      error: null,

      setAnswer: (answer) =>
        set((state) => ({
          answers: [...state.answers.filter((a) => a.questionId !== answer.questionId), answer],
        })),

      nextQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion + 1 })),

      prevQuestion: () =>
        set((state) => ({ currentQuestion: Math.max(0, state.currentQuestion - 1) })),

      setRecommendations: (recommendations, personalityProfile) =>
        set({ recommendations, personalityProfile }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          answers: [],
          currentQuestion: 0,
          recommendations: [],
          personalityProfile: '',
          isLoading: false,
          error: null,
        }),
    }),
    { name: 'pathsim-quiz' }
  )
);
