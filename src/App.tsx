import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";

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

const App = () => (
  <I18nProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chinh-sach" element={<PolicyPage />} />
            <Route path="/tin-tuc" element={<BlogPage />} />
            <Route path="/bang-gia-quoc-te" element={<InternationalPricingPage />} />
            <Route path="/bang-gia-noi-dia" element={<DomesticPricingPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
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
