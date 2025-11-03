/* ==================================================================================
   V28 PROGRESS - PROGRESS INDICATOR COMPONENT
   ==================================================================================
   ✅ Linear progress bar
   ✅ Circular progress (optional)
   ✅ Customizable colors
   ✅ Label support
   ================================================================================== */

import { cn } from '@/lib/utils';

interface V28ProgressProps {
  value: number; // 0-100
  max?: number;
  type?: 'linear' | 'circular';
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function V28Progress({
  value,
  max = 100,
  type = 'linear',
  label,
  showPercentage = true,
  variant = 'primary',
  className,
}: V28ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  if (type === 'circular') {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={cn('inline-flex flex-col items-center gap-2', className)}>
        <div className="relative">
          <svg className="transform -rotate-90 w-24 h-24">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-200"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn(
                'transition-all duration-300',
                variant === 'primary' && 'text-slate-700',
                variant === 'success' && 'text-green-600',
                variant === 'warning' && 'text-amber-600',
                variant === 'error' && 'text-red-600'
              )}
            />
          </svg>
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-slate-900">
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>
        {label && <span className="text-sm text-slate-600">{label}</span>}
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-2', className)}>
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-slate-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            variant === 'primary' && 'bg-slate-700',
            variant === 'success' && 'bg-green-600',
            variant === 'warning' && 'bg-amber-600',
            variant === 'error' && 'bg-red-600'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
