/* ==================================================================================
   SKELETON LOADING COMPONENT - EINHEITLICHE LOADING-STATES
   ==================================================================================
   ✅ Konsistentes Loading-Design systemweit
   ✅ Variants: Text, Card, Avatar, Button
   ✅ Animation mit CI-Farben
   ==================================================================================
   NUTZUNG: <Skeleton variant="card" />
   ================================================================================== */

import React from 'react';
import { ANIMATIONS } from '@/lib/design-system';
import { cn } from '@/lib/utils';

// ==================================================================================
// TYPES
// ==================================================================================

interface SkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'custom';
  width?: string;
  height?: string;
  className?: string;
}

// ==================================================================================
// COMPONENT
// ==================================================================================

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  
  const variantStyles = {
    text: 'h-4 w-full rounded',
    card: 'h-48 w-full rounded-lg',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-md',
    custom: '',
  };
  
  return (
    <div
      className={cn(
        'bg-muted animate-pulse',
        variantStyles[variant],
        className
      )}
      style={width || height ? { 
        ...(width && { width }),
        ...(height && { height })
      } : undefined}
      aria-hidden="true"
    />
  );
}

// ==================================================================================
// SKELETON GROUP (Multiple Lines)
// ==================================================================================

interface SkeletonGroupProps {
  lines?: number;
  className?: string;
}

export function SkeletonGroup({ lines = 3, className }: SkeletonGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

// ==================================================================================
// SKELETON CARD (Complete Card Loading State)
// ==================================================================================

interface SkeletonCardProps {
  hasImage?: boolean;
  hasFooter?: boolean;
  className?: string;
}

export function SkeletonCard({ hasImage, hasFooter, className }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-6 space-y-4', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </div>
      
      {/* Image (optional) */}
      {hasImage && <Skeleton variant="card" />}
      
      {/* Content */}
      <SkeletonGroup lines={3} />
      
      {/* Footer (optional) */}
      {hasFooter && (
        <div className="flex gap-2 pt-4">
          <Skeleton variant="button" />
          <Skeleton variant="button" />
        </div>
      )}
    </div>
  );
}

// ==================================================================================
// SKELETON TABLE (Table Loading State)
// ==================================================================================

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="80%" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" />
          ))}
        </div>
      ))}
    </div>
  );
}
