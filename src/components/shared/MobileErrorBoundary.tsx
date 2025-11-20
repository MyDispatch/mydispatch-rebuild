/* ==================================================================================
   MOBILE ERROR BOUNDARY - MOBILE-SPEZIFISCHE FEHLER-ISOLATION
   ==================================================================================
   Optimiert für Mobile-Geräte mit Touch-optimierten Recovery-Optionen
   ================================================================================== */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { trackUIError } from '@/lib/error-tracker';

interface Props {
  children: React.ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MobileErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error
    trackUIError(this.props.componentName, 'mobile_render', error, {
      componentStack: errorInfo.componentStack,
      deviceType: 'mobile',
      screenWidth: window.innerWidth,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/50 m-4">
          <CardContent className="p-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4 inline-block mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-sm font-semibold text-destructive mb-2">
              Komponente nicht verfügbar
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {this.props.componentName} konnte nicht geladen werden
            </p>
            {this.state.error && (
              <details className="mb-4 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer mb-2">
                  Details anzeigen
                </summary>
                <div className="bg-muted p-3 rounded text-xs font-mono break-all">
                  {this.state.error.message}
                </div>
              </details>
            )}
            <V28Button
              onClick={this.handleReset}
              variant="primary"
              className="min-h-[44px] w-full touch-manipulation"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Erneut versuchen
            </V28Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
