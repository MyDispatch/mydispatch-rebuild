/* ==================================================================================
   V28 MARKETING SECTION - CENTERED & CLEAN
   ==================================================================================
   ✅ Zentrierte Texte (Title + Description)
   ✅ bg-slate-50 statt Canvas-Beige
   ✅ Konsistente Abstände (py-20 md:py-24)
   ✅ Max-width für Description (3xl)
   ================================================================================== */

import { ReactNode } from 'react';
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
    <section id={id} className={cn('py-16 md:py-20 lg:py-24', bgClass, className)}>
      {/* Floating Orbs für orbs-light Variante */}
      {background === 'orbs-light' && (
        <>
          <div 
            className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-slate-100 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse" 
            style={{ animationDuration: '8s' }}
            aria-hidden="true"
          />
          <div 
            className="absolute bottom-[15%] left-[5%] w-[350px] h-[350px] bg-slate-200 rounded-full blur-3xl opacity-25 pointer-events-none animate-pulse" 
            style={{ animationDuration: '12s', animationDelay: '3s' }}
            aria-hidden="true"
          />
        </>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {title && (
          <h2
            className={cn(
              'font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4',
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
              'font-sans text-lg md:text-xl text-center text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed',
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
