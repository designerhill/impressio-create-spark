import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Textbox, Rect } from "fabric";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, Save, Type, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

export const CertificateCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [title, setTitle] = useState("Certificate of Achievement");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

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
          if (td.background && !String(td.background).startsWith("linear-gradient")) {
            bgColor = td.background;
          }
          if (td.border === "gold") borderColor = "#D4AF37";
          else if (td.border === "silver") borderColor = "#C0C0C0";
          else if (td.border === "none") borderColor = "transparent";
          toast.success(`Loaded template: ${data.title}`);
        }
      }

      fabricCanvas.backgroundColor = bgColor;

      if (borderColor !== "transparent") {
        fabricCanvas.add(
          new Rect({
            left: 20,
            top: 20,
            width: 760,
            height: 560,
            fill: "transparent",
            stroke: borderColor,
            strokeWidth: 8,
            selectable: false,
          })
        );
      }

      fabricCanvas.add(
        new Textbox(templateTitle, {
          left: 400,
          top: 100,
          width: 600,
          fontSize: 48,
          fontFamily: "Georgia",
          fill: "#2C3E50",
          textAlign: "center",
          originX: "center",
        })
      );
      fabricCanvas.renderAll();
    };

    applyTemplate();
    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [templateId]);

  const handleAddText = () => {
    if (!canvas) return;

    const text = new Textbox("Double click to edit", {
      left: 400,
      top: 300,
      width: 400,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      textAlign: "center",
      originX: "center",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    toast.success("Text added! Double-click to edit");
  };

  const handleGenerateWithAI = async () => {
    if (!canvas) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-design", {
        body: { 
          prompt: `Generate certificate text for: ${title}. Include recipient name placeholder, achievement description, and date.`,
          type: "certificate"
        },
      });

      if (error) throw error;

      if (data?.text) {
        const aiText = new Textbox(data.text, {
          left: 400,
          top: 350,
          width: 600,
          fontSize: 18,
          fontFamily: "Arial",
          fill: "#34495E",
          textAlign: "center",
          originX: "center",
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

  const handleSave = async () => {
    if (!canvas) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save");
        return;
      }

      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1 });
      const designData = canvas.toJSON();

      const { error } = await supabase.from("designs").insert({
        user_id: user.id,
        title: title || "Untitled Certificate",
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

  const handleExportPDF = () => {
    if (!canvas) return;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [800, 600],
    });

    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1 });
    pdf.addImage(dataUrl, "PNG", 0, 0, 800, 600);
    pdf.save(`${title || "certificate"}.pdf`);
    toast.success("PDF exported!");
  };

  const handleExportPNG = () => {
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1 });
    const link = document.createElement("a");
    link.download = `${title || "certificate"}.png`;
    link.href = dataUrl;
    link.click();
    toast.success("PNG exported!");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="title">Certificate Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Certificate of Achievement"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleAddText} variant="secondary">
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
          <Button onClick={handleGenerateWithAI} disabled={isGenerating} variant="accent">
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "AI Generate"}
          </Button>
          <Button onClick={handleSave} disabled={isSaving} variant="default">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleExportPNG} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PNG
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant">
        <canvas ref={canvasRef} className="border border-border rounded-lg shadow-lg mx-auto" />
      </div>
    </div>
  );
};
