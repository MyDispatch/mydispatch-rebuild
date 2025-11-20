/**
 * HYPERION PHASE 1: Aufträge Page State Hook
 * 
 * Zentralisierter State für die /auftraege Seite.
 * Nutzt den globalen App Store anstelle von lokalem useState.
 * 
 * ✅ Persistenter State (überlebt Page-Refresh)
 * ✅ Type-Safe
 * ✅ DevTools Support
 */

import { useAppStore } from '@/stores/app-store';
import { useCallback } from 'react';

const PAGE_KEY = 'auftraege';

interface AuftraegePageState {
  searchTerm: string;
  showArchived: boolean;
  filterPartner: string;
  isDialogOpen: boolean;
  editingBookingId: string | null;
  selectedBookingId: string | null;
  showInlineCustomerForm: boolean;
  smartAssignmentOpen: boolean;
  isPartnerDialogOpen: boolean;
  selectedPartnerForBooking: string | null;
}

const DEFAULT_STATE: AuftraegePageState = {
  searchTerm: '',
  showArchived: false,
  filterPartner: 'all',
  isDialogOpen: false,
  editingBookingId: null,
  selectedBookingId: null,
  showInlineCustomerForm: false,
  smartAssignmentOpen: false,
  isPartnerDialogOpen: false,
  selectedPartnerForBooking: null,
};

export const useAuftraegeState = () => {
  const setPageState = useAppStore((state) => state.setPageState);
  const getPageState = useAppStore((state) => state.getPageState);
  
  // ✅ HYPERION: Getter mit Fallback auf Default-Werte
  const getState = useCallback(<K extends keyof AuftraegePageState>(
    key: K
  ): AuftraegePageState[K] => {
    const value = getPageState(PAGE_KEY, key);
    return value !== undefined ? value : DEFAULT_STATE[key];
  }, [getPageState]);
  
  // ✅ HYPERION: Type-Safe Setter
  const setState = useCallback(<K extends keyof AuftraegePageState>(
    key: K,
    value: AuftraegePageState[K]
  ) => {
    setPageState(PAGE_KEY, key, value);
  }, [setPageState]);
  
  // ========== PUBLIC API ==========
  
  return {
    // Search
    searchTerm: getState('searchTerm'),
    setSearchTerm: (value: string) => setState('searchTerm', value),
    
    // Filters
    showArchived: getState('showArchived'),
    setShowArchived: (value: boolean) => setState('showArchived', value),
    
    filterPartner: getState('filterPartner'),
    setFilterPartner: (value: string) => setState('filterPartner', value),
    
    // Dialogs
    isDialogOpen: getState('isDialogOpen'),
    setIsDialogOpen: (value: boolean) => setState('isDialogOpen', value),
    
    isPartnerDialogOpen: getState('isPartnerDialogOpen'),
    setIsPartnerDialogOpen: (value: boolean) => setState('isPartnerDialogOpen', value),
    
    smartAssignmentOpen: getState('smartAssignmentOpen'),
    setSmartAssignmentOpen: (value: boolean) => setState('smartAssignmentOpen', value),
    
    showInlineCustomerForm: getState('showInlineCustomerForm'),
    setShowInlineCustomerForm: (value: boolean) => setState('showInlineCustomerForm', value),
    
    // Selected Items
    editingBookingId: getState('editingBookingId'),
    setEditingBookingId: (value: string | null) => setState('editingBookingId', value),
    
    selectedBookingId: getState('selectedBookingId'),
    setSelectedBookingId: (value: string | null) => setState('selectedBookingId', value),
    
    selectedPartnerForBooking: getState('selectedPartnerForBooking'),
    setSelectedPartnerForBooking: (value: string | null) => setState('selectedPartnerForBooking', value),
  };
};
