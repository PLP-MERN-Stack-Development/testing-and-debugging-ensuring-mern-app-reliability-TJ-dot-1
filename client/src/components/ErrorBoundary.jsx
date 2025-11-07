import React from 'react';
import { logger } from '../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error using our logger
    logger.error('React Error Boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });

    // Send to error reporting service (e.g., Sentry, LogRocket)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service if available
    if (window.errorReporting) {
      window.errorReporting.captureException(error, {
        extra: {
          componentStack: errorInfo.componentStack,
          errorBoundary: true
        }
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" data-testid="error-boundary" style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#d63031', marginBottom: '16px' }}>
            Oops! Something went wrong.
          </h2>
          <p style={{ color: '#636e72', marginBottom: '20px' }}>
            We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginBottom: '20px' }}>
              <summary style={{ cursor: 'pointer', color: '#0984e3' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <div>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              data-testid="reload-button"
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                backgroundColor: '#0984e3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c5ce7',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;