import { useState, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Image, Upload, Download, Zap, Settings, CheckCircle } from "lucide-react";

const ImageOptimizer = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [optimizationSettings, setOptimizationSettings] = useState({
    format: "webp",
    quality: [80],
    width: [1920],
    height: [1080]
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setOptimizationComplete(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
    }, 3000);
  };

  const formats = [
    { value: "webp", label: "WebP (Recommended)", description: "Best compression" },
    { value: "jpeg", label: "JPEG", description: "Good compatibility" },
    { value: "png", label: "PNG", description: "Lossless quality" },
    { value: "avif", label: "AVIF", description: "Next-gen format" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Image Optimizer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compress and optimize your images for web while maintaining quality
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Image Upload */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Image
                </h3>
                
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Drop your image here</p>
                      <p className="text-muted-foreground mb-4">or click to browse</p>
                      <Button variant="outline">
                        Choose File
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-4 left-4">Original</Badge>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUploadedImage(null);
                        setOptimizationComplete(false);
                      }}
                    >
                      Upload Different Image
                    </Button>
                  </div>
                )}
              </Card>

              {/* Optimization Results */}
              {optimizationComplete && (
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Optimization Complete
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Before</h4>
                      <div className="relative">
                        <img
                          src={uploadedImage!}
                          alt="Original"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-red-500">2.4 MB</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">After</h4>
                      <div className="relative">
                        <img
                          src={uploadedImage!}
                          alt="Optimized"
                          className="w-full h-48 object-cover rounded-lg opacity-95"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500">540 KB</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-700 dark:text-green-300">
                        Size reduced by 77%
                      </span>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download Optimized
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Optimization Settings
                </h3>
                
                <div className="space-y-6">
                  
                  {/* Format Selection */}
                  <div>
                    <Label className="text-sm font-medium">Output Format</Label>
                    <Select value={optimizationSettings.format} onValueChange={(value) => 
                      setOptimizationSettings({...optimizationSettings, format: value})
                    }>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            <div>
                              <div className="font-medium">{format.label}</div>
                              <div className="text-xs text-muted-foreground">{format.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quality Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">Quality</Label>
                      <span className="text-sm text-muted-foreground">{optimizationSettings.quality[0]}%</span>
                    </div>
                    <Slider
                      value={optimizationSettings.quality}
                      onValueChange={(value) => setOptimizationSettings({...optimizationSettings, quality: value})}
                      min={1}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Small file</span>
                      <span>High quality</span>
                    </div>
                  </div>

                  {/* Width Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">Max Width</Label>
                      <span className="text-sm text-muted-foreground">{optimizationSettings.width[0]}px</span>
                    </div>
                    <Slider
                      value={optimizationSettings.width}
                      onValueChange={(value) => setOptimizationSettings({...optimizationSettings, width: value})}
                      min={320}
                      max={3840}
                      step={160}
                      className="mt-2"
                    />
                  </div>

                  {/* Height Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">Max Height</Label>
                      <span className="text-sm text-muted-foreground">{optimizationSettings.height[0]}px</span>
                    </div>
                    <Slider
                      value={optimizationSettings.height}
                      onValueChange={(value) => setOptimizationSettings({...optimizationSettings, height: value})}
                      min={240}
                      max={2160}
                      step={120}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Optimize Button */}
                <div className="mt-8">
                  {isOptimizing ? (
                    <div className="space-y-3">
                      <Progress value={66} />
                      <p className="text-sm text-center text-muted-foreground">
                        Optimizing your image...
                      </p>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handleOptimize}
                      disabled={!uploadedImage}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize Image
                    </Button>
                  )}
                </div>
              </Card>

              {/* Tips */}
              <Card className="p-6">
                <h4 className="font-semibold mb-3">💡 Optimization Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• WebP format offers the best compression</li>
                  <li>• 80% quality is usually ideal for web</li>
                  <li>• Resize large images to improve load times</li>
                  <li>• Use lower quality for thumbnails</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ImageOptimizer;