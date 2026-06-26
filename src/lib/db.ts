import fs from 'fs';
import path from 'path';

// Define DB schema interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface UserProfile {
  userId: string;
  quizCompleted: boolean;
  recommendations: any[];
  personalityProfile: string;
  answers: any[];
  updatedAt: string;
}

export interface SimulationHistoryItem {
  scenarioTitle: string;
  choiceIndex: number;
  choiceText: string;
  feedback: string;
  skillsGained: string[];
}

export interface SimulationRun {
  id: string;
  userId: string;
  careerId: string;
  careerTitle: string;
  currentScenarioIndex: number;
  history: SimulationHistoryItem[];
  score: number;
  completed: boolean;
  outcome?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CustomCareer {
  id: string;
  title: string;
  cluster: string;
  color: string;
  description: string;
  salary: { entry: number; mid: number; senior: number | string };
  skills: string[];
  education: string;
  growthRate: string;
  dayInLife: string;
  relatedTo: string[];
  iconName: string;
  isCustom: boolean;
  createdBy: string;
}

export interface DBSchema {
  users: User[];
  sessions: Session[];
  profiles: UserProfile[];
  simulations: SimulationRun[];
  customCareers: CustomCareer[];
}

const DB_DIR = path.join(process.cwd(), 'db');
const DB_FILE = path.join(DB_DIR, 'store.json');

const INITIAL_DB: DBSchema = {
  users: [],
  sessions: [],
  profiles: [],
  simulations: [],
  customCareers: [],
};

// Thread-safe read/write helpers
function readDB(): DBSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON database:', err);
    return INITIAL_DB;
  }
}

function writeDB(data: DBSchema) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON database:', err);
  }
}

export const db = {
  // Users
  getUserByEmail: (email: string): User | undefined => {
    const data = readDB();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserById: (id: string): User | undefined => {
    const data = readDB();
    return data.users.find((u) => u.id === id);
  },

  createUser: (user: Omit<User, 'id' | 'createdAt'>): User => {
    const data = readDB();
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    writeDB(data);
    return newUser;
  },

  // Sessions
  createSession: (userId: string, expiresDays = 7): Session => {
    const data = readDB();
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresDays);

    const newSession: Session = {
      token,
      userId,
      expiresAt: expiresAt.toISOString(),
    };

    // Remove any previous expired/existing sessions for clean up
    data.sessions = data.sessions.filter(
      (s) => s.userId !== userId && new Date(s.expiresAt) > new Date()
    );
    data.sessions.push(newSession);
    writeDB(data);
    return newSession;
  },

  getSession: (token: string): Session | undefined => {
    const data = readDB();
    const session = data.sessions.find((s) => s.token === token);
    if (session && new Date(session.expiresAt) > new Date()) {
      return session;
    }
    return undefined;
  },

  deleteSession: (token: string) => {
    const data = readDB();
    data.sessions = data.sessions.filter((s) => s.token !== token);
    writeDB(data);
  },

  // User Profiles
  getProfile: (userId: string): UserProfile | undefined => {
    const data = readDB();
    return data.profiles.find((p) => p.userId === userId);
  },

  upsertProfile: (profile: Omit<UserProfile, 'updatedAt'>): UserProfile => {
    const data = readDB();
    const existingIndex = data.profiles.findIndex((p) => p.userId === profile.userId);
    const updatedProfile: UserProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      data.profiles[existingIndex] = updatedProfile;
    } else {
      data.profiles.push(updatedProfile);
    }
    writeDB(data);
    return updatedProfile;
  },

  // Simulations
  getSimulations: (userId: string): SimulationRun[] => {
    const data = readDB();
    return data.simulations.filter((s) => s.userId === userId);
  },

  getSimulationById: (id: string): SimulationRun | undefined => {
    const data = readDB();
    return data.simulations.find((s) => s.id === id);
  },

  upsertSimulation: (run: Omit<SimulationRun, 'updatedAt'>): SimulationRun => {
    const data = readDB();
    const existingIndex = data.simulations.findIndex((s) => s.id === run.id);
    const updatedRun: SimulationRun = {
      ...run,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      data.simulations[existingIndex] = updatedRun;
    } else {
      data.simulations.push(updatedRun);
    }
    writeDB(data);
    return updatedRun;
  },

  // Custom Careers
  getCustomCareers: (): CustomCareer[] => {
    const data = readDB();
    return data.customCareers || [];
  },

  createCustomCareer: (career: Omit<CustomCareer, 'id'>): CustomCareer => {
    const data = readDB();
    const newCareer: CustomCareer = {
      ...career,
      id: crypto.randomUUID(),
    };
    if (!data.customCareers) {
      data.customCareers = [];
    }
    data.customCareers.push(newCareer);
    writeDB(data);
    return newCareer;
  },
};
