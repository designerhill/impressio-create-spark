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
  FlipVertical, Cloud, CloudOff, Loader2, CheckCircle2,
  Share2, ZoomIn, ZoomOut, Grid3x3, Upload as UploadIcon, Smile as SmileIcon,
  Shapes, PanelLeftClose, LayoutTemplate, Bookmark, Plus,
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

type PresetItem = {
  text: string;
  top: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: "left" | "center" | "right";
  charSpacing?: number;
  width?: number;
};

type CardPreset = {
  id: string;
  name: string;
  description: string;
  accent: string;
  items: PresetItem[];
  decor?: "underline" | "double-line" | "none";
};

// Canvas is 600 × 400. Use centered originX.
const CARD_PRESETS: CardPreset[] = [
  {
    id: "birthday-bash",
    name: "Birthday Bash",
    description: "Fun, bold birthday wishes",
    accent: "#ec4899",
    decor: "none",
    items: [
      { text: "🎉 Happy Birthday 🎉", top: 60, fontSize: 38, fontFamily: "Comic Sans MS", fill: "#db2777", fontWeight: "bold", textAlign: "center" },
      { text: "to someone special", top: 130, fontSize: 18, fontFamily: "Comic Sans MS", fill: "#7c3aed", fontStyle: "italic", textAlign: "center" },
      { text: "Recipient Name", top: 180, fontSize: 34, fontFamily: "Comic Sans MS", fill: "#1f2937", fontWeight: "bold", textAlign: "center" },
      { text: "Wishing you a day filled with laughter,\nlove, and lots of cake!", top: 250, fontSize: 16, fontFamily: "Comic Sans MS", fill: "#374151", textAlign: "center" },
    ],
  },
  {
    id: "elegant-anniversary",
    name: "Elegant Anniversary",
    description: "Romantic script for couples",
    accent: "#9b6b3f",
    decor: "double-line",
    items: [
      { text: "Happy Anniversary", top: 50, fontSize: 44, fontFamily: "Brush Script MT", fill: "#7c4a1e", textAlign: "center" },
      { text: "celebrating you", top: 140, fontSize: 16, fontFamily: "Palatino", fill: "#6b7280", fontStyle: "italic", textAlign: "center" },
      { text: "Recipient Name", top: 180, fontSize: 30, fontFamily: "Palatino", fill: "#1f2937", fontWeight: "bold", textAlign: "center" },
      { text: "Another year of love, laughter, and\nbeautiful memories together.", top: 250, fontSize: 15, fontFamily: "Palatino", fill: "#4b5563", fontStyle: "italic", textAlign: "center" },
    ],
  },
  {
    id: "modern-thanks",
    name: "Modern Thank You",
    description: "Clean sans-serif gratitude",
    accent: "#111827",
    decor: "underline",
    items: [
      { text: "THANK YOU", top: 80, fontSize: 48, fontFamily: "Verdana", fill: "#111827", fontWeight: "bold", textAlign: "center", charSpacing: 400 },
      { text: "to", top: 170, fontSize: 14, fontFamily: "Verdana", fill: "#9ca3af", textAlign: "center", charSpacing: 200 },
      { text: "Recipient Name", top: 200, fontSize: 28, fontFamily: "Verdana", fill: "#111827", fontWeight: "bold", textAlign: "center" },
      { text: "for your kindness, support, and generosity.\nIt truly means the world.", top: 270, fontSize: 14, fontFamily: "Verdana", fill: "#4b5563", textAlign: "center" },
    ],
  },
  {
    id: "congrats-bold",
    name: "Congrats Bold",
    description: "Strong, celebratory impact",
    accent: "#1e40af",
    decor: "underline",
    items: [
      { text: "CONGRATULATIONS!", top: 70, fontSize: 36, fontFamily: "Impact", fill: "#1e3a8a", textAlign: "center", charSpacing: 200 },
      { text: "WAY TO GO", top: 150, fontSize: 13, fontFamily: "Arial", fill: "#1e40af", textAlign: "center", fontWeight: "bold", charSpacing: 400 },
      { text: "Recipient Name", top: 185, fontSize: 36, fontFamily: "Arial", fill: "#111827", fontWeight: "bold", textAlign: "center" },
      { text: "You did it! So proud of everything\nyou've accomplished.", top: 260, fontSize: 15, fontFamily: "Arial", fill: "#374151", textAlign: "center" },
    ],
  },
  {
    id: "holiday-warmth",
    name: "Holiday Warmth",
    description: "Cozy, classic season's greetings",
    accent: "#b91c1c",
    decor: "double-line",
    items: [
      { text: "Season's Greetings", top: 60, fontSize: 40, fontFamily: "Georgia", fill: "#7f1d1d", fontStyle: "italic", textAlign: "center" },
      { text: "warm wishes for", top: 150, fontSize: 16, fontFamily: "Georgia", fill: "#6b7280", textAlign: "center" },
      { text: "Recipient Name", top: 190, fontSize: 30, fontFamily: "Georgia", fill: "#1f2937", fontWeight: "bold", textAlign: "center" },
      { text: "May your holidays be filled with joy,\npeace, and the company of loved ones.", top: 260, fontSize: 15, fontFamily: "Georgia", fill: "#4b5563", textAlign: "center" },
    ],
  },
  {
    id: "baby-soft",
    name: "Baby Soft",
    description: "Sweet, gentle new baby card",
    accent: "#f472b6",
    decor: "none",
    items: [
      { text: "👶 Welcome, Little One 👶", top: 70, fontSize: 28, fontFamily: "Palatino", fill: "#be185d", fontStyle: "italic", textAlign: "center" },
      { text: "congratulations to", top: 140, fontSize: 14, fontFamily: "Palatino", fill: "#9ca3af", textAlign: "center" },
      { text: "The Family", top: 175, fontSize: 30, fontFamily: "Brush Script MT", fill: "#1f2937", textAlign: "center" },
      { text: "Wishing you endless cuddles, sleep-filled nights,\nand the sweetest of memories.", top: 250, fontSize: 14, fontFamily: "Palatino", fill: "#4b5563", fontStyle: "italic", textAlign: "center" },
    ],
  },
];

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

  // UI state
  const [projectTitle, setProjectTitle] = useState("Untitled Card");
  const [activeTool, setActiveTool] = useState<
    "text" | "presets" | "shapes" | "bg" | "ai" | "upload" | "stickers"
  >("text");
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showLayers, setShowLayers] = useState(true);

  // Custom (user-saved) text presets — stored in localStorage per user
  type SavedTextItem = {
    text: string;
    left: number;
    top: number;
    width: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
    fontWeight: string | number;
    fontStyle: string;
    textAlign: "left" | "center" | "right";
    originX: "left" | "center" | "right";
    charSpacing: number;
    underline?: boolean;
    angle?: number;
    opacity?: number;
    lineHeight?: number;
  };
  type SavedPreset = {
    id: string;
    name: string;
    createdAt: number;
    items: SavedTextItem[];
    thumbnail?: string;
  };
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const userKey = user?.id || "anon";
  const presetStorageKey = `impressio:card-text-presets:${userKey}`;
  const [newPresetName, setNewPresetName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(presetStorageKey);
      setSavedPresets(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedPresets([]);
    }
  }, [presetStorageKey]);

  const persistPresets = (next: SavedPreset[]) => {
    setSavedPresets(next);
    try {
      localStorage.setItem(presetStorageKey, JSON.stringify(next));
    } catch {
      toast.error("Couldn't save preset (storage full)");
    }
  };

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
        const title =
          projectTitle && projectTitle.trim() && projectTitle !== "Untitled Card"
            ? projectTitle
            : `${occasion} Card${recipientName ? ` for ${recipientName}` : ""}`;
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
    [canvas, user, occasion, recipientName, projectTitle]
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

  // Apply zoom whenever it changes
  useEffect(() => {
    if (!canvas) return;
    if (!(canvas as any).lowerCanvasEl) return;
    try {
      canvas.setZoom(zoom);
      canvas.setDimensions({ width: 600 * zoom, height: 400 * zoom });
      canvas.renderAll();
    } catch {
      // canvas was disposed mid-update; ignore
    }
  }, [zoom, canvas]);

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

  // ---- Built-in card text presets ----
  const applyTextPreset = (preset: CardPreset) => {
    if (!canvas) return;
    const toRemove = canvas.getObjects().filter((o: any) => {
      if (o.type === "textbox" || o.type === "i-text") return true;
      if (o._presetDecor) return true;
      return false;
    });
    toRemove.forEach((o) => canvas.remove(o));

    if (preset.decor === "underline") {
      const line = new Line([200, 130, 400, 130], { stroke: preset.accent, strokeWidth: 2, selectable: false });
      (line as any)._presetDecor = true;
      canvas.add(line);
    } else if (preset.decor === "double-line") {
      const l1 = new Line([180, 130, 420, 130], { stroke: preset.accent, strokeWidth: 2, selectable: false });
      const l2 = new Line([210, 137, 390, 137], { stroke: preset.accent, strokeWidth: 1, selectable: false });
      (l1 as any)._presetDecor = true;
      (l2 as any)._presetDecor = true;
      canvas.add(l1);
      canvas.add(l2);
    }

    preset.items.forEach((it) => {
      const tb = new Textbox(it.text, {
        left: 300,
        top: it.top,
        width: it.width ?? 540,
        fontSize: it.fontSize,
        fontFamily: it.fontFamily,
        fill: it.fill,
        fontWeight: it.fontWeight ?? "normal",
        fontStyle: it.fontStyle ?? "normal",
        textAlign: it.textAlign ?? "center",
        originX: "center",
        charSpacing: it.charSpacing ?? 0,
      });
      canvas.add(tb);
    });

    canvas.discardActiveObject();
    canvas.renderAll();
    saveHistory(canvas);
    toast.success(`Applied "${preset.name}" preset`);
  };

  // ---- Custom user presets ----
  const saveCurrentAsPreset = (name: string) => {
    if (!canvas) return;
    const trimmed = name.trim();
    if (!trimmed) { toast.error("Name your preset first"); return; }
    const texts = canvas.getObjects().filter(
      (o) => o.type === "textbox" || o.type === "i-text"
    );
    if (!texts.length) {
      toast.error("Add some text to the card first");
      return;
    }
    const items: SavedTextItem[] = texts.map((o: any) => ({
      text: o.text ?? "",
      left: o.left ?? 0,
      top: o.top ?? 0,
      width: o.width ?? 400,
      fontSize: o.fontSize ?? 24,
      fontFamily: o.fontFamily ?? "Arial",
      fill: typeof o.fill === "string" ? o.fill : "#000000",
      fontWeight: o.fontWeight ?? "normal",
      fontStyle: o.fontStyle ?? "normal",
      textAlign: (o.textAlign as any) ?? "left",
      originX: (o.originX as any) ?? "left",
      charSpacing: o.charSpacing ?? 0,
      underline: !!o.underline,
      angle: o.angle ?? 0,
      opacity: o.opacity ?? 1,
      lineHeight: o.lineHeight ?? 1.16,
    }));
    const preset: SavedPreset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmed,
      createdAt: Date.now(),
      items,
      thumbnail: (() => {
        try {
          canvas.discardActiveObject();
          canvas.renderAll();
          return canvas.toDataURL({
            format: "png",
            multiplier: 0.3 / (zoom || 1),
          });
        } catch {
          return undefined;
        }
      })(),
    };
    persistPresets([preset, ...savedPresets]);
    setNewPresetName("");
    toast.success(`Saved "${trimmed}"`);
  };

  const applyCustomPreset = (preset: SavedPreset) => {
    if (!canvas) return;
    const toRemove = canvas.getObjects().filter((o: any) => {
      if (o.type === "textbox" || o.type === "i-text") return true;
      if (o._presetDecor) return true;
      return false;
    });
    toRemove.forEach((o) => canvas.remove(o));

    preset.items.forEach((it) => {
      const tb = new Textbox(it.text, {
        left: it.left,
        top: it.top,
        width: it.width,
        fontSize: it.fontSize,
        fontFamily: it.fontFamily,
        fill: it.fill,
        fontWeight: it.fontWeight,
        fontStyle: it.fontStyle,
        textAlign: it.textAlign,
        originX: it.originX,
        charSpacing: it.charSpacing,
        underline: it.underline,
        angle: it.angle,
        opacity: it.opacity,
        lineHeight: it.lineHeight,
      });
      canvas.add(tb);
    });

    canvas.discardActiveObject();
    canvas.renderAll();
    saveHistory(canvas);
    toast.success(`Applied "${preset.name}"`);
  };

  const deleteCustomPreset = (id: string) => {
    persistPresets(savedPresets.filter((p) => p.id !== id));
    toast.success("Preset removed");
  };

  const renameCustomPreset = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    persistPresets(savedPresets.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
  };

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

  const layers = canvas ? canvas.getObjects() : [];
  const layerName = (o: FabricObject, i: number) => {
    const a: any = o;
    if (o.type === "textbox" || o.type === "i-text") {
      const t = (a.text || "").trim();
      return t ? (t.length > 22 ? t.slice(0, 22) + "…" : t) : `Text ${i + 1}`;
    }
    if (o.type === "image") return `Image ${i + 1}`;
    return `${(o.type || "Shape").replace(/^./, (c) => c.toUpperCase())} ${i + 1}`;
  };
  const selectLayer = (o: FabricObject) => {
    if (!canvas) return;
    canvas.setActiveObject(o);
    canvas.renderAll();
    setActiveObject(o);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const tools = [
    { id: "text" as const, icon: Type, label: "Text" },
    { id: "presets" as const, icon: LayoutTemplate, label: "Presets" },
    { id: "shapes" as const, icon: Shapes, label: "Shapes" },
    { id: "stickers" as const, icon: SmileIcon, label: "Stickers" },
    { id: "bg" as const, icon: Palette, label: "Background" },
    { id: "upload" as const, icon: UploadIcon, label: "Upload" },
    { id: "ai" as const, icon: Sparkles, label: "AI" },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="h-14 flex items-center gap-3 px-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              onFocus={(e) => projectTitle === "Untitled Card" && e.target.select()}
              className="h-9 w-[240px] font-medium border-transparent hover:border-slate-200 focus-visible:border-slate-300 focus-visible:ring-0 px-2"
            />
            <span className="text-xs text-slate-500 hidden md:inline whitespace-nowrap">
              {lastSavedAt
                ? `Last saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Not saved yet"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <AutosaveBadge status={saveStatus} lastSavedAt={lastSavedAt} signedIn={!!user} />
            <Separator orientation="vertical" className="h-6" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={undo} disabled={historyIndex.current <= 0}>
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (⌘Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={redo} disabled={historyIndex.current >= historyRef.current.length - 1}>
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />
            <Button size="sm" variant="ghost" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1.5" /> Share
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1.5" /> Export
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700 text-white">
              <Save className="w-4 h-4 mr-1.5" />{isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex min-h-0">
          {/* Tool rail */}
          <nav className="w-16 shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-1">
            {tools.map((t) => (
              <Tooltip key={t.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTool(t.id)}
                    className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${
                      activeTool === t.id
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <t.icon className="w-5 h-5" />
                    {t.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{t.label}</TooltipContent>
              </Tooltip>
            ))}
          </nav>

          {/* Tool panel */}
          <aside className="w-[280px] shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 capitalize">
                {tools.find((x) => x.id === activeTool)?.label}
              </h3>

              {activeTool === "text" && (
                <div className="space-y-2">
                  <Button className="w-full justify-start h-auto py-3" variant="outline" onClick={addHeading}>
                    <span className="font-bold text-lg mr-2">T</span>
                    <span className="text-left">
                      <div className="font-semibold">Add a heading</div>
                      <div className="text-xs text-slate-500 font-normal">Big, bold title</div>
                    </span>
                  </Button>
                  <Button className="w-full justify-start h-auto py-3" variant="outline" onClick={addSubheading}>
                    <span className="font-medium mr-2">T</span>
                    <span className="text-left">
                      <div className="font-medium">Add a subheading</div>
                      <div className="text-xs text-slate-500 font-normal">Supporting line</div>
                    </span>
                  </Button>
                  <Button className="w-full justify-start h-auto py-3" variant="outline" onClick={handleAddText}>
                    <span className="text-sm mr-2">T</span>
                    <span className="text-left">
                      <div className="text-sm">Add body text</div>
                      <div className="text-xs text-slate-500 font-normal">For longer messages</div>
                    </span>
                  </Button>
                </div>
              )}

              {activeTool === "shapes" && (
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={addRect} className="aspect-square rounded-lg border border-slate-200 hover:border-violet-400 hover:bg-violet-50 flex items-center justify-center transition">
                    <Square className="w-6 h-6 text-slate-700" />
                  </button>
                  <button onClick={addCircle} className="aspect-square rounded-lg border border-slate-200 hover:border-violet-400 hover:bg-violet-50 flex items-center justify-center transition">
                    <CircleIcon className="w-6 h-6 text-slate-700" />
                  </button>
                  <button onClick={addTriangle} className="aspect-square rounded-lg border border-slate-200 hover:border-violet-400 hover:bg-violet-50 flex items-center justify-center transition">
                    <TriangleIcon className="w-6 h-6 text-slate-700" />
                  </button>
                  <button onClick={addLine} className="aspect-square rounded-lg border border-slate-200 hover:border-violet-400 hover:bg-violet-50 flex items-center justify-center transition">
                    <Minus className="w-6 h-6 text-slate-700" />
                  </button>
                </div>
              )}

              {activeTool === "presets" && (
                <div className="space-y-4">
                  {/* My presets */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                      <Label className="text-xs text-slate-600">My presets</Label>
                    </div>
                    <div className="flex gap-1.5 mb-2">
                      <Input
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="Preset name"
                        className="h-8 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveCurrentAsPreset(newPresetName);
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 shrink-0"
                        onClick={() => saveCurrentAsPreset(newPresetName)}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Save
                      </Button>
                    </div>
                    {savedPresets.length === 0 ? (
                      <div className="text-[11px] text-slate-500 px-1 py-2">
                        Save your current text layout to reuse it later.
                      </div>
                    ) : (
                      <ul className="space-y-1.5">
                        {savedPresets.map((p) => (
                          <li
                            key={p.id}
                            className="group flex items-center gap-1 rounded-md border border-slate-200 hover:border-violet-300 px-2 py-1.5"
                          >
                            <button
                              onClick={() => applyCustomPreset(p)}
                              className="flex-1 text-left min-w-0"
                            >
                              <div className="text-xs font-medium text-slate-800 truncate">{p.name}</div>
                              <div className="text-[10px] text-slate-500">{p.items.length} element{p.items.length === 1 ? "" : "s"}</div>
                            </button>
                            <button
                              onClick={() => {
                                const next = prompt("Rename preset", p.name);
                                if (next) renameCustomPreset(p.id, next);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-500 hover:text-violet-700 px-1"
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => deleteCustomPreset(p.id)}
                              className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Separator />

                  {/* Built-in presets */}
                  <div>
                    <Label className="text-xs text-slate-600 mb-2 block">Layouts</Label>
                    <div className="space-y-2">
                      {CARD_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => applyTextPreset(p)}
                          className="w-full text-left rounded-md border border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: p.accent }}
                            />
                            <span className="text-sm font-medium text-slate-800">{p.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 pl-4.5">{p.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTool === "stickers" && (
                <div className="grid grid-cols-5 gap-2">
                  {STICKERS.map((s) => (
                    <button key={s} onClick={() => addSticker(s)} className="aspect-square text-2xl rounded-lg border border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {activeTool === "bg" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-600 mb-2 block">Solid Colors</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_BACKGROUNDS.map((b) => (
                        <button key={b.value} title={b.name} onClick={() => setSolidBg(b.value)}
                          className="h-10 rounded-md border border-slate-200 hover:ring-2 hover:ring-violet-400 transition" style={{ background: b.value }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600 mb-2 block">Custom Color</Label>
                    <input type="color" onChange={(e) => setSolidBg(e.target.value)} className="w-full h-10 rounded-md cursor-pointer border border-slate-200" />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600 mb-2 block">Gradients</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {GRADIENT_PRESETS.map((g) => (
                        <button key={g.name} onClick={() => setGradientBg(g.from, g.to)} className="h-14 rounded-md border border-slate-200 hover:ring-2 hover:ring-violet-400 transition flex items-end justify-center pb-1"
                          style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}>
                          <span className="text-[10px] font-medium text-white drop-shadow">{g.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTool === "upload" && (
                <div className="space-y-2">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-300 hover:border-violet-400 hover:bg-violet-50 rounded-lg p-6 flex flex-col items-center gap-2 transition"
                  >
                    <UploadIcon className="w-6 h-6 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Upload image</span>
                    <span className="text-xs text-slate-500">PNG, JPG, SVG</span>
                  </button>
                </div>
              )}

              {activeTool === "ai" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-600">Occasion</Label>
                    <Select value={occasion} onValueChange={setOccasion}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
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
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-600">Recipient (optional)</Label>
                    <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g. Sarah" className="h-9" />
                  </div>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" onClick={handleGenerateMessage} disabled={isGenerating}>
                    <Sparkles className="w-4 h-4 mr-2" />{isGenerating ? "Generating…" : "Generate message"}
                  </Button>
                  <Button className="w-full" variant="outline" onClick={handleGenerateBackground} disabled={isGeneratingImage}>
                    <Wand2 className="w-4 h-4 mr-2" />{isGeneratingImage ? "Generating…" : "Generate background"}
                  </Button>
                </div>
              )}
            </div>
          </aside>

          {/* Canvas stage */}
          <section className="flex-1 min-w-0 flex flex-col bg-slate-100">
            {/* Contextual property bar */}
            <div className="h-12 px-3 border-b border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto shrink-0">
              {!activeObject && (
                <span className="text-xs text-slate-500 px-2">Select an element on the canvas to edit it.</span>
              )}
              {activeObject && (
                <>
                  {isText && (
                    <>
                      <Select value={ao.fontFamily} onValueChange={(v) => updateActive({ fontFamily: v })}>
                        <SelectTrigger className="w-[140px] h-8"><SelectValue placeholder="Font" /></SelectTrigger>
                        <SelectContent>
                          {FONTS.map((f) => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input type="number" className="w-[64px] h-8" value={Math.round(ao.fontSize || 16)}
                        onChange={(e) => updateActive({ fontSize: Number(e.target.value) })} />
                      <Button size="sm" variant={ao.fontWeight === "bold" ? "default" : "ghost"} className="h-8 w-8 p-0" onClick={() => updateActive({ fontWeight: ao.fontWeight === "bold" ? "normal" : "bold" })}><Bold className="w-4 h-4" /></Button>
                      <Button size="sm" variant={ao.fontStyle === "italic" ? "default" : "ghost"} className="h-8 w-8 p-0" onClick={() => updateActive({ fontStyle: ao.fontStyle === "italic" ? "normal" : "italic" })}><Italic className="w-4 h-4" /></Button>
                      <Button size="sm" variant={ao.underline ? "default" : "ghost"} className="h-8 w-8 p-0" onClick={() => updateActive({ underline: !ao.underline })}><Underline className="w-4 h-4" /></Button>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      <Button size="sm" variant={ao.textAlign === "left" ? "default" : "ghost"} className="h-8 w-8 p-0" onClick={() => updateActive({ textAlign: "left" })}><AlignLeft className="w-4 h-4" /></Button>
                      <Button size="sm" variant={ao.textAlign === "center" ? "default" : "ghost"} className="h-8 w-8 p-0" onClick={() => updateActive({ textAlign: "center" })}><AlignCenter className="w-4 h-4" /></Button>
                      <Button size="sm" variant={ao.textAlign === "right" ? "default" : "ghost"} className="h-8 w-8 p-0" onClick={() => updateActive({ textAlign: "right" })}><AlignRight className="w-4 h-4" /></Button>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                    </>
                  )}
                  {(isText || activeObject.type === "rect" || activeObject.type === "circle" || activeObject.type === "triangle") && (
                    <label className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-600">Fill</span>
                      <input type="color" value={typeof ao.fill === "string" ? ao.fill : "#000000"}
                        onChange={(e) => updateActive({ fill: e.target.value })} className="h-7 w-8 rounded cursor-pointer border border-slate-200" />
                    </label>
                  )}
                  {(activeObject.type === "rect" || activeObject.type === "circle" || activeObject.type === "triangle" || activeObject.type === "line") && (
                    <label className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-600">Stroke</span>
                      <input type="color" value={typeof ao.stroke === "string" ? ao.stroke : "#000000"}
                        onChange={(e) => updateActive({ stroke: e.target.value })} className="h-7 w-8 rounded cursor-pointer border border-slate-200" />
                    </label>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8">Opacity</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <Slider value={[Math.round((ao.opacity ?? 1) * 100)]} min={0} max={100} step={1}
                        onValueChange={(v) => updateActive({ opacity: v[0] / 100 })} />
                    </PopoverContent>
                  </Popover>
                  <div className="ml-auto flex items-center gap-1">
                    <Tooltip><TooltipTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={flipH}><FlipHorizontal className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Flip horizontal</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={flipV}><FlipVertical className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Flip vertical</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={bringForward}><ChevronUp className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Bring forward</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={sendBackward}><ChevronDown className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Send backward</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={toggleLock}>{ao.lockMovementX ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}</Button></TooltipTrigger><TooltipContent>Lock</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={duplicateActive}><Copy className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Duplicate</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={deleteActive}><Trash2 className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
                  </div>
                </>
              )}
            </div>

            {/* Canvas area */}
            <div
              className="flex-1 overflow-auto p-8 relative"
              style={
                showGrid
                  ? {
                      backgroundImage:
                        "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }
                  : undefined
              }
            >
              <div className="mx-auto inline-block shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] rounded-md bg-white">
                <canvas ref={canvasRef} className="rounded-md block" />
              </div>
            </div>

            {/* Status / zoom bar */}
            <div className="h-10 px-4 border-t border-slate-200 bg-white flex items-center gap-3 text-xs text-slate-600 shrink-0">
              <span>600 × 400 px</span>
              <Separator orientation="vertical" className="h-5" />
              <button
                onClick={() => setShowGrid((g) => !g)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 ${showGrid ? "text-violet-700" : ""}`}
              >
                <Grid3x3 className="w-3.5 h-3.5" /> Grid
              </button>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <button onClick={() => setZoom(1)} className="px-2 py-1 rounded hover:bg-slate-100 tabular-nums w-14 text-center">
                  {Math.round(zoom * 100)}%
                </button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Right: Layers + properties hints */}
          {showLayers && (
            <aside className="w-[260px] shrink-0 bg-white border-l border-slate-200 flex flex-col">
              <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Layers className="w-4 h-4" /> Layers
                </div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowLayers(false)}>
                  <PanelLeftClose className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {layers.length === 0 ? (
                  <div className="text-center px-4 py-8 text-xs text-slate-500">
                    No layers yet. Add text, shapes or images from the left panel.
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {[...layers].reverse().map((o, idx) => {
                      const realIdx = layers.length - 1 - idx;
                      const selected = activeObject === o;
                      return (
                        <li key={realIdx}>
                          <button
                            onClick={() => selectLayer(o)}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-sm transition ${
                              selected
                                ? "bg-violet-50 text-violet-900 ring-1 ring-violet-200"
                                : "hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            <span className="w-6 h-6 rounded bg-slate-100 grid place-items-center text-slate-500 shrink-0">
                              {o.type === "textbox" || o.type === "i-text" ? (
                                <Type className="w-3.5 h-3.5" />
                              ) : o.type === "image" ? (
                                <ImageIcon className="w-3.5 h-3.5" />
                              ) : o.type === "circle" ? (
                                <CircleIcon className="w-3.5 h-3.5" />
                              ) : o.type === "triangle" ? (
                                <TriangleIcon className="w-3.5 h-3.5" />
                              ) : o.type === "line" ? (
                                <Minus className="w-3.5 h-3.5" />
                              ) : (
                                <Square className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <span className="truncate flex-1">{layerName(o, realIdx)}</span>
                            {(o as any).lockMovementX && <Lock className="w-3 h-3 text-slate-400" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {!activeObject && layers.length > 0 && (
                <div className="border-t border-slate-200 p-4 text-xs text-slate-500">
                  <div className="font-medium text-slate-700 mb-1">Nothing selected</div>
                  Click any layer above or any element on the canvas to edit its properties.
                </div>
              )}
            </aside>
          )}
          {!showLayers && (
            <button
              onClick={() => setShowLayers(true)}
              className="w-8 shrink-0 bg-white border-l border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              title="Show layers"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
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
