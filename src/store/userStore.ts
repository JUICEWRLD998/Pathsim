import { create } from 'zustand';
import type { User, UserProfile, SimulationRun } from '@/lib/db';

interface UserStore {
  user: Omit<User, 'passwordHash'> | null;
  profile: UserProfile | null;
  simulations: SimulationRun[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setUser: (user: Omit<User, 'passwordHash'> | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSimulations: (simulations: SimulationRun[]) => void;
  addSimulation: (sim: SimulationRun) => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  profile: null,
  simulations: [],
  isAuthenticated: false,
  isLoading: true,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        set({
          user: data.user,
          profile: data.profile,
          simulations: data.simulations,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          profile: null,
          simulations: [],
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      set({
        user: null,
        profile: null,
        simulations: [],
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to connect to authentication service',
      });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setSimulations: (simulations) => set({ simulations }),
  
  addSimulation: (sim) => {
    const sims = get().simulations;
    const existing = sims.findIndex((s) => s.id === sim.id);
    if (existing >= 0) {
      const copy = [...sims];
      copy[existing] = sim;
      set({ simulations: copy });
    } else {
      set({ simulations: [...sims, sim] });
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      set({
        user: null,
        profile: null,
        simulations: [],
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));
