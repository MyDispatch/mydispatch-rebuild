# Remove all Lovable references - replace with Vercel
# Architecture: Supabase Backend + Vercel Frontend Hosting

Write-Host "Removing Lovable references..." -ForegroundColor Cyan

$replacements = @{
    "Lovable Cloud" = "Vercel"
    "lovable.dev" = "vercel.app"
    "mydispatch.lovable.app" = "mydispatch.vercel.app"
    "Lovable Dashboard" = "Vercel Dashboard"
    "Lovable Preview" = "Vercel Preview"
    "Lovable AI" = "Supabase Edge Functions"
}

$files = Get-ChildItem -Recurse -Include *.md,*.txt,*.json,*.ts,*.tsx,*.js,*.yml,*.yaml,*.sql | Where-Object {
    $_.FullName -notmatch "node_modules|\.git|dist|build|\.next|bun\.lockb"
}

$modified = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }

    if ($content -ne $original) {
        Set-Content $file.FullName -Value $content -NoNewline
        $modified++
        Write-Host "Modified: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nModified $modified files" -ForegroundColor Green
Write-Host "Next: git add -A" -ForegroundColor Yellow
