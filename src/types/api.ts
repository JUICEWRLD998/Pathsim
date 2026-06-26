export interface GeminiRequest {
  promptKey: 'career_recommendation' | 'scenario_generation' | 'outcome_evaluation' | 'roadmap_generation';
  variables: Record<string, string>;
}

export interface GeminiResponse<T> {
  data: T | null;
  error?: string;
}

export interface CareerRecommendation {
  id: string;
  title: string;
  whyYou: string;
  matchScore: number;
  salaryRange: string;
  growthTag: string;
}

export interface RecommendationsResponse {
  recommendations: CareerRecommendation[];
  personalityProfile: string;
}

export interface RoadmapAction {
  type: string;
  title: string;
  platform: string;
  url: string;
  time: string;
}

export interface RoadmapMilestone {
  timeframe: string;
  title: string;
  actions: RoadmapAction[];
}

export interface RoadmapResponse {
  profile: { archetype: string; summary: string };
  milestones: RoadmapMilestone[];
}
