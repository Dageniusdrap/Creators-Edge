import React, { Component, ErrorInfo, ReactNode } from 'react';
import { XCircleIcon } from './icons/XCircleIcon';
import { CycleIcon } from './icons/CycleIcon';
import { TrashIcon } from './icons/TrashIcon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public handleReset = () => {
      this.setState({ hasError: false, error: null });
      window.location.reload();
  };

  public handleFactoryReset = () => {
      if (window.confirm('This will wipe all local data and reset the app to its initial state. Are you sure?')) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
      }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-full p-6">
            <div className="glass-card p-8 max-w-md text-center">
                <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-300 mb-6 text-sm">
                    We encountered an unexpected error. It's not you, it's us.
                </p>
                {this.state.error && (
                    <div className="bg-black/30 p-3 rounded-md mb-6 text-left max-h-32 overflow-auto">
                        <p className="text-xs font-mono text-red-300">{this.state.error.toString()}</p>
                    </div>
                )}
                <div className="space-y-3">
                    <button 
                        onClick={this.handleReset}
                        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <CycleIcon className="h-5 w-5 mr-2" />
                        Reload Application
                    </button>
                    <button 
                        onClick={this.handleFactoryReset}
                        className="w-full inline-flex items-center justify-center px-6 py-3 border border-red-500/30 text-base font-medium rounded-md text-red-400 bg-red-500/10 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Factory Reset
                    </button>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}
