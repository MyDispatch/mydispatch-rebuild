/* ==================================================================================
   USE MAIN LAYOUT HOOK - SHARED LAYOUT STATE
   ==================================================================================
   Provides sidebar expansion state to all components
   ================================================================================== */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MainLayoutState {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
}

export const useMainLayout = create<MainLayoutState>()(
  persist(
    (set) => ({
      sidebarExpanded: false,
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
    }),
    {
      name: 'main-layout-storage',
    }
  )
);
