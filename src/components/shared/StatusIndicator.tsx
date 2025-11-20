/* ==================================================================================
   KRITISCHER HINWEIS: StatusIndicator - NIEMALS ÄNDERN!
   ==================================================================================
   Ampel-System mit ECHTEN Ampelfarben (Rot/Gelb/Grün)
   Verwendet in: 16+ Dateien, 60+ Stellen
   NUR Helper-Functions erweitern, NIE Badge-Design ändern!
   ================================================================================== */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'pending' | 'neutral' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface StatusIndicatorProps {
  type: StatusType;
  label: string;
  size?: BadgeSize;
  className?: string;
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs rounded',
  md: 'px-2.5 py-1 text-xs rounded-md',
  lg: 'px-3 py-1.5 text-sm rounded-md',
};

const typeStyles = {
  success: 'bg-status-success/10 border-status-success/30 text-status-success hover:bg-status-success/15',
  warning: 'bg-status-warning/10 border-status-warning/30 text-status-warning hover:bg-status-warning/15',
  error: 'bg-status-error border-status-error text-status-error-foreground hover:bg-status-error/90',
  pending: 'bg-status-warning/10 border-status-warning/30 text-status-warning hover:bg-status-warning/15',
  neutral: 'bg-muted/10 border-muted/30 text-muted-foreground hover:bg-muted/15',
  info: 'bg-primary/10 border-primary/30 text-foreground hover:bg-primary/15',
};

export function StatusIndicator({ type, label, size = 'sm', className }: StatusIndicatorProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border shadow-sm transition-colors',
        sizeStyles[size],
        typeStyles[type],
        className
      )}
    >
      {label}
    </Badge>
  );
}

// ==================================================================================
// HELPER FUNCTIONS - Integration mit zentralem Ampelsystem
// ==================================================================================
// Diese Functions bieten Rückwärts-Kompatibilität für bestehenden Code
// Verwenden intern das zentrale Ampelsystem aus src/lib/status-system.ts
// ==================================================================================

import { 
  BOOKING_STATUS_CONFIG,
  DRIVER_STATUS_CONFIG, 
  VEHICLE_STATUS_CONFIG,
  INVOICE_STATUS_CONFIG
} from '@/lib/status-system';

// Booking Status
export function getBookingStatusType(status: string): StatusType {
  const config = BOOKING_STATUS_CONFIG[status as keyof typeof BOOKING_STATUS_CONFIG];
  if (!config) return 'neutral';
  return config.level as StatusType;
}

// Driver Status
export function getDriverStatusType(status: string): StatusType {
  const config = DRIVER_STATUS_CONFIG[status as keyof typeof DRIVER_STATUS_CONFIG];
  if (!config) return 'neutral';
  return config.level as StatusType;
}

// Vehicle Status - mit Fallback auf alte Namen
export function getVehicleStatusType(status: string): StatusType {
  // Map alte Namen auf neue
  const statusMapping: Record<string, string> = {
    'im_einsatz': 'in_use',
    'wartung': 'maintenance',
    'defekt': 'out_of_service'
  };
  
  const mappedStatus = statusMapping[status] || status;
  const config = VEHICLE_STATUS_CONFIG[mappedStatus as keyof typeof VEHICLE_STATUS_CONFIG];
  if (!config) return 'neutral';
  return config.level as StatusType;
}

// Payment Status - verwendet Invoice-System
export function getPaymentStatusType(status: string): StatusType {
  const config = INVOICE_STATUS_CONFIG[status as keyof typeof INVOICE_STATUS_CONFIG];
  if (!config) {
    // Fallback: pending als warning
    return status === 'pending' ? 'warning' : 'neutral';
  }
  return config.level as StatusType;
}

// Offer Status
export function getOfferStatusType(status: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    pending: 'warning',
    accepted: 'success',
    declined: 'error',
    expired: 'neutral',
  };
  return statusMap[status] || 'neutral';
}

// Shift Status
export function getShiftStatusType(status: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    active: 'success',
    break: 'warning',
    completed: 'neutral',
  };
  return statusMap[status] || 'neutral';
}

// Partner Status
export function getPartnerStatusType(onlineAccessEnabled: boolean): StatusType {
  return onlineAccessEnabled ? 'success' : 'neutral';
}
