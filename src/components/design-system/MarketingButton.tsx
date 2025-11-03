/* ==================================================================================
   MARKETING BUTTON - V18.5.2 (V28 Compatibility)
   ==================================================================================
   Spezialisierte Button-Komponente für Marketing-Seiten mit perfekten Kontrasten
   ================================================================================== */

import { V28Button } from '@/components/design-system/V28Button';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import '../ui/button-styles.css';

export interface MarketingButtonProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  marketingVariant?: 'hero-primary' | 'hero-secondary' | 'cta-primary' | 'cta-secondary';
}

export const MarketingButton = forwardRef<HTMLButtonElement, MarketingButtonProps>(
  ({ className, marketingVariant = 'hero-primary', children, variant = 'primary', ...props }, ref) => {
    const marketingClasses = {
      'hero-primary': 'bg-primary text-foreground hover:bg-primary-glow hover:text-foreground hover:scale-105 shadow-2xl hover:shadow-primary/30 transition-all duration-300',
      'hero-secondary': 'marketing-btn-hero-secondary !text-background bg-transparent hover:bg-background hover:!text-foreground hover:scale-105 backdrop-blur-sm transition-all duration-300',
      'cta-primary': 'bg-primary text-foreground hover:bg-primary-glow hover:text-foreground hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300',
      'cta-secondary': 'marketing-btn-cta-secondary bg-background text-foreground hover:bg-primary hover:text-foreground hover:scale-105 transition-all duration-300',
    };

    return (
      <V28Button
        variant={variant}
        className={cn(
          'min-h-[44px] font-semibold rounded-lg',
          marketingClasses[marketingVariant],
          className
        )}
        {...props}
      >
        {children}
      </V28Button>
    );
  }
);

MarketingButton.displayName = 'MarketingButton';
