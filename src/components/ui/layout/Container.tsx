/* ==================================================================================
   CONTAINER COMPONENT V28.1 - LAYOUT PATTERN SYSTEM
   ==================================================================================
   ✅ Responsive max-widths
   ✅ Consistent padding
   ✅ Center alignment
   ✅ V28.1 Slate Design System
   ================================================================================== */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Padding */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Center horizontally */
  center?: boolean;
  children: React.ReactNode;
}

/**
 * Container Component
 * 
 * Standard container with responsive max-width and padding.
 * 
 * @example
 * <Container size="xl" padding="lg">
 *   {children}
 * </Container>
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'xl', padding = 'md', center = true, children, className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-screen-sm',   // 640px
      md: 'max-w-screen-md',   // 768px
      lg: 'max-w-screen-lg',   // 1024px
      xl: 'max-w-screen-xl',   // 1280px
      '2xl': 'max-w-screen-2xl', // 1536px
      full: 'max-w-full',
    };
    
    const paddingClasses = {
      none: '',
      sm: 'px-4 py-6 md:px-6 md:py-8',
      md: 'px-4 py-8 md:px-8 md:py-12',
      lg: 'px-6 py-12 md:px-12 md:py-16',
      xl: 'px-6 py-16 md:px-16 md:py-24',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          sizeClasses[size],
          center && 'mx-auto',
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
