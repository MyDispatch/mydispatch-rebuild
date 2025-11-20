/* ==================================================================================
   NAVIGATION CONFIGURATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ✅ Marketing & Dashboard Navigation
   ✅ Permission-based routes
   ✅ Icon references (Lucide React)
   ✅ Mobile & Desktop optimiert
   ================================================================================== */

export const MAIN_NAVIGATION = [
  {
    path: "/",
    label: "Home",
    icon: "Home",
    showInMobile: true,
    showInDesktop: true,
  },
  {
    path: "/features",
    label: "Features",
    icon: "Zap",
    showInMobile: true,
    showInDesktop: true,
    children: [
      { path: "/features/fahrer-fahrzeuge", label: "Fahrer & Fahrzeuge" },
      { path: "/features/auftragsverwaltung", label: "Auftragsverwaltung" },
      { path: "/features/gps-tracking", label: "GPS-Tracking" },
      { path: "/features/automatisierung", label: "Automatisierung" },
      { path: "/features/rechnungsstellung", label: "Rechnungsstellung" },
      { path: "/features/api", label: "API" },
    ],
  },
  {
    path: "/pricing",
    label: "Preise",
    icon: "DollarSign",
    showInMobile: true,
    showInDesktop: true,
  },
  {
    path: "/branchen",
    label: "Branchen",
    icon: "Building2",
    showInMobile: false,
    showInDesktop: true,
    children: [
      { path: "/branchen/taxi", label: "Taxi" },
      { path: "/branchen/mietwagen", label: "Mietwagen" },
      { path: "/branchen/limousinen", label: "Limousinen" },
    ],
  },
  {
    path: "/contact",
    label: "Kontakt",
    icon: "Mail",
    showInMobile: true,
    showInDesktop: true,
  },
] as const;

export const DASHBOARD_NAVIGATION = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    permission: null, // Available to all
  },
  {
    path: "/auftraege",
    label: "Aufträge",
    icon: "MapPin",
    permission: null,
  },
  {
    path: "/fahrer",
    label: "Fahrer",
    icon: "Users",
    permission: "canManageDrivers",
  },
  {
    path: "/fahrzeuge",
    label: "Fahrzeuge",
    icon: "Car",
    permission: "canManageVehicles",
  },
  {
    path: "/kunden",
    label: "Kunden",
    icon: "UserCheck",
    permission: "canManageCustomers",
  },
  {
    path: "/rechnungen",
    label: "Rechnungen",
    icon: "FileText",
    permission: "canManageInvoices",
  },
  {
    path: "/schichtzettel",
    label: "Schichtzettel",
    icon: "ClipboardList",
    permission: "canAccessShiftReports",
  },
  {
    path: "/dokumente",
    label: "Dokumente",
    icon: "FolderOpen",
    permission: "canAccessDocuments",
  },
  {
    path: "/statistiken",
    label: "Statistiken",
    icon: "TrendingUp",
    permission: "canAccessStatistics",
  },
  {
    path: "/kostenstellen",
    label: "Kostenstellen",
    icon: "Building",
    permission: "canManageCostCenters",
  },
  {
    path: "/partner",
    label: "Partner",
    icon: "Handshake",
    permission: "canManagePartners",
  },
  {
    path: "/kommunikation",
    label: "Kommunikation",
    icon: "MessageSquare",
    permission: null,
  },
] as const;

export const FOOTER_NAVIGATION = {
  product: [
    { path: "/features", label: "Features" },
    { path: "/pricing", label: "Preise" },
    { path: "/branchen", label: "Branchen" },
  ],
  legal: [
    { path: "/legal/impressum", label: "Impressum" },
    { path: "/legal/datenschutz", label: "Datenschutz" },
    { path: "/legal/agb", label: "AGB" },
    { path: "/legal/ki-transparenz", label: "KI-Transparenz" },
    { path: "/legal/cookie-policy", label: "Cookie-Policy" },
  ],
  support: [
    { path: "/hilfe", label: "Hilfe-Center" },
    { path: "/contact", label: "Kontakt" },
  ],
} as const;

// Alias exports für Backward Compatibility
export const DASHBOARD_NAV_ITEMS = DASHBOARD_NAVIGATION;

// Mobile Bottom Navigation (nur wichtigste 4 Items)
export const MOBILE_BOTTOM_NAV_ITEMS = [
  DASHBOARD_NAVIGATION[0], // Dashboard
  DASHBOARD_NAVIGATION[1], // Aufträge
  DASHBOARD_NAVIGATION[2], // Fahrer
  DASHBOARD_NAVIGATION[10], // Kommunikation
] as const;

// Marketing Navigation Groups (für Mega-Menu)
export const MARKETING_NAV_GROUPS = [
  {
    title: "Features",
    items: MAIN_NAVIGATION.find((n) => n.path === "/features")?.children || [],
  },
  {
    title: "Branchen",
    items: MAIN_NAVIGATION.find((n) => n.path === "/branchen")?.children || [],
  },
] as const;

// Marketing Header Navigation (Top-Level nur)
export const MARKETING_HEADER_NAV = MAIN_NAVIGATION.filter((n) => n.showInDesktop);

// Footer Navigation Groups (Alias für Consistency)
export const FOOTER_NAV_GROUPS = FOOTER_NAVIGATION;

// ==================================================================================
// FEATURE-DETAIL-NAVIGATION (für Sidebar auf Feature-Seiten)
// ==================================================================================
export const FEATURE_NAVIGATION = [
  {
    category: "Core Features",
    description: "Basis-Funktionen für alle Tarife",
    features: [
      { path: "/features/core/fahrer-fahrzeuge", label: "Fahrer & Fahrzeuge", icon: "Users" },
      {
        path: "/features/core/auftragsverwaltung",
        label: "Auftragsverwaltung",
        icon: "ClipboardList",
      },
      { path: "/features/core/angebotserstellung", label: "Angebotserstellung", icon: "FileText" },
      { path: "/features/core/rechnungsstellung", label: "Rechnungsstellung", icon: "DollarSign" },
      { path: "/features/core/kundenverwaltung", label: "Kundenverwaltung", icon: "UserCheck" },
      { path: "/features/core/landingpage", label: "Landingpage (Info)", icon: "Globe" },
    ],
  },
  {
    category: "Business Features",
    description: "Erweiterte Funktionen ab Business-Tarif",
    features: [
      { path: "/features/business/buchungswidget", label: "Buchungswidget", icon: "Code" },
      { path: "/features/business/kunden-portal", label: "Kunden-Portal", icon: "Smartphone" },
      {
        path: "/features/business/partner-management",
        label: "Partner-Management",
        icon: "Handshake",
      },
      { path: "/features/business/live-traffic", label: "Live-Traffic & Wetter", icon: "MapPin" },
      {
        path: "/features/business/statistiken",
        label: "Statistiken & Reports",
        icon: "TrendingUp",
      },
      { path: "/features/business/gps-tracking", label: "GPS-Tracking", icon: "Navigation" },
      { path: "/features/business/team-chat", label: "Team-Chat", icon: "MessageSquare" },
      {
        path: "/features/business/workflow-automation",
        label: "Workflow-Automatisierung",
        icon: "Zap",
      },
    ],
  },
  {
    category: "Enterprise Features",
    description: "Premium-Funktionen nur für Enterprise",
    features: [
      { path: "/features/enterprise/api-zugang", label: "API-Zugang", icon: "Terminal" },
      { path: "/features/enterprise/white-labeling", label: "White-Labeling", icon: "Palette" },
      {
        path: "/features/enterprise/custom-development",
        label: "Custom Development",
        icon: "Code2",
      },
      { path: "/features/enterprise/support", label: "Premium-Support", icon: "Headphones" },
    ],
  },
] as const;

// Helper: Get navigation item by path
export function getNavItemById(path: string): MainNavItem | DashboardNavItem | undefined {
  const mainNav = MAIN_NAVIGATION.find((n) => n.path === path);
  if (mainNav) return mainNav;

  const dashboardNav = DASHBOARD_NAVIGATION.find((n) => n.path === path);
  return dashboardNav;
}

// Helper: Get active navigation item
export function getActiveNavItem(currentPath: string): MainNavItem | DashboardNavItem | undefined {
  // Exact match first
  let navItem = getNavItemById(currentPath);
  if (navItem) return navItem;

  // Check if currentPath starts with navigation path (for sub-routes)
  navItem = DASHBOARD_NAVIGATION.find((n) => currentPath.startsWith(n.path));
  if (navItem) return navItem;

  navItem = MAIN_NAVIGATION.find((n) => currentPath.startsWith(n.path));
  return navItem;
}

// Type exports
export type MainNavItem = (typeof MAIN_NAVIGATION)[number];
export type DashboardNavItem = (typeof DASHBOARD_NAVIGATION)[number];
export type FooterNavSection = keyof typeof FOOTER_NAVIGATION;
export type NavItem = MainNavItem | DashboardNavItem;
export type NavGroup = (typeof MARKETING_NAV_GROUPS)[number];
