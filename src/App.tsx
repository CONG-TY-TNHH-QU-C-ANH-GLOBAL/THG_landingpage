import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index.tsx";
import PolicyPage from "./pages/PolicyPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import THGFulfillPage from "./pages/THGFulfillPage.tsx";
import THGExpressPage from "./pages/THGExpressPage.tsx";
import THGWarehousePage from "./pages/THGWarehousePage.tsx";
import THGOrderPage from "./pages/THGOrderPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chinh-sach" element={<PolicyPage />} />
            <Route path="/tin-tuc" element={<BlogPage />} />
            <Route path="/thg-fulfill" element={<THGFulfillPage />} />
            <Route path="/thg-express" element={<THGExpressPage />} />
            <Route path="/thg-warehouse" element={<THGWarehousePage />} />
            <Route path="/thg-order" element={<THGOrderPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
