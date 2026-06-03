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
  Shadow,
  FabricObject,
  Group,
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
  Layers, ChevronUp, ChevronDown, Lock, Unlock, Palette, FlipHorizontal,
  FlipVertical, Star, Heart, Smile, Cloud, CloudOff, Loader2, CheckCircle2,
  Share2, Eye, ZoomIn, ZoomOut, Grid3x3, Upload as UploadIcon, Smile as SmileIcon,
  Shapes, Plus, PanelLeftClose,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { renderTemplateObjects } from "@/lib/templateRender";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FONTS = [
  "Arial", "Georgia", "Times New Roman", "Courier New", "Verdana",
  "Trebuchet MS", "Impact", "Comic Sans MS", "Brush Script MT", "Palatino",
];

const PRESET_BACKGROUNDS = [
  { name: "Cream", value: "#fef3c7" },
  { name: "Blush", value: "#fce7f3" },
  { name: "Mint", value: "#d1fae5" },
  { name: "Sky", value: "#dbeafe" },
  { name: "Lavender", value: "#ede9fe" },
  { name: "Peach", value: "#fed7aa" },
  { name: "White", value: "#ffffff" },
  { name: "Charcoal", value: "#1f2937" },
];

const GRADIENT_PRESETS = [
  { name: "Sunset", from: "#ff9a9e", to: "#fad0c4" },
  { name: "Ocean", from: "#a1c4fd", to: "#c2e9fb" },
  { name: "Peach", from: "#ffecd2", to: "#fcb69f" },
  { name: "Lavender", from: "#e0c3fc", to: "#8ec5fc" },
  { name: "Mint", from: "#84fab0", to: "#8fd3f4" },
  { name: "Berry", from: "#f093fb", to: "#f5576c" },
];

const STICKERS = ["⭐", "❤️", "🎉", "🎂", "🎁", "✨", "🌸", "🎈", "🏆", "💐", "🥂", "🌟"];

export const CardCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [occasion, setOccasion] = useState("birthday");
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
  const { user } = useAuth();

  // autosave
  const designIdRef = useRef<string | null>(searchParams.get("designId"));
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const scheduleAutosaveRef = useRef<() => void>(() => {});
  const hasInteractedRef = useRef(false);

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

  const performSave = useCallback(
    async (silent: boolean) => {
      if (!canvas || !user) return;
      setSaveStatus("saving");
      try {
        const designData = canvas.toJSON();
        const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1 });
        const title = `${occasion} Card${recipientName ? ` for ${recipientName}` : ""}`;
        if (designIdRef.current) {
          const { error } = await supabase
            .from("designs")
            .update({ design_data: designData, thumbnail_url: dataUrl, title })
            .eq("id", designIdRef.current);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("designs")
            .insert({
              user_id: user.id,
              title,
              type: "card",
              design_data: designData,
              thumbnail_url: dataUrl,
            })
            .select("id")
            .single();
          if (error) throw error;
          designIdRef.current = data.id;
        }
        setSaveStatus("saved");
        setLastSavedAt(new Date());
        if (!silent) toast.success("Card saved!");
      } catch (e: any) {
        console.error("Autosave error:", e);
        setSaveStatus("error");
        if (!silent) toast.error(e?.message || "Failed to save");
      }
    },
    [canvas, user, occasion, recipientName]
  );

  const scheduleAutosave = useCallback(() => {
    if (!user || !canvas || isRestoring.current) return;
    hasInteractedRef.current = true;
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    setSaveStatus("saving");
    autosaveTimerRef.current = window.setTimeout(() => {
      performSave(true);
    }, 1500);
  }, [user, canvas, performSave]);

  useEffect(() => {
    scheduleAutosaveRef.current = scheduleAutosave;
  }, [scheduleAutosave]);

  // Title changes (occasion/recipient) should trigger autosave too
  useEffect(() => {
    if (!hasInteractedRef.current) return;
    scheduleAutosaveRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasion, recipientName]);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#fef3c7",
    });

    const loadExistingDesign = async () => {
      const id = designIdRef.current;
      if (!id) return false;
      const { data } = await supabase
        .from("designs")
        .select("title, design_data, type")
        .eq("id", id)
        .maybeSingle();
      if (!data || data.type !== "card") return false;
      await fabricCanvas.loadFromJSON(data.design_data as any);
      fabricCanvas.renderAll();
      toast.success(`Loaded: ${data.title}`);
      setLastSavedAt(new Date());
      setSaveStatus("saved");
      return true;
    };

    const applyTemplate = async () => {
      if (!templateId) return;
      const { data } = await supabase
        .from("templates")
        .select("title, template_data")
        .eq("id", templateId)
        .maybeSingle();
      if (!data) return;
      const td: any = data.template_data || {};
      if (td.background) {
        if (String(td.background).startsWith("linear-gradient")) {
          const m = td.background.match(/linear-gradient\([^,]+,\s*(#[0-9a-fA-F]{3,8})[^,]*,\s*(#[0-9a-fA-F]{3,8})/);
          if (m) {
            fabricCanvas.add(
              new Rect({
                left: 0, top: 0, width: 600, height: 400,
                selectable: false,
                fill: new Gradient({
                  type: "linear",
                  coords: { x1: 0, y1: 0, x2: 600, y2: 400 },
                  colorStops: [
                    { offset: 0, color: m[1] },
                    { offset: 1, color: m[2] },
                  ],
                }),
              })
            );
          }
        } else {
          fabricCanvas.backgroundColor = td.background;
        }
      }
      if (td.theme) setOccasion(td.theme);
      if (Array.isArray(td.objects) && td.objects.length) {
        renderTemplateObjects(fabricCanvas, td.objects);
      } else {
        fabricCanvas.add(
          new Textbox(data.title, {
            left: 300, top: 80, width: 500, fontSize: 32,
            fontFamily: "Georgia", fill: "#1F2937",
            textAlign: "center", originX: "center",
          })
        );
      }
      fabricCanvas.renderAll();
      toast.success(`Loaded template: ${data.title}`);
    };

    const onSelection = () => {
      setActiveObject(fabricCanvas.getActiveObject() || null);
    };
    const onCleared = () => setActiveObject(null);
    const onModified = () => {
      saveHistory(fabricCanvas);
      scheduleAutosaveRef.current?.();
    };

    fabricCanvas.on("selection:created", onSelection);
    fabricCanvas.on("selection:updated", onSelection);
    fabricCanvas.on("selection:cleared", onCleared);
    fabricCanvas.on("object:modified", onModified);
    fabricCanvas.on("object:added", onModified);
    fabricCanvas.on("object:removed", onModified);

    loadExistingDesign().then((loaded) => {
      if (!loaded) applyTemplate().then(() => saveHistory(fabricCanvas));
      else saveHistory(fabricCanvas);
    });
    setCanvas(fabricCanvas);
    // initial snapshot if no template
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
    addAndSelect(new Rect({ left: 200, top: 150, width: 160, height: 100, fill: "#6366f1", rx: 8, ry: 8 }));
  const addCircle = () =>
    addAndSelect(new Circle({ left: 220, top: 150, radius: 60, fill: "#ec4899" }));
  const addTriangle = () =>
    addAndSelect(new Triangle({ left: 220, top: 150, width: 120, height: 120, fill: "#f59e0b" }));
  const addLine = () =>
    addAndSelect(new Line([50, 100, 350, 100], { stroke: "#1f2937", strokeWidth: 4 }));
  const addSticker = (emoji: string) =>
    addAndSelect(
      new Textbox(emoji, {
        left: 250, top: 150, fontSize: 80, width: 100, textAlign: "center", originX: "center",
      })
    );

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
    // fabric v6 backgroundColor accepts gradient
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
      img.scaleToWidth(250);
      img.set({ left: 150, top: 100 });
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

  const handleGenerateMessage = async () => {
    if (!canvas) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-design", {
        body: { 
          prompt: `Generate a heartfelt ${occasion} greeting card message${recipientName ? ` for ${recipientName}` : ''}. Make it warm, personal, and meaningful.`,
          type: "card"
        },
      });

      if (error) throw error;

      if (data?.text) {
        const messageText = new Textbox(data.text, {
          left: 300,
          top: 200,
          width: 500,
          fontSize: 20,
          fontFamily: "Georgia",
          fill: "#1F2937",
          textAlign: "center",
          originX: "center",
          originY: "center",
        });
        canvas.add(messageText);
        canvas.renderAll();
        toast.success("Message generated!");
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast.error(error.message || "Failed to generate message");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBackground = async () => {
    if (!canvas) return;

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { 
          prompt: `Beautiful ${occasion} greeting card background design, festive, colorful, professional quality`
        },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        FabricImage.fromURL(data.imageUrl, {
          crossOrigin: 'anonymous'
        }).then((img) => {
          img.scaleToWidth(600);
          img.scaleToHeight(400);
          canvas.backgroundImage = img;
          canvas.renderAll();
          toast.success("Background generated!");
        });
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

    const text = new Textbox("Your message here", {
      left: 300,
      top: 200,
      width: 400,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      textAlign: "center",
      originX: "center",
      originY: "center",
    });
    addAndSelect(text);
    toast.success("Text added! Double-click to edit.");
  };

  const addHeading = () => addAndSelect(new Textbox("Add a heading", {
    left: 300, top: 80, width: 500, fontSize: 44, fontWeight: "bold",
    fontFamily: "Georgia", fill: "#111827", textAlign: "center", originX: "center",
  }));
  const addSubheading = () => addAndSelect(new Textbox("Add a subheading", {
    left: 300, top: 150, width: 500, fontSize: 24, fontFamily: "Georgia",
    fill: "#374151", textAlign: "center", originX: "center",
  }));

  const handleSave = async () => {
    if (!canvas) return;
    if (!user) {
      toast.error("Please sign in to save");
      return;
    }
    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    setIsSaving(true);
    await performSave(false);
    setIsSaving(false);
  };

  const handleExport = () => {
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    const link = document.createElement("a");
    link.download = `${occasion}-card.png`;
    link.href = dataUrl;
    link.click();
    toast.success("Card exported as PNG!");
  };

  const isText = activeObject && (activeObject.type === "textbox" || activeObject.type === "i-text");
  const ao: any = activeObject || {};

  return (
    <div className="space-y-6">
      {/* Top toolbar: occasion + actions */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-border shadow-elegant flex flex-wrap gap-3 items-end">
        <div className="min-w-[160px]">
          <Label>Occasion</Label>
          <Select value={occasion} onValueChange={setOccasion}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="birthday">Birthday</SelectItem>
              <SelectItem value="anniversary">Anniversary</SelectItem>
              <SelectItem value="congratulations">Congratulations</SelectItem>
              <SelectItem value="thank-you">Thank You</SelectItem>
              <SelectItem value="holiday">Holiday</SelectItem>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="baby">Baby</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[180px]">
          <Label>Recipient (Optional)</Label>
          <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="John Doe" className="mt-1" />
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <AutosaveBadge status={saveStatus} lastSavedAt={lastSavedAt} signedIn={!!user} />
          <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex.current <= 0}><Undo2 className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex.current >= historyRef.current.length - 1}><Redo2 className="w-4 h-4" /></Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="w-4 h-4 mr-2" />{isSaving ? "Saving..." : "Save"}</Button>
          <Button size="sm" variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export PNG</Button>
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
                    <span className="text-xs text-white drop-shadow">{g.name}</span>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-2 mt-4">
              <Button className="w-full" variant="accent" onClick={handleGenerateMessage} disabled={isGenerating}>
                <Sparkles className="w-4 h-4 mr-2" />{isGenerating ? "Generating..." : "AI Message"}
              </Button>
              <Button className="w-full" variant="gold" onClick={handleGenerateBackground} disabled={isGeneratingImage}>
                <Wand2 className="w-4 h-4 mr-2" />{isGeneratingImage ? "Generating..." : "AI Background"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Uses occasion + recipient as context.</p>
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
          {/* Property bar */}
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

function AutosaveBadge({
  status,
  lastSavedAt,
  signedIn,
}: {
  status: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  signedIn: boolean;
}) {
  if (!signedIn) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
        <CloudOff className="w-3.5 h-3.5" /> Sign in to autosave
      </span>
    );
  }
  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-destructive px-2.5 py-1 rounded-md bg-destructive/10 border border-destructive/20">
        <CloudOff className="w-3.5 h-3.5" /> Couldn't autosave
      </span>
    );
  }
  if (status === "saved" && lastSavedAt) {
    const time = lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" /> Saved · {time}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
      <Cloud className="w-3.5 h-3.5" /> Autosave on
    </span>
  );
}
