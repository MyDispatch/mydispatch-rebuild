/* ==================================================================================
   BUTTON MIGRATION SCRIPT V1.0
   ==================================================================================
   Migriert ui/button → V28Button
   
   Usage: tsx scripts/migrate-buttons.ts
   ================================================================================== */

interface ButtonMapping {
  oldVariant: string;
  newVariant: 'primary' | 'secondary';
  note?: string;
}

const VARIANT_MAPPINGS: ButtonMapping[] = [
  { oldVariant: 'default', newVariant: 'primary', note: 'Standard → Primary' },
  { oldVariant: 'outline', newVariant: 'secondary', note: 'Outline → Secondary' },
  { oldVariant: 'secondary', newVariant: 'secondary', note: 'Keep Secondary' },
  { oldVariant: 'ghost', newVariant: 'secondary', note: 'Ghost → Secondary' },
  { oldVariant: 'destructive', newVariant: 'primary', note: '⚠️ Destructive → Primary (manual review!)' },
  { oldVariant: 'link', newVariant: 'secondary', note: 'Link → Secondary' },
];

const PRIORITY_FILES = [
  // Dashboard Components (P0)
  'src/components/dashboard/UniversalQuickActionsPanel.tsx',
  'src/components/dashboard/DashboardInfoBoard.tsx',
  'src/components/dashboard/NewBookingDialog.tsx',
  'src/components/dashboard/StatisticsWidget.tsx',
  'src/components/dashboard/WeatherWidget.tsx',
  
  // Design System (P0)
  'src/components/design-system/QuickActions.tsx',
  'src/components/design-system/HeroSection.tsx',
  
  // Dialogs (P1)
  'src/components/dialogs/UnifiedDialog.tsx',
  
  // Forms (P1)
  'src/components/forms/UnifiedForm.tsx',
  'src/components/forms/InlineCustomerForm.tsx',
  
  // Layout (P1)
  'src/components/layout/ActionBar.tsx',
  
  // Mobile (P2)
  'src/components/mobile/MobileDashboard.tsx',
  'src/components/mobile/MobileFahrer.tsx',
];

console.log('🔄 Button Migration V1.0');
console.log('=====================================');
console.log(`Priority files to migrate: ${PRIORITY_FILES.length}`);
console.log('');

console.log('Variant Mappings:');
for (const mapping of VARIANT_MAPPINGS) {
  console.log(`  ${mapping.oldVariant} → ${mapping.newVariant} ${mapping.note ? `(${mapping.note})` : ''}`);
}
console.log('');

let totalMigrations = 0;

for (const filePath of PRIORITY_FILES) {
  console.log(`📄 Processing: ${filePath}`);
  
  // Note: Actual migration done via Lovable tools
  // Steps:
  // 1. Replace import: Button → V28Button
  // 2. Replace component: <Button → <V28Button
  // 3. Map variants according to VARIANT_MAPPINGS
  // 4. Remove unused variant props
  
  totalMigrations++;
}

console.log('');
console.log('=====================================');
console.log(`✅ Migration Plan Complete: ${totalMigrations} files`);
console.log('');
console.log('⚠️  Manual Review Required:');
console.log('- Check destructive buttons (need manual color review)');
console.log('- Verify size props (sm, lg)');
console.log('- Test icon positions');
console.log('- Validate disabled states');

export { VARIANT_MAPPINGS, PRIORITY_FILES };
