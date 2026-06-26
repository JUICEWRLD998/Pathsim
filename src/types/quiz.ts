export type OptionType = 'card' | 'chip';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  iconName?: string; // Lucide icon name
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
