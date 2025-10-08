import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const ImageOptimizerTool = () => {
  const [image, setImage] = useState<string | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    toast.success("Image uploaded!");
  };

  const handleOptimize = () => {
    if (!image || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setOptimizedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setOptimizedImage(url);
            const savings = ((1 - blob.size / originalSize) * 100).toFixed(1);
            toast.success(`Optimized! Saved ${savings}% of file size`);
          }
        },
        "image/jpeg",
        quality[0] / 100
      );
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!optimizedImage) return;

    const link = document.createElement("a");
    link.download = "optimized-image.jpg";
    link.href = optimizedImage;
    link.click();
    toast.success("Image downloaded!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant">
        <div className="space-y-6">
          {/* Upload Section */}
          <div>
            <Label>Upload Image</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>

          {image && (
            <>
              {/* Optimization Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Quality: {quality[0]}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    min={1}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleOptimize} variant="default" className="flex-1">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Optimize
                </Button>
                {optimizedImage && (
                  <Button onClick={handleDownload} variant="accent" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {image && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant">
            <h3 className="font-bold mb-4">Original</h3>
            <img src={image} alt="Original" className="w-full rounded-lg border border-border" />
            <p className="mt-2 text-sm text-muted-foreground">
              Size: {formatFileSize(originalSize)}
            </p>
          </div>

          {optimizedImage && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant">
              <h3 className="font-bold mb-4">Optimized</h3>
              <img src={optimizedImage} alt="Optimized" className="w-full rounded-lg border border-border" />
              <p className="mt-2 text-sm text-muted-foreground">
                Size: {formatFileSize(optimizedSize)}
              </p>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
