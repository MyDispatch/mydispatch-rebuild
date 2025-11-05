import { create } from "zustand";

export type MasterSession = {
  id: string;
  email: string;
  displayName?: string;
  roles: string[];
  token?: string;
};

type AuthState = {
  session: MasterSession | null;
  isBootstrapping: boolean;
  setSession: (session: MasterSession | null) => void;
  setBootstrapping: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isBootstrapping: true,
  setSession: (session) => set({ session }),
  setBootstrapping: (value) => set({ isBootstrapping: value }),
  logout: () => set({ session: null })
}));
