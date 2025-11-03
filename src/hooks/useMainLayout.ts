import { useState } from 'react';

export function useMainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  return {
    sidebarExpanded,
    toggleSidebar: () => setSidebarExpanded(!sidebarExpanded),
  };
}
