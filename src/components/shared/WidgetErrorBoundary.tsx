/* ==================================================================================
   WIDGET ERROR BOUNDARY - DASHBOARD-WIDGET FEHLER-ISOLATION
   ================================================================================== */

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { trackUIError } from "@/lib/error-tracker";

interface Props {
  children: React.ReactNode;
  widgetName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WidgetErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    trackUIError(`Widget: ${this.props.widgetName}`, "widget_render", error, {
      componentStack: errorInfo.componentStack,
      severity: "medium",
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-status-warning/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-status-warning" />
            <p className="text-sm font-medium mb-3">{this.props.widgetName} nicht verfügbar</p>
            <V28Button
              onClick={() => this.setState({ hasError: false, error: null })}
              size="sm"
              variant="primary"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Erneut laden
            </V28Button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
