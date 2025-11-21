/* ==================================================================================
   V26 LINK → V28 LINK (DEPRECATED)
   ==================================================================================
   @deprecated Use standard Link component or inline styles instead!
   
   This V26 component is deprecated and will be removed in v29.
   Use react-router-dom Link directly with Tailwind classes.
   
   Migration:
   ```tsx
   // Old
   import { V26Link } from '@/components/design-system/V26Link';
   <V26Link to="/page">Link</V26Link>
   
   // New
   import { Link } from 'react-router-dom';
   <Link to="/page" className="text-slate-700 hover:text-slate-900 no-underline font-medium">Link</Link>
   ```
   ================================================================================== */

import type { AnchorHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface V26LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  external?: boolean;
  children: React.ReactNode;
}

export const V26Link = forwardRef<HTMLAnchorElement, V26LinkProps>(
  ({ to, external = false, children, className, ...props }, ref) => {
    const baseStyles = cn(
      'no-underline font-medium transition-colors text-slate-700 hover:text-slate-900',
      className
    );

    if (to && !external) {
      return (
        <RouterLink
          ref={ref as any}
          to={to}
          className={baseStyles}
          {...(props as any)}
        >
          {children}
        </RouterLink>
      );
    }

    return (
      <a
        ref={ref}
        href={to}
        className={baseStyles}
        {...(external && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
        {...props}
      >
        {children}
      </a>
    );
  }
);

V26Link.displayName = 'V26Link';
