# Remove all Lovable references and replace with Vercel
# MyDispatch Deployment Architecture: Supabase (Backend) + Vercel (Frontend Hosting)

Write-Host '🔍 Removing all Lovable references from codebase...' -ForegroundColor Cyan

$replacements = @{
    # Deployment references
    'Lovable Cloud'                  = 'Vercel'
    'lovable.dev'                    = 'vercel.app'
    '*.lovable.app'                  = '*.vercel.app'
    'mydispatch.lovable.app'         = 'mydispatch.vercel.app'

    # Documentation references
    'Lovable UI'                     = 'Vercel Dashboard'
    'Lovable Dashboard'              = 'Vercel Dashboard'
    'Lovable Preview'                = 'Vercel Preview Deployment'
    'Lovable.dev Features'           = 'Vercel Features'

    # AI Gateway references (REMOVE - not used)
    'Lovable AI Gateway'             = 'Supabase Edge Functions'
    'Lovable AI'                     = 'AI Features via Supabase'
    'https://ai.gateway.lovable.dev' = '[REMOVED - Not used]'
    'https://api.lovable.dev'        = '[REMOVED - Not used]'
    'LOVABLE_API_KEY'                = '[REMOVED - Not needed]'

    # Documentation links
    'https://docs.lovable.dev'       = 'https://vercel.com/docs'
    '[Lovable Docs]'                 = '[Vercel Docs]'

    # General references (case-insensitive handled by PowerShell)
    'lovable'                        = 'vercel'
}

# Exclude certain files/directories
$excludePaths = @(
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'bun.lockb',
    'package-lock.json'
)

# Get all text files
$files = Get-ChildItem -Recurse -File | Where-Object {
    $file = $_
    $exclude = $false
    foreach ($excludePath in $excludePaths) {
        if ($file.FullName -like "*\$excludePath\*") {
            $exclude = $true
            break
        }
    }

    # Only process text files
    $textExtensions = @('.md', '.txt', '.json', '.ts', '.tsx', '.js', '.jsx', '.yml', '.yaml', '.sh', '.ps1', '.sql')
    $isTextFile = $textExtensions | Where-Object { $file.Extension -eq $_ }

    -not $exclude -and $isTextFile
}

$totalFiles = $files.Count
$modifiedFiles = 0
$totalReplacements = 0

Write-Host "📁 Found $totalFiles text files to check..." -ForegroundColor Yellow

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        $fileReplacements = 0

        foreach ($key in $replacements.Keys) {
            if ($content -match [regex]::Escape($key)) {
                $content = $content -replace [regex]::Escape($key), $replacements[$key]
                $fileReplacements++
            }
        }

        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $modifiedFiles++
            $totalReplacements += $fileReplacements
            Write-Host "✅ Modified: $($file.FullName.Replace($PWD, '.'))" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️  Skipped: $($file.FullName) (Error: $_)" -ForegroundColor Yellow
    }
}

Write-Host "`n✨ Cleanup complete!" -ForegroundColor Cyan
Write-Host '📊 Statistics:' -ForegroundColor White
Write-Host "   - Files checked: $totalFiles" -ForegroundColor White
Write-Host "   - Files modified: $modifiedFiles" -ForegroundColor Green
Write-Host "   - Total replacements: $totalReplacements" -ForegroundColor Green

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host '1. Review changes: git diff' -ForegroundColor White
Write-Host "2. Commit changes: git add -A; git commit -m 'refactor: remove Lovable, use Vercel'" -ForegroundColor White
Write-Host '3. Push to trigger Vercel deployment: git push origin master' -ForegroundColor White

# Special cleanup: Remove lovable-tagger from package.json
Write-Host "`n🗑️  Checking package.json for lovable-tagger..." -ForegroundColor Cyan
$packageJsonPath = 'package.json'
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw
    if ($packageJson -match 'lovable-tagger') {
        Write-Host '⚠️  Found lovable-tagger in package.json' -ForegroundColor Yellow
        Write-Host '   Run manually: npm uninstall lovable-tagger' -ForegroundColor White
    }
}
