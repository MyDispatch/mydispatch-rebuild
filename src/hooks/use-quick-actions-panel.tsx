/* ==================================================================================
   QUICK ACTIONS PANEL CONTEXT HOOK V1.0
   ==================================================================================
   Context Provider für Quick Actions Panel Config-Passing von Pages → MainLayout
   ================================================================================== */

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface QuickActionsPanelConfig {
  enabled: boolean;
  quickActions: Array<{
    icon: LucideIcon;
    label: string;
    action: () => void;
    tooltip?: string;
    variant?: 'quick-action-primary' | 'secondary';
  }>;
  recentActivities?: Array<{
    icon: LucideIcon;
    iconColor?: string;
    title: string;
    time: string;
  }>;
  contextWidget: {
    title: string;
    icon: LucideIcon;
    content: ReactNode;
  };
}

const QuickActionsPanelContext = createContext<{
  config: QuickActionsPanelConfig | null;
  setConfig: (config: QuickActionsPanelConfig | null) => void;
}>({
  config: null,
  setConfig: () => {},
});

export const QuickActionsPanelProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<QuickActionsPanelConfig | null>(null);
  
  return (
    <QuickActionsPanelContext.Provider value={{ config, setConfig }}>
      {children}
    </QuickActionsPanelContext.Provider>
  );
};

export const useQuickActionsPanel = () => useContext(QuickActionsPanelContext);
