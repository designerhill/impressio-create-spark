import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Award, Gift, LayoutTemplate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";
import { toast } from "sonner";

interface Template {
  id: string;
  title: string;
  type: string;
  preview_url: string | null;
  template_data: any;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Restricts which templates are shown and where to navigate. */
  type: "certificate" | "card";
}

/**
 * In-editor template browser. Lets the user swap the current canvas to a
 * different template without leaving the editor.
 */
export const TemplatePickerDialog = ({ open, onOpenChange, type }: Props) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentId = searchParams.get("templateId");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    supabase
      .from("templates")
      .select("id, title, type, preview_url, template_data")
      .eq("is_public", true)
      .eq("type", type)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          toast.error("Failed to load templates");
        } else {
          setTemplates((data as Template[]) || []);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, type]);

  const filtered = templates.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const pick = (t: Template) => {
    const route = type === "certificate" ? "/certificate-creator" : "/card-designer";
    onOpenChange(false);
    // Replace so back-button doesn't bounce between templates.
    navigate(`${route}?templateId=${t.id}`, { replace: true });
  };

  const Icon = type === "certificate" ? Award : Gift;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5" />
            Browse {type === "certificate" ? "Certificate" : "Card"} Templates
          </DialogTitle>
          <DialogDescription>
            Pick a template to replace the current canvas. Your current work will
            be lost unless saved.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No templates match your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2">
              {filtered.map((t) => {
                const isCurrent = currentId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pick(t)}
                    className={`group text-left rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md hover:border-primary ${
                      isCurrent ? "border-primary ring-2 ring-primary/40" : "border-border"
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      {t.preview_url ? (
                        <img
                          src={t.preview_url}
                          alt={t.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <TemplateThumbnail
                          type={t.type}
                          data={t.template_data}
                          className="absolute inset-0 w-full h-full"
                        />
                      )}
                      {isCurrent && (
                        <Badge className="absolute top-2 right-2" variant="default">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="p-3 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-semibold truncate">{t.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              navigate("/templates");
            }}
          >
            View all templates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};