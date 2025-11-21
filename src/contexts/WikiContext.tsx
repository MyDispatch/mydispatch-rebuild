/* ==================================================================================
   WikiContext - Global Wiki State Provider
   ==================================================================================
   Provides Wiki data to entire app
   Auto-loads on app start
   Accessible via useWiki() hook anywhere
   ================================================================================== */

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { WikiLoadResult } from '@/hooks/use-nexify-wiki';
import { useNeXifyWiki } from '@/hooks/use-nexify-wiki';

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

export function WikiProvider({ children, autoLoad = false }: WikiProviderProps) {
  const wiki = useNeXifyWiki({ autoLoad, enableLogging: false });

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
