export type CareerCluster = 'tech' | 'creative' | 'business' | 'science' | 'health' | 'education';

export interface SalaryRange {
  entry: number;
  mid: number;
  senior: number | string;
}

export interface Career {
  id: string;
  title: string;
  cluster: CareerCluster;
  color: string;
  description: string;
  salary: SalaryRange;
  skills: string[];
  education: string;
  growthRate: string;
  dayInLife: string;
  relatedTo: string[];
  iconName: string; // Lucide icon name
}

export interface CareerClusterMeta {
  label: string;
  color: string;
  iconName: string;
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
