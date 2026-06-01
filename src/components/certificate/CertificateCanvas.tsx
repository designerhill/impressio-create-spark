import { useEffect, useRef, useState, useCallback } from "react";
import {
  Canvas as FabricCanvas,
  Textbox,
  Rect,
  Circle,
  Triangle,
  Line,
  FabricImage,
  Gradient,
  FabricObject,
} from "fabric";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sparkles, Download, Save, Type, Wand2, Square, Circle as CircleIcon,
  Triangle as TriangleIcon, Minus, Image as ImageIcon, Trash2, Copy,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  ChevronUp, ChevronDown, Lock, Unlock, Palette, FlipHorizontal, FlipVertical,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

const FONTS = [
  "Arial", "Georgia", "Times New Roman", "Courier New", "Verdana",
  "Trebuchet MS", "Impact", "Comic Sans MS", "Brush Script MT", "Palatino",
];

const PRESET_BACKGROUNDS = [
  { name: "White", value: "#ffffff" },
  { name: "Ivory", value: "#fffdf5" },
  { name: "Cream", value: "#fef3c7" },
  { name: "Parchment", value: "#f5ecd9" },
  { name: "Mist", value: "#e0f2fe" },
  { name: "Slate", value: "#e2e8f0" },
  { name: "Midnight", value: "#0f172a" },
  { name: "Charcoal", value: "#1f2937" },
];

const GRADIENT_PRESETS = [
  { name: "Gold", from: "#fff7d6", to: "#f5d77c" },
  { name: "Royal", from: "#dbeafe", to: "#a5b4fc" },
  { name: "Pearl", from: "#ffffff", to: "#e5e7eb" },
  { name: "Sunset", from: "#ffecd2", to: "#fcb69f" },
  { name: "Emerald", from: "#d1fae5", to: "#6ee7b7" },
  { name: "Rose", from: "#ffe4e6", to: "#fda4af" },
];

const STICKERS = ["🏆", "🥇", "🎖️", "🏅", "⭐", "✨", "📜", "🎓", "🌟", "👑", "💎", "🪄"];

export const CertificateCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [title, setTitle] = useState("Certificate of Achievement");
  const [recipientName, setRecipientName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeObject, setActiveObject] = useState<FabricObject | null>(null);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  // history (undo/redo)
  const historyRef = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const isRestoring = useRef(false);

  const saveHistory = useCallback((c: FabricCanvas) => {
    if (isRestoring.current) return;
    const json = JSON.stringify(c.toJSON());
    historyRef.current = historyRef.current.slice(0, historyIndex.current + 1);
    historyRef.current.push(json);
    if (historyRef.current.length > 50) historyRef.current.shift();
    historyIndex.current = historyRef.current.length - 1;
    refresh();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    const applyTemplate = async () => {
      let bgColor = "#ffffff";
      let borderColor = "#D4AF37";
      let templateTitle = "Certificate of Achievement";
      let customObjects: any[] | null = null;
      let bgGradient: string | null = null;

      if (templateId) {
        const { data } = await supabase
          .from("templates")
          .select("title, template_data")
          .eq("id", templateId)
          .maybeSingle();
        if (data) {
          templateTitle = data.title;
          setTitle(data.title);
          const td: any = data.template_data || {};
          if (td.background) {
            if (String(td.background).startsWith("linear-gradient")) {
              bgGradient = td.background;
            } else {
              bgColor = td.background;
            }
          }
          if (td.border === "gold") borderColor = "#D4AF37";
          else if (td.border === "silver") borderColor = "#C0C0C0";
          else if (td.border === "none") borderColor = "transparent";
          if (Array.isArray(td.objects)) customObjects = td.objects;
          toast.success(`Loaded template: ${data.title}`);
        }
      }

      fabricCanvas.backgroundColor = bgColor;
      if (bgGradient) {
        // Approximate CSS linear-gradient by parsing the two stops.
        const m = bgGradient.match(/linear-gradient\([^,]+,\s*(#[0-9a-fA-F]{3,8})[^,]*,\s*(#[0-9a-fA-F]{3,8})/);
        if (m) {
          fabricCanvas.add(
            new Rect({
              left: 0, top: 0, width: 800, height: 600,
              selectable: false,
              fill: new Gradient({
                type: "linear",
                coords: { x1: 0, y1: 0, x2: 800, y2: 600 },
                colorStops: [
                  { offset: 0, color: m[1] },
                  { offset: 1, color: m[2] },
                ],
              }),
            })
          );
        }
      }

      if (borderColor !== "transparent") {
        fabricCanvas.add(
          new Rect({
            left: 20, top: 20, width: 760, height: 560,
            fill: "transparent", stroke: borderColor, strokeWidth: 8,
            selectable: false,
          })
        );
      }

      if (customObjects && customObjects.length) {
        renderTemplateObjects(fabricCanvas, customObjects);
      } else {
        fabricCanvas.add(
          new Textbox(templateTitle, {
            left: 400, top: 100, width: 600, fontSize: 48,
            fontFamily: "Georgia", fill: "#2C3E50", textAlign: "center",
            originX: "center",
          })
        );
      }
      fabricCanvas.renderAll();
    };

    const onSelection = () => setActiveObject(fabricCanvas.getActiveObject() || null);
    const onCleared = () => setActiveObject(null);
    const onModified = () => saveHistory(fabricCanvas);

    fabricCanvas.on("selection:created", onSelection);
    fabricCanvas.on("selection:updated", onSelection);
    fabricCanvas.on("selection:cleared", onCleared);
    fabricCanvas.on("object:modified", onModified);
    fabricCanvas.on("object:added", onModified);
    fabricCanvas.on("object:removed", onModified);

    applyTemplate().then(() => saveHistory(fabricCanvas));
    setCanvas(fabricCanvas);
    setTimeout(() => {
      if (historyRef.current.length === 0) saveHistory(fabricCanvas);
    }, 50);

    return () => {
      fabricCanvas.dispose();
    };
  }, [templateId, saveHistory]);

  // ---- helpers ----
  const addAndSelect = (obj: FabricObject) => {
    if (!canvas) return;
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    setActiveObject(obj);
  };

  const updateActive = (props: Partial<any>) => {
    if (!canvas || !activeObject) return;
    activeObject.set(props);
    activeObject.setCoords();
    canvas.renderAll();
    saveHistory(canvas);
    refresh();
  };

  // ---- shapes ----
  const addRect = () =>
    addAndSelect(new Rect({ left: 250, top: 250, width: 200, height: 120, fill: "#6366f1", rx: 8, ry: 8 }));
  const addCircle = () =>
    addAndSelect(new Circle({ left: 300, top: 220, radius: 70, fill: "#ec4899" }));
  const addTriangle = () =>
    addAndSelect(new Triangle({ left: 300, top: 220, width: 140, height: 140, fill: "#f59e0b" }));
  const addLine = () =>
    addAndSelect(new Line([100, 300, 700, 300], { stroke: "#1f2937", strokeWidth: 4 }));
  const addSticker = (emoji: string) =>
    addAndSelect(new Textbox(emoji, {
      left: 380, top: 220, fontSize: 96, width: 120, textAlign: "center", originX: "center",
    }));

  // ---- background ----
  const setSolidBg = (color: string) => {
    if (!canvas) return;
    canvas.backgroundColor = color;
    canvas.backgroundImage = undefined as any;
    canvas.renderAll();
    saveHistory(canvas);
  };
  const setGradientBg = (from: string, to: string) => {
    if (!canvas) return;
    const grad = new Gradient({
      type: "linear",
      coords: { x1: 0, y1: 0, x2: canvas.getWidth(), y2: canvas.getHeight() },
      colorStops: [{ offset: 0, color: from }, { offset: 1, color: to }],
    });
    canvas.backgroundColor = grad as any;
    canvas.backgroundImage = undefined as any;
    canvas.renderAll();
    saveHistory(canvas);
  };

  // ---- image upload ----
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const url = ev.target?.result as string;
      const img = await FabricImage.fromURL(url);
      img.scaleToWidth(300);
      img.set({ left: 250, top: 200 });
      addAndSelect(img);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ---- layer + transforms ----
  const deleteActive = () => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    setActiveObject(null);
  };
  const duplicateActive = async () => {
    if (!canvas || !activeObject) return;
    const cloned = await activeObject.clone();
    cloned.set({ left: (activeObject.left || 0) + 20, top: (activeObject.top || 0) + 20 });
    addAndSelect(cloned);
  };
  const bringForward = () => { if (canvas && activeObject) { canvas.bringObjectForward(activeObject); canvas.renderAll(); saveHistory(canvas); } };
  const sendBackward = () => { if (canvas && activeObject) { canvas.sendObjectBackwards(activeObject); canvas.renderAll(); saveHistory(canvas); } };
  const flipH = () => updateActive({ flipX: !(activeObject as any)?.flipX });
  const flipV = () => updateActive({ flipY: !(activeObject as any)?.flipY });
  const toggleLock = () => {
    if (!activeObject) return;
    const locked = (activeObject as any).lockMovementX;
    updateActive({
      lockMovementX: !locked, lockMovementY: !locked,
      lockScalingX: !locked, lockScalingY: !locked, lockRotation: !locked,
    });
  };

  // ---- undo / redo ----
  const undo = () => {
    if (!canvas || historyIndex.current <= 0) return;
    historyIndex.current -= 1;
    isRestoring.current = true;
    canvas.loadFromJSON(historyRef.current[historyIndex.current]).then(() => {
      canvas.renderAll();
      isRestoring.current = false;
      refresh();
    });
  };
  const redo = () => {
    if (!canvas || historyIndex.current >= historyRef.current.length - 1) return;
    historyIndex.current += 1;
    isRestoring.current = true;
    canvas.loadFromJSON(historyRef.current[historyIndex.current]).then(() => {
      canvas.renderAll();
      isRestoring.current = false;
      refresh();
    });
  };

  // ---- keyboard ----
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement;
      if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable)) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      else if ((e.key === "Delete" || e.key === "Backspace") && activeObject) { e.preventDefault(); deleteActive(); }
      else if ((e.metaKey || e.ctrlKey) && e.key === "d") { e.preventDefault(); duplicateActive(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject, canvas]);

  // ---- AI ----
  const handleGenerateWithAI = async () => {
    if (!canvas) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-design", {
        body: {
          prompt: `Generate certificate text for: ${title}${recipientName ? ` for ${recipientName}` : ""}. Include achievement description and date.`,
          type: "certificate",
        },
      });
      if (error) throw error;
      if (data?.text) {
        const aiText = new Textbox(data.text, {
          left: 400, top: 350, width: 600, fontSize: 18,
          fontFamily: "Arial", fill: "#34495E", textAlign: "center", originX: "center",
        });
        canvas.add(aiText);
        canvas.renderAll();
        toast.success("AI content added!");
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBackground = async () => {
    if (!canvas) return;
    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: `Elegant certificate background, ornate decorative border, premium award document design, professional` },
      });
      if (error) throw error;
      if (data?.imageUrl) {
        const img = await FabricImage.fromURL(data.imageUrl, { crossOrigin: "anonymous" });
        img.scaleToWidth(800);
        img.scaleToHeight(600);
        canvas.backgroundImage = img;
        canvas.renderAll();
        toast.success("Background generated!");
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      toast.error(error.message || "Failed to generate background");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAddText = () => {
    if (!canvas) return;
    const text = new Textbox("Double click to edit", {
      left: 400, top: 300, width: 400, fontSize: 24,
      fontFamily: "Arial", fill: "#000000", textAlign: "center", originX: "center",
    });
    addAndSelect(text);
  };
  const addHeading = () => addAndSelect(new Textbox("Certificate Title", {
    left: 400, top: 90, width: 700, fontSize: 52, fontWeight: "bold",
    fontFamily: "Georgia", fill: "#111827", textAlign: "center", originX: "center",
  }));
  const addSubheading = () => addAndSelect(new Textbox("is hereby awarded to", {
    left: 400, top: 200, width: 600, fontSize: 22, fontFamily: "Georgia",
    fill: "#374151", textAlign: "center", originX: "center",
  }));

  // ---- save / export ----
  const handleSave = async () => {
    if (!canvas) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please sign in to save"); return; }
      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1 });
      const designData = canvas.toJSON();
      const { error } = await supabase.from("designs").insert({
        user_id: user.id,
        title: `${title || "Untitled Certificate"}${recipientName ? ` — ${recipientName}` : ""}`,
        type: "certificate",
        design_data: designData,
        thumbnail_url: dataUrl,
      });
      if (error) throw error;
      toast.success("Certificate saved!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPNG = () => {
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    const link = document.createElement("a");
    link.download = `${title || "certificate"}.png`;
    link.href = dataUrl;
    link.click();
    toast.success("PNG exported (2× resolution)!");
  };

  const handleExportPDF = () => {
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [800, 600] });
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    pdf.addImage(dataUrl, "PNG", 0, 0, 800, 600);
    pdf.save(`${title || "certificate"}.pdf`);
    toast.success("PDF exported!");
  };

  const isText = activeObject && (activeObject.type === "textbox" || activeObject.type === "i-text");
  const ao: any = activeObject || {};

  return (
    <div className="space-y-6">
      {/* Top toolbar */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-border shadow-elegant flex flex-wrap gap-3 items-end">
        <div className="min-w-[220px] flex-1">
          <Label>Certificate Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Certificate of Achievement" className="mt-1" />
        </div>
        <div className="min-w-[200px] flex-1">
          <Label>Recipient (Optional)</Label>
          <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Jane Doe" className="mt-1" />
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex.current <= 0}><Undo2 className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex.current >= historyRef.current.length - 1}><Redo2 className="w-4 h-4" /></Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="w-4 h-4 mr-2" />{isSaving ? "Saving..." : "Save"}</Button>
          <Button size="sm" variant="outline" onClick={handleExportPNG}><Download className="w-4 h-4 mr-2" />PNG</Button>
          <Button size="sm" variant="outline" onClick={handleExportPDF}><Download className="w-4 h-4 mr-2" />PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left tools panel */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-border shadow-elegant p-4">
          <Tabs defaultValue="text">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="text"><Type className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="shapes"><Square className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="bg"><Palette className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="ai"><Sparkles className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="upload"><ImageIcon className="w-4 h-4" /></TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-2 mt-4">
              <Button className="w-full justify-start" variant="secondary" onClick={addHeading}>Add Heading</Button>
              <Button className="w-full justify-start" variant="secondary" onClick={addSubheading}>Add Subheading</Button>
              <Button className="w-full justify-start" variant="secondary" onClick={handleAddText}>Add Body Text</Button>
              <Separator className="my-3" />
              <Label className="text-xs">Stickers & Emojis</Label>
              <div className="grid grid-cols-6 gap-1">
                {STICKERS.map((s) => (
                  <button key={s} onClick={() => addSticker(s)} className="text-2xl hover:bg-muted rounded p-1">{s}</button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shapes" className="space-y-2 mt-4">
              <Button className="w-full justify-start" variant="secondary" onClick={addRect}><Square className="w-4 h-4 mr-2" />Rectangle</Button>
              <Button className="w-full justify-start" variant="secondary" onClick={addCircle}><CircleIcon className="w-4 h-4 mr-2" />Circle</Button>
              <Button className="w-full justify-start" variant="secondary" onClick={addTriangle}><TriangleIcon className="w-4 h-4 mr-2" />Triangle</Button>
              <Button className="w-full justify-start" variant="secondary" onClick={addLine}><Minus className="w-4 h-4 mr-2" />Line</Button>
            </TabsContent>

            <TabsContent value="bg" className="space-y-3 mt-4">
              <Label className="text-xs">Solid Colors</Label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_BACKGROUNDS.map((b) => (
                  <button key={b.value} title={b.name} onClick={() => setSolidBg(b.value)}
                    className="h-10 rounded-md border border-border hover:scale-105 transition" style={{ background: b.value }} />
                ))}
              </div>
              <Label className="text-xs">Custom Color</Label>
              <input type="color" onChange={(e) => setSolidBg(e.target.value)} className="w-full h-10 rounded-md cursor-pointer border border-border" />
              <Separator />
              <Label className="text-xs">Gradients</Label>
              <div className="grid grid-cols-2 gap-2">
                {GRADIENT_PRESETS.map((g) => (
                  <button key={g.name} onClick={() => setGradientBg(g.from, g.to)} className="h-12 rounded-md border border-border hover:scale-105 transition"
                    style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}>
                    <span className="text-xs text-foreground drop-shadow">{g.name}</span>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-2 mt-4">
              <Button className="w-full" variant="accent" onClick={handleGenerateWithAI} disabled={isGenerating}>
                <Sparkles className="w-4 h-4 mr-2" />{isGenerating ? "Generating..." : "AI Message"}
              </Button>
              <Button className="w-full" variant="gold" onClick={handleGenerateBackground} disabled={isGeneratingImage}>
                <Wand2 className="w-4 h-4 mr-2" />{isGeneratingImage ? "Generating..." : "AI Background"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Uses title + recipient as context.</p>
            </TabsContent>

            <TabsContent value="upload" className="space-y-2 mt-4">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button className="w-full" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="w-4 h-4 mr-2" />Upload Image
              </Button>
              <p className="text-xs text-muted-foreground">PNG, JPG, SVG. Drag to position, drag corners to resize.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas + contextual property bar */}
        <div className="space-y-3">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-3 border border-border shadow-elegant flex flex-wrap items-center gap-2 min-h-[58px]">
            {!activeObject && (
              <span className="text-sm text-muted-foreground px-2">Select an element to edit its properties.</span>
            )}
            {activeObject && (
              <>
                {isText && (
                  <>
                    <Select value={ao.fontFamily} onValueChange={(v) => updateActive({ fontFamily: v })}>
                      <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Font" /></SelectTrigger>
                      <SelectContent>
                        {FONTS.map((f) => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input type="number" className="w-[70px] h-9" value={Math.round(ao.fontSize || 16)}
                      onChange={(e) => updateActive({ fontSize: Number(e.target.value) })} />
                    <Button size="sm" variant={ao.fontWeight === "bold" ? "default" : "outline"} onClick={() => updateActive({ fontWeight: ao.fontWeight === "bold" ? "normal" : "bold" })}><Bold className="w-4 h-4" /></Button>
                    <Button size="sm" variant={ao.fontStyle === "italic" ? "default" : "outline"} onClick={() => updateActive({ fontStyle: ao.fontStyle === "italic" ? "normal" : "italic" })}><Italic className="w-4 h-4" /></Button>
                    <Button size="sm" variant={ao.underline ? "default" : "outline"} onClick={() => updateActive({ underline: !ao.underline })}><Underline className="w-4 h-4" /></Button>
                    <Button size="sm" variant={ao.textAlign === "left" ? "default" : "outline"} onClick={() => updateActive({ textAlign: "left" })}><AlignLeft className="w-4 h-4" /></Button>
                    <Button size="sm" variant={ao.textAlign === "center" ? "default" : "outline"} onClick={() => updateActive({ textAlign: "center" })}><AlignCenter className="w-4 h-4" /></Button>
                    <Button size="sm" variant={ao.textAlign === "right" ? "default" : "outline"} onClick={() => updateActive({ textAlign: "right" })}><AlignRight className="w-4 h-4" /></Button>
                  </>
                )}
                {(isText || activeObject.type === "rect" || activeObject.type === "circle" || activeObject.type === "triangle") && (
                  <label className="flex items-center gap-1 text-xs">
                    Fill
                    <input type="color" value={typeof ao.fill === "string" ? ao.fill : "#000000"}
                      onChange={(e) => updateActive({ fill: e.target.value })} className="h-8 w-10 rounded cursor-pointer border border-border" />
                  </label>
                )}
                {(activeObject.type === "rect" || activeObject.type === "circle" || activeObject.type === "triangle" || activeObject.type === "line") && (
                  <label className="flex items-center gap-1 text-xs">
                    Stroke
                    <input type="color" value={typeof ao.stroke === "string" ? ao.stroke : "#000000"}
                      onChange={(e) => updateActive({ stroke: e.target.value })} className="h-8 w-10 rounded cursor-pointer border border-border" />
                  </label>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline">Opacity</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <Slider value={[Math.round((ao.opacity ?? 1) * 100)]} min={0} max={100} step={1}
                      onValueChange={(v) => updateActive({ opacity: v[0] / 100 })} />
                  </PopoverContent>
                </Popover>
                <Separator orientation="vertical" className="h-8" />
                <Button size="sm" variant="outline" onClick={flipH}><FlipHorizontal className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={flipV}><FlipVertical className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={bringForward}><ChevronUp className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={sendBackward}><ChevronDown className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={toggleLock}>{ao.lockMovementX ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}</Button>
                <Button size="sm" variant="outline" onClick={duplicateActive}><Copy className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={deleteActive}><Trash2 className="w-4 h-4" /></Button>
              </>
            )}
          </div>

          {/* Canvas */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant overflow-auto">
            <canvas ref={canvasRef} className="border border-border rounded-lg shadow-lg mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
