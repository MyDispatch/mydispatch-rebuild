import { create } from 'zustand';

interface MainStore {
  user: any;
  isAuthenticated: boolean;
  sidebarExpanded: boolean;
  theme: 'light' | 'dark';
  filters: Record<string, any>;
  searchQuery: string;
  
  setUser: (user: any) => void;
  logout: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

export const useMainStore = create<MainStore>((set) => ({
  user: null,
  isAuthenticated: false,
  sidebarExpanded: true,
  theme: 'light',
  filters: {},
  searchQuery: '',
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setTheme: (theme) => set({ theme }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  reset: () => set({
    user: null,
    isAuthenticated: false,
    sidebarExpanded: true,
    theme: 'light',
    filters: {},
    searchQuery: '',
  }),
}));
