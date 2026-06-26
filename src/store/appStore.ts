'use client';

import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface AppStore {
  globalLoading: boolean;
  toasts: Toast[];
  navbarVisible: boolean;
  setGlobalLoading: (loading: boolean) => void;
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  setNavbarVisible: (visible: boolean) => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  globalLoading: false,
  toasts: [],
  navbarVisible: true,

  setGlobalLoading: (globalLoading) => set({ globalLoading }),

  addToast: (message, type = 'info') =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), message, type },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setNavbarVisible: (navbarVisible) => set({ navbarVisible }),
}));
