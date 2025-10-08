import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Textbox, Rect, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Download, Save, Type, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const CardCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [occasion, setOccasion] = useState("birthday");
  const [recipientName, setRecipientName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#fef3c7",
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

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
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    toast.success("Text added!");
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
        title: `${occasion} Card${recipientName ? ` for ${recipientName}` : ''}`,
        type: "card",
        design_data: designData,
        thumbnail_url: dataUrl,
      });

      if (error) throw error;

      toast.success("Card saved!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1 });
    const link = document.createElement("a");
    link.download = `${occasion}-card.png`;
    link.href = dataUrl;
    link.click();
    toast.success("Card exported!");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-elegant">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="occasion">Occasion</Label>
            <Select value={occasion} onValueChange={setOccasion}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="anniversary">Work Anniversary</SelectItem>
                <SelectItem value="congratulations">Congratulations</SelectItem>
                <SelectItem value="thank-you">Thank You</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="recipient">Recipient Name (Optional)</Label>
            <Input
              id="recipient"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleAddText} variant="secondary">
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
          <Button onClick={handleGenerateMessage} disabled={isGenerating} variant="accent">
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "AI Message"}
          </Button>
          <Button onClick={handleGenerateBackground} disabled={isGeneratingImage} variant="gold">
            <Wand2 className="w-4 h-4 mr-2" />
            {isGeneratingImage ? "Generating..." : "AI Background"}
          </Button>
          <Button onClick={handleSave} disabled={isSaving} variant="default">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
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
