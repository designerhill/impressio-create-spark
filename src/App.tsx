import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isChunkLoadError, reloadForFreshChunks } from "@/lib/chunkReload";

/**
 * Wrap dynamic imports so a stale chunk (after a redeploy) triggers a one-time
 * full reload instead of a blank screen. While reloading we resolve to a stub
 * module — never a forever-pending promise, which corrupts React.lazy's
 * internal state ("_result is undefined").
 */
const lazyWithReload = <T extends { default: React.ComponentType }>(
  factory: () => Promise<T>
) =>
  lazy(() =>
    factory().catch((err) => {
      if (isChunkLoadError(err) && reloadForFreshChunks()) {
        // Page is reloading — render nothing in the meantime.
        return { default: () => null } as unknown as T;
      }
      throw err;
    })
  );

const Index = lazyWithReload(() => import("./pages/Index"));
const Auth = lazyWithReload(() => import("./pages/Auth"));
const CertificateCreator = lazyWithReload(() => import("./pages/CertificateCreator"));
const CardDesigner = lazyWithReload(() => import("./pages/CardDesigner"));
const ImageOptimizer = lazyWithReload(() => import("./pages/ImageOptimizer"));
const Templates = lazyWithReload(() => import("./pages/Templates"));
const MyDesigns = lazyWithReload(() => import("./pages/MyDesigns"));
const Account = lazyWithReload(() => import("./pages/Account"));
const Pricing = lazyWithReload(() => import("./pages/Pricing"));
const Features = lazyWithReload(() => import("./pages/Features"));
const About = lazyWithReload(() => import("./pages/About"));
const Contact = lazyWithReload(() => import("./pages/Contact"));
const Privacy = lazyWithReload(() => import("./pages/Privacy"));
const Terms = lazyWithReload(() => import("./pages/Terms"));
const Security = lazyWithReload(() => import("./pages/Security"));
const Cookies = lazyWithReload(() => import("./pages/Cookies"));
const NotFound = lazyWithReload(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

class ChunkErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: isChunkLoadError(error) };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    if (!isChunkLoadError(error)) {
      console.error(error, errorInfo);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-5">
          <h1 className="text-2xl font-bold text-foreground">Refresh needed</h1>
          <p className="text-muted-foreground">
            A new version is available. Refresh the page to load the latest app files.
          </p>
          <Button onClick={() => window.location.reload()} className="mx-auto">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </main>
    );
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ChunkErrorBoundary>
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
        </ChunkErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
