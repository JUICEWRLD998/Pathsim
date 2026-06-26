import type { GeminiRequest } from '@/types/api';

export type PromptKey = GeminiRequest['promptKey'];

export const PROMPTS: Record<PromptKey, string> = {
  career_recommendation: `
You are a career counselor AI. A high school student answered a Spark Quiz.

Quiz Answers:
{answers}

Based on these answers, recommend exactly 3 careers from this list:
Software Engineer, UX Designer, Data Scientist, Product Manager, Biomedical Engineer, 
Graphic Designer, Financial Analyst, Doctor, Teacher, Environmental Scientist, 
Cybersecurity Analyst, Architect

Return ONLY this JSON:
{
  "recommendations": [
    {
      "id": "career-id-slug",
      "title": "Career Title",
      "whyYou": "One sentence explaining why this matches them specifically.",
      "matchScore": 87,
      "salaryRange": "$75K–$130K",
      "growthTag": "+22% by 2030"
    }
  ],
  "personalityProfile": "One paragraph describing the student's strengths and working style."
}
`,

  scenario_generation: `
You are a career simulation engine. Generate a realistic workplace scenario for a {career} professional.

This is scenario {scenarioNumber} of 3.

Return ONLY this JSON:
{
  "setting": "Brief location/context (e.g., 'Morning stand-up meeting at a startup')",
  "situation": "2-3 sentences describing the challenge they face. Make it realistic and specific to {career}.",
  "options": [
    { "id": "A", "text": "Option A description (analytical approach)", "approach": "analytical" },
    { "id": "B", "text": "Option B description (creative approach)", "approach": "creative" },
    { "id": "C", "text": "Option C description (collaborative approach)", "approach": "collaborative" },
    { "id": "D", "text": "Option D description (systematic approach)", "approach": "systematic" }
  ]
}
`,

  outcome_evaluation: `
You are a career assessment AI. A student completed a {career} simulation and made these decisions:

{decisions}

Evaluate their performance and suitability for this career.

Return ONLY this JSON:
{
  "matchScore": 78,
  "headline": "One energetic sentence about their performance (no emoji).",
  "strengths": [
    { "skill": "Skill Name", "evidence": "Brief evidence from their choices." }
  ],
  "growthAreas": [
    { "skill": "Skill Name", "advice": "Specific actionable advice." }
  ],
  "careerFit": "2-3 sentences on how well they fit {career} and what path suits them.",
  "relatedCareers": ["Career 1", "Career 2", "Career 3"],
  "roadmapPriorities": ["Priority skill 1", "Priority skill 2", "Priority skill 3"]
}
`,

  roadmap_generation: `
You are a career roadmap advisor. A student wants to become a {career}.

Their strengths: {strengths}
Their growth areas: {growthAreas}

Create a 12-month personalized roadmap.

Return ONLY this JSON:
{
  "profile": {
    "archetype": "The [Archetype Name] (e.g., 'The Analytical Builder')",
    "summary": "2-3 sentences on their unique path to {career}."
  },
  "milestones": [
    {
      "timeframe": "Month 1–2",
      "title": "Milestone title",
      "actions": [
        {
          "type": "course",
          "title": "Course/Resource title",
          "platform": "Platform name",
          "url": "https://example.com",
          "time": "4 hours/week"
        }
      ]
    }
  ]
}
`,
};
