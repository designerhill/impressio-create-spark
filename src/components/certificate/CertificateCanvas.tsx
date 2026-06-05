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
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sparkles, Download, Save, Type, Wand2, Square, Circle as CircleIcon,
  Triangle as TriangleIcon, Minus, Image as ImageIcon, Trash2, Copy,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Layers, ChevronUp, ChevronDown, Lock, Unlock, Palette, FlipHorizontal,
  FlipVertical, Share2, ZoomIn, ZoomOut, Grid3x3, Upload as UploadIcon,
  Smile as SmileIcon, Shapes, PanelLeftClose, FileText, LayoutTemplate,
  Bookmark, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import { renderTemplateObjects } from "@/lib/templateRender";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

type CertPreset = {
  id: string;
  name: string;
  description: string;
  accent: string;
  items: PresetItem[];
  decor?: "underline" | "double-line" | "none";
};

const CERT_PRESETS: CertPreset[] = [
  {
    id: "classic-gold",
    name: "Classic Gold",
    description: "Traditional serif with gold accents",
    accent: "#D4AF37",
    decor: "double-line",
    items: [
      { text: "CERTIFICATE", top: 90, fontSize: 56, fontFamily: "Georgia", fill: "#1f2937", fontWeight: "bold", textAlign: "center", charSpacing: 600 },
      { text: "OF ACHIEVEMENT", top: 160, fontSize: 22, fontFamily: "Georgia", fill: "#6b7280", textAlign: "center", charSpacing: 800 },
      { text: "This certificate is proudly presented to", top: 230, fontSize: 18, fontFamily: "Georgia", fill: "#374151", fontStyle: "italic", textAlign: "center" },
      { text: "Recipient Name", top: 280, fontSize: 48, fontFamily: "Brush Script MT", fill: "#1f2937", textAlign: "center" },
      { text: "For outstanding performance and dedication\nin recognition of exceptional achievement.", top: 370, fontSize: 16, fontFamily: "Georgia", fill: "#4b5563", textAlign: "center" },
      { text: "Date", top: 500, fontSize: 14, fontFamily: "Georgia", fill: "#6b7280", textAlign: "center", width: 200 },
      { text: "Signature", top: 500, fontSize: 14, fontFamily: "Georgia", fill: "#6b7280", textAlign: "center", width: 200 },
    ],
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean sans-serif, lots of whitespace",
    accent: "#111827",
    decor: "underline",
    items: [
      { text: "Certificate of Completion", top: 110, fontSize: 38, fontFamily: "Verdana", fill: "#111827", fontWeight: "bold", textAlign: "center" },
      { text: "AWARDED TO", top: 220, fontSize: 14, fontFamily: "Verdana", fill: "#9ca3af", textAlign: "center", charSpacing: 400 },
      { text: "Recipient Name", top: 260, fontSize: 44, fontFamily: "Verdana", fill: "#111827", fontWeight: "bold", textAlign: "center" },
      { text: "for successfully completing the program with distinction.", top: 360, fontSize: 16, fontFamily: "Verdana", fill: "#4b5563", textAlign: "center" },
      { text: "DATE", top: 490, fontSize: 12, fontFamily: "Verdana", fill: "#9ca3af", textAlign: "center", width: 200, charSpacing: 200 },
      { text: "SIGNATURE", top: 490, fontSize: 12, fontFamily: "Verdana", fill: "#9ca3af", textAlign: "center", width: 200, charSpacing: 200 },
    ],
  },
  {
    id: "elegant-script",
    name: "Elegant Script",
    description: "Script headings, romantic feel",
    accent: "#9b6b3f",
    decor: "double-line",
    items: [
      { text: "Certificate", top: 90, fontSize: 72, fontFamily: "Brush Script MT", fill: "#7c4a1e", textAlign: "center" },
      { text: "of Excellence", top: 180, fontSize: 26, fontFamily: "Palatino", fill: "#7c4a1e", fontStyle: "italic", textAlign: "center" },
      { text: "presented to", top: 240, fontSize: 16, fontFamily: "Palatino", fill: "#6b7280", fontStyle: "italic", textAlign: "center" },
      { text: "Recipient Name", top: 290, fontSize: 42, fontFamily: "Palatino", fill: "#1f2937", fontWeight: "bold", textAlign: "center" },
      { text: "in heartfelt recognition of remarkable\ndedication and inspiring contribution.", top: 380, fontSize: 16, fontFamily: "Palatino", fill: "#4b5563", fontStyle: "italic", textAlign: "center" },
      { text: "Date", top: 500, fontSize: 14, fontFamily: "Palatino", fill: "#6b7280", textAlign: "center", width: 200 },
      { text: "Signature", top: 500, fontSize: 14, fontFamily: "Palatino", fill: "#6b7280", textAlign: "center", width: 200 },
    ],
  },
  {
    id: "corporate-bold",
    name: "Corporate Bold",
    description: "Strong impact heading, professional",
    accent: "#1e40af",
    decor: "underline",
    items: [
      { text: "CERTIFICATE OF APPRECIATION", top: 100, fontSize: 34, fontFamily: "Impact", fill: "#1e3a8a", textAlign: "center", charSpacing: 200 },
      { text: "PRESENTED TO", top: 200, fontSize: 14, fontFamily: "Arial", fill: "#1e40af", textAlign: "center", fontWeight: "bold", charSpacing: 400 },
      { text: "Recipient Name", top: 240, fontSize: 50, fontFamily: "Arial", fill: "#111827", fontWeight: "bold", textAlign: "center" },
      { text: "In recognition of valuable contributions and exemplary service\nto the organization throughout the year.", top: 340, fontSize: 16, fontFamily: "Arial", fill: "#374151", textAlign: "center" },
      { text: "Date", top: 500, fontSize: 13, fontFamily: "Arial", fill: "#6b7280", textAlign: "center", width: 200, fontWeight: "bold" },
      { text: "Authorized Signature", top: 500, fontSize: 13, fontFamily: "Arial", fill: "#6b7280", textAlign: "center", width: 200, fontWeight: "bold" },
    ],
  },
  {
    id: "academic",
    name: "Academic Diploma",
    description: "University-style, formal Latin feel",
    accent: "#4c1d95",
    decor: "double-line",
    items: [
      { text: "The Institute of Excellence", top: 80, fontSize: 20, fontFamily: "Times New Roman", fill: "#4c1d95", fontStyle: "italic", textAlign: "center" },
      { text: "Diploma of Honor", top: 130, fontSize: 48, fontFamily: "Times New Roman", fill: "#1f2937", fontWeight: "bold", textAlign: "center" },
      { text: "Be it known that", top: 220, fontSize: 16, fontFamily: "Times New Roman", fill: "#4b5563", fontStyle: "italic", textAlign: "center" },
      { text: "Recipient Name", top: 260, fontSize: 40, fontFamily: "Times New Roman", fill: "#1f2937", textAlign: "center" },
      { text: "having satisfied all requirements is hereby granted this diploma\nwith all rights, honors, and privileges thereto appertaining.", top: 340, fontSize: 16, fontFamily: "Times New Roman", fill: "#4b5563", textAlign: "center" },
      { text: "Date Conferred", top: 500, fontSize: 13, fontFamily: "Times New Roman", fill: "#6b7280", textAlign: "center", width: 200, fontStyle: "italic" },
      { text: "Dean's Signature", top: 500, fontSize: 13, fontFamily: "Times New Roman", fill: "#6b7280", textAlign: "center", width: 200, fontStyle: "italic" },
    ],
  },
  {
    id: "playful",
    name: "Playful Award",
    description: "Fun, casual — great for kids & events",
    accent: "#ec4899",
    decor: "none",
    items: [
      { text: "🌟 Super Star Award 🌟", top: 100, fontSize: 42, fontFamily: "Comic Sans MS", fill: "#db2777", fontWeight: "bold", textAlign: "center" },
      { text: "goes to", top: 200, fontSize: 22, fontFamily: "Comic Sans MS", fill: "#7c3aed", textAlign: "center" },
      { text: "Recipient Name", top: 250, fontSize: 48, fontFamily: "Comic Sans MS", fill: "#1f2937", fontWeight: "bold", textAlign: "center" },
      { text: "for being amazing, working hard, and making\neveryone smile every single day! 🎉", top: 360, fontSize: 18, fontFamily: "Comic Sans MS", fill: "#374151", textAlign: "center" },
      { text: "Date", top: 500, fontSize: 14, fontFamily: "Comic Sans MS", fill: "#6b7280", textAlign: "center", width: 200 },
      { text: "Signed", top: 500, fontSize: 14, fontFamily: "Comic Sans MS", fill: "#6b7280", textAlign: "center", width: 200 },
    ],
  },
];

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

  // UI state
  const [projectTitle, setProjectTitle] = useState("Untitled Certificate");
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
  };
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [userKey, setUserKey] = useState<string>("anon");
  const presetStorageKey = `impressio:cert-text-presets:${userKey}`;
  const [newPresetName, setNewPresetName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserKey(data.user?.id || "anon");
    });
  }, []);

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

  // Apply zoom whenever it changes
  useEffect(() => {
    if (!canvas) return;
    canvas.setZoom(zoom);
    canvas.setWidth(800 * zoom);
    canvas.setHeight(600 * zoom);
    canvas.renderAll();
  }, [zoom, canvas]);

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
          setProjectTitle(data.title);
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

  const applyTextPreset = (preset: CertPreset) => {
    if (!canvas) return;
    // Remove existing text + decorative preset lines (keep background rect / borders / images / shapes)
    const toRemove = canvas.getObjects().filter((o: any) => {
      if (o.type === "textbox" || o.type === "i-text") return true;
      if (o._presetDecor) return true;
      return false;
    });
    toRemove.forEach((o) => canvas.remove(o));

    // Optional decorative divider under heading
    if (preset.decor === "underline") {
      const line = new Line([250, 175, 550, 175], { stroke: preset.accent, strokeWidth: 2, selectable: false });
      (line as any)._presetDecor = true;
      canvas.add(line);
    } else if (preset.decor === "double-line") {
      const l1 = new Line([220, 210, 580, 210], { stroke: preset.accent, strokeWidth: 2, selectable: false });
      const l2 = new Line([260, 218, 540, 218], { stroke: preset.accent, strokeWidth: 1, selectable: false });
      (l1 as any)._presetDecor = true;
      (l2 as any)._presetDecor = true;
      canvas.add(l1);
      canvas.add(l2);
    }

    preset.items.forEach((it, idx) => {
      const isFooter = it.top >= 480;
      const width = it.width ?? 700;
      let left = 400;
      if (isFooter) {
        // Two-column footer: distribute left/right based on order among footer items
        const footerIdx = preset.items.filter((p) => p.top >= 480).indexOf(it);
        left = footerIdx === 0 ? 200 : 600;
      }
      const tb = new Textbox(it.text, {
        left,
        top: it.top,
        width,
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

      // Signature/Date lines for footer fields
      if (isFooter) {
        const lineY = it.top - 8;
        const sigLine = new Line([left - 90, lineY, left + 90, lineY], {
          stroke: "#9ca3af",
          strokeWidth: 1,
          selectable: false,
        });
        (sigLine as any)._presetDecor = true;
        canvas.add(sigLine);
      }
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
      toast.error("Add some text to the canvas first");
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
    };
    persistPresets([preset, ...savedPresets]);
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

  // ---- save / export ----
  const handleSave = async () => {
    if (!canvas) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please sign in to save"); return; }
      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1 });
      const designData = canvas.toJSON();
      const finalTitle =
        projectTitle && projectTitle.trim() && projectTitle !== "Untitled Certificate"
          ? projectTitle
          : `${title || "Untitled Certificate"}${recipientName ? ` — ${recipientName}` : ""}`;
      const { error } = await supabase.from("designs").insert({
        user_id: user.id,
        title: finalTitle,
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
    link.download = `${projectTitle || title || "certificate"}.png`;
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
    pdf.save(`${projectTitle || title || "certificate"}.pdf`);
    toast.success("PDF exported!");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
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
              onFocus={(e) => projectTitle === "Untitled Certificate" && e.target.select()}
              className="h-9 w-[260px] font-medium border-transparent hover:border-slate-200 focus-visible:border-slate-300 focus-visible:ring-0 px-2"
            />
            <span className="text-xs text-slate-500 hidden md:inline whitespace-nowrap">Draft</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
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
            <Button size="sm" variant="outline" onClick={handleExportPNG}>
              <Download className="w-4 h-4 mr-1.5" /> PNG
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportPDF}>
              <FileText className="w-4 h-4 mr-1.5" /> PDF
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
                      <div className="text-xs text-slate-500 font-normal">Certificate title</div>
                    </span>
                  </Button>
                  <Button className="w-full justify-start h-auto py-3" variant="outline" onClick={addSubheading}>
                    <span className="font-medium mr-2">T</span>
                    <span className="text-left">
                      <div className="font-medium">Add a subheading</div>
                      <div className="text-xs text-slate-500 font-normal">e.g. is hereby awarded to</div>
                    </span>
                  </Button>
                  <Button className="w-full justify-start h-auto py-3" variant="outline" onClick={handleAddText}>
                    <span className="text-sm mr-2">T</span>
                    <span className="text-left">
                      <div className="text-sm">Add body text</div>
                      <div className="text-xs text-slate-500 font-normal">Description, date, signature</div>
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
                <div className="space-y-2">
                  {/* Save current text as a custom preset */}
                  <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-3 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-violet-700" />
                      <Label className="text-xs font-semibold text-violet-900">My presets</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Input
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="Preset name…"
                        className="h-8 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveCurrentAsPreset(newPresetName);
                            setNewPresetName("");
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-8 bg-violet-600 hover:bg-violet-700 text-white px-2"
                        onClick={() => {
                          saveCurrentAsPreset(newPresetName);
                          setNewPresetName("");
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Captures every text element's font, color, size, position & spacing.
                    </p>

                    {savedPresets.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        {savedPresets.map((sp) => (
                          <div
                            key={sp.id}
                            className="group flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5"
                          >
                            <button
                              onClick={() => applyCustomPreset(sp)}
                              className="flex-1 min-w-0 text-left"
                              title="Apply this preset"
                            >
                              <div className="text-xs font-medium text-slate-900 truncate">{sp.name}</div>
                              <div className="text-[10px] text-slate-500">
                                {sp.items.length} element{sp.items.length === 1 ? "" : "s"}
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                const n = window.prompt("Rename preset", sp.name);
                                if (n) renameCustomPreset(sp.id, n);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition text-[10px] text-slate-500 hover:text-slate-900 px-1"
                              title="Rename"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCustomPreset(sp.id)}
                              className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-red-600 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        No saved presets yet.
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 pt-2 pb-1">
                    Built-in layouts — replaces existing text.
                  </p>
                  {CERT_PRESETS.map((p) => {
                    const heading = p.items[0];
                    const sub = p.items[1];
                    return (
                      <button
                        key={p.id}
                        onClick={() => applyTextPreset(p)}
                        className="w-full text-left rounded-lg border border-slate-200 hover:border-violet-400 hover:bg-violet-50/40 p-3 transition group"
                      >
                        <div
                          className="rounded-md border border-slate-100 bg-white px-3 py-3 mb-2 flex flex-col items-center justify-center min-h-[70px]"
                          style={{ borderTop: `3px solid ${p.accent}` }}
                        >
                          <span
                            className="truncate max-w-full"
                            style={{
                              fontFamily: heading.fontFamily,
                              fontWeight: heading.fontWeight as any,
                              fontStyle: heading.fontStyle as any,
                              color: heading.fill,
                              fontSize: 18,
                              letterSpacing: heading.charSpacing ? `${(heading.charSpacing / 1000) * 0.5}em` : undefined,
                            }}
                          >
                            {heading.text}
                          </span>
                          {sub && (
                            <span
                              className="truncate max-w-full mt-1"
                              style={{
                                fontFamily: sub.fontFamily,
                                fontStyle: sub.fontStyle as any,
                                color: sub.fill,
                                fontSize: 11,
                              }}
                            >
                              {sub.text}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                            <div className="text-[11px] text-slate-500">{p.description}</div>
                          </div>
                          <span
                            className="inline-block w-3 h-3 rounded-full shrink-0"
                            style={{ background: p.accent }}
                          />
                        </div>
                      </button>
                    );
                  })}
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
                          <span className="text-[10px] font-medium text-slate-800 drop-shadow">{g.name}</span>
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
                    <span className="text-xs text-slate-500">Logo, signature, photo</span>
                  </button>
                </div>
              )}

              {activeTool === "ai" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-600">Certificate Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Certificate of Achievement" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-600">Recipient (optional)</Label>
                    <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Jane Doe" className="h-9" />
                  </div>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" onClick={handleGenerateWithAI} disabled={isGenerating}>
                    <Sparkles className="w-4 h-4 mr-2" />{isGenerating ? "Generating…" : "Generate text"}
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
              <span>800 × 600 px</span>
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

          {/* Right: Layers */}
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
