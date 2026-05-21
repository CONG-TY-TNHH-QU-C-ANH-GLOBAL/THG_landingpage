import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/* ═══════════════════════════════════════════════════════════
   Global error handlers — suppress GTranslate DOM-mutation crashes
   GTranslate rewrites the DOM (adds <font> wrappers, swaps text nodes)
   which causes React reconciliation to fail with errors like:
     "Failed to execute 'removeChild' on 'Node'"
     "Failed to execute 'insertBefore' on 'Node'"
     "The node to be removed is not a child of this node"
   These are non-fatal; React ErrorBoundary handles recovery.
   ═══════════════════════════════════════════════════════════ */
const DOM_ERROR_PATTERNS = [
    "removeChild",
    "insertBefore",
    "appendChild",
    "replaceChild",
    "not a child of this node",
    "Node was not found",
    "Cannot read properties of null",
    "Failed to execute",
];

const isDomMutationError = (msg: string) =>
    DOM_ERROR_PATTERNS.some((p) => msg.includes(p));

window.addEventListener("error", (e) => {
    if (e.message && isDomMutationError(e.message)) {
        console.warn("[Suppressed DOM error]", e.message);
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    }
});

window.addEventListener("unhandledrejection", (e) => {
    const msg = e.reason?.message || String(e.reason || "");
    if (isDomMutationError(msg)) {
        console.warn("[Suppressed unhandled rejection]", msg);
        e.preventDefault();
    }
});

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
