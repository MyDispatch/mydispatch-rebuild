# Supabase Setup - Vereinfachte Version
# Konfiguriert RESEND_API_KEY Secret

$PROJECT_ID = "vsbqyqhzxmwezlhzdmfd"
$ACCESS_TOKEN = "sbp_c7ba28a3d0760fa168bc483b0a8d8b048dfe58a1"
$RESEND_API_KEY = "re_WWtdb7JV_DJ9iJU4DJrc7ZLkFufufFxi5"

Write-Host "Supabase MyDispatch Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Setze RESEND_API_KEY Secret
Write-Host "Setze RESEND_API_KEY Secret..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type" = "application/json"
}

$secretBody = @{
    name = "RESEND_API_KEY"
    value = $RESEND_API_KEY
} | ConvertTo-Json

$secretUrl = "https://api.supabase.com/v1/projects/$PROJECT_ID/secrets"

try {
    $response = Invoke-RestMethod -Uri $secretUrl -Method Post -Headers $headers -Body $secretBody -ErrorAction Stop
    Write-Host "RESEND_API_KEY erfolgreich gesetzt!" -ForegroundColor Green
} catch {
    Write-Host "Hinweis: Secret existiert moeglicherweise bereits" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Gray
}

Write-Host ""
Write-Host "==========================" -ForegroundColor Cyan
Write-Host "Naechste Schritte:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. SQL-Editor oeffnen:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
Write-Host ""
Write-Host "2. Datei kopieren: setup_master_users.sql" -ForegroundColor White
Write-Host ""
Write-Host "3. Login testen:" -ForegroundColor White
Write-Host "   Email: courbois1981@gmail.com"
Write-Host "   Passwort: 1def!xO2022!!"
Write-Host ""
