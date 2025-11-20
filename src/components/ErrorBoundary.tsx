/* ==================================================================================
   ERROR BOUNDARY - Sentry Integration
   ==================================================================================
   Fängt React-Fehler ab und sendet sie an Sentry
   ================================================================================== */

// import * as Sentry from '@sentry/react'; // DISABLED: Sentry not installed
import { Component, ErrorInfo, ReactNode } from "react";
import { V28Button } from "@/components/design-system/V28Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sende Fehler an Sentry - DISABLED: Sentry not installed
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack,
    //     },
    //   },
    //   tags: {
    //     errorBoundary: true,
    //   },
    // });

    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center max-w-md p-8">
              <h1 className="text-2xl font-bold mb-4 text-foreground">
                Ein Fehler ist aufgetreten
              </h1>
              <p className="text-muted-foreground mb-6">
                Es tut uns leid, aber etwas ist schiefgelaufen. Bitte versuchen Sie, die Seite neu
                zu laden.
              </p>
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                    Fehlerdetails anzeigen
                  </summary>
                  <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                    {this.state.error.message}
                    {"\n"}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className="flex gap-4 justify-center">
                <V28Button variant="primary" onClick={() => window.location.reload()}>
                  Seite neu laden
                </V28Button>
                <V28Button
                  variant="secondary"
                  onClick={() => this.setState({ hasError: false, error: null })}
                >
                  Erneut versuchen
                </V28Button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
