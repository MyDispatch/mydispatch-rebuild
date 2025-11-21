# Color Migration Script V33.4
# Automated hardcoded color \u2192 semantic token migration

$mappings = @(
    @{ Pattern = 'bg-green-50'; Replacement = 'bg-success-light' },
    @{ Pattern = 'bg-green-600'; Replacement = 'bg-success' },
    @{ Pattern = 'text-green-500'; Replacement = 'text-success' },
    @{ Pattern = 'text-green-600'; Replacement = 'text-success-text' },
    @{ Pattern = 'text-green-700'; Replacement = 'text-success-text' },
    @{ Pattern = 'border-green-'; Replacement = 'border-success-border' },
    
    @{ Pattern = 'bg-red-50'; Replacement = 'bg-error-light' },
    @{ Pattern = 'bg-red-500'; Replacement = 'bg-error' },
    @{ Pattern = 'text-red-500'; Replacement = 'text-error' },
    @{ Pattern = 'text-red-600'; Replacement = 'text-error-text' },
    @{ Pattern = 'border-red-'; Replacement = 'border-error' },
    
    @{ Pattern = 'bg-blue-50'; Replacement = 'bg-info-light' },
    @{ Pattern = 'bg-blue-600'; Replacement = 'bg-info' },
    @{ Pattern = 'text-blue-500'; Replacement = 'text-info' },
    @{ Pattern = 'text-blue-600'; Replacement = 'text-info-text' },
    @{ Pattern = 'text-blue-700'; Replacement = 'text-info-text' },
    @{ Pattern = 'border-blue-200'; Replacement = 'border-info-border' },
    @{ Pattern = 'border-blue-300'; Replacement = 'border-info-border' },
    @{ Pattern = 'hover:bg-blue-50'; Replacement = 'hover:bg-info-light' },
    @{ Pattern = 'hover:border-blue-'; Replacement = 'hover:border-info-border' },
    @{ Pattern = 'hover:text-blue-600'; Replacement = 'hover:text-info-text' },
    @{ Pattern = 'group-hover:text-blue-600'; Replacement = 'group-hover:text-info-text' },
    
    @{ Pattern = 'bg-yellow-50'; Replacement = 'bg-warning-light' },
    @{ Pattern = 'text-yellow-'; Replacement = 'text-warning' }
)

Write-Host "Migration mappings created: $($mappings.Count) rules" -ForegroundColor Green
