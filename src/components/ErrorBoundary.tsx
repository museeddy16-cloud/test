import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f7f7f7;
              padding: 20px;
            }
            .error-content {
              max-width: 500px;
              text-align: center;
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .error-icon {
              width: 80px;
              height: 80px;
              background: #fff3e0;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 24px;
            }
            .error-icon svg {
              color: #ff9800;
            }
            .error-content h1 {
              font-size: 24px;
              margin: 0 0 12px;
              color: #222;
            }
            .error-content p {
              color: #717171;
              margin: 0 0 24px;
              line-height: 1.6;
            }
            .error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
            }
            .error-actions button {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }
            .btn-retry {
              background: #FF5A5F;
              color: white;
              border: none;
            }
            .btn-retry:hover {
              background: #e04a4f;
            }
            .btn-home {
              background: white;
              color: #222;
              border: 1px solid #ddd;
            }
            .btn-home:hover {
              background: #f7f7f7;
            }
            .error-details {
              margin-top: 24px;
              padding-top: 24px;
              border-top: 1px solid #eee;
              text-align: left;
            }
            .error-details summary {
              cursor: pointer;
              color: #717171;
              font-size: 12px;
            }
            .error-details pre {
              background: #f7f7f7;
              padding: 12px;
              border-radius: 8px;
              overflow-x: auto;
              font-size: 11px;
              margin-top: 8px;
            }
          `}</style>

          <div className="error-content">
            <div className="error-icon">
              <AlertTriangle size={40} />
            </div>
            <h1>Something went wrong</h1>
            <p>
              We encountered an unexpected error. Please try again or return to the homepage.
            </p>
            <div className="error-actions">
              <button className="btn-retry" onClick={this.handleRetry}>
                <RefreshCw size={18} />
                Try Again
              </button>
              <button className="btn-home" onClick={this.handleGoHome}>
                <Home size={18} />
                Go Home
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="error-details">
                <details>
                  <summary>Error Details (Development Only)</summary>
                  <pre>
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
