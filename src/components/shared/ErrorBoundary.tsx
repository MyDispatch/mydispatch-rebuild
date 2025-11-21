/* ==================================================================================
   ERROR BOUNDARY - GLOBALE FEHLERBEHANDLUNG
   ==================================================================================
   Zentrale Fehlerbehandlung mit automatischem Logging
   ================================================================================== */

import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { Card } from '@/components/ui/card';
import { logError } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Supabase
    logError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: 'error',
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
          <Card className="max-w-2xl w-full p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Ein Fehler ist aufgetreten
                </h1>
                <p className="text-muted-foreground">
                  Die Anwendung ist auf einen unerwarteten Fehler gestoßen.
                  Bitte laden Sie die Seite neu oder kontaktieren Sie den Support.
                </p>
              </div>

              {this.state.error && (
                <div className="w-full bg-muted p-4 rounded-md text-left">
                  <p className="font-mono text-sm text-destructive mb-2">
                    {this.state.error.message}
                  </p>
                  {import.meta.env.DEV && this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                        Technische Details anzeigen
                      </summary>
                      <pre className="mt-2 text-xs overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <V28Button onClick={this.handleReset} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Seite neu laden
                </V28Button>
                <V28Button 
                  variant="secondary" 
                  onClick={() => window.location.reload()}
                >
                  Zur Startseite
                </V28Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
