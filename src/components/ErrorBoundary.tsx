import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * ErrorBoundary — catches render errors caused by GTranslate DOM mutations
 * or any other unexpected React reconciliation failure.
 *
 * Strategy: auto-recover silently instead of showing an error page.
 *   1st attempt  → reset React tree (fast, no flicker)
 *   2nd attempt  → full page reload (nuclear option)
 *   Prevents infinite reload loops via sessionStorage counter.
 */
class ErrorBoundary extends Component<Props, State> {
    private retryCount = 0;
    private static readonly MAX_RETRIES = 2;
    private static readonly RELOAD_KEY = "__eb_reload_count__";

    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log but do NOT render an error page
        console.warn("[ErrorBoundary] caught →", error.message, errorInfo.componentStack?.slice(0, 200));

        this.retryCount++;

        if (this.retryCount <= ErrorBoundary.MAX_RETRIES) {
            // Fast recovery: just reset the error flag so React re-renders children
            this.setState({ hasError: false });
            return;
        }

        // If we keep crashing, do a full page reload (but prevent infinite loop)
        const reloads = Number(sessionStorage.getItem(ErrorBoundary.RELOAD_KEY) || "0");
        if (reloads < 2) {
            sessionStorage.setItem(ErrorBoundary.RELOAD_KEY, String(reloads + 1));
            window.location.reload();
        }
        // If already reloaded twice, just silently clear error and render children
        // (shows whatever partial content is possible rather than a crash page)
        sessionStorage.removeItem(ErrorBoundary.RELOAD_KEY);
        this.setState({ hasError: false });
    }

    componentDidMount() {
        // Clear reload counter on successful mount (the page is healthy)
        sessionStorage.removeItem(ErrorBoundary.RELOAD_KEY);
    }

    render() {
        if (this.state.hasError) {
            // Fallback during the brief moment before componentDidCatch -> setState
            // This will rarely be visible because we auto-recover above
            if (this.props.fallback) return this.props.fallback;

            // Show a minimal spinner instead of an error page
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
