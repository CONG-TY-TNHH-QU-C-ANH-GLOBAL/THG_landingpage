import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";

// Lazy-load all pages for code splitting
const Index = lazy(() => import("./pages/Index.tsx"));
const PolicyPage = lazy(() => import("./pages/PolicyPage.tsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.tsx"));
const THGFulfillPage = lazy(() => import("./pages/THGFulfillPage.tsx"));
const THGExpressPage = lazy(() => import("./pages/THGExpressPage.tsx"));
const THGWarehousePage = lazy(() => import("./pages/THGWarehousePage.tsx"));
const THGOrderPage = lazy(() => import("./pages/THGOrderPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const InternationalPricingPage = lazy(() => import("./pages/InternationalPricingPage.tsx"));
const DomesticPricingPage = lazy(() => import("./pages/DomesticPricingPage.tsx"));

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <I18nProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chinh-sach" element={<PolicyPage />} />
            <Route path="/tin-tuc" element={<BlogPage />} />
            <Route path="/bang-gia-quoc-te" element={<InternationalPricingPage />} />
            <Route path="/bang-gia-noi-dia" element={<DomesticPricingPage />} />
            <Route path="/thg-fulfill" element={<THGFulfillPage />} />
            <Route path="/thg-express" element={<THGExpressPage />} />
            <Route path="/thg-warehouse" element={<THGWarehousePage />} />
            <Route path="/thg-order" element={<THGOrderPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </I18nProvider>
);

export default App;
