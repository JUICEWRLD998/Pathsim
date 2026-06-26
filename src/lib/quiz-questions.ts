import type { QuizQuestion } from '@/types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'When you have a free afternoon, what pulls you in?',
    subtitle: 'There are no wrong answers — just honest ones.',
    type: 'card',
    options: [
      {
        id: 'build',
        label: 'Building something',
        description: 'Coding, constructing, designing a prototype',
        iconName: 'Hammer',
      },
      {
        id: 'explore',
        label: 'Exploring ideas',
        description: 'Reading, researching, watching documentaries',
        iconName: 'Compass',
      },
      {
        id: 'help',
        label: 'Helping others',
        description: 'Tutoring, volunteering, listening',
        iconName: 'Heart',
      },
      {
        id: 'create',
        label: 'Creating art',
        description: 'Drawing, writing, making music or video',
        iconName: 'Palette',
      },
    ],
  },
  {
    id: 2,
    question: 'A problem lands on your desk. What\'s your first move?',
    subtitle: 'How you approach challenges tells us a lot.',
    type: 'card',
    options: [
      {
        id: 'data',
        label: 'Gather data',
        description: 'Research the facts before deciding anything',
        iconName: 'Search',
      },
      {
        id: 'brainstorm',
        label: 'Brainstorm ideas',
        description: 'Generate lots of creative solutions first',
        iconName: 'Lightbulb',
      },
      {
        id: 'team',
        label: 'Talk to the team',
        description: 'Get everyone\'s input before moving forward',
        iconName: 'Users',
      },
      {
        id: 'plan',
        label: 'Build a plan',
        description: 'Structure the approach step by step',
        iconName: 'ListChecks',
      },
    ],
  },
  {
    id: 3,
    question: 'Which kind of impact motivates you most?',
    subtitle: 'Your "why" shapes your ideal career.',
    type: 'card',
    options: [
      {
        id: 'innovate',
        label: 'Innovating technology',
        description: 'Pushing what\'s possible forward',
        iconName: 'Zap',
      },
      {
        id: 'heal',
        label: 'Improving health',
        description: 'Making people feel better, live longer',
        iconName: 'HeartPulse',
      },
      {
        id: 'educate',
        label: 'Educating others',
        description: 'Growing minds, opening doors',
        iconName: 'GraduationCap',
      },
      {
        id: 'sustain',
        label: 'Protecting the planet',
        description: 'Environmental and social sustainability',
        iconName: 'Leaf',
      },
    ],
  },
  {
    id: 4,
    question: 'Which work environment energizes you?',
    subtitle: 'Environment affects performance more than most people realize.',
    type: 'chip',
    options: [
      { id: 'startup', label: 'Fast-paced startup', iconName: 'Rocket' },
      { id: 'corporate', label: 'Structured corporation', iconName: 'Building2' },
      { id: 'remote', label: 'Remote & independent', iconName: 'Wifi' },
      { id: 'lab', label: 'Research lab', iconName: 'FlaskConical' },
      { id: 'school', label: 'School or clinic', iconName: 'BookOpen' },
      { id: 'studio', label: 'Creative studio', iconName: 'Layers' },
    ],
  },
  {
    id: 5,
    question: 'Which skills come naturally to you?',
    subtitle: 'Pick all that feel authentic — not aspirational.',
    type: 'chip',
    multiSelect: true,
    options: [
      { id: 'logic', label: 'Logical thinking', iconName: 'Brain' },
      { id: 'empathy', label: 'Empathy', iconName: 'Heart' },
      { id: 'writing', label: 'Writing & storytelling', iconName: 'PenLine' },
      { id: 'numbers', label: 'Numbers & analysis', iconName: 'BarChart3' },
      { id: 'leadership', label: 'Leading teams', iconName: 'Users' },
      { id: 'hands', label: 'Hands-on making', iconName: 'Wrench' },
      { id: 'visual', label: 'Visual thinking', iconName: 'Eye' },
      { id: 'communication', label: 'Public speaking', iconName: 'Mic' },
    ],
  },
];
