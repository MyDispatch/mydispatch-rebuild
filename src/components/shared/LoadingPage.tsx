/* ==================================================================================
   LOADING PAGE V18.5.13 - FIX FÜR WEIßE SEITEN
   ==================================================================================
   Fullscreen Loading-State für bessere UX
   - Verhindert weiße Seiten während Auth-Checks
   - Branded Loading Experience
   - Smooth Transitions
   ================================================================================== */

import { Loader2 } from 'lucide-react';

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Lade Anwendung...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
        {/* Logo/Brand */}
        <div className="mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
        
        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            {message}
          </h2>
          <p className="text-sm text-muted-foreground">
            Bitte warten Sie einen Moment...
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="w-full max-w-xs mt-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-[70%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
