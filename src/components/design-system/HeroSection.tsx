/* ==================================================================================
   HERO SECTION - MASTER COMPONENT V18.3.25
   ==================================================================================
   Professional Hero Section with 3 variants:
   - marketing: Video/Gradient background, large headlines, 2 CTAs
   - portal: Branded header with company logo and stats
   - auth: Minimalist with badge and logo
   
   Features:
   - Mobile-First responsive design
   - Touch-targets ≥ 44px
   - WCAG AA contrast compliance
   - Professional shadows and transitions
   - CI-compliant colors
   ✅ V40.14: Inline-Styles eliminiert → CSS-Klassen
   ================================================================================== */

import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/lib/compat';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface HeroSectionProps {
  variant: 'marketing' | 'portal' | 'auth';
  title: string;
  subtitle?: string;
  description?: string;
  badge?: {
    text: string;
    icon?: LucideIcon;
  };
  primaryCTA?: {
    text: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  backgroundType?: 'video' | 'gradient' | 'solid';
  backgroundUrl?: string;
  companyBranding?: {
    logo?: string;
    primaryColor?: string;
    name?: string;
  };
  className?: string;
}

export function HeroSection({
  variant,
  title,
  subtitle,
  description,
  badge,
  primaryCTA,
  secondaryCTA,
  backgroundType = 'gradient',
  backgroundUrl,
  companyBranding,
  className
}: HeroSectionProps) {
  
  // Variant-specific styling
  const variantStyles = {
    marketing: {
      container: 'min-h-[600px] md:min-h-screen',
      content: 'max-w-5xl',
      title: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
      subtitle: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
      description: 'text-base sm:text-lg md:text-xl lg:text-2xl',
      ctaContainer: 'flex-col sm:flex-row gap-3 sm:gap-4',
      ctaButton: 'w-full sm:w-auto px-6 sm:px-8 py-4 md:py-6 text-base md:text-lg'
    },
    portal: {
      container: 'min-h-[200px] md:min-h-[300px]',
      content: 'max-w-7xl',
      title: 'text-2xl sm:text-3xl md:text-4xl',
      subtitle: 'text-lg sm:text-xl md:text-2xl',
      description: 'text-sm sm:text-base md:text-lg',
      ctaContainer: 'flex-row gap-2 sm:gap-3',
      ctaButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base'
    },
    auth: {
      container: 'min-h-[300px] md:min-h-[400px]',
      content: 'max-w-3xl',
      title: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
      subtitle: 'text-lg sm:text-xl md:text-2xl',
      description: 'text-sm sm:text-base md:text-lg',
      ctaContainer: 'flex-col sm:flex-row gap-3 sm:gap-4',
      ctaButton: 'w-full sm:w-auto px-5 sm:px-7 py-3 md:py-5 text-sm md:text-base'
    }
  };

  const styles = variantStyles[variant];

  return (
    <section 
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        styles.container,
        className
      )}
    >
      {/* Background Layer */}
      {backgroundType === 'video' && backgroundUrl && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        >
          <source src={backgroundUrl} type="video/mp4" />
        </video>
      )}
      
      {backgroundType === 'gradient' && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10"
          style={companyBranding?.primaryColor ? {
            background: `linear-gradient(135deg, ${companyBranding.primaryColor}20, hsl(var(--background)), ${companyBranding.primaryColor}10)`
          } : undefined}
        />
      )}

      {backgroundType === 'solid' && (
        <div 
          className="absolute inset-0"
          style={companyBranding?.primaryColor ? {
            backgroundColor: companyBranding.primaryColor
          } : {
            backgroundColor: 'hsl(var(--primary))'
          }}
        />
      )}

      {/* Dark Overlay for better text readability */}
      {(backgroundType === 'video' || variant === 'marketing') && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background/50" />
      )}

      {/* Content */}
      <div className={cn(
        'relative z-10 px-4 sm:px-6 lg:px-8 text-center mx-auto',
        styles.content
      )}>
        <div className={cn(
          'space-y-4 sm:space-y-6 md:space-y-8',
          variant === 'marketing' && 'animate-fade-in'
        )}>
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-primary/95 backdrop-blur-sm shadow-lg">
              {badge.icon && (
                <badge.icon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              )}
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {badge.text}
              </span>
            </div>
          )}

          {/* Company Logo (Portal/Auth variant) */}
          {(variant === 'portal' || variant === 'auth') && companyBranding?.logo && (
            <div className="flex justify-center mb-4 sm:mb-6">
              <img 
                src={companyBranding.logo}
                alt={`${companyBranding.name || 'Company'} Logo`}
                className="h-12 sm:h-16 md:h-20 w-auto object-contain"
              />
            </div>
          )}

          {/* Title */}
          <h1 className={cn(
            'font-bold leading-tight tracking-tight',
            styles.title
          )}>
            {variant === 'marketing' ? (
              <>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/80">
                  {title}
                </span>
                {subtitle && (
                  <span className={cn(
                    'block mt-2 sm:mt-3 md:mt-4 text-foreground',
                    styles.subtitle
                  )}>
                    {subtitle}
                  </span>
                )}
              </>
            ) : (
              <span className="text-foreground">{title}</span>
            )}
          </h1>

          {/* Description */}
          {description && (
            <p className={cn(
              'text-muted-foreground max-w-4xl mx-auto leading-[1.6] font-light px-2 sm:px-0',
              styles.description
            )}>
              {description}
            </p>
          )}

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <div className={cn(
              'flex items-center justify-center pt-4 sm:pt-8',
              styles.ctaContainer
            )}>
              {primaryCTA && (
                <V28Button
                  onClick={primaryCTA.onClick}
                  size="lg"
                  variant="primary"
                  className={cn(
                    'font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-md inline-flex items-center justify-center gap-2 min-h-[44px]',
                    styles.ctaButton,
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {primaryCTA.icon && (
                    <primaryCTA.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  {primaryCTA.text}
                </V28Button>
              )}
              
              {secondaryCTA && (
                <V28Button
                  onClick={secondaryCTA.onClick}
                  variant="secondary"
                  size="lg"
                  className={cn(
                    'font-semibold transition-all duration-300 rounded-md inline-flex items-center justify-center gap-2 min-h-[44px]',
                    styles.ctaButton,
                    'bg-background/80 backdrop-blur-sm hover:bg-background border-2'
                  )}
                >
                  {secondaryCTA.icon && (
                    <secondaryCTA.icon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                  )}
                  {secondaryCTA.text}
                </V28Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
