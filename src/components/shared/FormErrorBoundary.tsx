/* ==================================================================================
   FORM ERROR BOUNDARY - FORMULAR-EBENE FEHLER-ISOLATION
   ==================================================================================
   Verhindert dass Formular-Fehler andere Components crashen
   ================================================================================== */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { V28Button } from '@/components/design-system/V28Button';
import { trackUIError } from '@/lib/error-tracker';

interface Props {
  children: React.ReactNode;
  formName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class FormErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error
    trackUIError(this.props.formName, 'form_render', error, {
      componentStack: errorInfo.componentStack,
      severity: 'medium',
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Formular nicht verfügbar</AlertTitle>
          <AlertDescription className="space-y-3">
            <p className="text-sm">
              Das Formular "{this.props.formName}" konnte nicht geladen werden.
            </p>
            {this.state.error && (
              <p className="text-xs font-mono bg-destructive/10 p-2 rounded">
                {this.state.error.message}
              </p>
            )}
            <V28Button
              size="sm"
              variant="secondary"
              onClick={this.handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </V28Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
