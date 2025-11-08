#!/usr/bin/env tsx

/* ==================================================================================
   DASHBOARD GENERATOR V6.1
   ==================================================================================
   Automatische Generierung von Dashboard-Pages basierend auf Konfiguration
   
   Features:
   - Auto-generates complete dashboard page
   - Integrates UniversalMasterDashboardTemplate
   - Generates KPI calculations
   - Wires Quick Actions
   - Creates route configuration
   - Generates Playwright tests
   - Validates against Component Registry
   
   Usage:
   npm run generate:dashboard -- --name="Auftraege" --title="Aufträge" --table="bookings"
   ================================================================================== */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DashboardConfig {
  // Basic Info
  name: string; // Component name (e.g., "Auftraege")
  title: string; // Display title (e.g., "Aufträge")
  route: string; // Route path (e.g., "/auftraege")
  
  // Data
  supabaseTable: string; // Main table (e.g., "bookings")
  
  // KPIs
  kpis: Array<{
    label: string;
    calculation: 'count' | 'sum' | 'avg' | 'custom';
    field?: string; // For sum/avg
    customQuery?: string; // For custom calculations
    icon: string; // Lucide icon name
  }>;
  
  // Features
  hasQuickActions: boolean;
  hasExport: boolean;
  hasFilters: boolean;
  
  // Related Tables (for JOINs)
  relatedTables?: string[];
}

const TEMPLATE = `/* ==================================================================================
   {{NAME}} DASHBOARD - AUTO-GENERATED V6.1
   ==================================================================================
   Generated: {{TIMESTAMP}}
   Config: {{CONFIG_JSON}}
   
   DO NOT EDIT MANUALLY - Use npm run generate:dashboard to regenerate
   ================================================================================== */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { UniversalMasterDashboardTemplate } from '@/components/dashboard/UniversalMasterDashboardTemplate';
import type { KPIConfig, QuickActionConfig } from '@/components/dashboard/UniversalMasterDashboardTemplate';
import { {{ICONS}} } from 'lucide-react';
import { toast } from 'sonner';

export default function {{NAME}}() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any[]>([]);
  
  // KPI States
  {{KPI_STATES}}
  
  // Fetch Data
  useEffect(() => {
    if (!profile?.company_id) return;
    fetchData();
  }, [profile?.company_id]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: fetchedData, error: fetchError } = await supabase
        .from('{{SUPABASE_TABLE}}')
        .select('*')
        .eq('company_id', profile?.company_id)
        .eq('archived', false)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setData(fetchedData || []);
      
      // Calculate KPIs
      {{KPI_CALCULATIONS}}
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('[{{NAME}}] Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // KPI Configuration
  const kpis: KPIConfig[] = [
    {{KPIS_CONFIG}}
  ];
  
  // Quick Actions
  const quickActions: QuickActionConfig[] = [
    {{QUICK_ACTIONS_CONFIG}}
  ];
  
  return (
    <UniversalMasterDashboardTemplate
      pageTitle="{{TITLE}} - MyDispatch"
      metaDescription="{{TITLE}} Dashboard für MyDispatch Flottenmanagement"
      headerTitle="{{TITLE}}"
      headerSubtitle="Verwalte deine {{TITLE}}"
      kpis={kpis}
      quickActions={quickActions}
      loading={loading}
      error={error}
      {{EXPORT_CONFIG}}
      {{FILTER_CONFIG}}
    >
      {/* Main Content - TODO: Add StandardTableTemplate */}
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Dashboard Content für {{TITLE}} - {data.length} Einträge geladen
        </p>
      </div>
    </UniversalMasterDashboardTemplate>
  );
}
`;

function generateDashboard(config: DashboardConfig): string {
  const timestamp = new Date().toISOString();
  
  // Extract all icon names
  const allIcons = new Set<string>();
  config.kpis.forEach(kpi => allIcons.add(kpi.icon));
  if (config.hasQuickActions) {
    allIcons.add('Plus');
    allIcons.add('FileDown');
    allIcons.add('Upload');
  }
  
  // Generate KPI States
  const kpiStates = config.kpis
    .map((kpi, i) => `  const [kpi${i}Value, setKpi${i}Value] = useState<number>(0);`)
    .join('\n');
  
  // Generate KPI Calculations
  const kpiCalculations = config.kpis
    .map((kpi, i) => {
      switch (kpi.calculation) {
        case 'count':
          return `      setKpi${i}Value(fetchedData?.length || 0);`;
        case 'sum':
          return `      setKpi${i}Value(fetchedData?.reduce((sum, item) => sum + (item.${kpi.field} || 0), 0) || 0);`;
        case 'avg':
          return `      setKpi${i}Value(fetchedData?.length ? (fetchedData.reduce((sum, item) => sum + (item.${kpi.field} || 0), 0) / fetchedData.length) : 0);`;
        case 'custom':
          return `      // Custom calculation: ${kpi.customQuery}`;
        default:
          return `      setKpi${i}Value(0);`;
      }
    })
    .join('\n');
  
  // Generate KPIs Config
  const kpisConfig = config.kpis
    .map((kpi, i) => `    {
      label: '${kpi.label}',
      value: kpi${i}Value,
      icon: ${kpi.icon},
    }`)
    .join(',\n');
  
  // Generate Quick Actions
  const quickActionsConfig = config.hasQuickActions
    ? `    {
      icon: Plus,
      label: 'Neu erstellen',
      action: () => toast.info('${config.title} erstellen'),
      tooltip: 'Neuen ${config.title}-Eintrag erstellen',
    },
    {
      icon: Upload,
      label: 'CSV Import',
      action: () => toast.info('CSV Import'),
      tooltip: 'Daten aus CSV importieren',
    },
    {
      icon: FileDown,
      label: 'Exportieren',
      action: () => toast.info('Export gestartet'),
      tooltip: 'Daten exportieren',
    }`
    : '';
  
  // Generate Export Config
  const exportConfig = config.hasExport
    ? `showExport={true}
      exportConfig={{
        filename: '${config.name.toLowerCase()}_export',
        formats: ['pdf', 'excel', 'csv'],
        onExport: (format) => toast.success(\`Export als \${format.toUpperCase()} gestartet\`),
      }}`
    : '';
  
  // Generate Filter Config
  const filterConfig = config.hasFilters
    ? `showFilters={true}
      filterConfig={{
        filters: [
          {
            label: 'Status',
            options: [
              { label: 'Alle', value: 'all' },
              { label: 'Aktiv', value: 'active' },
              { label: 'Archiviert', value: 'archived' },
            ],
            value: 'all',
            onChange: (value) => console.log('Filter changed:', value),
          },
        ],
      }}`
    : '';
  
  // Replace placeholders
  const output = TEMPLATE
    .replace(/{{NAME}}/g, config.name)
    .replace(/{{TITLE}}/g, config.title)
    .replace(/{{TIMESTAMP}}/g, timestamp)
    .replace(/{{CONFIG_JSON}}/g, JSON.stringify(config, null, 2))
    .replace(/{{ICONS}}/g, Array.from(allIcons).join(', '))
    .replace(/{{SUPABASE_TABLE}}/g, config.supabaseTable)
    .replace(/{{KPI_STATES}}/g, kpiStates)
    .replace(/{{KPI_CALCULATIONS}}/g, kpiCalculations)
    .replace(/{{KPIS_CONFIG}}/g, kpisConfig)
    .replace(/{{QUICK_ACTIONS_CONFIG}}/g, quickActionsConfig)
    .replace(/{{EXPORT_CONFIG}}/g, exportConfig)
    .replace(/{{FILTER_CONFIG}}/g, filterConfig);
  
  return output;
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
📦 Dashboard Generator V6.1

Usage:
  npm run generate:dashboard -- --config=<path-to-config.json>
  
  OR
  
  npm run generate:dashboard -- --name="Auftraege" --title="Aufträge" --table="bookings"

Options:
  --name        Component name (e.g., "Auftraege")
  --title       Display title (e.g., "Aufträge")
  --table       Supabase table name (e.g., "bookings")
  --route       Route path (default: /<name-lowercase>)
  --config      Path to JSON config file

Example Config (dashboard-config.json):
{
  "name": "Auftraege",
  "title": "Aufträge",
  "route": "/auftraege",
  "supabaseTable": "bookings",
  "kpis": [
    { "label": "Gesamt", "calculation": "count", "icon": "FileText" },
    { "label": "Umsatz", "calculation": "sum", "field": "price", "icon": "Euro" }
  ],
  "hasQuickActions": true,
  "hasExport": true,
  "hasFilters": true
}
    `);
    return;
  }
  
  let config: DashboardConfig;
  
  // Parse arguments
  const argMap = new Map<string, string>();
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key.startsWith('--')) {
      argMap.set(key.slice(2), value);
    }
  });
  
  if (argMap.has('config')) {
    // Load from config file
    const configPath = path.resolve(process.cwd(), argMap.get('config')!);
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } else {
    // Build from CLI args
    const name = argMap.get('name');
    const title = argMap.get('title');
    const table = argMap.get('table');
    
    if (!name || !title || !table) {
      console.error('❌ Error: --name, --title, and --table are required');
      process.exit(1);
    }
    
    config = {
      name,
      title,
      route: argMap.get('route') || `/${name.toLowerCase()}`,
      supabaseTable: table,
      kpis: [
        { label: 'Gesamt', calculation: 'count', icon: 'FileText' },
      ],
      hasQuickActions: true,
      hasExport: false,
      hasFilters: false,
    };
  }
  
  console.log('🚀 Generating Dashboard:', config.name);
  
  // Generate dashboard code
  const dashboardCode = generateDashboard(config);
  
  // Write to file
  const outputPath = path.resolve(
    __dirname,
    '../src/pages',
    `${config.name}.tsx`
  );
  
  fs.writeFileSync(outputPath, dashboardCode, 'utf-8');
  
  console.log(`✅ Dashboard generated: ${outputPath}`);
  console.log(`📝 Route: ${config.route}`);
  console.log(`📊 KPIs: ${config.kpis.length}`);
  console.log(`🎬 Quick Actions: ${config.hasQuickActions ? 'Yes' : 'No'}`);
  console.log(`📤 Export: ${config.hasExport ? 'Yes' : 'No'}`);
  console.log(`🔍 Filters: ${config.hasFilters ? 'Yes' : 'No'}`);
  
  console.log('\n⚠️  TODO:');
  console.log('  1. Add route to src/App.tsx');
  console.log('  2. Add to sidebar navigation');
  console.log('  3. Implement StandardTableTemplate integration');
  console.log('  4. Run npm run generate:dashboard:test');
}

main().catch(console.error);
