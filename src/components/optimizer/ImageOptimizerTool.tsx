import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type OutputFormat = "image/jpeg" | "image/webp" | "image/png";

type OptimizedItem = {
  id: string;
  name: string;
  originalUrl: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  optimizedUrl?: string;
  optimizedSize?: number;
  optimizedWidth?: number;
  optimizedHeight?: number;
  processing?: boolean;
};

const PRESETS = [
  { label: "Original", value: "original" },
  { label: "1920 × 1080 (Full HD)", value: "1920x1080" },
  { label: "1280 × 720 (HD)", value: "1280x720" },
  { label: "1080 × 1080 (Square)", value: "1080x1080" },
  { label: "1080 × 1350 (Portrait)", value: "1080x1350" },
  { label: "1200 × 630 (OG image)", value: "1200x630" },
  { label: "800 × 800 (Thumb)", value: "800x800" },
];

const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const extForFormat = (f: OutputFormat) =>
  f === "image/jpeg" ? "jpg" : f === "image/webp" ? "webp" : "png";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const ImageOptimizerTool = () => {
  const [items, setItems] = useState<OptimizedItem[]>([]);
  const [quality, setQuality] = useState([80]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [preset, setPreset] = useState("original");
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [compareValue, setCompareValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const active = items.find((i) => i.id === activeId) || items[0];
  const ratio = useMemo(() => {
    if (!active) return 1;
    return active.originalWidth / active.originalHeight;
  }, [active]);

  // When the active item changes, sync size controls.
  useEffect(() => {
    if (!active) return;
    setWidth(active.optimizedWidth || active.originalWidth);
    setHeight(active.optimizedHeight || active.originalHeight);
    setPreset("original");
  }, [active?.id]);

  // Revoke object URLs on unmount.
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.optimizedUrl) URL.revokeObjectURL(it.optimizedUrl);
        if (it.originalUrl.startsWith("blob:")) URL.revokeObjectURL(it.originalUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!valid.length) {
      toast.error("Please add image files");
      return;
    }
    const newItems: OptimizedItem[] = [];
    for (const file of valid) {
      const url = URL.createObjectURL(file);
      try {
        const img = await loadImage(url);
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          originalUrl: url,
          originalSize: file.size,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
        });
      } catch {
        URL.revokeObjectURL(url);
      }
    }
    if (!newItems.length) return;
    setItems((prev) => {
      const merged = [...prev, ...newItems];
      return merged;
    });
    setActiveId((prev) => prev ?? newItems[0].id);
    toast.success(`${newItems.length} image${newItems.length > 1 ? "s" : ""} added`);
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleWidth = (val: number) => {
    setWidth(val);
    if (lockRatio && ratio) setHeight(Math.max(1, Math.round(val / ratio)));
  };
  const handleHeight = (val: number) => {
    setHeight(val);
    if (lockRatio && ratio) setWidth(Math.max(1, Math.round(val * ratio)));
  };

  const applyPreset = (value: string) => {
    setPreset(value);
    if (!active) return;
    if (value === "original") {
      setWidth(active.originalWidth);
      setHeight(active.originalHeight);
      return;
    }
    const [w, h] = value.split("x").map(Number);
    setWidth(w);
    setHeight(h);
  };

  const optimizeItem = async (
    item: OptimizedItem,
    w: number,
    h: number,
    f: OutputFormat,
    q: number
  ): Promise<OptimizedItem> => {
    const img = await loadImage(item.originalUrl);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, w);
    canvas.height = Math.max(1, h);
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Encoding failed"))),
        f,
        f === "image/png" ? undefined : q / 100
      )
    );
    if (item.optimizedUrl) URL.revokeObjectURL(item.optimizedUrl);
    return {
      ...item,
      optimizedUrl: URL.createObjectURL(blob),
      optimizedSize: blob.size,
      optimizedWidth: canvas.width,
      optimizedHeight: canvas.height,
    };
  };

  const optimizeActive = async () => {
    if (!active) return;
    setProcessing(true);
    try {
      const updated = await optimizeItem(active, width, height, format, quality[0]);
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      const savings =
        updated.optimizedSize !== undefined
          ? ((1 - updated.optimizedSize / updated.originalSize) * 100).toFixed(1)
          : "0";
      toast.success(`Optimized — saved ${savings}%`);
    } catch {
      toast.error("Failed to optimize image");
    } finally {
      setProcessing(false);
    }
  };

  const optimizeAll = async () => {
    if (!items.length) return;
    setProcessing(true);
    try {
      const next: OptimizedItem[] = [];
      for (const it of items) {
        const targetW = it.id === active?.id ? width : it.originalWidth;
        const targetH = it.id === active?.id ? height : it.originalHeight;
        next.push(await optimizeItem(it, targetW, targetH, format, quality[0]));
      }
      setItems(next);
      toast.success(`Optimized ${next.length} image${next.length > 1 ? "s" : ""}`);
    } catch {
      toast.error("Batch optimize failed");
    } finally {
      setProcessing(false);
    }
  };

  const downloadOne = (item: OptimizedItem) => {
    if (!item.optimizedUrl) return;
    const a = document.createElement("a");
    const base = item.name.replace(/\.[^.]+$/, "");
    a.download = `${base}-optimized.${extForFormat(format)}`;
    a.href = item.optimizedUrl;
    a.click();
  };

  const downloadAll = () => {
    const ready = items.filter((i) => i.optimizedUrl);
    if (!ready.length) {
      toast.error("Nothing to download — optimize first");
      return;
    }
    ready.forEach((it, idx) => setTimeout(() => downloadOne(it), idx * 150));
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed?.optimizedUrl) URL.revokeObjectURL(removed.optimizedUrl);
      if (removed?.originalUrl.startsWith("blob:"))
        URL.revokeObjectURL(removed.originalUrl);
      const next = prev.filter((i) => i.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  };

  const totalOriginal = items.reduce((a, i) => a + i.originalSize, 0);
  const totalOptimized = items.reduce((a, i) => a + (i.optimizedSize || 0), 0);
  const totalSavings = totalOriginal
    ? ((1 - totalOptimized / totalOriginal) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all p-10 text-center bg-white/70 dark:bg-card/50 backdrop-blur-lg shadow-elegant ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileInput}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <Upload className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-lg">Drag & drop images here</p>
            <p className="text-sm text-muted-foreground">
              or click to browse • JPEG, PNG, WebP • batch supported
            </p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
            Choose Images
          </Button>
        </div>
      </div>

      {items.length > 0 && (
        <>
          {/* Controls */}
          <div className="bg-white/80 dark:bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Output format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">WebP (smallest)</SelectItem>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/png">PNG (lossless)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preset</Label>
                <Select value={preset} onValueChange={applyPreset}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <Label>
                  Quality: {quality[0]}%{" "}
                  {format === "image/png" && (
                    <span className="text-xs text-muted-foreground">(PNG is lossless)</span>
                  )}
                </Label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  min={1}
                  max={100}
                  step={1}
                  className="mt-2"
                  disabled={format === "image/png"}
                />
              </div>
              <div>
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => handleWidth(parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => handleHeight(parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="ratio"
                  checked={lockRatio}
                  onCheckedChange={setLockRatio}
                />
                <Label htmlFor="ratio" className="cursor-pointer">
                  Lock aspect ratio
                </Label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={optimizeActive} disabled={!active || processing}>
                  {processing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Optimize
                </Button>
                <Button onClick={optimizeAll} variant="secondary" disabled={processing}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Optimize all
                </Button>
                <Button onClick={downloadAll} variant="accent" disabled={!totalOptimized}>
                  <Download className="w-4 h-4 mr-2" />
                  Download all
                </Button>
              </div>
            </div>

            {totalOptimized > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Original</p>
                  <p className="font-bold">{formatFileSize(totalOriginal)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Optimized</p>
                  <p className="font-bold">{formatFileSize(totalOptimized)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Saved</p>
                  <p className="font-bold text-primary">{totalSavings}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Before / After */}
          {active && (
            <div className="bg-white/80 dark:bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-bold">Preview — {active.name}</h3>
                {active.optimizedUrl && (
                  <Button size="sm" variant="outline" onClick={() => downloadOne(active)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download this
                  </Button>
                )}
              </div>

              {active.optimizedUrl ? (
                <>
                  <div
                    className="relative w-full overflow-hidden rounded-lg border border-border select-none"
                    style={{ aspectRatio: `${active.originalWidth} / ${active.originalHeight}` }}
                  >
                    <img
                      src={active.optimizedUrl}
                      alt="Optimized"
                      className="absolute inset-0 w-full h-full object-contain bg-muted"
                    />
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${compareValue}%` }}
                    >
                      <img
                        src={active.originalUrl}
                        alt="Original"
                        className="absolute inset-0 h-full object-contain bg-muted"
                        style={{
                          width: `${(100 / compareValue) * 100}%`,
                          maxWidth: "none",
                        }}
                      />
                    </div>
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
                      style={{ left: `${compareValue}%` }}
                    />
                    <span className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded text-xs font-semibold">
                      Original
                    </span>
                    <span className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-semibold">
                      Optimized
                    </span>
                  </div>
                  <Slider
                    value={[compareValue]}
                    onValueChange={(v) => setCompareValue(v[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original</p>
                      <p className="font-semibold">
                        {active.originalWidth}×{active.originalHeight} •{" "}
                        {formatFileSize(active.originalSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Optimized</p>
                      <p className="font-semibold">
                        {active.optimizedWidth}×{active.optimizedHeight} •{" "}
                        {formatFileSize(active.optimizedSize || 0)}
                        <span className="text-primary ml-2">
                          (-
                          {(
                            (1 - (active.optimizedSize || 0) / active.originalSize) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden bg-muted">
                  <img
                    src={active.originalUrl}
                    alt={active.name}
                    className="w-full max-h-[480px] object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {/* Queue */}
          <div className="bg-white/80 dark:bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border shadow-elegant">
            <h3 className="font-bold mb-3 px-2">Queue ({items.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {items.map((it) => {
                const isActive = active?.id === it.id;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setActiveId(it.id)}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                      isActive ? "border-primary shadow-elegant" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={it.optimizedUrl || it.originalUrl}
                      alt={it.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 bg-background/95">
                      <p className="text-xs font-semibold truncate">{it.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatFileSize(it.optimizedSize || it.originalSize)}
                        {it.optimizedSize && (
                          <span className="text-primary ml-1">
                            -{((1 - it.optimizedSize / it.originalSize) * 100).toFixed(0)}%
                          </span>
                        )}
                      </p>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(it.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          removeItem(it.id);
                        }
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label={`Remove ${it.name}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
