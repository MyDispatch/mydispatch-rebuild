/* ==================================================================================
   V28 MARKETING SECTION - CENTERED & CLEAN
   ==================================================================================
   ✅ Zentrierte Texte (Title + Description)
   ✅ bg-slate-50 statt Canvas-Beige
   ✅ Konsistente Abstände (py-20 md:py-24)
   ✅ Max-width für Description (3xl)
   ================================================================================== */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface V28MarketingSectionProps {
  id?: string;
  background?: 'white' | 'canvas' | 'orbs-light';
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function V28MarketingSection({
  id,
  background = 'canvas',
  title,
  description,
  children,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
}: V28MarketingSectionProps) {
  const bgClass = background === 'white' ? 'bg-white' : background === 'orbs-light' ? 'bg-white relative overflow-hidden' : 'bg-slate-50';

  return (
    <section id={id} className={cn('py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24', bgClass, className)}>
      {/* Floating Orbs für orbs-light Variante */}
      {background === 'orbs-light' && (
        <>
          <div
            className="absolute top-[10%] right-[5%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-slate-100 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse"
            style={{ animationDuration: '8s' }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-[15%] left-[5%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-slate-200 rounded-full blur-3xl opacity-25 pointer-events-none animate-pulse"
            style={{ animationDuration: '12s', animationDelay: '3s' }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {title && (
          <h2
            className={cn(
              'font-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-slate-900 mb-2 sm:mb-3 md:mb-4',
              titleClassName
            )}
            style={{ textWrap: 'balance' }}
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            className={cn(
              'font-sans text-sm sm:text-base md:text-lg lg:text-xl text-center text-slate-600 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed',
              descriptionClassName
            )}
            style={{ textWrap: 'pretty' }}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
