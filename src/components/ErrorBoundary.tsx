import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary — catches render errors and shows a retry button
 * instead of a blank screen. Essential for lazy-loaded routes.
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[ErrorBoundary]", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
                    <div className="text-center p-8 max-w-md">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-lg font-bold text-navy mb-2">
                            Đã xảy ra lỗi khi tải trang
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            An error occurred while loading this page. Please try again.
                        </p>
                        <button
                            onClick={this.handleRetry}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                        >
                            🔄 Tải lại / Retry
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
