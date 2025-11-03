/* ==================================================================================
   SYSTEM CONSTANTS - Z-INDEX HIERARCHY
   ==================================================================================
   Definiert die Z-Index Layer-Struktur für konsistentes Stacking
   ================================================================================== */

export const Z_INDEX_HIERARCHY = {
  base: 0,
  dashboardSidebar: 10,
  quickActionsPanel: 30,
  header: 40,
  dialogs: 50,
  notifications: 100,
} as const;

export const LAYOUT_CONSTANTS = {
  header: {
    height: 64, // px
  },
  footer: {
    height: 48, // px
  },
  appSidebar: {
    widthExpanded: 240, // px
    widthCollapsed: 64, // px
  },
  dashboardSidebar: {
    width: 320, // px
  },
  quickActionsPanel: {
    width: 280, // px
  },
} as const;
