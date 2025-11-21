/* ==================================================================================
   V26 TAB NAVIGATION → V28.1 SLATE MIGRATION
   ==================================================================================
   @deprecated Use Radix Tabs instead!
   ✅ V28.1 Slate Colors (bg-slate-100, text-slate-900)
   ✅ Touch-Target: 44px+ (Mobile-First)
   ✅ Responsive Grid Layout
   ================================================================================== */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface V26TabItem {
  id: string;
  label: string | ReactNode;
}

interface V26TabNavigationProps {
  tabs: V26TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function V26TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className,
}: V26TabNavigationProps) {
  return (
    <div className={cn('w-full', className)}>
      <div
        className="grid gap-2 p-1.5 rounded-lg bg-slate-100"
        style={{
          gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'text-xs sm:text-sm py-2.5 sm:py-3 min-h-[44px] rounded-lg font-semibold transition-all',
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-transparent text-slate-900 hover:bg-slate-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
