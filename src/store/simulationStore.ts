'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scenario, Decision, SimulationOutcome } from '@/types/simulation';
import type { Career } from '@/types/career';

interface SimulationStore {
  simulationId: string | null;
  selectedCareer: Career | null;
  scenarios: Scenario[];
  decisions: Decision[];
  currentScenario: number;
  outcome: SimulationOutcome | null;
  isLoading: boolean;
  error: string | null;
  
  setSimulationId: (id: string | null) => void;
  setCareer: (career: Career) => void;
  addScenario: (scenario: Scenario) => void;
  makeDecision: (decision: Decision) => void;
  setOutcome: (outcome: SimulationOutcome) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resumeSimulation: (run: any, career: Career) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set) => ({
      simulationId: null,
      selectedCareer: null,
      scenarios: [],
      decisions: [],
      currentScenario: 0,
      outcome: null,
      isLoading: false,
      error: null,

      setSimulationId: (simulationId) => set({ simulationId }),
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
      
      resumeSimulation: (run, career) =>
        set({
          simulationId: run.id,
          selectedCareer: career,
          currentScenario: run.currentScenarioIndex,
          scenarios: run.history.map((h: any, i: number) => ({
            setting: h.scenarioTitle || 'Scenario ' + (i + 1),
            situation: 'Resumed scenario context...',
            options: [], // Not needed for history display
          })),
          decisions: run.history.map((h: any, i: number) => ({
            scenarioIndex: i,
            choiceId: String.fromCharCode(65 + h.choiceIndex), // Map back index to A, B, C, D
            choiceText: h.choiceText,
            approach: 'collaborative', // Mock since it is historical
          })),
          outcome: run.completed
            ? {
                matchScore: run.score,
                headline: 'Historical fit summary',
                strengths: [],
                growthAreas: [],
                careerFit: 'Fit analysis loaded from history.',
                relatedCareers: [],
                roadmapPriorities: [],
              }
            : null,
          isLoading: false,
          error: null,
        }),

      reset: () =>
        set({
          simulationId: null,
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
