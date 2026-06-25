# PathSim AI — Full Implementation Plan
> Youth Code x AI Hackathon | Track 04 (Career Planning) + Track 03 (Social Impact)
> Stack: **Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · OpenRouter (Gemini) · D3.js**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Setup](#3-project-setup)
4. [Folder Structure](#4-folder-structure)
5. [Design System (Tailwind + CSS Variables)](#5-design-system-tailwind--css-variables)
6. [Type Definitions](#6-type-definitions)
7. [OpenRouter + Gemini API Layer](#7-openrouter--gemini-api-layer)
8. [State Management (Zustand)](#8-state-management-zustand)
9. [Data Layer — Career Data](#9-data-layer--career-data)
10. [AI Prompt Templates](#10-ai-prompt-templates)
11. [Page & Component Implementation](#11-page--component-implementation)
12. [Career Galaxy (D3.js + React)](#12-career-galaxy-d3js--react)
13. [Simulation Engine](#13-simulation-engine)
14. [48-Hour Build Timeline](#14-48-hour-build-timeline)
15. [Environment Variables](#15-environment-variables)
16. [Deployment (Vercel)](#16-deployment-vercel)
17. [Submission Checklist](#17-submission-checklist)
18. [Pitch Script](#18-pitch-script)

---

## Build Phases

| Phase | Name | Sections | Deliverable |
|-------|------|----------|-------------|
| **Phase 1** | 🏗️ Foundation & Setup | §3 → §5 | Next.js app running locally with design system |
| **Phase 2** | 🧱 Data & AI Layer | §6 → §10 | Types, stores, API proxy, prompts, career data |
| **Phase 3** | 🎯 Core User Flow | §11 (Landing + Quiz + Simulation + Dashboard) | Full quiz → sim → results flow |
| **Phase 4** | 🌌 Galaxy & Roadmap | §11 (Galaxy + Roadmap) + §12 + §13 | Career Galaxy D3 graph + AI roadmap page |
| **Phase 5** | ✨ Polish & Deploy | §14 → §18 | Mobile QA, loading states, Vercel deploy, demo mode |

### Phase Status

- [x] **Phase 1** — Foundation & Setup
- [ ] **Phase 2** — Data & AI Layer
- [ ] **Phase 3** — Core User Flow
- [ ] **Phase 4** — Galaxy & Roadmap
- [ ] **Phase 5** — Polish & Deploy

---

## 1. Project Overview

### Concept

PathSim AI is a **career simulation game** that lets students *play through* realistic, AI-generated scenarios in different careers — making actual decisions that professionals face every day. Instead of reading about careers, students discover what they love by **experiencing it**.

### The Core Loop

```
Student takes 5-question Spark Quiz
        ↓
AI (Gemini via OpenRouter) maps interests → 3 recommended career simulations
        ↓
Student plays "Day in the Life" — 3 branching AI-generated scenarios
        ↓
AI evaluates decisions → match score + skill profile
        ↓
Personalized roadmap: courses, certifications, next steps
        ↓
Career Galaxy — visual graph of all career nodes, unlocking connections
```

### Prize Targets

| Prize                  | Why PathSim Wins It                                              |
|------------------------|------------------------------------------------------------------|
| Best Original Idea     | Career *game*, not another chatbot or quiz                       |
| Best Social Value      | Bridges career exposure gap for first-gen/underserved students   |
| Best UI/UX             | Framer Motion animations + Career Galaxy visualization           |
| Best Presentation      | Judges play it live during pitch — interactive demo              |
| Best in Category       | Directly serves Track 04 (Career Planning)                       |

---

## 2. Tech Stack

| Layer             | Technology                              | Version  | Purpose                                  |
|-------------------|-----------------------------------------|----------|------------------------------------------|
| Framework         | Next.js (App Router)                    | 15.x     | SSR, routing, API routes                 |
| Language          | TypeScript                              | 5.x      | Type safety throughout                   |
| Styling           | Tailwind CSS                            | 3.x      | Utility-first styling                    |
| Animations        | Framer Motion                           | 11.x     | Page transitions, micro-interactions     |
| State Management  | Zustand                                 | 4.x      | Global simulation + quiz state           |
| AI API            | OpenRouter → Gemini 2.0 Flash           | Latest   | Scenario generation + evaluation         |
| Visualization     | D3.js                                   | 7.x      | Career Galaxy force-directed graph       |
| Icons             | Lucide React                            | Latest   | Consistent SVG icon set                  |
| Fonts             | next/font (Inter + Space Grotesk)       | Built-in | Zero layout shift font loading           |
| HTTP Client       | Native fetch (Next.js API Routes)       | —        | Server-side API calls (key stays hidden) |
| Deployment        | Vercel                                  | Free     | One-click deploy, instant HTTPS          |

---

## 3. Project Setup

### Bootstrap the App

```bash
# In c:\Users\fadhm\Desktop\youth\

npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack

# Install dependencies
npm install framer-motion zustand d3 lucide-react
npm install -D @types/d3
```

### Environment Variables

Create `.env.local` at the root:

```env
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security:** API key lives in `.env.local` (never exposed to the browser). All Gemini calls go through a Next.js API route (`/api/gemini`), which acts as a secure proxy.

---

## 4. Folder Structure

```
youth/
├── .env.local                          ← API keys (gitignored)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── implementation.md
│
└── src/
    ├── app/                            ← Next.js App Router
    │   ├── layout.tsx                  ← Root layout (fonts, metadata, providers)
    │   ├── page.tsx                    ← Landing page (/)
    │   ├── globals.css                 ← Tailwind base + CSS custom properties
    │   │
    │   ├── quiz/
    │   │   └── page.tsx                ← Spark Quiz (/quiz)
    │   │
    │   ├── galaxy/
    │   │   └── page.tsx                ← Career Galaxy (/galaxy)
    │   │
    │   ├── simulation/
    │   │   └── page.tsx                ← Simulation game (/simulation)
    │   │
    │   ├── dashboard/
    │   │   └── page.tsx                ← Results dashboard (/dashboard)
    │   │
    │   ├── roadmap/
    │   │   └── page.tsx                ← Skill roadmap (/roadmap)
    │   │
    │   └── api/
    │       └── gemini/
    │           └── route.ts            ← POST /api/gemini (secure proxy)
    │
    ├── components/
    │   ├── ui/                         ← Reusable primitives
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx                ← Glassmorphism card
    │   │   ├── Badge.tsx
    │   │   ├── ProgressBar.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   └── Toast.tsx
    │   │
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   └── PageWrapper.tsx         ← Framer Motion page transition wrapper
    │   │
    │   ├── landing/
    │   │   ├── Hero.tsx
    │   │   ├── HowItWorks.tsx
    │   │   ├── CareerPreviewCards.tsx
    │   │   └── StarField.tsx           ← CSS particle background
    │   │
    │   ├── quiz/
    │   │   ├── QuizCard.tsx
    │   │   ├── OptionChip.tsx
    │   │   └── QuizProgress.tsx
    │   │
    │   ├── galaxy/
    │   │   └── CareerGalaxy.tsx        ← D3.js force graph (client component)
    │   │
    │   ├── simulation/
    │   │   ├── ScenarioCard.tsx
    │   │   ├── ChoiceButton.tsx
    │   │   └── SimulationHeader.tsx
    │   │
    │   ├── dashboard/
    │   │   ├── MatchScoreRing.tsx      ← Animated SVG ring
    │   │   ├── SkillTags.tsx
    │   │   ├── DecisionBreakdown.tsx
    │   │   └── SalaryCard.tsx
    │   │
    │   └── roadmap/
    │       ├── MilestoneTimeline.tsx
    │       └── ResourceCard.tsx
    │
    ├── lib/
    │   ├── api.ts                      ← Client-side fetch wrapper for /api/gemini
    │   ├── prompts.ts                  ← All AI prompt templates
    │   └── utils.ts                    ← Helper functions
    │
    ├── store/
    │   ├── quizStore.ts                ← Zustand: quiz answers
    │   ├── simulationStore.ts          ← Zustand: scenario state + decisions
    │   └── appStore.ts                 ← Zustand: global UI state
    │
    └── types/
        ├── career.ts                   ← Career, Cluster, CareerNode types
        ├── quiz.ts                     ← Question, Answer types
        ├── simulation.ts               ← Scenario, Choice, Decision types
        └── api.ts                      ← API request/response types
```

---

## 5. Design System (Tailwind + CSS Variables)

### `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Backgrounds */
    --bg-void: #040812;
    --bg-deep: #080f1e;
    --bg-card: #0d1829;
    --bg-glass: rgba(13, 24, 41, 0.7);

    /* Primary — Electric Violet */
    --primary: #a855f7;
    --primary-glow: rgba(168, 85, 247, 0.35);

    /* Accent — Cyan */
    --accent: #22d3ee;
    --accent-glow: rgba(6, 182, 212, 0.35);

    /* Text */
    --text-primary: #f8fafc;
    --text-muted: #94a3b8;

    /* Gradient */
    --gradient-cta: linear-gradient(90deg, #a855f7, #22d3ee);
  }

  body {
    background-color: var(--bg-void);
    color: var(--text-primary);
    font-family: var(--font-inter);
  }
}

@layer components {
  /* Glassmorphism */
  .glass-card {
    @apply bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl;
  }

  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent;
  }

  /* Glow button */
  .btn-primary {
    @apply bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold
           px-8 py-3 rounded-full transition-all duration-200
           hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(168,85,247,0.4)]
           active:translate-y-0 cursor-pointer border-none;
  }

  /* Shimmer animation for hero text */
  .shimmer {
    background: linear-gradient(90deg, #a855f7, #22d3ee, #a855f7);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
  50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
}
```

### `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#040812',
        deep: '#080f1e',
        card: '#0d1829',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 4s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 6. Type Definitions

### `src/types/career.ts`

```ts
export type CareerCluster = 'tech' | 'creative' | 'business' | 'science' | 'health' | 'education';

export interface SalaryRange {
  entry: number;
  mid: number;
  senior: number | string;
}

export interface Career {
  id: string;
  title: string;
  emoji: string;
  cluster: CareerCluster;
  color: string;
  description: string;
  salary: SalaryRange;
  skills: string[];
  education: string;
  growthRate: string;
  dayInLife: string;
  relatedTo: string[];
}

export interface CareerClusterMeta {
  label: string;
  color: string;
  icon: string;
}

// D3 node type
export interface CareerNode extends Career {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface CareerLink {
  source: string | CareerNode;
  target: string | CareerNode;
}
```

### `src/types/simulation.ts`

```ts
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
```

### `src/types/quiz.ts`

```ts
export type OptionType = 'card' | 'chip' | 'image-card';

export interface QuizOption {
  id: string;
  label: string;
  emoji?: string;
  description?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle?: string;
  type: OptionType;
  options: QuizOption[];
  multiSelect?: boolean;
}

export interface QuizAnswer {
  questionId: number;
  answer: string | string[];
}
```

### `src/types/api.ts`

```ts
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
  emoji: string;
  whyYou: string;
  matchScore: number;
  salaryRange: string;
  growthTag: string;
}

export interface RecommendationsResponse {
  recommendations: CareerRecommendation[];
  personalityProfile: string;
}

export interface RoadmapMilestone {
  timeframe: string;
  title: string;
  actions: Array<{
    type: string;
    title: string;
    platform: string;
    url: string;
    time: string;
  }>;
}

export interface RoadmapResponse {
  profile: { archetype: string; summary: string };
  milestones: RoadmapMilestone[];
}
```

---

## 7. OpenRouter + Gemini API Layer

### `src/app/api/gemini/route.ts` — Secure Server-Side Proxy

```ts
import { NextRequest, NextResponse } from 'next/server';
import { PROMPTS } from '@/lib/prompts';
import type { GeminiRequest } from '@/types/api';

export async function POST(req: NextRequest) {
  const body: GeminiRequest = await req.json();
  const { promptKey, variables } = body;

  // Build the prompt by substituting variables
  let prompt = PROMPTS[promptKey];
  for (const [key, value] of Object.entries(variables)) {
    prompt = prompt.replaceAll(`{${key}}`, value);
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'PathSim AI',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'system',
          content: 'You are PathSim AI. Always respond with valid JSON only. No markdown, no explanation — pure JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Gemini API error' }, { status: 500 });
  }

  const result = await response.json();
  const raw = result.choices[0].message.content as string;

  // Strip markdown code fences if model wraps in them
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();

  try {
    const data = JSON.parse(cleaned);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response', raw }, { status: 500 });
  }
}
```

### `src/lib/api.ts` — Client-Side Fetch Wrapper

```ts
import type { GeminiRequest, GeminiResponse } from '@/types/api';

export async function callGemini<T>(
  promptKey: GeminiRequest['promptKey'],
  variables: Record<string, string>
): Promise<T> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ promptKey, variables } satisfies GeminiRequest),
  });

  const json: GeminiResponse<T> = await res.json();

  if (!res.ok || json.error || !json.data) {
    throw new Error(json.error ?? 'Unknown API error');
  }

  return json.data;
}
```

---

## 8. State Management (Zustand)

### `src/store/quizStore.ts`

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizAnswer } from '@/types/quiz';
import type { CareerRecommendation } from '@/types/api';

interface QuizStore {
  answers: QuizAnswer[];
  currentQuestion: number;
  recommendations: CareerRecommendation[];
  personalityProfile: string;
  setAnswer: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  setRecommendations: (recs: CareerRecommendation[], profile: string) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      answers: [],
      currentQuestion: 0,
      recommendations: [],
      personalityProfile: '',

      setAnswer: (answer) =>
        set((state) => ({
          answers: [...state.answers.filter((a) => a.questionId !== answer.questionId), answer],
        })),

      nextQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion + 1 })),

      setRecommendations: (recommendations, personalityProfile) =>
        set({ recommendations, personalityProfile }),

      reset: () =>
        set({ answers: [], currentQuestion: 0, recommendations: [], personalityProfile: '' }),
    }),
    { name: 'pathsim-quiz' }
  )
);
```

### `src/store/simulationStore.ts`

```ts
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
  setCareer: (career: Career) => void;
  addScenario: (scenario: Scenario) => void;
  makeDecision: (decision: Decision) => void;
  setOutcome: (outcome: SimulationOutcome) => void;
  setLoading: (loading: boolean) => void;
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

      setCareer: (career) => set({ selectedCareer: career }),
      addScenario: (scenario) => set((s) => ({ scenarios: [...s.scenarios, scenario] })),
      makeDecision: (decision) =>
        set((s) => ({
          decisions: [...s.decisions, decision],
          currentScenario: s.currentScenario + 1,
        })),
      setOutcome: (outcome) => set({ outcome }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () =>
        set({
          selectedCareer: null,
          scenarios: [],
          decisions: [],
          currentScenario: 0,
          outcome: null,
          isLoading: false,
        }),
    }),
    { name: 'pathsim-simulation' }
  )
);
```

---

## 9. Data Layer — Career Data

### `src/lib/data/careers.ts`

```ts
import type { Career, CareerCluster, CareerClusterMeta } from '@/types/career';

export const CAREERS: Record<string, Career> = {
  data_analyst: {
    id: 'data_analyst',
    title: 'Data Analyst',
    emoji: '📊',
    cluster: 'tech',
    color: '#a855f7',
    description: 'Turn raw data into business insights using SQL, Python, and dashboards',
    salary: { entry: 55000, mid: 85000, senior: 130000 },
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
    education: "Bachelor's in Math, CS, or Statistics",
    growthRate: '23% (Much faster than average)',
    dayInLife: 'Analyze datasets, build dashboards, present findings to stakeholders',
    relatedTo: ['software_engineer', 'financial_analyst', 'product_manager'],
  },
  ux_designer: {
    id: 'ux_designer',
    title: 'UX Designer',
    emoji: '🎨',
    cluster: 'creative',
    color: '#22d3ee',
    description: 'Design digital experiences that are intuitive, beautiful, and user-centered',
    salary: { entry: 60000, mid: 95000, senior: 140000 },
    skills: ['Figma', 'User Research', 'Prototyping', 'Usability Testing', 'Design Systems'],
    education: "Bachelor's in Design or HCI",
    growthRate: '8% (Average)',
    dayInLife: 'User interviews, wireframing, prototyping, design reviews',
    relatedTo: ['product_manager', 'software_engineer', 'content_creator'],
  },
  software_engineer: {
    id: 'software_engineer',
    title: 'Software Engineer',
    emoji: '💻',
    cluster: 'tech',
    color: '#10b981',
    description: 'Build the apps, websites, and systems that power the modern world',
    salary: { entry: 80000, mid: 120000, senior: 180000 },
    skills: ['TypeScript', 'React', 'Node.js', 'Algorithms', 'System Design'],
    education: "Bachelor's in CS or bootcamp",
    growthRate: '25% (Much faster than average)',
    dayInLife: 'Write code, code reviews, debugging, deploy features, team meetings',
    relatedTo: ['data_analyst', 'ux_designer', 'product_manager'],
  },
  game_developer: {
    id: 'game_developer',
    title: 'Game Developer',
    emoji: '🎮',
    cluster: 'creative',
    color: '#f59e0b',
    description: 'Create interactive worlds and experiences using game engines and code',
    salary: { entry: 55000, mid: 90000, senior: 140000 },
    skills: ['Unity', 'C#', 'Game Design', '3D Modeling', 'Physics'],
    education: "Bachelor's in CS or Game Design",
    growthRate: '15% (Faster than average)',
    dayInLife: 'Code mechanics, collaborate with artists, test, debug, ship updates',
    relatedTo: ['software_engineer', 'ux_designer', 'content_creator'],
  },
  financial_analyst: {
    id: 'financial_analyst',
    title: 'Financial Analyst',
    emoji: '💰',
    cluster: 'business',
    color: '#ef4444',
    description: 'Analyze financial data to guide investment decisions and business strategy',
    salary: { entry: 60000, mid: 95000, senior: 150000 },
    skills: ['Excel', 'Financial Modeling', 'Accounting', 'Bloomberg', 'Presentation'],
    education: "Bachelor's in Finance, Economics, or Accounting",
    growthRate: '9% (Average)',
    dayInLife: 'Build financial models, analyze markets, prepare reports, client calls',
    relatedTo: ['data_analyst', 'entrepreneur', 'product_manager'],
  },
  content_creator: {
    id: 'content_creator',
    title: 'Content Creator',
    emoji: '🎥',
    cluster: 'creative',
    color: '#ec4899',
    description: 'Build audiences and influence on YouTube, TikTok, podcasts, and beyond',
    salary: { entry: 30000, mid: 75000, senior: 500000 },
    skills: ['Video Editing', 'SEO', 'Storytelling', 'Social Media', 'Brand Deals'],
    education: 'No formal degree required',
    growthRate: '12% (Faster than average)',
    dayInLife: 'Ideate, film/record, edit, publish, engage community, analyze metrics',
    relatedTo: ['ux_designer', 'entrepreneur', 'game_developer'],
  },
  environmental_scientist: {
    id: 'environmental_scientist',
    title: 'Environmental Scientist',
    emoji: '🌿',
    cluster: 'science',
    color: '#10b981',
    description: 'Study and protect the natural world using data, fieldwork, and policy',
    salary: { entry: 50000, mid: 75000, senior: 110000 },
    skills: ['GIS Mapping', 'Data Analysis', 'Field Sampling', 'Report Writing', 'Policy'],
    education: "Bachelor's in Environmental Science or Biology",
    growthRate: '7% (Average)',
    dayInLife: 'Field sampling, lab analysis, environmental impact reports, stakeholder meetings',
    relatedTo: ['data_analyst', 'nurse', 'financial_analyst'],
  },
  cybersecurity_analyst: {
    id: 'cybersecurity_analyst',
    title: 'Cybersecurity Analyst',
    emoji: '🔐',
    cluster: 'tech',
    color: '#f59e0b',
    description: 'Protect organizations from digital threats, hacks, and data breaches',
    salary: { entry: 70000, mid: 100000, senior: 150000 },
    skills: ['Networking', 'Linux', 'Threat Analysis', 'Pen Testing', 'SIEM Tools'],
    education: "Bachelor's in Cybersecurity or CS + certifications",
    growthRate: '32% (Much faster than average)',
    dayInLife: 'Monitor systems, investigate alerts, patch vulnerabilities, incident response',
    relatedTo: ['software_engineer', 'data_analyst', 'product_manager'],
  },
  nurse: {
    id: 'nurse',
    title: 'Registered Nurse',
    emoji: '🩺',
    cluster: 'health',
    color: '#22d3ee',
    description: 'Provide direct patient care and coordinate medical treatment',
    salary: { entry: 55000, mid: 80000, senior: 110000 },
    skills: ['Patient Care', 'Medical Knowledge', 'Communication', 'Critical Thinking', 'EHR'],
    education: "Bachelor's of Science in Nursing (BSN)",
    growthRate: '6% (Faster than average)',
    dayInLife: 'Patient assessments, administering medication, coordinating care, documentation',
    relatedTo: ['environmental_scientist', 'teacher', 'entrepreneur'],
  },
  entrepreneur: {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    emoji: '🚀',
    cluster: 'business',
    color: '#a855f7',
    description: 'Identify problems, build solutions, and create businesses from scratch',
    salary: { entry: 0, mid: 80000, senior: 'Unlimited' },
    skills: ['Problem Solving', 'Sales', 'Product Dev', 'Finance', 'Leadership'],
    education: 'No specific degree — experience + hustle',
    growthRate: 'Self-determined',
    dayInLife: 'Customer calls, product decisions, fundraising, team building, pitching',
    relatedTo: ['product_manager', 'financial_analyst', 'content_creator'],
  },
  teacher: {
    id: 'teacher',
    title: 'Educator',
    emoji: '📚',
    cluster: 'education',
    color: '#ec4899',
    description: 'Shape the next generation through engaging, evidence-based teaching',
    salary: { entry: 40000, mid: 60000, senior: 85000 },
    skills: ['Curriculum Design', 'Communication', 'Classroom Management', 'EdTech', 'Patience'],
    education: "Bachelor's in Education + certification",
    growthRate: '4% (Average)',
    dayInLife: 'Lesson planning, teaching, grading, parent comms, professional development',
    relatedTo: ['nurse', 'content_creator', 'ux_designer'],
  },
  product_manager: {
    id: 'product_manager',
    title: 'Product Manager',
    emoji: '🧩',
    cluster: 'tech',
    color: '#f97316',
    description: 'Define what gets built and why — bridge between users, engineers, and business',
    salary: { entry: 85000, mid: 130000, senior: 200000 },
    skills: ['Strategy', 'Data Analysis', 'Communication', 'Roadmapping', 'User Research'],
    education: "Bachelor's in any field + experience",
    growthRate: '10% (Faster than average)',
    dayInLife: 'Prioritize features, write specs, sync with engineers, analyze metrics',
    relatedTo: ['ux_designer', 'software_engineer', 'data_analyst'],
  },
};

export const CAREER_CLUSTERS: Record<string, CareerClusterMeta> = {
  tech: { label: 'Technology', color: '#a855f7', icon: '💻' },
  creative: { label: 'Creative', color: '#22d3ee', icon: '🎨' },
  business: { label: 'Business', color: '#ef4444', icon: '💼' },
  science: { label: 'Science', color: '#10b981', icon: '🔬' },
  health: { label: 'Health', color: '#06b6d4', icon: '🩺' },
  education: { label: 'Education', color: '#ec4899', icon: '📚' },
};
```

---

## 10. AI Prompt Templates

### `src/lib/prompts.ts`

```ts
export const PROMPTS: Record<string, string> = {

  career_recommendation: `
You are PathSim AI, a career exploration assistant for high school students.
Based on the student's quiz answers, recommend exactly 3 careers to simulate.

Available careers: data_analyst, ux_designer, software_engineer, game_developer,
financial_analyst, content_creator, environmental_scientist, cybersecurity_analyst,
nurse, entrepreneur, teacher, product_manager

Student quiz answers: {QUIZ_ANSWERS}

Return this exact JSON structure:
{
  "recommendations": [
    {
      "id": "data_analyst",
      "title": "Data Analyst",
      "emoji": "📊",
      "whyYou": "One sentence explaining why this matches their answers",
      "matchScore": 92,
      "salaryRange": "$65,000 – $120,000",
      "growthTag": "High Demand"
    }
  ],
  "personalityProfile": "A 2-sentence profile of the student based on their answers"
}
`,

  scenario_generation: `
You are generating a realistic "Day in the Life" scenario for a student simulating: {CAREER_TITLE}
This is scenario {SCENARIO_NUMBER} of 3.
Previous decisions: {HISTORY}

Generate a specific, domain-accurate workplace scenario:
- Use real tools and terminology for this career
- Create genuine tension or a problem to solve
- Offer 4 distinct choices — no single obviously correct answer
- Choices should reflect different professional approaches

Return this exact JSON:
{
  "scenario": {
    "setting": "Brief context (e.g., 'Monday morning standup, startup office')",
    "situation": "2-3 sentences describing a specific challenge",
    "options": [
      { "id": "A", "text": "20-30 word option text", "approach": "analytical" },
      { "id": "B", "text": "20-30 word option text", "approach": "creative" },
      { "id": "C", "text": "20-30 word option text", "approach": "collaborative" },
      { "id": "D", "text": "20-30 word option text", "approach": "systematic" }
    ]
  }
}
`,

  outcome_evaluation: `
You are evaluating a student's career simulation performance.
Career simulated: {CAREER_TITLE}
Their 3 decisions:
{DECISION_HISTORY}

Analyze their decision patterns and generate a personalized outcome report.

Return this exact JSON:
{
  "matchScore": 85,
  "headline": "You think like a [specific professional archetype]",
  "strengths": [
    { "skill": "Critical Thinking", "evidence": "You consistently chose to analyze before acting" }
  ],
  "growthAreas": [
    { "skill": "Communication", "advice": "In scenarios 2 and 3, you avoided collaborative options" }
  ],
  "careerFit": "3 sentences describing how well this career fits them and why",
  "relatedCareers": ["UX Researcher", "Business Intelligence Analyst", "Product Manager"],
  "roadmapPriorities": ["Learn SQL", "Build a portfolio project", "Try Kaggle competitions"]
}
`,

  roadmap_generation: `
You are a career coach for high school students. Create a specific, actionable learning roadmap.

Career explored: {CAREER_TITLE}
Match score: {MATCH_SCORE}%
Strengths: {STRENGTHS}
Growth areas: {GROWTH_AREAS}

Return this exact JSON:
{
  "profile": {
    "archetype": "The Analytical Builder",
    "summary": "2 sentences describing this student's unique strengths and approach"
  },
  "milestones": [
    {
      "timeframe": "This Week",
      "title": "Get Your Bearings",
      "actions": [
        {
          "type": "free_resource",
          "title": "Resource name",
          "platform": "Platform (Free)",
          "url": "https://example.com",
          "time": "Estimated time commitment"
        }
      ]
    },
    { "timeframe": "3 Months", "title": "Build Your Foundation", "actions": [...] },
    { "timeframe": "6 Months", "title": "Create Something Real", "actions": [...] },
    { "timeframe": "1 Year", "title": "Go Public", "actions": [...] }
  ]
}
`,
};
```

---

## 11. Page & Component Implementation

### Root Layout — `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'PathSim AI — Play Your Future Before You Choose It',
  description: 'Career simulation game powered by AI. Discover careers by experiencing them.',
  keywords: ['career', 'AI', 'simulation', 'students', 'education'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-void text-white font-body antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

### Landing Page — `src/app/page.tsx`

```tsx
'use client';
import { motion } from 'framer-motion';
import { StarField } from '@/components/landing/StarField';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CareerPreviewCards } from '@/components/landing/CareerPreviewCards';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-void">
      <StarField />
      <Hero />
      <HowItWorks />
      <CareerPreviewCards />
    </main>
  );
}
```

### Hero Component — `src/components/landing/Hero.tsx`

```tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30
                     bg-purple-500/10 text-purple-300 text-sm font-medium mb-8"
        >
          🎮 AI Career Simulation · Youth Code x AI Hackathon
        </motion.span>

        <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-6">
          Play Your Future{' '}
          <span className="shimmer">Before You Choose It</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Stop reading about careers. Start experiencing them. PathSim AI generates
          realistic scenarios from real workplaces — and discovers what you love
          by watching how you think.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/quiz">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-lg px-10 py-4"
            >
              🚀 Start Simulation
            </motion.button>
          </Link>
          <Link href="/galaxy">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 rounded-full border border-purple-500/40 text-purple-300
                         hover:bg-purple-500/10 transition-all duration-200 text-lg font-semibold"
            >
              🌌 Explore Galaxy
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
```

### Quiz Page — `src/app/quiz/page.tsx`

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/quizStore';
import { QUIZ_QUESTIONS } from '@/lib/data/questions';
import { QuizCard } from '@/components/quiz/QuizCard';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { callGemini } from '@/lib/api';
import type { RecommendationsResponse } from '@/types/api';

export default function QuizPage() {
  const router = useRouter();
  const { currentQuestion, answers, setAnswer, nextQuestion, setRecommendations } = useQuizStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1;

  const handleAnswer = async (answer: string) => {
    setAnswer({ questionId: question.id, answer });

    if (isLastQuestion) {
      setIsSubmitting(true);
      const quizSummary = [...answers, { questionId: question.id, answer }]
        .map((a) => `Q${a.questionId}: ${a.answer}`)
        .join(' | ');

      try {
        const result = await callGemini<RecommendationsResponse>('career_recommendation', {
          QUIZ_ANSWERS: quizSummary,
        });
        setRecommendations(result.recommendations, result.personalityProfile);
        router.push('/simulation');
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    } else {
      nextQuestion();
    }
  };

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        <QuizProgress current={currentQuestion + 1} total={QUIZ_QUESTIONS.length} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <QuizCard
              question={question}
              onAnswer={handleAnswer}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
```

### Simulation Page — `src/app/simulation/page.tsx`

```tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '@/store/simulationStore';
import { useQuizStore } from '@/store/quizStore';
import { callGemini } from '@/lib/api';
import { CAREERS } from '@/lib/data/careers';
import { ScenarioCard } from '@/components/simulation/ScenarioCard';
import { ChoiceButton } from '@/components/simulation/ChoiceButton';
import { SimulationHeader } from '@/components/simulation/SimulationHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Scenario } from '@/types/simulation';

export default function SimulationPage() {
  const router = useRouter();
  const { recommendations } = useQuizStore();
  const {
    selectedCareer, setCareer, scenarios, addScenario,
    decisions, makeDecision, currentScenario,
    setOutcome, setLoading, isLoading,
  } = useSimulationStore();

  // Auto-select top recommended career if none selected
  useEffect(() => {
    if (!selectedCareer && recommendations[0]) {
      const career = CAREERS[recommendations[0].id];
      if (career) setCareer(career);
    }
  }, []);

  // Load the next scenario when currentScenario changes
  useEffect(() => {
    if (!selectedCareer) return;
    if (scenarios.length > currentScenario) return; // already loaded
    if (currentScenario >= 3) return; // done

    const fetchScenario = async () => {
      setLoading(true);
      const history = decisions
        .map((d, i) => `Scenario ${i + 1}: ${d.approach} approach — "${d.choiceText}"`)
        .join('\n') || 'None yet';

      const result = await callGemini<{ scenario: Scenario }>('scenario_generation', {
        CAREER_TITLE: selectedCareer.title,
        SCENARIO_NUMBER: String(currentScenario + 1),
        HISTORY: history,
      });

      addScenario(result.scenario);
      setLoading(false);
    };

    fetchScenario();
  }, [currentScenario, selectedCareer]);

  // All 3 scenarios done — evaluate outcome
  useEffect(() => {
    if (currentScenario === 3 && decisions.length === 3 && selectedCareer) {
      const history = decisions
        .map((d, i) => `Scenario ${i + 1}: ${d.approach} — "${d.choiceText}"`)
        .join('\n');

      callGemini('outcome_evaluation', {
        CAREER_TITLE: selectedCareer.title,
        DECISION_HISTORY: history,
      }).then((outcome: unknown) => {
        setOutcome(outcome as ReturnType<typeof setOutcome> extends (o: infer O) => void ? O : never);
        router.push('/dashboard');
      });
    }
  }, [currentScenario]);

  const handleChoice = (choiceId: string) => {
    const scenario = scenarios[currentScenario];
    const option = scenario.options.find((o) => o.id === choiceId)!;
    makeDecision({
      scenarioIndex: currentScenario,
      choiceId,
      choiceText: option.text,
      approach: option.approach,
    });
  };

  if (!selectedCareer) return <LoadingSpinner label="Loading your career..." />;
  if (isLoading) return <LoadingSpinner label="AI is building your scenario..." />;

  const scenario = scenarios[currentScenario];
  if (!scenario) return <LoadingSpinner label="Preparing scenario..." />;

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl space-y-8">
        <SimulationHeader
          career={selectedCareer}
          current={currentScenario + 1}
          total={3}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <ScenarioCard scenario={scenario} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scenario.options.map((option, i) => (
                <ChoiceButton
                  key={option.id}
                  option={option}
                  delay={i * 0.1}
                  onClick={() => handleChoice(option.id)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
```

### Dashboard Page — `src/app/dashboard/page.tsx`

```tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSimulationStore } from '@/store/simulationStore';
import { MatchScoreRing } from '@/components/dashboard/MatchScoreRing';
import { SkillTags } from '@/components/dashboard/SkillTags';
import { DecisionBreakdown } from '@/components/dashboard/DecisionBreakdown';
import { SalaryCard } from '@/components/dashboard/SalaryCard';

export default function DashboardPage() {
  const router = useRouter();
  const { outcome, selectedCareer, decisions } = useSimulationStore();

  useEffect(() => {
    if (!outcome) router.replace('/quiz');
  }, [outcome]);

  if (!outcome || !selectedCareer) return null;

  return (
    <main className="min-h-screen bg-void px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-purple-400 text-sm font-medium mb-2">Simulation Complete</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {outcome.headline}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">{outcome.careerFit}</p>
        </motion.div>

        {/* Score + Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MatchScoreRing score={outcome.matchScore} career={selectedCareer.title} />
          <SalaryCard career={selectedCareer} />
        </div>

        {/* Strengths */}
        <SkillTags strengths={outcome.strengths} growthAreas={outcome.growthAreas} />

        {/* Decision Breakdown */}
        <DecisionBreakdown decisions={decisions} scenarios={useSimulationStore.getState().scenarios} />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/roadmap">
            <button className="btn-primary text-lg px-10 py-4">
              🗺️ Get My Roadmap
            </button>
          </Link>
          <Link href="/galaxy">
            <button className="px-10 py-4 rounded-full border border-purple-500/40 text-purple-300
                               hover:bg-purple-500/10 transition-all duration-200 text-lg font-semibold">
              🌌 Explore More Careers
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
```

---

## 12. Career Galaxy (D3.js + React)

### `src/components/galaxy/CareerGalaxy.tsx`

> This must be a `'use client'` component using `useEffect` to mount D3 after hydration.

```tsx
'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';
import { CAREERS, CAREER_CLUSTERS } from '@/lib/data/careers';
import { useSimulationStore } from '@/store/simulationStore';
import type { CareerNode, CareerLink } from '@/types/career';

export function CareerGalaxy() {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const { setCareer } = useSimulationStore();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear on re-render

    const defs = svg.append('defs');

    // Radial gradient background
    const bg = defs.append('radialGradient').attr('id', 'bg-grad');
    bg.append('stop').attr('offset', '0%').attr('stop-color', '#0d1829');
    bg.append('stop').attr('offset', '100%').attr('stop-color', '#040812');
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', 'url(#bg-grad)');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const merge = filter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'coloredBlur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const nodes: CareerNode[] = Object.values(CAREERS).map((c) => ({ ...c }));
    const links: CareerLink[] = [];
    Object.values(CAREERS).forEach((career) => {
      career.relatedTo.forEach((relId) => {
        if (CAREERS[relId]) links.push({ source: career.id, target: relId });
      });
    });

    const sim = d3
      .forceSimulation<CareerNode>(nodes)
      .force('link', d3.forceLink<CareerNode, CareerLink>(links).id((d) => d.id).distance(130))
      .force('charge', d3.forceManyBody<CareerNode>().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<CareerNode>().radius(50));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(168,85,247,0.2)')
      .attr('stroke-width', 1.5);

    const nodeG = svg
      .append('g')
      .selectAll<SVGGElement, CareerNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'career-node cursor-pointer')
      .call(
        d3
          .drag<SVGGElement, CareerNode>()
          .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on('click', (_e, d) => {
        setCareer(d);
        router.push('/simulation');
      });

    nodeG
      .append('circle')
      .attr('r', 28)
      .attr('fill', (d) => `${CAREER_CLUSTERS[d.cluster]?.color}25`)
      .attr('stroke', (d) => CAREER_CLUSTERS[d.cluster]?.color ?? '#a855f7')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)');

    nodeG
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '18px')
      .text((d) => d.emoji);

    nodeG
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 40)
      .attr('fill', 'rgba(248,250,252,0.75)')
      .attr('font-size', '11px')
      .attr('font-family', 'Inter, sans-serif')
      .text((d) => d.title);

    sim.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as CareerNode).x ?? 0)
        .attr('y1', (d) => (d.source as CareerNode).y ?? 0)
        .attr('x2', (d) => (d.target as CareerNode).x ?? 0)
        .attr('y2', (d) => (d.target as CareerNode).y ?? 0);
      nodeG.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => { sim.stop(); };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ minHeight: '80vh' }}
    />
  );
}
```

---

## 13. Simulation Engine

The simulation engine is managed entirely through the **Zustand `simulationStore`** and the **`/simulation/page.tsx`** page component using `useEffect` hooks to orchestrate API calls at the right time.

### Flow Summary

```
1. User selects career (from quiz recommendations or galaxy)
   → simulationStore.setCareer(career)

2. /simulation/page.tsx mounts
   → useEffect: fetch scenario 1 via callGemini('scenario_generation')
   → addScenario(result)

3. User picks choice A/B/C/D
   → makeDecision(decision)
   → currentScenario increments to 1

4. useEffect re-fires (currentScenario changed)
   → fetch scenario 2 (with previous decision as history)

5. Repeat for scenario 3

6. After decision 3, currentScenario === 3
   → fetch outcome via callGemini('outcome_evaluation')
   → setOutcome(result)
   → router.push('/dashboard')
```

---

## 14. 48-Hour Build Timeline

| Hours  | Tasks                                                                 | Files                                    |
|--------|-----------------------------------------------------------------------|------------------------------------------|
| 0–1    | `npx create-next-app`, install deps, set up env vars                 | Project bootstrap                        |
| 1–2    | `globals.css` design system, `tailwind.config.ts`, font setup        | Design tokens                            |
| 2–3    | Root layout, Navbar, PageWrapper, reusable UI components             | `layout/`, `ui/`                         |
| 3–5    | Landing page: Hero, StarField, HowItWorks, CareerPreviewCards        | `app/page.tsx`, `components/landing/`    |
| 5–7    | Type definitions (all types in `src/types/`)                         | `types/*.ts`                             |
| 7–9    | `CAREERS` data, `QUIZ_QUESTIONS` data                                | `lib/data/careers.ts`, `questions.ts`    |
| 9–10   | AI prompt templates                                                  | `lib/prompts.ts`                         |
| 10–12  | `/api/gemini/route.ts` (secure server proxy), `lib/api.ts` client    | API layer                                |
| 12–14  | Zustand stores: `quizStore`, `simulationStore`, `appStore`           | `store/*.ts`                             |
| 14–17  | Spark Quiz page + components (QuizCard, OptionChip, QuizProgress)    | `app/quiz/`, `components/quiz/`          |
| 17–20  | Simulation page + components + engine (AI fetch, decisions)          | `app/simulation/`, `components/simulation/` |
| 20–23  | **Career Galaxy** D3.js force graph (full implementation)            | `app/galaxy/`, `components/galaxy/`      |
| 23–26  | Dashboard page: MatchScoreRing, SkillTags, DecisionBreakdown         | `app/dashboard/`, `components/dashboard/` |
| 26–29  | Roadmap page: MilestoneTimeline, AI roadmap generation              | `app/roadmap/`, `components/roadmap/`    |
| 29–32  | Full E2E flow testing (quiz → sim → dashboard → roadmap → galaxy)    | All pages                                |
| 32–35  | Mobile responsiveness audit (all breakpoints), Framer Motion polish  | All components                           |
| 35–37  | Loading states, error boundaries, toast notifications                | `ui/` components                         |
| 37–39  | Deploy to Vercel, test live URL                                      | Deployment                               |
| 39–41  | Demo Mode: pre-cached AI responses for offline pitch                | `lib/api.ts`                             |
| 41–43  | Demo video recording (3 min)                                        | External                                 |
| 43–45  | Pitch deck (10 slides, Canva/Figma)                                 | External                                 |
| 45–47  | Devpost writeup + supplementary materials                           | Devpost                                  |
| 47–48  | Buffer: bug fixes, final polish, submission confirmation            | —                                        |

### Priority Tiers (If Time Runs Short)

**Must Ship (MVP):**
- Landing page
- Spark Quiz + AI career recommendations
- Simulation engine (3 scenarios)
- Dashboard results

**Should Ship:**
- Career Galaxy visualization
- Roadmap generator
- Vercel deployment

**Nice to Have:**
- Demo Mode (offline caching)
- Share/export roadmap card
- Cluster filter on Galaxy

---

## 15. Environment Variables

### `.env.local`

```env
# OpenRouter API Key (never exposed to browser — stays server-side only)
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY_HERE

# App URL (used in OpenRouter HTTP-Referer header)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### `.gitignore` additions

```
.env.local
.env*.local
```

### Vercel Environment Variables (Production)

In Vercel dashboard → Project Settings → Environment Variables:
- `OPENROUTER_API_KEY` → your key
- `NEXT_PUBLIC_APP_URL` → `https://pathsim-ai.vercel.app`

---

## 16. Deployment (Vercel)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "PathSim AI - Youth Code x AI Hackathon"
git remote add origin https://github.com/YOUR_USERNAME/pathsim-ai.git
git push -u origin main

# 2. Deploy to Vercel (free)
npx vercel --prod
# → Follow CLI prompts
# → Your live URL: https://pathsim-ai.vercel.app

# Or: connect GitHub repo at vercel.com for automatic CI/CD deploys
```

---

## 17. Submission Checklist

### Technical
- [ ] All pages render without TypeScript errors (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] All pages are mobile-responsive (tested at 375px)
- [ ] API key is **never** exposed in the browser (all calls through `/api/gemini`)
- [ ] Demo Mode works for offline pitch
- [ ] Deployed live on Vercel with working URL

### Devpost
- [ ] **Title:** PathSim AI — Play Your Future Before You Choose It
- [ ] **Track:** Track 04 (Career Planning) primary, Track 03 (Social Impact) secondary
- [ ] 3-minute demo video (screen record with voiceover)
- [ ] GitHub repo link (public)
- [ ] All prize categories checked (Original Idea, Social Value, UI/UX, Best in Category)
- [ ] Team info complete

### Demo Video Script (3 Minutes)
```
0:00–0:20  Problem: "Career planning is broken for students — it's PDFs and old quizzes"
0:20–0:50  Show landing page — explain the concept in one sentence
0:50–1:30  Live: Take the 5-question Spark Quiz → show AI recommendations
1:30–2:10  Live: Play through a simulation scenario → pick a choice
2:10–2:30  Show Dashboard → match score ring, strengths, roadmap preview
2:30–2:45  Career Galaxy — drag nodes, show the network of career connections
2:45–3:00  Close: "PathSim AI. Built by a student, for every student."
```

---

## 18. Pitch Script

### Opening Hook (15 seconds)
> *"Raise your hand if someone has told you to 'just figure out what you want to do.' Keep your hand up if you have no idea how to do that."*

### Problem (30 seconds)
> *"Career exploration for our generation is still old aptitude tests and 40-page PDFs. The students who figure it out are the ones who already have connections — which means first-gen students and students from underserved communities fall further behind. That's a systems problem. We built a solution."*

### Solution (45 seconds)
> *"PathSim AI doesn't tell you what career to pick — it lets you play through it. You answer 5 questions, and within seconds our AI builds you a real 'Day in the Life' simulation. 'Your manager just dropped 50,000 rows of data — what do you do first?' You make choices. The AI watches how you think. Then it tells you what career actually fits the way your brain works, and exactly what to do next."*

### Live Demo (60 seconds)
> *"Let me show you right now." [Walk through: quiz → AI recommendation → scenario choice → dashboard → galaxy]*

### Why It Matters (30 seconds)
> *"Every student who plays PathSim AI walks away knowing what a real day in that career actually feels like. That's more valuable than any quiz — because you didn't read about it. You lived it."*

### Close (15 seconds)
> *"PathSim AI. Built by a student. For every student who's ever been told to just figure it out. Thank you."*

---

## Quick Reference

| Resource | URL |
|---|---|
| OpenRouter API Docs | https://openrouter.ai/docs |
| Gemini 2.0 Flash (Free) | `google/gemini-2.0-flash-exp:free` |
| Next.js App Router Docs | https://nextjs.org/docs/app |
| Framer Motion Docs | https://www.framer.com/motion |
| Zustand Docs | https://zustand-demo.pmnd.rs |
| D3.js v7 Docs | https://d3js.org |
| Lucide React Icons | https://lucide.dev/guide/packages/lucide-react |
| Vercel Deploy | https://vercel.com |

---

*PathSim AI · Youth Code x AI Hackathon 2026 · "Play Your Future Before You Choose It"*
