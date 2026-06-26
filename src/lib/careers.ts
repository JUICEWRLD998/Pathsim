import type { Career, CareerClusterMeta, CareerCluster } from '@/types/career';

export const CLUSTER_META: Record<CareerCluster, CareerClusterMeta> = {
  tech: { label: 'Technology', color: '#818cf8', iconName: 'Cpu' },
  creative: { label: 'Creative', color: '#f472b6', iconName: 'Palette' },
  business: { label: 'Business', color: '#fb923c', iconName: 'TrendingUp' },
  science: { label: 'Science', color: '#34d399', iconName: 'FlaskConical' },
  health: { label: 'Healthcare', color: '#f87171', iconName: 'HeartPulse' },
  education: { label: 'Education', color: '#fbbf24', iconName: 'GraduationCap' },
};

export const CAREERS: Career[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    cluster: 'tech',
    color: '#818cf8',
    description: 'Build the systems and products that power the modern world.',
    salary: { entry: 75000, mid: 110000, senior: 160000 },
    skills: ['Problem Solving', 'System Design', 'Algorithms', 'Collaboration'],
    education: 'CS degree or bootcamp',
    growthRate: '+25% by 2030',
    dayInLife: 'Design, code, review, and ship features in a collaborative team.',
    relatedTo: ['ux-designer', 'data-scientist', 'product-manager', 'cybersecurity-analyst', 'ai-researcher'],
    iconName: 'Code2',
    videos: [
      { title: 'Software Developers Career Video', embedId: 'Hl5K33bE4tM', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Google Software Engineer', embedId: 'n42UaYJb7f0', channelTitle: 'Joma Tech' }
    ]
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    cluster: 'creative',
    color: '#f472b6',
    description: 'Shape how millions of people interact with technology.',
    salary: { entry: 60000, mid: 90000, senior: 130000 },
    skills: ['Empathy', 'Visual Design', 'Prototyping', 'User Research'],
    education: 'Design degree or portfolio',
    growthRate: '+16% by 2030',
    dayInLife: 'Research user needs, sketch flows, prototype interfaces, and test solutions.',
    relatedTo: ['software-engineer', 'product-manager', 'graphic-designer', 'game-designer'],
    iconName: 'Layers',
    videos: [
      { title: 'What Does a UX Designer Do?', embedId: 'vBstG2Q1JtQ', channelTitle: 'Lillian Chiu' },
      { title: 'UX/UI Designer Career Profile', embedId: 'fS_49z9wV28', channelTitle: 'CareerOneStop' }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    cluster: 'tech',
    color: '#818cf8',
    description: 'Extract insight from data to drive billion-dollar decisions.',
    salary: { entry: 80000, mid: 120000, senior: 180000 },
    skills: ['Statistics', 'Machine Learning', 'Python', 'Communication'],
    education: 'Statistics or CS degree',
    growthRate: '+36% by 2030',
    dayInLife: 'Clean datasets, build predictive models, and present findings to leadership.',
    relatedTo: ['software-engineer', 'financial-analyst', 'biomedical-engineer', 'ai-researcher'],
    iconName: 'BarChart3',
    videos: [
      { title: 'Data Scientists Career Profile', embedId: 'Kz7vF49uKiw', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Data Scientist', embedId: 'qf7O25-1H9U', channelTitle: 'Luke Barousse' }
    ]
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    cluster: 'business',
    color: '#fb923c',
    description: 'Lead cross-functional teams to ship products users love.',
    salary: { entry: 85000, mid: 130000, senior: 200000 },
    skills: ['Strategy', 'Communication', 'Prioritization', 'Empathy'],
    education: 'Business or any technical degree',
    growthRate: '+10% by 2030',
    dayInLife: 'Define product vision, coordinate engineers and designers, remove blockers.',
    relatedTo: ['software-engineer', 'ux-designer', 'data-scientist', 'marketing-manager'],
    iconName: 'Target',
    videos: [
      { title: 'Day in the Life of a PM', embedId: '7g1lJpQD26M', channelTitle: 'PM School' },
      { title: 'What is Product Management?', embedId: 'xP2fW_5nKj8', channelTitle: 'Google Careers' }
    ]
  },
  {
    id: 'biomedical-engineer',
    title: 'Biomedical Engineer',
    cluster: 'science',
    color: '#34d399',
    description: 'Design technology that saves lives at the intersection of medicine and engineering.',
    salary: { entry: 60000, mid: 95000, senior: 140000 },
    skills: ['Biology', 'Engineering', 'Critical Thinking', 'Research'],
    education: 'Biomedical Engineering degree',
    growthRate: '+10% by 2030',
    dayInLife: 'Design medical devices, run clinical tests, and collaborate with surgeons.',
    relatedTo: ['doctor', 'data-scientist', 'environmental-scientist', 'nurse-practitioner'],
    iconName: 'Activity',
    videos: [
      { title: 'Biomedical Engineers Career Profile', embedId: 'tK31uH5oFjA', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Bio-Engineer', embedId: 't2Jp7zK5X8A', channelTitle: 'Bio-Engineering Vlogs' }
    ]
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    cluster: 'creative',
    color: '#f472b6',
    description: 'Communicate ideas visually — from brand identity to digital campaigns.',
    salary: { entry: 45000, mid: 65000, senior: 95000 },
    skills: ['Visual Thinking', 'Typography', 'Color Theory', 'Adobe Suite'],
    education: 'Design degree or strong portfolio',
    growthRate: '+3% by 2030',
    dayInLife: 'Design brand materials, collaborate with marketing, and iterate on feedback.',
    relatedTo: ['ux-designer', 'architect', 'product-manager', 'game-designer'],
    iconName: 'PenTool',
    videos: [
      { title: 'Graphic Designers Career Profile', embedId: 'a7G006G-w9g', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Graphic Designer', embedId: 'x-G3D8aJ0o4', channelTitle: 'Creative Spaces' }
    ]
  },
  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    cluster: 'business',
    color: '#fb923c',
    description: 'Translate numbers into strategy for corporations and investors.',
    salary: { entry: 60000, mid: 90000, senior: 140000 },
    skills: ['Financial Modeling', 'Excel/SQL', 'Critical Thinking', 'Communication'],
    education: 'Finance or Economics degree',
    growthRate: '+9% by 2030',
    dayInLife: 'Build financial models, analyze market trends, and present investment cases.',
    relatedTo: ['product-manager', 'data-scientist', 'lawyer'],
    iconName: 'DollarSign',
    videos: [
      { title: 'Financial Analysts Career Video', embedId: 'qD8kP_yIoOI', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Finance Analyst', embedId: '1tVn9Y42Lq0', channelTitle: 'WallStreetPrep' }
    ]
  },
  {
    id: 'doctor',
    title: 'Physician',
    cluster: 'health',
    color: '#f87171',
    description: 'Diagnose, treat, and transform patients\' lives with expertise and compassion.',
    salary: { entry: 80000, mid: 200000, senior: '300K+' },
    skills: ['Medical Knowledge', 'Empathy', 'Decision-making', 'Communication'],
    education: 'Medical degree (MD/DO)',
    growthRate: '+3% by 2030',
    dayInLife: 'Examine patients, diagnose conditions, prescribe treatment, and coordinate care.',
    relatedTo: ['biomedical-engineer', 'teacher', 'nurse-practitioner', 'psychologist'],
    iconName: 'Stethoscope',
    videos: [
      { title: 'Physicians Career Video Profile', embedId: '2wX8sL8237s', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of an ER Doctor', embedId: 'L1n95m09-A4', channelTitle: 'Doctor Mike' }
    ]
  },
  {
    id: 'teacher',
    title: 'Educator',
    cluster: 'education',
    color: '#fbbf24',
    description: 'Shape the next generation through inspiring, evidence-based teaching.',
    salary: { entry: 40000, mid: 58000, senior: 80000 },
    skills: ['Communication', 'Patience', 'Curriculum Design', 'Mentorship'],
    education: 'Education degree + certification',
    growthRate: '+5% by 2030',
    dayInLife: 'Plan lessons, engage students, provide feedback, and foster curiosity.',
    relatedTo: ['doctor', 'environmental-scientist', 'psychologist'],
    iconName: 'BookOpen',
    videos: [
      { title: 'Secondary School Teachers Video', embedId: '5_4L8L1923k', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a High School Teacher', embedId: 'u43m09L23k0', channelTitle: 'Real Teachers' }
    ]
  },
  {
    id: 'environmental-scientist',
    title: 'Environmental Scientist',
    cluster: 'science',
    color: '#34d399',
    description: 'Protect ecosystems and drive sustainability policy with data.',
    salary: { entry: 48000, mid: 73000, senior: 105000 },
    skills: ['Field Research', 'Data Analysis', 'Environmental Law', 'Report Writing'],
    education: 'Environmental Science degree',
    growthRate: '+8% by 2030',
    dayInLife: 'Collect samples, analyze environmental data, write policy reports.',
    relatedTo: ['biomedical-engineer', 'teacher', 'data-scientist', 'renewable-energy', 'marine-biologist'],
    iconName: 'Leaf',
    videos: [
      { title: 'Environmental Scientists Video', embedId: 'oO6zD8kP_yI', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of an Eco-Scientist', embedId: '5_4L8L1923k', channelTitle: 'Earth Science' }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    cluster: 'tech',
    color: '#818cf8',
    description: 'Defend systems from hackers and build resilient digital infrastructure.',
    salary: { entry: 70000, mid: 105000, senior: 155000 },
    skills: ['Network Security', 'Threat Analysis', 'Ethical Hacking', 'Risk Assessment'],
    education: 'CS or Cybersecurity degree + certs',
    growthRate: '+35% by 2030',
    dayInLife: 'Monitor threats, run penetration tests, incident response, and harden systems.',
    relatedTo: ['software-engineer', 'data-scientist', 'devops-engineer'],
    iconName: 'ShieldCheck',
    videos: [
      { title: 'Information Security Analysts Video', embedId: '4Z3Y_sS8sV4', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Cyber Analyst', embedId: 'd7y3648s', channelTitle: 'Cyber Security Vlogs' }
    ]
  },
  {
    id: 'architect',
    title: 'Architect',
    cluster: 'creative',
    color: '#f472b6',
    description: 'Design spaces that shape how people live, work, and experience the world.',
    salary: { entry: 52000, mid: 82000, senior: 120000 },
    skills: ['Spatial Thinking', 'CAD Software', 'Structural Knowledge', 'Creativity'],
    education: 'Architecture degree (5+ years)',
    growthRate: '+5% by 2030',
    dayInLife: 'Draft blueprints, collaborate with clients, manage construction phases.',
    relatedTo: ['graphic-designer', 'environmental-scientist', 'renewable-energy'],
    iconName: 'Building2',
    videos: [
      { title: 'Architects Career Profile Video', embedId: 'r4OaWnF1o48', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of an Architect', embedId: 'r8D8Zt5mE08', channelTitle: '30X40 Design Workshop' }
    ]
  },
  {
    id: 'nurse-practitioner',
    title: 'Nurse Practitioner',
    cluster: 'health',
    color: '#f87171',
    description: 'Provide advanced primary and specialty healthcare directly to patients.',
    salary: { entry: 90000, mid: 120000, senior: 150000 },
    skills: ['Clinical Assessment', 'Patient Care', 'Diagnostics', 'Empathy'],
    education: 'Master of Science in Nursing (MSN)',
    growthRate: '+40% by 2030',
    dayInLife: 'Perform examinations, diagnose illnesses, prescribe medications, counsel families.',
    relatedTo: ['doctor', 'biomedical-engineer', 'psychologist'],
    iconName: 'HeartHandshake',
    videos: [
      { title: 'Nurse Practitioners Career Video', embedId: '1tVn9Y42Lq0', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Family NP', embedId: 'sQn8kQD47a0', channelTitle: 'Nurse Practitioner Channel' }
    ]
  },
  {
    id: 'lawyer',
    title: 'Attorney',
    cluster: 'business',
    color: '#fb923c',
    description: 'Advocate for clients and represent entities in legal transactions or disputes.',
    salary: { entry: 70000, mid: 125000, senior: '200K+' },
    skills: ['Legal Writing', 'Analytical Thinking', 'Negotiation', 'Public Speaking'],
    education: 'Juris Doctor (JD) + Bar admission',
    growthRate: '+9% by 2030',
    dayInLife: 'Draft contracts, conduct legal research, advise clients, and argue in court.',
    relatedTo: ['financial-analyst', 'product-manager', 'environmental-scientist'],
    iconName: 'Scale',
    videos: [
      { title: 'Lawyers Career Video Profile', embedId: 'p12wM8wP_zI', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Corporate Lawyer', embedId: 'qD8kP_yIoOI', channelTitle: 'Law School Vlogs' }
    ]
  },
  {
    id: 'psychologist',
    title: 'Clinical Psychologist',
    cluster: 'health',
    color: '#f87171',
    description: 'Study cognitive, emotional, and social processes to improve mental wellness.',
    salary: { entry: 55000, mid: 85000, senior: 130000 },
    skills: ['Active Listening', 'Empathy', 'Behavioral Therapy', 'Research'],
    education: 'Ph.D. or Psy.D. in Psychology',
    growthRate: '+6% by 2030',
    dayInLife: 'Conduct therapy sessions, diagnose psychological conditions, write research notes.',
    relatedTo: ['doctor', 'nurse-practitioner', 'teacher'],
    iconName: 'Smile',
    videos: [
      { title: 'Clinical Psychologists Profile', embedId: 'Hl5K33bE4tM', channelTitle: 'CareerOneStop' },
      { title: 'What Does a Psychologist Actually Do?', embedId: 'vBstG2Q1JtQ', channelTitle: 'Psychology Academy' }
    ]
  },
  {
    id: 'ai-researcher',
    title: 'AI Research Scientist',
    cluster: 'tech',
    color: '#818cf8',
    description: 'Advance the state-of-the-art in machine learning and artificial intelligence.',
    salary: { entry: 95000, mid: 150000, senior: '250K+' },
    skills: ['Deep Learning', 'PyTorch/TensorFlow', 'Mathematics', 'Scientific Writing'],
    education: 'Ph.D. in CS or Mathematics',
    growthRate: '+45% by 2030',
    dayInLife: 'Formulate new architectures, train large neural networks, write research papers.',
    relatedTo: ['software-engineer', 'data-scientist', 'devops-engineer'],
    iconName: 'BrainCircuit',
    videos: [
      { title: 'Day in the Life of an AI Scientist', embedId: 'n42UaYJb7f0', channelTitle: 'AI Research' },
      { title: 'What is an AI Scientist?', embedId: 'xP2fW_5nKj8', channelTitle: 'Tech Insider' }
    ]
  },
  {
    id: 'aerospace-engineer',
    title: 'Aerospace Engineer',
    cluster: 'science',
    color: '#34d399',
    description: 'Design, construct, and test aircraft, spacecraft, satellites, and missiles.',
    salary: { entry: 72000, mid: 115000, senior: 165000 },
    skills: ['Aerodynamics', 'Physics', 'CAD Modeling', 'Testing'],
    education: 'Aerospace Engineering degree',
    growthRate: '+8% by 2030',
    dayInLife: 'Calculate structural loads, run simulations, inspect prototypes, analyze data.',
    relatedTo: ['biomedical-engineer', 'environmental-scientist', 'software-engineer'],
    iconName: 'PlaneTakeoff',
    videos: [
      { title: 'Aerospace Engineers Career Video', embedId: 'tK31uH5oFjA', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a NASA Engineer', embedId: 't2Jp7zK5X8A', channelTitle: 'NASA Careers' }
    ]
  },
  {
    id: 'film-director',
    title: 'Film Director',
    cluster: 'creative',
    color: '#f472b6',
    description: 'Translate written scripts into visual cinematic masterworks.',
    salary: { entry: 40000, mid: 75000, senior: '150K+' },
    skills: ['Storytelling', 'Leadership', 'Cinematography', 'Creative Direction'],
    education: 'Film school or portfolio',
    growthRate: '+12% by 2030',
    dayInLife: 'Block scenes, guide actor performances, collaborate with editors and designers.',
    relatedTo: ['graphic-designer', 'ux-designer', 'game-designer'],
    iconName: 'Clapperboard',
    videos: [
      { title: 'Film and Video Directors Profile', embedId: 'a7G006G-w9g', channelTitle: 'CareerOneStop' },
      { title: 'Directing a Feature Film Masterclass', embedId: 'x-G3D8aJ0o4', channelTitle: 'Cinema Studies' }
    ]
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Director',
    cluster: 'business',
    color: '#fb923c',
    description: 'Plan campaigns to build brand equity and acquire customer pipelines.',
    salary: { entry: 50000, mid: 88000, senior: 145000 },
    skills: ['Strategy', 'Copywriting', 'SEO/Analytics', 'Project Management'],
    education: 'Marketing or Business degree',
    growthRate: '+10% by 2030',
    dayInLife: 'Review ad metrics, coordinate visual content, draft campaign copy, plan budgets.',
    relatedTo: ['product-manager', 'financial-analyst', 'graphic-designer'],
    iconName: 'Megaphone',
    videos: [
      { title: 'Marketing Managers Career Video', embedId: 'qD8kP_yIoOI', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Marketing Director', embedId: '1tVn9Y42Lq0', channelTitle: 'Business Vlogs' }
    ]
  },
  {
    id: 'marine-biologist',
    title: 'Marine Biologist',
    cluster: 'science',
    color: '#34d399',
    description: 'Study marine organisms, behaviors, and ocean ecosystem dynamics.',
    salary: { entry: 42000, mid: 68000, senior: 98000 },
    skills: ['Scuba Diving', 'Field Sampling', 'Microscopy', 'Conservation'],
    education: 'Marine Biology or Biology degree',
    growthRate: '+5% by 2030',
    dayInLife: 'Collect water samples, monitor coral health, run lab cultures, write research.',
    relatedTo: ['environmental-scientist', 'teacher'],
    iconName: 'Fish',
    videos: [
      { title: 'Marine Biologists Career Profile', embedId: '5_4L8L1923k', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Marine Biologist', embedId: 'u43m09L23k0', channelTitle: 'Ocean Conservation' }
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    cluster: 'tech',
    color: '#818cf8',
    description: 'Orchestrate cloud infrastructure deployment and automate build pipelines.',
    salary: { entry: 78000, mid: 118000, senior: 170000 },
    skills: ['Docker/Kubernetes', 'CI/CD Pipelines', 'AWS/GCP', 'Linux scripting'],
    education: 'CS degree or cloud certifications',
    growthRate: '+21% by 2030',
    dayInLife: 'Monitor cloud cluster logs, write deployment scripts, optimize build speeds.',
    relatedTo: ['software-engineer', 'cybersecurity-analyst', 'ai-researcher'],
    iconName: 'Terminal',
    videos: [
      { title: 'What is DevOps Engineering?', embedId: 'n42UaYJb7f0', channelTitle: 'DevOps Central' },
      { title: 'Day in the Life of a DevOps Engineer', embedId: 'xP2fW_5nKj8', channelTitle: 'Tech Vlogs' }
    ]
  },
  {
    id: 'game-designer',
    title: 'Game Designer',
    cluster: 'creative',
    color: '#f472b6',
    description: 'Create interactive rules, level layouts, and game dynamics for digital systems.',
    salary: { entry: 50000, mid: 82000, senior: 125000 },
    skills: ['Systems Design', 'Scripting', 'Creative Writing', 'Level Editors'],
    education: 'Game Design degree or portfolio',
    growthRate: '+14% by 2030',
    dayInLife: 'Draft design docs, script level logic, playtest builds, adjust balance values.',
    relatedTo: ['ux-designer', 'graphic-designer', 'film-director', 'software-engineer'],
    iconName: 'Gamepad2',
    videos: [
      { title: 'Video Game Designers Career Video', embedId: 'sQn8kQD47a0', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Game Level Designer', embedId: '1tVn9Y42Lq0', channelTitle: 'Game Dev Insights' }
    ]
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Analyst',
    cluster: 'science',
    color: '#34d399',
    description: 'Design solar, wind, and geothermal systems to power green cities.',
    salary: { entry: 58000, mid: 88000, senior: 130000 },
    skills: ['Thermodynamics', 'Grid modeling', 'AutoCAD', 'Sustainability'],
    education: 'Mechanical or Electrical Engineering degree',
    growthRate: '+30% by 2030',
    dayInLife: 'Calculate solar output projections, inspect solar arrays, consult on power grid grids.',
    relatedTo: ['environmental-scientist', 'architect', 'aerospace-engineer'],
    iconName: 'Sun',
    videos: [
      { title: 'Wind and Solar Energy Technicians Profile', embedId: 'oO6zD8kP_yI', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Green Grid Analyst', embedId: '5_4L8L1923k', channelTitle: 'EcoGrid Projects' }
    ]
  },
  {
    id: 'chef',
    title: 'Chef de Cuisine',
    cluster: 'creative',
    color: '#f472b6',
    description: 'Manage kitchen operations and invent menu profiles of culinary artistry.',
    salary: { entry: 38000, mid: 60000, senior: 95000 },
    skills: ['Culinary Arts', 'Kitchen Management', 'Menu Design', 'Sensory taste'],
    education: 'Culinary degree or apprenticeship',
    growthRate: '+15% by 2030',
    dayInLife: 'Test new ingredients, oversee line cooks, manage inventories, prep signature sauces.',
    relatedTo: ['graphic-designer', 'marketing-manager'],
    iconName: 'ChefHat',
    videos: [
      { title: 'Chefs and Head Cooks Career Profile', embedId: 'p12wM8wP_zI', channelTitle: 'CareerOneStop' },
      { title: 'Day in the Life of a Fine Dining Head Chef', embedId: 'r8D8Zt5mE08', channelTitle: 'Munchies' }
    ]
  },
];

export function getCareerById(id: string): Career | undefined {
  return CAREERS.find((c) => c.id === id);
}

export function getCareersByCluster(cluster: string): Career[] {
  return CAREERS.filter((c) => c.cluster === cluster);
}

export function getAllCareers(): Career[] {
  return [...CAREERS];
}

export function formatSalary(amount: number | string): string {
  if (typeof amount === 'string') return amount;
  return `$${(amount / 1000).toFixed(0)}K`;
}
