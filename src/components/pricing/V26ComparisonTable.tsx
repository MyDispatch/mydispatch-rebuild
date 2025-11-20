/* ==================================================================================
   V26 COMPARISON TABLE - HERO-QUALITÄT MIT GLOW-EFFEKTEN
   ==================================================================================
   ✅ Glowing Table Design
   ✅ Beige/Dunkelblau Premium-Design
   ✅ Smooth Hover-Effekte
   ================================================================================== */

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonFeature {
  name: string;
  starter: boolean;
  business: boolean;
  enterprise: boolean;
}

interface V26ComparisonTableProps {
  features: ComparisonFeature[];
}

export function V26ComparisonTable({ features }: V26ComparisonTableProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-slate-200/50">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            <tr>
              <th className="py-5 px-6 text-left font-sans text-xl font-semibold text-slate-50">
                Feature
              </th>
              <th className="py-5 px-4 text-center font-sans text-xl font-semibold text-slate-50">
                Starter
              </th>
              <th className="py-5 px-4 text-center font-sans text-xl font-semibold bg-slate-100 text-slate-900 border-x-2 border-t-2 border-slate-900">
                Business
              </th>
              <th className="py-5 px-4 text-center font-sans text-xl font-semibold text-slate-50">
                Enterprise
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {features.map((feature, index) => {
              const isLastRow = index === features.length - 1;
              return (
                <tr
                  key={index}
                  className="transition-colors duration-200 border-b border-slate-200/50 hover:bg-slate-50/30"
                >
                  <td className="py-4 px-6 font-sans text-sm font-medium text-slate-900">
                    {feature.name}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {feature.starter ? (
                      <Check className="h-5 w-5 mx-auto text-slate-900" />
                    ) : (
                      <X className="h-5 w-5 mx-auto text-slate-900/30" />
                    )}
                  </td>
                  <td className={cn(
                    "py-4 px-4 text-center bg-slate-100/90",
                    isLastRow 
                      ? "border-x-2 border-b-2 border-slate-900" 
                      : "border-x-2 border-slate-900"
                  )}>
                    {feature.business ? (
                      <Check className="h-5 w-5 mx-auto text-slate-900" />
                    ) : (
                      <X className="h-5 w-5 mx-auto text-slate-900/30" />
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {feature.enterprise ? (
                      <Check className="h-5 w-5 mx-auto text-slate-900" />
                    ) : (
                      <X className="h-5 w-5 mx-auto text-slate-900/30" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
