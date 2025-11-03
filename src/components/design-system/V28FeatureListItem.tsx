/* ==================================================================================
   V28 FEATURE LIST ITEM - FLAT DESIGN
   ==================================================================================
   ✅ Check Icon: text-slate-700 (statt Dunkelblau)
   ✅ Text: text-slate-700 (konsistent)
   ✅ Konsistente Spacing (gap-3)
   ================================================================================== */

import { Check } from 'lucide-react';

interface V28FeatureListItemProps {
  text: string;
  className?: string;
}

export function V28FeatureListItem({ 
  text, 
  className = '' 
}: V28FeatureListItemProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <Check className="h-5 w-5 shrink-0 mt-0.5 text-slate-700" />
      <span className="text-base text-slate-700">{text}</span>
    </div>
  );
}
