/**
 * HYPERION PHASE 1: Global State Container
 * 
 * Zentrale Zustand-Verwaltung mit 5 Slices:
 * 1. User Slice - Nutzer-Daten
 * 2. Filters Slice - Globale Filter
 * 3. Selection Slice - Multi-Select-States
 * 4. UI Slice - Modals, Toasts, Sidebar
 * 5. Realtime Slice - Websocket-Verbindungen
 * 
 * Ersetzt fragmentierte Page-Level States durch einen zentralen Store.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ==================================================================================
// TYPE DEFINITIONS
// ==================================================================================

interface User {
  id: string;
  email: string;
  company_id: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'viewer';
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface AppState {
  // User Slice
  user: {
    data: User | null;
    loading: boolean;
    error: string | null;
  };
  
  // Filters Slice (global filters for tables)
  filters: Record<string, any>;
  
  // Selection Slice (multi-select states für bulk actions)
  selection: Map<string, Set<string>>;
  
  // UI Slice
  ui: {
    sidebarOpen: boolean;
    modals: string[];
    toasts: Toast[];
    theme: 'light' | 'dark' | 'system';
  };
  
  // Realtime Slice
  realtime: {
    active: boolean;
    channels: Map<string, any>;
  };
  
  // ✅ HYPERION Phase 1: Page States (pro Seite isolierter State)
  pageStates: Record<string, any>;
}

interface AppActions {
  // User Actions
  setUser: (user: User | null) => void;
  setUserLoading: (loading: boolean) => void;
  setUserError: (error: string | null) => void;
  clearUser: () => void;
  
  // Filter Actions
  setFilter: (key: string, value: any) => void;
  clearFilter: (key: string) => void;
  clearAllFilters: () => void;
  
  // Selection Actions
  selectItem: (context: string, id: string) => void;
  deselectItem: (context: string, id: string) => void;
  toggleItem: (context: string, id: string) => void;
  selectAll: (context: string, ids: string[]) => void;
  clearSelection: (context: string) => void;
  getSelectedIds: (context: string) => string[];
  
  // UI Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Realtime Actions
  setRealtimeActive: (active: boolean) => void;
  addRealtimeChannel: (name: string, channel: any) => void;
  removeRealtimeChannel: (name: string) => void;
  
  // ✅ HYPERION Phase 1: Page State Actions
  setPageState: (page: string, key: string, value: any) => void;
  getPageState: (page: string, key: string) => any;
  clearPageState: (page: string) => void;
}

type AppStore = AppState & AppActions;

// ==================================================================================
// INITIAL STATE
// ==================================================================================

const initialState: AppState = {
  user: {
    data: null,
    loading: false,
    error: null,
  },
  filters: {},
  selection: new Map(),
  ui: {
    sidebarOpen: true,
    modals: [],
    toasts: [],
    theme: 'system',
  },
  realtime: {
    active: false,
    channels: new Map(),
  },
  pageStates: {},
};

// ==================================================================================
// STORE CREATION
// ==================================================================================

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // ========== USER ACTIONS ==========
        setUser: (user) => set(
          (state) => ({ user: { ...state.user, data: user } }),
          false,
          'setUser'
        ),
        
        setUserLoading: (loading) => set(
          (state) => ({ user: { ...state.user, loading } }),
          false,
          'setUserLoading'
        ),
        
        setUserError: (error) => set(
          (state) => ({ user: { ...state.user, error } }),
          false,
          'setUserError'
        ),
        
        clearUser: () => set(
          { user: { data: null, loading: false, error: null } },
          false,
          'clearUser'
        ),
        
        // ========== FILTER ACTIONS ==========
        setFilter: (key, value) => set(
          (state) => ({ filters: { ...state.filters, [key]: value } }),
          false,
          'setFilter'
        ),
        
        clearFilter: (key) => set(
          (state) => {
            const { [key]: _, ...rest } = state.filters;
            return { filters: rest };
          },
          false,
          'clearFilter'
        ),
        
        clearAllFilters: () => set(
          { filters: {} },
          false,
          'clearAllFilters'
        ),
        
        // ========== SELECTION ACTIONS ==========
        selectItem: (context, id) => set(
          (state) => {
            const newSelection = new Map(state.selection);
            const contextSet = newSelection.get(context) || new Set();
            contextSet.add(id);
            newSelection.set(context, contextSet);
            return { selection: newSelection };
          },
          false,
          'selectItem'
        ),
        
        deselectItem: (context, id) => set(
          (state) => {
            const newSelection = new Map(state.selection);
            const contextSet = newSelection.get(context);
            if (contextSet) {
              contextSet.delete(id);
              newSelection.set(context, contextSet);
            }
            return { selection: newSelection };
          },
          false,
          'deselectItem'
        ),
        
        toggleItem: (context, id) => {
          const contextSet = get().selection.get(context);
          if (contextSet?.has(id)) {
            get().deselectItem(context, id);
          } else {
            get().selectItem(context, id);
          }
        },
        
        selectAll: (context, ids) => set(
          (state) => {
            const newSelection = new Map(state.selection);
            newSelection.set(context, new Set(ids));
            return { selection: newSelection };
          },
          false,
          'selectAll'
        ),
        
        clearSelection: (context) => set(
          (state) => {
            const newSelection = new Map(state.selection);
            newSelection.set(context, new Set());
            return { selection: newSelection };
          },
          false,
          'clearSelection'
        ),
        
        getSelectedIds: (context) => {
          const contextSet = get().selection.get(context);
          return contextSet ? Array.from(contextSet) : [];
        },
        
        // ========== UI ACTIONS ==========
        toggleSidebar: () => set(
          (state) => ({ ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } }),
          false,
          'toggleSidebar'
        ),
        
        setSidebarOpen: (open) => set(
          (state) => ({ ui: { ...state.ui, sidebarOpen: open } }),
          false,
          'setSidebarOpen'
        ),
        
        openModal: (modalId) => set(
          (state) => ({
            ui: {
              ...state.ui,
              modals: [...state.ui.modals, modalId],
            },
          }),
          false,
          'openModal'
        ),
        
        closeModal: (modalId) => set(
          (state) => ({
            ui: {
              ...state.ui,
              modals: state.ui.modals.filter((id) => id !== modalId),
            },
          }),
          false,
          'closeModal'
        ),
        
        addToast: (toast) => set(
          (state) => ({
            ui: {
              ...state.ui,
              toasts: [
                ...state.ui.toasts,
                { ...toast, id: Math.random().toString(36).slice(2) },
              ],
            },
          }),
          false,
          'addToast'
        ),
        
        removeToast: (id) => set(
          (state) => ({
            ui: {
              ...state.ui,
              toasts: state.ui.toasts.filter((t) => t.id !== id),
            },
          }),
          false,
          'removeToast'
        ),
        
        setTheme: (theme) => set(
          (state) => ({ ui: { ...state.ui, theme } }),
          false,
          'setTheme'
        ),
        
        // ========== REALTIME ACTIONS ==========
        setRealtimeActive: (active) => set(
          (state) => ({ realtime: { ...state.realtime, active } }),
          false,
          'setRealtimeActive'
        ),
        
        addRealtimeChannel: (name, channel) => set(
          (state) => {
            const newChannels = new Map(state.realtime.channels);
            newChannels.set(name, channel);
            return { realtime: { ...state.realtime, channels: newChannels } };
          },
          false,
          'addRealtimeChannel'
        ),
        
        removeRealtimeChannel: (name) => set(
          (state) => {
            const newChannels = new Map(state.realtime.channels);
            newChannels.delete(name);
            return { realtime: { ...state.realtime, channels: newChannels } };
          },
          false,
          'removeRealtimeChannel'
        ),
        
        // ========== PAGE STATE ACTIONS ==========
        setPageState: (page, key, value) => set(
          (state) => ({
            pageStates: {
              ...state.pageStates,
              [page]: {
                ...state.pageStates[page],
                [key]: value,
              },
            },
          }),
          false,
          'setPageState'
        ),
        
        getPageState: (page, key) => {
          const pageState = get().pageStates[page];
          return pageState ? pageState[key] : undefined;
        },
        
        clearPageState: (page) => set(
          (state) => {
            const { [page]: _, ...rest } = state.pageStates;
            return { pageStates: rest };
          },
          false,
          'clearPageState'
        ),
      }),
      {
        name: 'mydispatch-app-store',
        partialize: (state) => ({
          user: state.user,
          filters: state.filters,
          ui: { theme: state.ui.theme, sidebarOpen: state.ui.sidebarOpen },
          pageStates: state.pageStates,
        }),
      }
    )
  )
);

// ==================================================================================
// SELECTORS (für optimierte Re-Renders)
// ==================================================================================

export const selectUser = (state: AppStore) => state.user.data;
export const selectUserLoading = (state: AppStore) => state.user.loading;
export const selectFilters = (state: AppStore) => state.filters;
export const selectFilter = (key: string) => (state: AppStore) => state.filters[key];
export const selectSelection = (context: string) => (state: AppStore) =>
  state.selection.get(context) || new Set();
export const selectSidebarOpen = (state: AppStore) => state.ui.sidebarOpen;
export const selectModals = (state: AppStore) => state.ui.modals;
export const selectToasts = (state: AppStore) => state.ui.toasts;
export const selectTheme = (state: AppStore) => state.ui.theme;
export const selectRealtimeActive = (state: AppStore) => state.realtime.active;
export const selectPageState = (page: string, key: string) => (state: AppStore) =>
  state.pageStates[page]?.[key];
