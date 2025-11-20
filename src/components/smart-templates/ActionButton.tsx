/* ==================================================================================
   SMART TEMPLATE: ACTION BUTTON V28.0.0 - V28 PREMIUM WRAPPER
   ==================================================================================
   ✅ Wrapper um V28Button für Backward Compatibility
   ✅ 100% V28 Premium Design (rounded-xl, shadow-sm/md, scale)
   ✅ Icon Support, Loading, Full Width
   ✅ Systemweite Konsistenz
   ================================================================================== */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { V28Button } from '@/components/design-system/V28Button';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Content
  children: ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  
  // Variants
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  
  // Behavior
  loading?: boolean;
  disabled?: boolean;
  
  // Styling
  className?: string;
}

export function ActionButton({
  children,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  type = 'button',
  onClick,
  ...props
}: ActionButtonProps) {
  return (
    <V28Button
      variant={variant}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled}
      className={className}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </V28Button>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Primary Button
 * <ActionButton variant="primary" onClick={handleSave}>
 *   Speichern
 * </ActionButton>
 * 
 * // Secondary Button with Icon
 * <ActionButton variant="secondary" icon={Plus} iconPosition="left">
 *   Neuer Eintrag
 * </ActionButton>
 * 
 * // Ghost Button
 * <ActionButton variant="ghost" onClick={handleCancel}>
 *   Abbrechen
 * </ActionButton>
 * 
 * // Full Width Loading Button
 * <ActionButton variant="primary" fullWidth loading>
 *   Speichern
 * </ActionButton>
 */
