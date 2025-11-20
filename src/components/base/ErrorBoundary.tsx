/* ==================================================================================
   ERROR BOUNDARY COMPONENT - FEHLERBEHANDLUNG
   ==================================================================================
   ✅ Fängt React-Fehler auf Component-Ebene
   ✅ Zeigt benutzerfreundliche Fehlermeldung
   ✅ Optional: Retry-Funktion
   ==================================================================================
   NUTZUNG: <ErrorBoundary><YourComponent /></ErrorBoundary>
   ================================================================================== */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { EnhancedCard } from "./EnhancedCard";
import { SafeIcon } from "./SafeIcon";
import { logger } from "@/lib/logger";

// ==================================================================================
// TYPES
// ==================================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ==================================================================================
// COMPONENT
// ==================================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log Error
    logger.error("ErrorBoundary caught error", error, {
      component: "ErrorBoundary",
      componentStack: errorInfo.componentStack,
    });

    // Custom Error Handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom Fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default Error UI
      return (
        <EnhancedCard className="max-w-2xl mx-auto my-8">
          <EnhancedCard.Header>
            <div className="flex items-center gap-2">
              <SafeIcon icon={AlertCircle} size="lg" color="text-foreground" />
              <EnhancedCard.Title>Ein Fehler ist aufgetreten</EnhancedCard.Title>
            </div>
            <EnhancedCard.Description>
              Die Komponente konnte nicht geladen werden.
            </EnhancedCard.Description>
          </EnhancedCard.Header>

          <EnhancedCard.Content>
            {/* Error Message (nur in Development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm font-mono text-destructive">{this.state.error.message}</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Bitte versuchen Sie es erneut. Falls das Problem weiterhin besteht, kontaktieren Sie
              unseren Support.
            </p>
          </EnhancedCard.Content>

          <EnhancedCard.Footer>
            <V28Button onClick={this.handleReset} variant="primary" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </V28Button>
          </EnhancedCard.Footer>
        </EnhancedCard>
      );
    }

    return this.props.children;
  }
}

// ==================================================================================
// ERROR FALLBACK COMPONENT (Functional Alternative)
// ==================================================================================

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <EnhancedCard className="max-w-2xl mx-auto my-8">
      <EnhancedCard.Header>
        <div className="flex items-center gap-2">
          <SafeIcon icon={AlertCircle} size="lg" color="text-foreground" />
          <EnhancedCard.Title>Ein Fehler ist aufgetreten</EnhancedCard.Title>
        </div>
      </EnhancedCard.Header>

      <EnhancedCard.Content>
        {import.meta.env.DEV && (
          <div className="p-4 bg-muted rounded-md mb-4">
            <p className="text-sm font-mono text-destructive">{error.message}</p>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.
        </p>
      </EnhancedCard.Content>

      <EnhancedCard.Footer>
        <V28Button onClick={resetError} variant="primary" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Erneut versuchen
        </V28Button>
      </EnhancedCard.Footer>
    </EnhancedCard>
  );
}
