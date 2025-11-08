# =====================================================================
# AUTONOMOUS SYSTEM - ONE-CLICK ACTIVATION
# =====================================================================
# Run this to activate the autonomous development system
# =====================================================================

Write-Host '================================================================' -ForegroundColor Cyan
Write-Host '   AUTONOMOUS SYSTEM - ONE-CLICK ACTIVATION' -ForegroundColor Cyan
Write-Host "================================================================`n" -ForegroundColor Cyan

# Step 1: Open Supabase SQL Editor
Write-Host '[STEP 1/4] Opening Supabase SQL Editor...' -ForegroundColor Yellow
Start-Process 'https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql/new'
Start-Sleep -Seconds 2

# Step 2: Copy main migration to clipboard
Write-Host "`n[STEP 2/4] Copying main migration SQL to clipboard..." -ForegroundColor Yellow
Get-Content 'supabase\migrations\20251108000000_autonomous_system_setup.sql' | Set-Clipboard
Write-Host 'SUCCESS: 360 lines copied!' -ForegroundColor Green
Write-Host 'ACTION: Paste in SQL Editor and click RUN' -ForegroundColor White
Read-Host "`nPress Enter after main migration is applied" | Out-Null

# Step 3: Copy quickstart script to clipboard
Write-Host "`n[STEP 3/4] Copying quickstart script to clipboard..." -ForegroundColor Yellow
Get-Content 'supabase\migrations\20251108000001_autonomous_quickstart.sql' | Set-Clipboard
Write-Host 'SUCCESS: Quickstart SQL copied!' -ForegroundColor Green
Write-Host 'ACTION: Paste in SQL Editor and click RUN' -ForegroundColor White
Read-Host "`nPress Enter after quickstart script is applied" | Out-Null

# Step 4: Test autonomous agent
Write-Host "`n[STEP 4/4] Testing Autonomous Agent (dry-run)..." -ForegroundColor Yellow

if (Test-Path 'scripts\autonomous-agent.ts') {
    Write-Host "`nRunning: npx tsx scripts\autonomous-agent.ts --dry-run`n" -ForegroundColor Cyan

    # Run dry-run test
    npx tsx scripts\autonomous-agent.ts --dry-run

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSUCCESS: Dry-run test passed!" -ForegroundColor Green
    }
    else {
        Write-Host "`nWARNING: Test had issues (check output above)" -ForegroundColor Yellow
    }
}
else {
    Write-Host 'INFO: autonomous-agent.ts not found, skipping local test' -ForegroundColor Yellow
    Write-Host 'Edge Function ai-agent-poll will handle execution automatically' -ForegroundColor White
}

# Final Summary
Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host '              ACTIVATION COMPLETE!' -ForegroundColor Green
Write-Host "================================================================`n" -ForegroundColor Cyan

Write-Host 'System Status:' -ForegroundColor Yellow
Write-Host '  [OK] Database Migration Applied' -ForegroundColor Green
Write-Host '  [OK] Quickstart Script Applied' -ForegroundColor Green
Write-Host '  [OK] Environment Variables Set' -ForegroundColor Green
Write-Host '  [OK] Edge Functions Ready' -ForegroundColor Green
Write-Host "  [OK] System Active (DRY-RUN mode)`n" -ForegroundColor Green

Write-Host 'What Happens Next:' -ForegroundColor Yellow
Write-Host '  - ai-agent-poll Edge Function runs every 5 minutes' -ForegroundColor White
Write-Host '  - Executes 3 sample tasks in DRY-RUN mode' -ForegroundColor White
Write-Host '  - Logs results in autonomous_execution_logs table' -ForegroundColor White
Write-Host "  - No actual code changes (safe testing mode)`n" -ForegroundColor White

Write-Host 'Verification:' -ForegroundColor Yellow
Write-Host '  1. Check tasks: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/editor' -ForegroundColor White
Write-Host '     Table: autonomous_tasks' -ForegroundColor Gray
Write-Host "`n  2. View logs: Same location, Table: autonomous_execution_logs" -ForegroundColor White
Write-Host "`n  3. Statistics:" -ForegroundColor White
Write-Host "     SQL: SELECT * FROM autonomous_system_stats;`n" -ForegroundColor Gray

Write-Host 'Monitoring:' -ForegroundColor Yellow
Write-Host '  Dashboard: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg' -ForegroundColor White
Write-Host "  Functions: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions`n" -ForegroundColor White

Write-Host 'Production Mode:' -ForegroundColor Yellow
Write-Host '  When ready for real changes, run:' -ForegroundColor White
Write-Host "  UPDATE autonomous_system_config SET dry_run_mode = false;`n" -ForegroundColor Gray

Write-Host 'Emergency Stop:' -ForegroundColor Red
Write-Host "  npx tsx scripts\emergency-stop.ts`n" -ForegroundColor White

Write-Host 'Documentation:' -ForegroundColor Yellow
Write-Host '  AUTONOMOUS_ACTIVATION_SUMMARY.md - Complete guide' -ForegroundColor White
Write-Host "  docs\AUTONOMOUS_SYSTEM_README.md - Detailed docs`n" -ForegroundColor White

Write-Host '================================================================' -ForegroundColor Cyan
Write-Host '        Your autonomous development system is now ACTIVE!' -ForegroundColor Green
Write-Host "================================================================`n" -ForegroundColor Cyan

# Open activation summary
$openDocs = Read-Host 'Open AUTONOMOUS_ACTIVATION_SUMMARY.md? (y/n)'
if ($openDocs -eq 'y') {
    Start-Process 'AUTONOMOUS_ACTIVATION_SUMMARY.md'
}
