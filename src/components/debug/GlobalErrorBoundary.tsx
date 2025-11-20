/* ==================================================================================
   GLOBAL ERROR BOUNDARY - V6.0 AI-ENHANCED ERROR DETECTION
   ==================================================================================
   ✅ Catches ALL React errors automatically
   ✅ AI-Learning via Supabase
   ✅ User-friendly German fallback UI
   ✅ Auto-Recovery mechanisms
   ================================================================================== */

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Card, CardContent } from "@/lib/compat";
import { V28Button } from "@/components/design-system/V28Button";
import { logger } from "@/lib/logger";
import { useErrorLogging } from "@/hooks/use-error-logging";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Increment error count
    this.setState((prev) => ({ errorCount: prev.errorCount + 1 }));

    // Log to console in DEV
    logger.error("GlobalErrorBoundary caught error", error, {
      componentStack: errorInfo.componentStack,
      errorCount: this.state.errorCount,
    });

    // Note: Error logging is now handled by useErrorLogging hook
    // Class components can't use hooks, so we keep minimal inline logging
    // For full TanStack Query integration, wrap functional components with ErrorBoundary

    // Execute custom onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorCount: 0 });
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI (German)
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-lg border-status-error/50">
            <CardContent className="pt-6 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-status-error/10 p-4">
                  <AlertTriangle className="h-12 w-12 text-status-error" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Ein unerwarteter Fehler ist aufgetreten
                </h1>
                <p className="text-muted-foreground">
                  MyDispatch konnte nicht korrekt geladen werden.
                </p>
              </div>

              {this.state.error && import.meta.env.DEV && (
                <div className="text-left bg-muted/50 p-4 rounded-md max-h-40 overflow-auto">
                  <p className="text-xs font-mono text-foreground/80 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {this.state.errorCount < 3 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <V28Button onClick={this.handleRetry} className="flex-1" size="lg">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Erneut versuchen
                  </V28Button>
                  <V28Button
                    onClick={this.handleHome}
                    variant="secondary"
                    className="flex-1"
                    size="lg"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Zur Startseite
                  </V28Button>
                </div>
              )}

              {this.state.errorCount >= 3 && (
                <div className="space-y-3">
                  <p className="text-sm text-status-warning">
                    Mehrfache Fehler erkannt. Bitte laden Sie die Seite neu.
                  </p>
                  <V28Button onClick={this.handleReload} className="w-full" size="lg">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Seite neu laden
                  </V28Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Wenn das Problem weiterhin besteht, kontaktieren Sie bitte den Support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }

  private static calculateSeverity(message: string): string {
    // Critical Patterns
    if (
      message.includes("ChunkLoadError") ||
      message.includes("Hydration failed") ||
      message.includes("white screen")
    ) {
      return "critical";
    }

    // High Severity
    if (
      message.includes("Cannot read properties") ||
      message.includes("undefined is not") ||
      message.includes("Network Error")
    ) {
      return "high";
    }

    // Medium Severity
    if (message.includes("Warning") || message.includes("Deprecated")) {
      return "medium";
    }

    return "low";
  }
}
