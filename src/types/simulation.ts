export interface ScenarioOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  approach: 'analytical' | 'creative' | 'collaborative' | 'systematic';
}

export interface Scenario {
  setting: string;
  situation: string;
  options: ScenarioOption[];
}

export interface Decision {
  scenarioIndex: number;
  choiceId: string;
  choiceText: string;
  approach: string;
}

export interface SimulationOutcome {
  matchScore: number;
  headline: string;
  strengths: Array<{ skill: string; evidence: string }>;
  growthAreas: Array<{ skill: string; advice: string }>;
  careerFit: string;
  relatedCareers: string[];
  roadmapPriorities: string[];
}
