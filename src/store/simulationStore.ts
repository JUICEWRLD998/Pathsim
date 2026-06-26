'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scenario, Decision, SimulationOutcome } from '@/types/simulation';
import type { Career } from '@/types/career';

interface SimulationStore {
  selectedCareer: Career | null;
  scenarios: Scenario[];
  decisions: Decision[];
  currentScenario: number;
  outcome: SimulationOutcome | null;
  isLoading: boolean;
  error: string | null;
  setCareer: (career: Career) => void;
  addScenario: (scenario: Scenario) => void;
  makeDecision: (decision: Decision) => void;
  setOutcome: (outcome: SimulationOutcome) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set) => ({
      selectedCareer: null,
      scenarios: [],
      decisions: [],
      currentScenario: 0,
      outcome: null,
      isLoading: false,
      error: null,

      setCareer: (career) => set({ selectedCareer: career }),
      addScenario: (scenario) => set((s) => ({ scenarios: [...s.scenarios, scenario] })),
      makeDecision: (decision) =>
        set((s) => ({
          decisions: [...s.decisions, decision],
          currentScenario: s.currentScenario + 1,
        })),
      setOutcome: (outcome) => set({ outcome }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          selectedCareer: null,
          scenarios: [],
          decisions: [],
          currentScenario: 0,
          outcome: null,
          isLoading: false,
          error: null,
        }),
    }),
    { name: 'pathsim-simulation' }
  )
);
