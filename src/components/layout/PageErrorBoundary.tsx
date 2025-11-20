/* ==================================================================================
   PAGE ERROR BOUNDARY - Dashboard Page Protection
   ==================================================================================
   ✅ Wraps all dashboard pages with error handling
   ✅ User-friendly error messages
   ✅ Automatic Sentry reporting in production
   ✅ Reload functionality
   ================================================================================== */

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { logger } from "@/lib/logger";

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
    // Log to console in DEV, Sentry in PROD
    logger.error(`Page Error: ${this.props.pageName}`, error, {
      component: this.props.pageName,
      componentStack: errorInfo.componentStack,
      severity: "high",
    });

    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
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
                <h1 className="text-2xl font-bold text-foreground">Fehler beim Laden der Seite</h1>
                <p className="text-muted-foreground">
                  Beim Laden von <strong>{this.props.pageName}</strong> ist ein Fehler aufgetreten.
                </p>
              </div>

              {this.state.error && (
                <div className="text-left bg-muted/50 p-4 rounded-md">
                  <p className="text-sm font-mono text-foreground/80">{this.state.error.message}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <V28Button onClick={this.handleReload} className="flex-1" size="lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Seite neu laden
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
}
