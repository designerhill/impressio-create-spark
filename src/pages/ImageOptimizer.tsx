import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ImageOptimizerTool } from "@/components/optimizer/ImageOptimizerTool";

export default function ImageOptimizer() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">Image Optimizer</h1>
            <p className="text-xl text-muted-foreground">
              Compress, resize, and optimize images instantly
            </p>
          </div>
          <ImageOptimizerTool />
        </div>
      </main>
      <Footer />
    </div>
  );
}
