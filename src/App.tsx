import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { LarkPricingProvider } from "@/components/pricing/LarkPricingProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = lazy(() => import("./pages/Index"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const THGFulfillPage = lazy(() => import("./pages/THGFulfillPage"));
const THGExpressPage = lazy(() => import("./pages/THGExpressPage"));
const THGWarehousePage = lazy(() => import("./pages/THGWarehousePage"));
const THGOrderPage = lazy(() => import("./pages/THGOrderPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const InternationalPricingPage = lazy(() => import("./pages/InternationalPricingPage"));
const DomesticPricingPage = lazy(() => import("./pages/DomesticPricingPage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const AgentPage = lazy(() => import("./pages/AgentPage"));
const ShippingPolicyPage = lazy(() => import("./pages/ShippingPolicyPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));

/**
 * ScrollToTop — resets scroll on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

/**
 * AppRoutes — uses location.key on ErrorBoundary to force clean React remounts
 * on every route change, preventing GTranslate-modified DOM nodes from causing
 * React reconciliation crashes (the root cause of the blank page bug).
 */
const AppRoutes = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
        <ErrorBoundary key={location.pathname}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/policy" element={<PolicyPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/international-pricing" element={<InternationalPricingPage />} />
            <Route path="/domestic-pricing" element={<DomesticPricingPage />} />
            <Route path="/thg-fulfill" element={<THGFulfillPage />} />
            <Route path="/thg-express" element={<THGExpressPage />} />
            <Route path="/thg-warehouse" element={<THGWarehousePage />} />
            <Route path="/thg-order" element={<THGOrderPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            {/* Internal agent tool — not linked in public nav */}
            <Route path="/agent" element={<AgentPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LarkPricingProvider>
            <AppRoutes />
          </LarkPricingProvider>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </ErrorBoundary>
);

export default App;
