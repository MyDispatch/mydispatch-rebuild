/**
 * HYPERION PHASE 2: Global State Container
 * 
 * Zentraler State-Container mit Zustand für:
 * - Authentifizierung
 * - UI-State (Sidebar, Modals)
 * - Cache (zuletzt geladene Daten)
 * - Notifications
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// AUTH STATE
// ============================================================================

interface AuthState {
  user: any | null;
  companyId: string | null;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  setCompanyId: (companyId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        companyId: null,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setCompanyId: (companyId) => set({ companyId }),
        clearAuth: () => set({ user: null, companyId: null, isAuthenticated: false }),
      }),
      { name: 'auth-storage' }
    ),
    { name: 'AuthStore' }
  )
);

// ============================================================================
// UI STATE
// ============================================================================

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      activeModal: null,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      openModal: (modalId) => set({ activeModal: modalId }),
      closeModal: () => set({ activeModal: null }),
    }),
    { name: 'UIStore' }
  )
);

// ============================================================================
// NOTIFICATIONS STATE
// ============================================================================

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

interface NotificationsState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set) => ({
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: `notif-${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
            },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: 'NotificationsStore' }
  )
);

// ============================================================================
// DATA CACHE STATE (Optional - für optimistische Updates)
// ============================================================================

interface DataCacheState {
  bookings: unknown[];
  drivers: unknown[];
  vehicles: unknown[];
  customers: unknown[];
  setBookings: (bookings: unknown[]) => void;
  setDrivers: (drivers: unknown[]) => void;
  setVehicles: (vehicles: unknown[]) => void;
  setCustomers: (customers: unknown[]) => void;
  clearCache: () => void;
}

export const useDataCacheStore = create<DataCacheState>()(
  devtools(
    (set) => ({
      bookings: [],
      drivers: [],
      vehicles: [],
      customers: [],
      setBookings: (bookings) => set({ bookings }),
      setDrivers: (drivers) => set({ drivers }),
      setVehicles: (vehicles) => set({ vehicles }),
      setCustomers: (customers) => set({ customers }),
      clearCache: () => set({ bookings: [], drivers: [], vehicles: [], customers: [] }),
    }),
    { name: 'DataCacheStore' }
  )
);
