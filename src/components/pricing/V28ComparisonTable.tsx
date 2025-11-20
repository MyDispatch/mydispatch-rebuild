/* ==================================================================================
   V28 COMPARISON TABLE - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ Slate-Gradient Header (statt Dunkelblau)
   ✅ Slate-100 Highlighted Column (statt Beige)
   ✅ Slate-700 Check Icons (statt Dunkelblau)
   ✅ Flat shadow (no glow)
   ✅ NO ROUNDED CORNERS (V28.1 Flat Design)
   ✅ SCROLLBAR UNSICHTBAR (V28.1 Requirement)
   ✅ Clean borders - no gap-filling solutions
   ================================================================================== */

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonFeature {
  name: string;
  starter: boolean;
  business: boolean;
  enterprise: boolean;
}

interface V28ComparisonTableProps {
  features: ComparisonFeature[];
}

export function V28ComparisonTable({ features }: V28ComparisonTableProps) {
  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* Horizontal Scroll Container - SCROLLBAR UNSICHTBAR */}
      <div className="overflow-x-auto scrollbar-invisible">
        <table className="w-full min-w-[600px]">
          {/* Header */}
          <thead className="bg-gradient-to-r from-slate-700 to-slate-800">
            <tr>
              <th className="py-4 md:py-5 px-4 md:px-6 text-left text-base md:text-xl font-semibold text-white">
                Feature
              </th>
              <th className="py-4 md:py-5 px-3 md:px-4 text-center text-sm md:text-xl font-semibold text-white">
                Starter
              </th>
              <th className="py-4 md:py-5 px-3 md:px-4 text-center text-sm md:text-xl font-semibold text-slate-900 bg-slate-100 border-y border-slate-100">
                Business
              </th>
              <th className="py-4 md:py-5 px-3 md:px-4 text-center text-sm md:text-xl font-semibold text-white">
                Enterprise
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {features.map((feature, index) => (
              <tr
                key={index}
                className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200"
              >
                <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-medium text-slate-900">
                  {feature.name}
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4 text-center">
                  {feature.starter ? (
                    <Check className="h-4 md:h-5 w-4 md:w-5 mx-auto text-slate-700" />
                  ) : (
                    <X className="h-4 md:h-5 w-4 md:w-5 mx-auto text-slate-400" />
                  )}
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4 text-center bg-slate-100">
                  {feature.business ? (
                    <Check className="h-4 md:h-5 w-4 md:w-5 mx-auto text-slate-700" />
                  ) : (
                    <X className="h-4 md:h-5 w-4 md:w-5 mx-auto text-slate-400" />
                  )}
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4 text-center">
                  {feature.enterprise ? (
                    <Check className="h-4 md:h-5 w-4 md:w-5 mx-auto text-slate-700" />
                  ) : (
                    <X className="h-4 md:h-5 w-4 md:w-5 mx-auto text-slate-400" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
