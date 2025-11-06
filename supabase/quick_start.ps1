# Quick Start - Oeffnet alle wichtigen Supabase URLs

$PROJECT_ID = "vsbqyqhzxmwezlhzdmfd"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Supabase MyDispatch - Quick Start  " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Oeffne Supabase Dashboard URLs..." -ForegroundColor Yellow
Write-Host ""

# URLs
$urls = @{
    "SQL Editor (Master Users)" = "https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
    "Function Secrets (RESEND_API_KEY)" = "https://supabase.com/dashboard/project/$PROJECT_ID/settings/functions"
    "Auth Users" = "https://supabase.com/dashboard/project/$PROJECT_ID/auth/users"
    "Dashboard" = "https://supabase.com/dashboard/project/$PROJECT_ID"
}

$counter = 1
foreach ($name in $urls.Keys) {
    Write-Host "$counter. $name" -ForegroundColor White
    Write-Host "   $($urls[$name])" -ForegroundColor Gray
    Start-Sleep -Milliseconds 500
    Start-Process $urls[$name]
    $counter++
    Write-Host ""
}

Write-Host "Alle URLs wurden im Browser geoeffnet!" -ForegroundColor Green
Write-Host ""
Write-Host "Naechste Schritte:" -ForegroundColor Cyan
Write-Host "1. Im SQL Editor: setup_master_users.sql ausfuehren" -ForegroundColor White
Write-Host "2. In Function Secrets: RESEND_API_KEY hinzufuegen" -ForegroundColor White
Write-Host "3. In Auth Users: Master User validieren" -ForegroundColor White
Write-Host ""
