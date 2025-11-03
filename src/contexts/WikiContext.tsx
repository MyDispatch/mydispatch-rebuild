/* ==================================================================================
   WikiContext - Global Wiki State Provider
   ==================================================================================
   Provides Wiki data to entire app
   Auto-loads on app start
   Accessible via useWiki() hook anywhere
   ================================================================================== */

import { createContext, useContext, ReactNode } from 'react';
import { useNeXifyWiki, WikiLoadResult } from '@/hooks/use-nexify-wiki';

interface WikiContextValue {
  wikiData: WikiLoadResult | null;
  isLoading: boolean;
  error: string | null;
  loadWiki: () => Promise<WikiLoadResult>;
  isReady: boolean;
}

const WikiContext = createContext<WikiContextValue | undefined>(undefined);

interface WikiProviderProps {
  children: ReactNode;
  autoLoad?: boolean;
}

export function WikiProvider({ children, autoLoad = true }: WikiProviderProps) {
  const wiki = useNeXifyWiki({ autoLoad, enableLogging: true });

  return (
    <WikiContext.Provider value={wiki}>
      {children}
    </WikiContext.Provider>
  );
}

export function useWiki() {
  const context = useContext(WikiContext);
  if (context === undefined) {
    throw new Error('useWiki must be used within a WikiProvider');
  }
  return context;
}
