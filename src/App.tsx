import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, Language, useI18n } from "@/lib/i18n";
import { LarkPricingProvider } from "@/components/pricing/LarkPricingProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ConsentBanner } from "@/components/cookie/ConsentBanner";
import { TrackingScripts } from "@/components/analytics/TrackingScripts";
import { FloatingContact } from "@/components/FloatingContact";
import { captureUtmOnce } from "@/lib/utm";

// QueryClient — singleton across re-renders. CMS content has 5min stale time,
// so refetches are cheap. Consider hydration once SSR/prerender lands.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Index = lazy(() => import("./pages/Index"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const THGFulfillPage = lazy(() => import("./pages/THGFulfillPage"));
const THGExpressPage = lazy(() => import("./pages/THGExpressPage"));
const THGWarehousePage = lazy(() => import("./pages/THGWarehousePage"));
const THGOrderPage = lazy(() => import("./pages/order/THGOrderPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const InternationalPricingPage = lazy(() => import("./pages/InternationalPricingPage"));
const DomesticPricingPage = lazy(() => import("./pages/DomesticPricingPage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const ShippingPolicyPage = lazy(() => import("./pages/ShippingPolicyPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const JobDetailPage = lazy(() => import("./pages/JobDetailPage"));

/**
 * ScrollToTop — resets scroll on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

/**
 * UtmCapture — runs once on first mount to snapshot incoming utm_* / gclid /
 * fbclid params + the referring page into sessionStorage. Lead and applicant
 * forms read the snapshot on submit so marketing keeps attribution even when
 * the user wanders across pages before converting.
 */
const UtmCapture = () => {
  useEffect(() => { captureUtmOnce(); }, []);
  return null;
};

/**
 * LangLayout — validates the :lang URL prefix, syncs it to I18n context,
 * and redirects invalid lang codes to /vi/rest-of-path.
 */
const VALID_LANGS: Language[] = ["en", "vi", "zh"];

const LangLayout = () => {
  const { lang } = useParams<{ lang: string }>();
  const { setLanguage } = useI18n();
  const location = useLocation();

  const isValid = !!lang && (VALID_LANGS as string[]).includes(lang);

  useEffect(() => {
    if (isValid) setLanguage(lang as Language);
  }, [lang, isValid, setLanguage]);

  if (!isValid) {
    // Legacy URL (e.g., /thg-fulfill, /blog/my-post) or unknown lang code —
    // redirect to /vi + full original path so old links keep working.
    // Nginx try_files serves index.html for all paths, so React handles this.
    return <Navigate to={`/vi${location.pathname}`} replace />;
  }

  return <Outlet />;
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
            {/* Root redirect — send bare / to default locale */}
            <Route path="/" element={<Navigate to="/vi" replace />} />
            {/* Lang-prefixed routes — /:lang validates and syncs language state */}
            <Route path="/:lang" element={<LangLayout />}>
              <Route index element={<Index />} />
              <Route path="policy" element={<PolicyPage />} />
              <Route path="shipping-policy" element={<ShippingPolicyPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="international-pricing" element={<InternationalPricingPage />} />
              <Route path="domestic-pricing" element={<DomesticPricingPage />} />
              <Route path="thg-fulfill" element={<THGFulfillPage />} />
              <Route path="thg-express" element={<THGExpressPage />} />
              <Route path="thg-warehouse" element={<THGWarehousePage />} />
              <Route path="thg-order" element={<THGOrderPage />} />
              <Route path="catalog" element={<CatalogPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="careers/:slug" element={<JobDetailPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <LarkPricingProvider>
                <UtmCapture />
                <AppRoutes />
                <FloatingContact />
                <ConsentBanner />
                <TrackingScripts />
              </LarkPricingProvider>
            </BrowserRouter>
          </TooltipProvider>
        </I18nProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
