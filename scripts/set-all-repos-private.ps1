# Alle GitHub Repositories auf Privat stellen
# 
# Usage: .\scripts\set-all-repos-private.ps1
# 
# Requirements:
# - GitHub Personal Access Token (https://github.com/settings/tokens)
#   - Scope: repo (Full control of private repositories)

param(
    [string]$GitHubUser = "u4231458123-droid",
    [string]$Token = ""
)

Write-Host "=== Alle GitHub Repositories auf Privat stellen ===" -ForegroundColor Yellow
Write-Host ""

# Token einlesen (falls nicht über Parameter)
if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "WARNING: GitHub Personal Access Token benoetigt!" -ForegroundColor Yellow
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

Write-Host "Lade alle Repositories von: $GitHubUser" -ForegroundColor Cyan
Write-Host ""

try {
    # Alle Repositories abrufen
    $repos = @()
    $page = 1
    $perPage = 100
    
    do {
        $url = "https://api.github.com/users/$GitHubUser/repos?page=$page&per_page=$perPage&type=all"
        $response = Invoke-RestMethod -Uri $url -Method GET -Headers $headers
        
        if ($response.Count -eq 0) {
            break
        }
        
        $repos += $response
        $page++
        Write-Host "   Seite $($page-1): $($response.Count) Repositories gefunden" -ForegroundColor Gray
    } while ($response.Count -eq $perPage)
    
    Write-Host ""
    Write-Host "[OK] Insgesamt $($repos.Count) Repositories gefunden" -ForegroundColor Green
    Write-Host ""
    
    # Filtere nur öffentliche Repositories
    $publicRepos = $repos | Where-Object { $_.private -eq $false }
    $privateRepos = $repos | Where-Object { $_.private -eq $true }
    
    Write-Host "Status:" -ForegroundColor Cyan
    Write-Host "   Oeffentlich: $($publicRepos.Count)" -ForegroundColor $(if ($publicRepos.Count -gt 0) { "Red" } else { "Green" })
    Write-Host "   Privat: $($privateRepos.Count)" -ForegroundColor Green
    Write-Host ""
    
    if ($publicRepos.Count -eq 0) {
        Write-Host "[OK] Alle Repositories sind bereits PRIVAT!" -ForegroundColor Green
        Write-Host ""
        exit 0
    }
    
    # Bestätigung
    Write-Host "WARNING: $($publicRepos.Count) Repositories werden auf PRIVAT gesetzt:" -ForegroundColor Yellow
    foreach ($repo in $publicRepos) {
        Write-Host "   - $($repo.full_name)" -ForegroundColor White
    }
    Write-Host ""
    
    $confirm = Read-Host "Fortfahren? (j/n)"
    if ($confirm -ne "j" -and $confirm -ne "J" -and $confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "[ABGEBROCHEN]" -ForegroundColor Red
        exit 0
    }
    
    Write-Host ""
    Write-Host "Setze Repositories auf PRIVAT..." -ForegroundColor Cyan
    Write-Host ""
    
    # Jedes öffentliche Repository auf privat setzen
    $successCount = 0
    $errorCount = 0
    
    foreach ($repo in $publicRepos) {
        Write-Host "   Bearbeite: $($repo.full_name)..." -ForegroundColor Gray -NoNewline
        
        try {
            $body = @{
                private = $true
            } | ConvertTo-Json
            
            $result = Invoke-RestMethod -Uri "https://api.github.com/repos/$($repo.full_name)" `
                -Method PATCH `
                -Headers $headers `
                -Body $body `
                -ContentType "application/json"
            
            Write-Host " [OK] PRIVAT" -ForegroundColor Green
            $successCount++
            
            # Kleine Pause zwischen Requests (API Rate Limiting)
            Start-Sleep -Milliseconds 500
            
        } catch {
            Write-Host " [FEHLER]" -ForegroundColor Red
            Write-Host "      $($_.Exception.Message)" -ForegroundColor Yellow
            $errorCount++
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Gray
    Write-Host ""
    Write-Host "ZUSAMMENFASSUNG:" -ForegroundColor Cyan
    Write-Host "   Erfolgreich: $successCount" -ForegroundColor Green
    Write-Host "   Fehler: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })
    Write-Host ""
    
    if ($successCount -eq $publicRepos.Count) {
        Write-Host "[OK] ALLE Repositories sind jetzt PRIVAT!" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Einige Repositories konnten nicht auf privat gesetzt werden." -ForegroundColor Yellow
    }
    
    Write-Host ""
    
} catch {
    Write-Host "[FEHLER]" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Fehlermeldung:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    Write-Host ""
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "Tipp: Token ist ungueltig oder hat nicht die richtigen Berechtigungen." -ForegroundColor Yellow
        Write-Host "   Erstelle ein neues Token mit 'repo' Scope:" -ForegroundColor Gray
        Write-Host "   https://github.com/settings/tokens" -ForegroundColor Cyan
    } elseif ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "Tipp: Token hat keine Berechtigung fuer alle Repositories." -ForegroundColor Yellow
        Write-Host "   Oder API Rate Limit erreicht (max. 5000 Requests/Stunde)." -ForegroundColor Gray
    } elseif ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "Tipp: Benutzer $GitHubUser nicht gefunden." -ForegroundColor Yellow
    }
    
    exit 1
}

# Token aus Speicher löschen
$TokenPlain = $null
$Token = $null