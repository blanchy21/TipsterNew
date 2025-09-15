'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    retryDelay?: number;
    maxRetries?: number;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    retryCount: number;
    isRetrying: boolean;
}

class AsyncErrorBoundary extends Component<Props, State> {
    private retryTimeoutId: number | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
            isRetrying: false,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            // Console statement removed for production
        }

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    componentWillUnmount() {
        if (this.retryTimeoutId) {
            clearTimeout(this.retryTimeoutId);
        }
    }

    handleRetry = () => {
        const { retryDelay = 1000, maxRetries = 3 } = this.props;
        const { retryCount } = this.state;

        if (retryCount >= maxRetries) {
            return;
        }

        this.setState({ isRetrying: true });

        this.retryTimeoutId = window.setTimeout(() => {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                retryCount: retryCount + 1,
                isRetrying: false,
            });
        }, retryDelay);
    };

    resetErrorBoundary = () => {
        if (this.retryTimeoutId) {
            clearTimeout(this.retryTimeoutId);
        }

        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
            isRetrying: false,
        });
    };

    isNetworkError = (error: Error | null): boolean => {
        if (!error) return false;
        return (
            error.message.includes('Network') ||
            error.message.includes('fetch') ||
            error.message.includes('connection') ||
            error.message.includes('timeout') ||
            error.name === 'NetworkError'
        );
    };

    isFirebaseError = (error: Error | null): boolean => {
        if (!error) return false;
        return (
            error.message.includes('Firebase') ||
            error.message.includes('firestore') ||
            error.message.includes('auth') ||
            error.message.includes('storage')
        );
    };

    getErrorMessage = (): string => {
        const { error } = this.state;
        if (!error) return 'An unexpected error occurred';

        if (this.isNetworkError(error)) {
            return 'Network connection issue. Please check your internet connection and try again.';
        }

        if (this.isFirebaseError(error)) {
            return 'Database connection issue. Please try again in a moment.';
        }

        return 'Something went wrong. Please try again.';
    };

    render() {
        const { hasError, error, retryCount, isRetrying } = this.state;
        const { maxRetries = 3, fallback } = this.props;

        if (hasError) {
            // Custom fallback UI
            if (fallback) {
                return fallback;
            }

            const isNetworkError = this.isNetworkError(error);
            const canRetry = retryCount < maxRetries;

            return (
                <div className="min-h-[400px] flex items-center justify-center p-4">
                    <div className="max-w-sm w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isNetworkError ? 'bg-orange-500/20' : 'bg-red-500/20'
                            }`}>
                            {isNetworkError ? (
                                <WifiOff className="w-6 h-6 text-orange-400" />
                            ) : (
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2">
                            {isNetworkError ? 'Connection Issue' : 'Something went wrong'}
                        </h3>

                        <p className="text-slate-300 text-sm mb-4">
                            {this.getErrorMessage()}
                        </p>

                        {process.env.NODE_ENV === 'development' && error && (
                            <details className="mb-4 text-left">
                                <summary className="text-slate-400 cursor-pointer hover:text-white transition-colors text-xs">
                                    Error Details
                                </summary>
                                <div className="mt-2 p-3 bg-slate-900/50 rounded border border-slate-700/50">
                                    <pre className="text-xs text-red-400 whitespace-pre-wrap overflow-auto max-h-20">
                                        {error.toString()}
                                    </pre>
                                </div>
                            </details>
                        )}

                        {canRetry && (
                            <button
                                onClick={this.handleRetry}
                                disabled={isRetrying}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                            >
                                {isRetrying ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Retrying...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        Try Again ({maxRetries - retryCount} left)
                                    </>
                                )}
                            </button>
                        )}

                        {!canRetry && (
                            <div className="text-slate-400 text-sm">
                                Maximum retry attempts reached. Please refresh the page.
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AsyncErrorBoundary;
