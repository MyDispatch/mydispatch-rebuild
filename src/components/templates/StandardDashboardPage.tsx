/* ==================================================================================
   STANDARD DASHBOARD PAGE TEMPLATE V45.0 - PREMIUM VIBRANT PROFESSIONAL
   ==================================================================================
   ✅ Wiederverwendbares Template für alle Dashboard-Seiten
   ✅ Einheitliches Layout: Hero → KPIs → Charts → Tables
   ✅ V28.1 Design System compliant
   ✅ Minimiert Code-Duplikation über 37+ Dashboard-Seiten
   
   ✅ V45.0 PREMIUM VIBRANT PROFESSIONAL DESIGN
   ✅ Premium Vibrant Professional Farbpalette
   ✅ Verbesserte Kontraste und leuchtende Farben
   ✅ Business Tarif Premium Features
   ✅ 100% V45.0 Design System kompatibel
   ================================================================================== */

import { ReactNode } from "react";
import React from "react";
import { LucideIcon } from "lucide-react";
import { SEOHead } from "@/components/shared/SEOHead";
import { V28DashboardSection, V28StatCard, V28DashboardCard } from "@/components/design-system";
import { DataGrid } from "@/components/smart-templates";

export interface KPICardData {
  label: string;
  value: string | number;
  change?: { value: number; trend: "up" | "down" | "neutral" };
  icon?: LucideIcon;
  onClick?: () => void;
}

export interface ChartConfig {
  title: string;
  description?: string;
  icon?: LucideIcon;
  component: ReactNode;
}

export interface TableConfig {
  title: string;
  description?: string;
  icon?: LucideIcon;
  component: ReactNode;
}

interface StandardDashboardPageProps {
  // Meta
  title: string;
  description: string;
  canonical?: string;

  // Background (V28.1 Premium)
  background?: "white" | "canvas" | "orbs-light";

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroBadge?: string;
  heroBadgeIcon?: LucideIcon;

  // Content
  kpis: KPICardData[];
  charts?: ChartConfig[];
  tables?: TableConfig[];

  // Additional Content
  additionalContent?: ReactNode;
}

export function StandardDashboardPage({
  title,
  description,
  canonical,
  background = "canvas",
  heroTitle,
  heroSubtitle,
  heroBadge = "Live-Dashboard",
  heroBadgeIcon,
  kpis,
  charts = [],
  tables = [],
  additionalContent,
}: StandardDashboardPageProps) {
  return (
    <>
      <SEOHead title={title} description={description} canonical={canonical} />

      <div className="px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        {/* ✅ HERO-HEADER */}
        <V28DashboardSection background="white" className="pt-24 pb-12 shadow-lg">
          <div className="animate-fade-in">
            {heroBadge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-blue-100 border border-blue-200 mb-4">
                {heroBadgeIcon &&
                  React.createElement(heroBadgeIcon, { className: "w-4 h-4 text-slate-800" })}
                <span className="font-sans text-sm font-semibold text-slate-800">{heroBadge}</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 mb-3">
              {heroTitle}
            </h1>
            <p className="text-lg text-slate-700 font-medium max-w-2xl">{heroSubtitle}</p>
          </div>
        </V28DashboardSection>

        {/* ✅ KPI GRID */}
        <V28DashboardSection background="canvas" className="py-16 shadow-lg">
          <DataGrid
            columns={{ mobile: 1, tablet: 2, desktop: Math.min(kpis.length, 4) }}
            gap="lg"
            className="animate-fade-in"
          >
            {kpis.map((kpi, index) => (
              <V28StatCard key={index} {...kpi} />
            ))}
          </DataGrid>
        </V28DashboardSection>

        {/* ✅ CHARTS SECTION */}
        {charts.length > 0 && (
          <V28DashboardSection background="white" className="py-16 shadow-lg">
            <div className="space-y-8">
              {charts.map((chart, index) => (
                <V28DashboardCard
                  key={index}
                  title={chart.title}
                  description={chart.description}
                  icon={chart.icon}
                  className="shadow-lg"
                >
                  {chart.component}
                </V28DashboardCard>
              ))}
            </div>
          </V28DashboardSection>
        )}

        {/* ✅ TABLES GRID */}
        {tables.length > 0 && (
          <V28DashboardSection background="canvas" className="py-16 shadow-lg">
            <DataGrid columns={{ mobile: 1, desktop: 2 }} gap="lg">
              {tables.map((table, index) => (
                <V28DashboardCard
                  key={index}
                  title={table.title}
                  description={table.description}
                  icon={table.icon}
                  className="shadow-lg"
                >
                  {table.component}
                </V28DashboardCard>
              ))}
            </DataGrid>
          </V28DashboardSection>
        )}

        {/* ✅ ADDITIONAL CONTENT */}
        {additionalContent && (
          <V28DashboardSection background="white" className="py-16">
            {additionalContent}
          </V28DashboardSection>
        )}
      </div>
    </>
  );
}
