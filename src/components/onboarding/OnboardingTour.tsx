/* ==================================================================================
   ONBOARDING TOUR SYSTEM V18.3.24 - INTERAKTIVE NUTZERFÜHRUNG
   ==================================================================================
   ✅ Step-by-Step Guided Tour für neue Nutzer
   ✅ Context-aware Highlighting von UI-Elementen
   ✅ Progress-Tracking (Fortschritt speichern)
   ✅ Überspringbar & Wiederholbar
   ✅ Mobile-optimiert
   ================================================================================== */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Check,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string; // CSS-Selector für Highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
  tips?: string[];
}

interface OnboardingTourProps {
  steps: OnboardingStep[];
  tourId: string; // Unique ID für localStorage
  onComplete: () => void;
  onSkip?: () => void;
  startAutomatically?: boolean;
}

export function OnboardingTour({
  steps,
  tourId,
  onComplete,
  onSkip,
  startAutomatically = true
}: OnboardingTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Check if tour was already completed
  useEffect(() => {
    const completed = localStorage.getItem(`onboarding-${tourId}-completed`);
    if (!completed && startAutomatically) {
      setIsActive(true);
    }
  }, [tourId, startAutomatically]);

  // Highlight target element
  useEffect(() => {
    if (!isActive || !currentStep.targetSelector) {
      if (highlightedElement) {
        highlightedElement.style.position = '';
        highlightedElement.style.zIndex = '';
        highlightedElement.style.outline = '';
        setHighlightedElement(null);
      }
      return;
    }

    const element = document.querySelector(currentStep.targetSelector) as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.position = 'relative';
      element.style.zIndex = '1001';
      element.style.outline = '3px solid hsl(var(--primary))';
      element.style.outlineOffset = '4px';
      setHighlightedElement(element);
    }

    return () => {
      if (element) {
        element.style.position = '';
        element.style.zIndex = '';
        element.style.outline = '';
      }
    };
  }, [isActive, currentStep, currentStepIndex]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
      // Save progress
      localStorage.setItem(`onboarding-${tourId}-progress`, String(currentStepIndex + 1));
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding-${tourId}-completed`, 'true');
    localStorage.removeItem(`onboarding-${tourId}-progress`);
    setIsActive(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(`onboarding-${tourId}-skipped`, 'true');
    setIsActive(false);
    onSkip?.();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1000]" />

      {/* Tour Card */}
      <div
        className={cn(
          'fixed z-[1002] max-w-md w-full mx-auto',
          currentStep.position === 'center' && 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          currentStep.position === 'top' && 'top-20 left-1/2 -translate-x-1/2',
          currentStep.position === 'bottom' && 'bottom-20 left-1/2 -translate-x-1/2',
          currentStep.position === 'left' && 'left-4 top-1/2 -translate-y-1/2',
          currentStep.position === 'right' && 'right-4 top-1/2 -translate-y-1/2',
          !currentStep.position && 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        )}
      >
        <Card className="shadow-2xl border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    Schritt {currentStepIndex + 1} von {steps.length}
                  </Badge>
                </div>
                <CardTitle className="text-foreground">{currentStep.title}</CardTitle>
                <CardDescription className="mt-2">
                  {currentStep.description}
                </CardDescription>
              </div>
              <V28Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="shrink-0 ml-2"
              >
                <X className="h-4 w-4 text-foreground" />
              </V28Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Illustration */}
            {currentStep.illustration && (
              <div className="rounded-lg bg-muted p-4">
                {currentStep.illustration}
              </div>
            )}

            {/* Tips */}
            {currentStep.tips && currentStep.tips.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">💡 Tipps:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {currentStep.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Button */}
            {currentStep.action && (
              <V28Button
                onClick={currentStep.action.onClick}
                className="w-full"
                variant="secondary"
              >
                {currentStep.action.label}
              </V28Button>
            )}

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(progress)}% abgeschlossen
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-2">
            <V28Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2 text-foreground" />
              Zurück
            </V28Button>

            <V28Button
              onClick={handleNext}
              className="flex-1"
              variant={isLastStep ? 'primary' : 'secondary'}
            >
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Fertig
                </>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </V28Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

/* ==================================================================================
   ONBOARDING TRIGGER BUTTON - Zum manuellen Starten des Onboardings
   ================================================================================== */

interface OnboardingTriggerProps {
  onClick: () => void;
  label?: string;
}

export function OnboardingTrigger({ onClick, label = 'Tour starten' }: OnboardingTriggerProps) {
  return (
    <V28Button onClick={onClick} variant="secondary" size="sm">
      <Rocket className="h-4 w-4 mr-2 text-foreground" />
      {label}
    </V28Button>
  );
}
