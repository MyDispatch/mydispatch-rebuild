import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ProductionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("❌ React Error Boundary caught an error:", error);
    console.error("Error Info:", errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h1 style={{ color: "#ef4444", marginBottom: "20px" }}>⚠️ Application Error</h1>
          <div
            style={{
              backgroundColor: "#fee",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Error:</h2>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "14px",
              }}
            >
              {this.state.error?.toString()}
            </pre>
          </div>

          {this.state.errorInfo && (
            <details style={{ marginBottom: "20px" }}>
              <summary style={{ cursor: "pointer", marginBottom: "10px" }}>Stack Trace</summary>
              <pre
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "12px",
                }}
              >
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProductionErrorBoundary;
