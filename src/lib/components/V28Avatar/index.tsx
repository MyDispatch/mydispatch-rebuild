/**
 * V28Avatar - Atomic Design System Avatar Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export interface V28AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function V28Avatar({
  src,
  alt = "Avatar",
  fallback = "U",
  size = "md",
  className,
}: V28AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        "bg-slate-100 dark:bg-slate-800",
        sizeClasses[size],
        className
      )}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className={cn(
          "flex h-full w-full items-center justify-center font-medium",
          "bg-slate-200 text-slate-900",
          "dark:bg-slate-700 dark:text-slate-100"
        )}
        delayMs={600}
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
