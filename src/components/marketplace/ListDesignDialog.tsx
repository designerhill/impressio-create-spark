import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface Design {
  id: string;
  title: string;
  type: string;
  thumbnail_url: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDesignId?: string;
  onListed?: () => void;
}

export const ListDesignDialog = ({ open, onOpenChange, defaultDesignId, onListed }: Props) => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [designId, setDesignId] = useState<string | undefined>(defaultDesignId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceUsd, setPriceUsd] = useState("0");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDesignId(defaultDesignId);
    supabase
      .from("designs")
      .select("id, title, type, thumbnail_url")
      .in("type", ["certificate", "card"])
      .order("updated_at", { ascending: false })
      .then(({ data }) => setDesigns((data as Design[]) || []));
  }, [open, defaultDesignId]);

  useEffect(() => {
    const d = designs.find((x) => x.id === designId);
    if (d && !title) setTitle(d.title);
  }, [designId, designs]);

  const handleSubmit = async () => {
    if (!user || !designId || !title.trim()) {
      toast.error("Pick a design and add a title");
      return;
    }
    const design = designs.find((d) => d.id === designId);
    if (!design) return;
    const cents = Math.max(0, Math.round(parseFloat(priceUsd || "0") * 100));
    setSubmitting(true);
    const { error } = await supabase.from("marketplace_listings").insert({
      design_id: designId,
      seller_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      type: design.type,
      preview_url: design.thumbnail_url,
      price_cents: cents,
      is_published: true,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(cents === 0 ? "Listed for free!" : `Listed at $${(cents / 100).toFixed(2)}`);
    onOpenChange(false);
    setTitle(""); setDescription(""); setPriceUsd("0");
    onListed?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>List a design for sale</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Design</Label>
            <Select value={designId} onValueChange={setDesignId}>
              <SelectTrigger><SelectValue placeholder="Pick a design" /></SelectTrigger>
              <SelectContent>
                {designs.length === 0 && <div className="p-3 text-sm text-muted-foreground">No card or certificate designs yet.</div>}
                {designs.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.title} ({d.type})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Public listing title" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What makes this design special?" rows={3} />
          </div>
          <div>
            <Label>Price (USD)</Label>
            <Input type="number" min="0" step="0.5" value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Set 0 to list it for free. You earn 80% of every sale.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};