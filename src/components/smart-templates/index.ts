/* ==================================================================================
   SMART TEMPLATES BARREL EXPORT V21.0.0
   ==================================================================================
   ✅ Zentrale Exports für alle wiederverwendbaren Smart Templates
   ✅ Basiert auf Pricing.tsx Master-Vorlage
   ✅ Für schnellen, konsistenten Dashboard-Aufbau
   ================================================================================== */

// Cards
export { DashboardCard } from './DashboardCard';
export { StatCard } from './StatCard';

// Layout
export { SectionHeader } from './SectionHeader';
export { DataGrid } from './DataGrid';

// Interactive
export { ActionButton } from './ActionButton';

/**
 * QUICK START EXAMPLE:
 * 
 * import {
 *   SectionHeader,
 *   DataGrid,
 *   StatCard,
 *   DashboardCard,
 *   ActionButton,
 * } from '@/components/smart-templates';
 * 
 * export default function MyDashboard() {
 *   return (
 *     <>
 *       <SectionHeader
 *         title="Dashboard"
 *         description="Übersicht über alle wichtigen Kennzahlen"
 *         actions={
 *           <ActionButton variant="primary">Neuer Auftrag</ActionButton>
 *         }
 *       />
 *       
 *       <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
 *         <StatCard label="Aufträge" value="142" icon={Truck} />
 *         <StatCard label="Fahrer" value="28" icon={Users} />
 *         <StatCard label="Fahrzeuge" value="35" icon={Car} />
 *         <StatCard label="Umsatz" value="12.450 €" icon={Euro} />
 *       </DataGrid>
 *       
 *       <DataGrid columns={{ mobile: 1, desktop: 2 }}>
 *         <DashboardCard title="Letzte Aufträge" icon={List}>
 *           {// Content}
 *         </DashboardCard>
 *         <DashboardCard title="Aktive Fahrer" icon={Users}>
 *           {// Content}
 *         </DashboardCard>
 *       </DataGrid>
 *     </>
 *   );
 * }
 */
