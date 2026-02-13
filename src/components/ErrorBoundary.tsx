import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-lender-bg">
        <div className="card max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-red-400 mb-2">
            Något gick fel
          </h1>
          <p className="text-lender-text-secondary mb-4">
            Ett oväntat fel inträffade. Försök ladda om sidan.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-left text-xs text-red-300 bg-black/30 rounded p-3 mb-4 overflow-auto max-h-40">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="btn-primary"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }
}
