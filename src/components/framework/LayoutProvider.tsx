import { ReactNode, useEffect } from 'react';
import { designFoundation, applyDesignVars } from '@/framework/design';

export function LayoutProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    applyDesignVars(root, designFoundation);
  }, []);

  return children as any;
}

export default LayoutProvider;

