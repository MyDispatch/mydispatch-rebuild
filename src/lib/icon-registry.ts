/* ==================================================================================
   ZENTRALE ICON-REGISTRY - SYSTEMWEITE ICON-VERWALTUNG
   ==================================================================================
   ✅ Alle Icons an einem Ort definiert
   ✅ CI-konform (nur erlaubte Farben)
   ✅ Type-Safe (TypeScript)
   ✅ Konsistente Größen
   ================================================================================== */

import {
  // Navigation
  Home,
  FileText,
  Users,
  Car,
  Calendar,
  Receipt,
  Euro,
  FolderOpen,
  Handshake,
  TrendingUp,
  Building2,
  MessageSquare,
  Mail,
  Settings,

  // Actions
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  Download,
  Upload,
  Send,
  Copy,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,

  // Status & Info
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  MapPin,
  Phone,
  User,
  UserPlus,
  Users2,
  Activity,
  TrendingDown,
  Star,
  Award,

  // Business
  Package,
  Truck,
  Navigation,
  Flag,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Briefcase,
  FileDown,
  FileUp,
  Printer,
  Share2,

  // Communication
  AtSign,
  Bell,
  Megaphone,
  Video,
  Headphones,
  Mic,

  // System
  Loader2,
  Menu,
  LogOut,
  Lock,
  Unlock,
  Key,
  Shield,
  Database,
  Server,
  Cloud,
  Zap,
  Sparkles,
  Bot,
  Code,
  Terminal,

  // Special
  Image as ImageIcon,
  File,
  Folder,
  Archive,
  Link,
  Paperclip,
  QrCode,
  Barcode,
  Scan,
  Camera,
  Globe,
  Wifi,
  type LucideIcon,
} from "lucide-react";

// ==================================================================================
// ICON CATEGORIES
// ==================================================================================

export const ICON_REGISTRY = {
  // Navigation Icons
  navigation: {
    home: Home,
    auftraege: FileText,
    kunden: Users,
    fahrer: Users,
    fahrzeuge: Car,
    schichten: Calendar,
    rechnungen: Receipt,
    kostenstellen: Euro,
    dokumente: FolderOpen,
    partner: Handshake,
    statistiken: TrendingUp,
    landingpage: Building2,
    chat: MessageSquare,
    email: Mail,
    einstellungen: Settings,
  },

  // Action Icons
  actions: {
    add: Plus,
    edit: Edit,
    delete: Trash2,
    save: Save,
    close: X,
    confirm: Check,
    download: Download,
    upload: Upload,
    send: Send,
    copy: Copy,
    refresh: RefreshCw,
    search: Search,
    filter: Filter,
    more: MoreHorizontal,
    expand: ChevronDown,
    collapse: ChevronUp,
    back: ChevronLeft,
    forward: ChevronRight,
    external: ExternalLink,
    view: Eye,
    hide: EyeOff,
  },

  // Status Icons
  status: {
    alert: AlertCircle,
    success: CheckCircle,
    info: Info,
    pending: Clock,
    location: MapPin,
    loading: Loader2,
    active: Activity,
    star: Star,
    award: Award,
  },

  // Business Icons
  business: {
    package: Package,
    truck: Truck,
    navigation: Navigation,
    flag: Flag,
    creditCard: CreditCard,
    payment: DollarSign,
    cart: ShoppingCart,
    briefcase: Briefcase,
    printer: Printer,
    share: Share2,
  },

  // Communication Icons
  communication: {
    email: AtSign,
    notification: Bell,
    megaphone: Megaphone,
    video: Video,
    headphones: Headphones,
    mic: Mic,
    phone: Phone,
  },

  // User Icons
  user: {
    user: User,
    userAdd: UserPlus,
    users: Users,
    team: Users2,
  },

  // System Icons
  system: {
    menu: Menu,
    logout: LogOut,
    lock: Lock,
    unlock: Unlock,
    key: Key,
    shield: Shield,
    database: Database,
    server: Server,
    cloud: Cloud,
    zap: Zap,
    ai: Sparkles,
    bot: Bot,
    code: Code,
    terminal: Terminal,
  },

  // File Icons
  files: {
    image: ImageIcon,
    file: File,
    folder: Folder,
    archive: Archive,
    link: Link,
    attachment: Paperclip,
    qrCode: QrCode,
    barcode: Barcode,
    scan: Scan,
    camera: Camera,
  },

  // Misc Icons
  misc: {
    globe: Globe,
    wifi: Wifi,
    trendUp: TrendingUp,
    trendDown: TrendingDown,
    fileDown: FileDown,
    fileUp: FileUp,
  },
} as const;

// ==================================================================================
// ICON SIZES (Standard)
// ==================================================================================

export const ICON_SIZES = {
  xs: "h-3 w-3", // 12px
  sm: "h-4 w-4", // 16px (Standard)
  md: "h-5 w-5", // 20px
  lg: "h-6 w-6", // 24px
  xl: "h-8 w-8", // 32px
  "2xl": "h-10 w-10", // 40px
} as const;

// ==================================================================================
// ALLOWED ICON COLORS (CI-konform)
// ==================================================================================

export const ICON_COLORS = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  background: "text-background", // Für dunkle Hintergründe (statt text-white)
} as const;

// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================

/**
 * Holt ein Icon aus der Registry
 */
export function getIcon(
  category: keyof typeof ICON_REGISTRY,
  name: string
): LucideIcon | undefined {
  const categoryIcons = ICON_REGISTRY[category];
  if (!categoryIcons) return undefined;
  return (categoryIcons as any)[name];
}

/**
 * Prüft ob ein Icon existiert
 */
export function hasIcon(category: keyof typeof ICON_REGISTRY, name: string): boolean {
  return getIcon(category, name) !== undefined;
}

/**
 * Alle verfügbaren Icons als flache Liste
 */
export function getAllIcons(): LucideIcon[] {
  const allIcons: LucideIcon[] = [];
  Object.values(ICON_REGISTRY).forEach((category) => {
    Object.values(category).forEach((icon) => {
      allIcons.push(icon);
    });
  });
  return allIcons;
}

// ==================================================================================
// TYPE EXPORTS
// ==================================================================================

export type IconSize = keyof typeof ICON_SIZES;
export type IconColor = keyof typeof ICON_COLORS;
export type IconCategory = keyof typeof ICON_REGISTRY;

export type NavigationIcon = keyof typeof ICON_REGISTRY.navigation;
export type ActionIcon = keyof typeof ICON_REGISTRY.actions;
export type StatusIcon = keyof typeof ICON_REGISTRY.status;
export type BusinessIcon = keyof typeof ICON_REGISTRY.business;
export type CommunicationIcon = keyof typeof ICON_REGISTRY.communication;
export type UserIcon = keyof typeof ICON_REGISTRY.user;
export type SystemIcon = keyof typeof ICON_REGISTRY.system;
export type FileIcon = keyof typeof ICON_REGISTRY.files;
export type MiscIcon = keyof typeof ICON_REGISTRY.misc;
