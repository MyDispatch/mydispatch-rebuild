/* ==================================================================================
   PAGE ERROR BOUNDARY - SEITEN-EBENE FEHLER-ISOLATION
   ==================================================================================
   Verhindert dass Seiten-Fehler die gesamte App crashen
   ================================================================================== */

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { trackUIError } from "@/lib/error-tracker";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  pageName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class PageErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error
    trackUIError(this.props.pageName, "page_render", error, {
      componentStack: errorInfo.componentStack,
      severity: "high",
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

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Seite nicht verfügbar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Die Seite <span className="font-semibold">{this.props.pageName}</span> ist auf einen
                Fehler gestoßen und konnte nicht geladen werden.
              </p>

              {this.state.error && (
                <div className="bg-muted p-4 rounded-md">
                  <p className="font-mono text-sm text-destructive">{this.state.error.message}</p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                        Technische Details anzeigen
                      </summary>
                      <pre className="mt-2 text-xs overflow-x-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <V28Button onClick={this.handleReset} variant="primary" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Seite neu laden
                </V28Button>
                <V28Button onClick={this.handleGoHome} variant="secondary" className="gap-2">
                  <Home className="h-4 w-4" />
                  Zum Dashboard
                </V28Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Der Fehler wurde automatisch an unser Support-Team gemeldet.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
