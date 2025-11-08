# =====================================================================
# Autonomous System Setup - Step-by-Step Guide
# =====================================================================
# Run this script to configure the autonomous development system
# =====================================================================

Write-Host '================================================================' -ForegroundColor Cyan
Write-Host '     AUTONOMOUS SYSTEM SETUP - MyDispatch V32.5            ' -ForegroundColor Cyan
Write-Host "================================================================`n" -ForegroundColor Cyan

# =====================================================================
# STEP 1: Database Migration
# =====================================================================
Write-Host "STEP 1: Apply Database Migration`n" -ForegroundColor Yellow

Write-Host '1. Open Supabase Dashboard:' -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg`n" -ForegroundColor Gray

Write-Host "2. Navigate to: SQL Editor → New Query`n" -ForegroundColor White

Write-Host '3. Copy entire content from:' -ForegroundColor White
Write-Host "   supabase/migrations/20251108000000_autonomous_system_setup.sql`n" -ForegroundColor Gray

Write-Host "4. Paste and click 'Run'`n" -ForegroundColor White

Write-Host "✅ Expected Result: 4 tables created (autonomous_tasks, autonomous_logs, autonomous_configs, autonomous_metrics)`n" -ForegroundColor Green

Read-Host 'Press Enter after migration is applied' | Out-Null

# =====================================================================
# STEP 2: Environment Variables
# =====================================================================
Write-Host "`n📋 STEP 2: Configure Environment Variables`n" -ForegroundColor Yellow

Write-Host 'Add to .env.local:' -ForegroundColor White
Write-Host @'

# Autonomous System
VITE_AUTONOMOUS_MODE=true
VITE_NEXIFY_AUTONOMY_LEVEL=2
VITE_GITKRAKEN_ENABLED=true

# Supabase (if not already set)
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your_anon_key>

'@ -ForegroundColor Gray

# Check if .env.local exists
if (Test-Path '.env.local') {
    Write-Host "`n✅ .env.local exists - please add the autonomous variables above`n" -ForegroundColor Green

    $addVars = Read-Host 'Add autonomous variables to .env.local? (y/n)'

    if ($addVars -eq 'y') {
        $envContent = @"

# ===== Autonomous System (added $(Get-Date -Format 'yyyy-MM-dd HH:mm')) =====
VITE_AUTONOMOUS_MODE=true
VITE_NEXIFY_AUTONOMY_LEVEL=2
VITE_GITKRAKEN_ENABLED=true
"@
        Add-Content -Path '.env.local' -Value $envContent
        Write-Host "✅ Variables added to .env.local`n" -ForegroundColor Green
    }
}
else {
    Write-Host "⚠️  .env.local not found - please create it first`n" -ForegroundColor Red
}

$continue = Read-Host 'Press Enter to continue'

# =====================================================================
# STEP 3: GitHub Secrets
# =====================================================================
Write-Host "`n📋 STEP 3: Configure GitHub Secrets`n" -ForegroundColor Yellow

Write-Host "1. Go to: https://github.com/MyDispatch/mydispatch-rebuild/settings/secrets/actions`n" -ForegroundColor White

Write-Host '2. Add these secrets:' -ForegroundColor White
Write-Host @'

   SUPABASE_ACCESS_TOKEN
   └─ Get from: Supabase Dashboard → Account → Access Tokens

   SUPABASE_DB_PASSWORD
   └─ Get from: Supabase Dashboard → Project Settings → Database

   GITKRAKEN_EMAIL (optional)
   └─ u4231458123@gmail.com

'@ -ForegroundColor Gray

$continue = Read-Host 'Press Enter after GitHub Secrets are configured'

# =====================================================================
# STEP 4: Edge Functions Check
# =====================================================================
Write-Host "`n📋 STEP 4: Check Edge Functions`n" -ForegroundColor Yellow

$edgeFunctions = @(
    'ai-agent-poll',
    'create-gitkraken-patch',
    'autonomous-validator',
    'brain-query',
    'auto-fix-issues'
)

Write-Host "Checking Edge Functions status...`n" -ForegroundColor White

foreach ($func in $edgeFunctions) {
    $funcPath = "supabase\functions\$func\index.ts"
    if (Test-Path $funcPath) {
        Write-Host "✅ $func" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $func (NOT FOUND)" -ForegroundColor Red
    }
}

Write-Host "`nℹ️  Deploy Edge Functions later with: npm run deploy:functions`n" -ForegroundColor Cyan

$continue = Read-Host 'Press Enter to continue'

# =====================================================================
# STEP 5: Supabase Cron Jobs
# =====================================================================
Write-Host "`n📋 STEP 5: Setup Cron Jobs`n" -ForegroundColor Yellow

Write-Host "1. Open Supabase Dashboard → Database → Cron Jobs`n" -ForegroundColor White

Write-Host '2. Add these cron jobs:' -ForegroundColor White
Write-Host @'

   Daily Health Check
   └─ Schedule: 0 6 * * *  (6:00 AM daily)
   └─ Function: supabase.functions.invoke('daily-health-check')

   Wiki Auto-Sync
   └─ Schedule: 0 8 * * *  (8:00 AM daily)
   └─ Function: supabase.functions.invoke('wiki-auto-sync')

   GPS Cleanup
   └─ Schedule: 0 12 * * *  (12:00 PM daily)
   └─ Function: supabase.functions.invoke('cleanup-gps-positions')

   System Audit
   └─ Schedule: 0 18 * * *  (6:00 PM daily)
   └─ Function: supabase.functions.invoke('system-audit')

'@ -ForegroundColor Gray

$continue = Read-Host 'Press Enter after Cron Jobs are configured'

# =====================================================================
# STEP 6: Test Configuration
# =====================================================================
Write-Host "`n📋 STEP 6: Test Configuration`n" -ForegroundColor Yellow

Write-Host "Running configuration checks...`n" -ForegroundColor White

# Check TypeScript
Write-Host 'Checking TypeScript...' -ForegroundColor White
if (Get-Command tsc -ErrorAction SilentlyContinue) {
    Write-Host '✅ TypeScript installed' -ForegroundColor Green
}
else {
    Write-Host '❌ TypeScript not found' -ForegroundColor Red
}

# Check Node version
Write-Host "`nChecking Node.js..." -ForegroundColor White
$nodeVersion = node -v
Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green

# Check GitKraken CLI
Write-Host "`nChecking GitKraken CLI..." -ForegroundColor White
if (Get-Command gk -ErrorAction SilentlyContinue) {
    $gkVersion = gk version
    Write-Host "✅ GitKraken CLI installed: $gkVersion" -ForegroundColor Green
}
else {
    Write-Host '❌ GitKraken CLI not found' -ForegroundColor Red
}

# =====================================================================
# FINAL SUMMARY
# =====================================================================
Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host '║              ✅ SETUP GUIDE COMPLETE                      ║' -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📋 Configuration Checklist:`n" -ForegroundColor Yellow

Write-Host '  [ ] Database Migration applied' -ForegroundColor White
Write-Host '  [ ] Environment variables set (.env.local)' -ForegroundColor White
Write-Host '  [ ] GitHub Secrets configured' -ForegroundColor White
Write-Host '  [ ] Edge Functions deployed' -ForegroundColor White
Write-Host '  [ ] Supabase Cron Jobs active' -ForegroundColor White

Write-Host "`n📖 Next Steps:`n" -ForegroundColor Yellow

Write-Host '1. Deploy Edge Functions:' -ForegroundColor White
Write-Host "   npm run deploy:functions`n" -ForegroundColor Gray

Write-Host '2. Test Autonomous Agent (dry-run):' -ForegroundColor White
Write-Host "   npx tsx scripts/autonomous-agent.ts --dry-run`n" -ForegroundColor Gray

Write-Host '3. Create first autonomous task:' -ForegroundColor White
Write-Host "   Open Supabase Dashboard → autonomous_tasks → Insert row`n" -ForegroundColor Gray

Write-Host '4. Monitor progress:' -ForegroundColor White
Write-Host "   Supabase Dashboard → autonomous_logs table`n" -ForegroundColor Gray

Write-Host '📚 Full Documentation:' -ForegroundColor Yellow
Write-Host "   docs/AUTONOMOUS_SYSTEM_README.md`n" -ForegroundColor Gray

Write-Host '🚨 Emergency Stop:' -ForegroundColor Red
Write-Host "   npx tsx scripts/emergency-stop.ts`n" -ForegroundColor Gray
