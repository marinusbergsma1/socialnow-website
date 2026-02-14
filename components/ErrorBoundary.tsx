import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[SocialNow] Component error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <span className="text-white/40 text-xl">!</span>
            </div>
            <h2 className="text-white text-lg font-semibold mb-2">Er ging iets mis</h2>
            <p className="text-white/50 text-sm mb-6">
              Er is een onverwachte fout opgetreden. Probeer het opnieuw.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-6 py-3 bg-[#25D366] text-black text-sm font-semibold rounded-full hover:bg-[#20bd5a] transition-colors"
              >
                Opnieuw proberen
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white/10 text-white text-sm font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                Pagina herladen
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
