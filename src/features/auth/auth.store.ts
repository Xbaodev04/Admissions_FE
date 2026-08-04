import { create } from "zustand";
import type { User } from "./auth.types";
import { setTokenInMemory, clearTokenFromMemory } from "@/shared/api/client";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setAuth: (user: User, token: string) => {
    setTokenInMemory(token);

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("crm_auth", JSON.stringify({ user, token }));
      } catch {
      
      }
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    clearTokenFromMemory();
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("crm_auth");
      } catch {
        
      }
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  hydrateFromStorage: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("crm_auth");
        if (stored) {
          const { user, token } = JSON.parse(stored) as {
            user: User;
            token: string;
          };
          setTokenInMemory(token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return;
        }
      } catch {
      
        sessionStorage.removeItem("crm_auth");
      }
    }
    set({ isLoading: false });
  },
}));
