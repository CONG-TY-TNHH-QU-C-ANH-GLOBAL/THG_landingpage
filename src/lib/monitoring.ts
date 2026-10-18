// Error monitoring, loaded only when it is configured.
//
// Sentry was imported eagerly by main.tsx and App.tsx: 88 KB of the entry
// bundle, parsed and initialised on every page view, while production builds
// carry no VITE_SENTRY_DSN and so run it disabled. It is now a separate chunk
// fetched after start-up, and only when a DSN is set. Errors raised before it
// arrives are not reported.

type SentryModule = typeof import("@sentry/react");

let sentry: Promise<SentryModule> | null = null;

export function initMonitoring(): void {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn || sentry) return;
    sentry = import("@sentry/react").then((S) => {
        S.init({ dsn, tracesSampleRate: 0.1 });
        return S;
    });
}

export function reportError(error: unknown, componentStack?: string): void {
    void sentry?.then((S) => S.captureException(error, componentStack ? { extra: { componentStack } } : undefined));
}
