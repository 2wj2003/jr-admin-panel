import { create } from "zustand";
import { StrapiUser, getAuthToken, getAuthUser } from "@/lib/auth";

interface AuthState {
  user: StrapiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: StrapiUser, token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
  hydrate: () => {
    const token = getAuthToken();
    const user = getAuthUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
