import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const CertificateCreator = lazy(() => import("./pages/CertificateCreator"));
const CardDesigner = lazy(() => import("./pages/CardDesigner"));
const ImageOptimizer = lazy(() => import("./pages/ImageOptimizer"));
const Templates = lazy(() => import("./pages/Templates"));
const MyDesigns = lazy(() => import("./pages/MyDesigns"));
const Account = lazy(() => import("./pages/Account"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Features = lazy(() => import("./pages/Features"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Security = lazy(() => import("./pages/Security"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }
        >
         <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/certificate-creator" element={<CertificateCreator />} />
          <Route path="/card-designer" element={<CardDesigner />} />
          <Route path="/image-optimizer" element={<ImageOptimizer />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/my-designs" element={<MyDesigns />} />
          <Route path="/account" element={<Account />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="/cookies" element={<Cookies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
         </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
