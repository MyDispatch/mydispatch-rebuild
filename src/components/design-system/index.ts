/* ==================================================================================
   DESIGN SYSTEM - BARREL EXPORT V26.0
   ==================================================================================
   Central export for all Design System Components
   ================================================================================== */

// Legacy Components (V18.3.28)
export { HeroSection } from "./HeroSection";
export type { HeroSectionProps } from "./HeroSection";

// KPICard removed - use StatCard from @/components/smart-templates instead

export { QuickActions } from "./QuickActions";
export type { QuickActionsProps, QuickAction } from "./QuickActions";

export { DashboardGrid } from "./DashboardGrid";
export type { DashboardGridProps } from "./DashboardGrid";

export { ResponsiveBadge } from "./ResponsiveBadge";
export type {
  ResponsiveBadgeProps,
  ResponsiveBadgeVariant,
  ResponsiveBadgeSize,
} from "./ResponsiveBadge";

export { Icon, IconWithSize, ICON_SIZES } from "./Icon";

export { MarketingButton } from "./MarketingButton";
export type { MarketingButtonProps } from "./MarketingButton";

// ==================================================================================
// V26.0 COMPONENT LIBRARY - PRODUCTION-READY & LOCKED
// ==================================================================================
// ✅ Alle Komponenten folgen KERNFARBEN
// ✅ WCAG 2.1 AA konform
// ✅ Mobile-First (Touch-Targets ≥ 44px)
// ✅ Inter Font
// 🔒 Ab 2025-01-26: GESPERRT gegen Design-Änderungen
//    Nur technische Optimierungen & Bug-Fixes erlaubt
// ==================================================================================

// ==================================================================================
// V26 COMPONENTS REMOVED - V28.1 MIGRATION COMPLETE
// ==================================================================================
// All V26 components have been deprecated and removed.
// Use shadcn/ui components directly instead:
//   - V26Button → Button from '@/components/ui/button'
//   - V26Badge → Badge from '@/components/ui/badge'
//   - V26Dialog → Dialog from '@/components/ui/dialog'
//   - V26AuthCard → Card from '@/components/ui/card'
// ==================================================================================

// ==================================================================================
// V28 DASHBOARD COMPONENTS (V29.1 - NEW!)
// ==================================================================================
export { V28StatCard } from "./V28StatCard";
export { V28DashboardCard } from "./V28DashboardCard";
export { V28DashboardSection } from "./V28DashboardSection";

// ==================================================================================
// V32.1 PREMIUM 3D COMPONENTS
// ==================================================================================
export { Premium3DCard } from "./Premium3DCard";

// ==================================================================================
// V28.1 TARIFF BADGE (2025-01-30)
// ==================================================================================
export { V28TariffBadge } from "./V28TariffBadge";

// ==================================================================================
// V28 FORM ATOMS (PHOENIX RISING Phase 1.3 - 2025-01-31)
// ==================================================================================
export { V28Input } from "./V28Input";
export type { V28InputProps } from "./V28Input";

export { V28Textarea } from "./V28Textarea";
export type { V28TextareaProps } from "./V28Textarea";

export { V28Checkbox } from "./V28Checkbox";
export type { V28CheckboxProps } from "./V28Checkbox";

// ==================================================================================
// V28 EXISTING COMPONENTS (to be documented)
// ==================================================================================
export { V28Button } from "./V28Button";
export { V28Badge } from "./V28Badge";
export { V28IconBox } from "./V28IconBox";
export { V28Select } from "./V28Select";
export { V28AuthInput } from "./V28AuthInput";
export { V28AuthCard } from "./V28AuthCard";
export { V28InfoBox } from "./V28InfoBox";
export { V28FeatureListItem } from "./V28FeatureListItem";
export { V28MarketingCard } from "./V28MarketingCard";
export { V28TariffCard } from "./V28TariffCard";
export { V28BillingToggle } from "./V28BillingToggle";
export { V28MarketingSection } from "./V28MarketingSection";
export { V28Dialog } from "./V28Dialog";

// ==================================================================================
// V28 PHASE 1.3 ATOMS (PHOENIX RISING - 2025-01-31)
// ==================================================================================
export { V28Radio } from "./V28Radio";
export type { V28RadioProps, V28RadioOption } from "./V28Radio";

export { V28Spinner } from "./V28Spinner";
export type { V28SpinnerProps } from "./V28Spinner";

export { V28Tooltip } from "./V28Tooltip";
export type { V28TooltipProps } from "./V28Tooltip";

export { V28Modal } from "./V28Modal";
export type { V28ModalProps } from "./V28Modal";

export { V28Popover } from "./V28Popover";
export type { V28PopoverProps } from "./V28Popover";

export { V28Dropdown } from "./V28Dropdown";
export type { V28DropdownProps, V28DropdownItem } from "./V28Dropdown";

export { V28DatePicker } from "./V28DatePicker";
export type { V28DatePickerProps } from "./V28DatePicker";
// ==================================================================================
