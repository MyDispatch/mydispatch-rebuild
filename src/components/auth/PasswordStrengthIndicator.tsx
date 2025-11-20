/* ==================================================================================
   PASSWORD STRENGTH INDICATOR - V18.3
   ==================================================================================
   Zeigt Passwort-Stärke visuell an
   ================================================================================== */

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { calculatePasswordStrength, type PasswordStrength } from '@/lib/password-validation';
import { Check, X, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const LEVEL_CONFIG: Record<PasswordStrength['level'], { 
  color: string; 
  bgColor: string;
  label: string; 
}> = {
  'weak': { 
    color: 'text-status-error', 
    bgColor: 'bg-status-error',
    label: 'Sehr schwach' 
  },
  'fair': { 
    color: 'text-status-warning', 
    bgColor: 'bg-status-warning',
    label: 'Schwach' 
  },
  'good': { 
    color: 'text-primary', 
    bgColor: 'bg-primary',
    label: 'Mittel' 
  },
  'strong': { 
    color: 'text-status-success', 
    bgColor: 'bg-status-success',
    label: 'Stark' 
  },
  'very-strong': { 
    color: 'text-status-success', 
    bgColor: 'bg-status-success',
    label: 'Sehr stark' 
  },
};

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password);
  const config = LEVEL_CONFIG[strength.level];
  
  if (!password) return null;
  
  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Passwort-Stärke</span>
          <span className={cn('font-semibold', config.color)}>
            {config.label}
          </span>
        </div>
        <Progress 
          value={strength.score} 
          className="h-2"
          indicatorClassName={config.bgColor}
        />
      </div>
      
      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((tip, i) => (
            <div 
              key={i} 
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              {strength.isCommon && i === 0 ? (
                <AlertCircle className="h-4 w-4 mt-0.5 text-foreground flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              )}
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Anforderungen-Checklist */}
      <div className="space-y-1 pt-2 border-t">
        <p className="text-xs font-medium text-muted-foreground mb-1">Anforderungen:</p>
        <RequirementItem 
          met={password.length >= 8} 
          label="Mindestens 8 Zeichen" 
        />
        <RequirementItem 
          met={/[A-Z]/.test(password) && /[a-z]/.test(password)} 
          label="Groß- und Kleinbuchstaben" 
        />
        <RequirementItem 
          met={/\d/.test(password)} 
          label="Mindestens eine Zahl" 
        />
        <RequirementItem 
          met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)} 
          label="Mindestens ein Sonderzeichen" 
        />
        <RequirementItem 
          met={!strength.isCommon} 
          label="Kein häufiges Passwort" 
        />
      </div>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="h-4 w-4 text-foreground flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      <span className={cn(
        met ? 'text-status-success' : 'text-muted-foreground'
      )}>
        {label}
      </span>
    </div>
  );
}
