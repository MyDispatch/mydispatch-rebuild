# 🔒 GitHub Repository auf Privat stellen (PowerShell Script)
# 
# Usage: .\scripts\make-repo-private.ps1
# 
# Requirements:
# - GitHub Personal Access Token (https://github.com/settings/tokens)
#   - Scope: repo (Full control of private repositories)

param(
    [string]$Repo = "u4231458123-droid/mydispatch-rebuild",
    [string]$Token = ""
)

Write-Host "🔒 GitHub Repository auf Privat stellen" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Token einlesen (falls nicht über Parameter)
if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "⚠️  GitHub Personal Access Token benötigt!" -ForegroundColor Yellow
    Write-Host "   Erstelle Token hier: https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "   Scope: repo (Full control of private repositories)" -ForegroundColor Gray
    Write-Host ""
    $Token = Read-Host "Token eingeben" -AsSecureString
    $TokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Token)
    )
} else {
    $TokenPlain = $Token
}

# Headers vorbereiten
$headers = @{
    "Authorization" = "token $TokenPlain"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "MyDispatch-Repo-Private-Script"
}

# Body vorbereiten
$body = @{
    private = $true
} | ConvertTo-Json

Write-Host "📡 Setze Repository auf PRIVAT..." -ForegroundColor Cyan
Write-Host "   Repository: $Repo" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo" `
        -Method PATCH `
        -Headers $headers `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✅ ERFOLG!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Repository Status:" -ForegroundColor Cyan
    Write-Host "  Name:      $($response.name)" -ForegroundColor White
    Write-Host "  Visibility: $($response.visibility)" -ForegroundColor $(if ($response.private) { "Green" } else { "Red" })
    Write-Host "  URL:       $($response.html_url)" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ Repository ist jetzt PRIVAT!" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ FEHLER!" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Fehlermeldung:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    Write-Host ""
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "💡 Tipp: Token ist ungültig oder hat nicht die richtigen Berechtigungen." -ForegroundColor Yellow
        Write-Host "   Erstelle ein neues Token mit 'repo' Scope:" -ForegroundColor Gray
        Write-Host "   https://github.com/settings/tokens" -ForegroundColor Cyan
    } elseif ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "💡 Tipp: Repository nicht gefunden oder kein Zugriff." -ForegroundColor Yellow
    }
    
    exit 1
}

# Token aus Speicher löschen
$TokenPlain = $null
$Token = $null









