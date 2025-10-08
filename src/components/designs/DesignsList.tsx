import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Design {
  id: string;
  title: string;
  type: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export const DesignsList = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from("designs")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setDesigns(data || []);
    } catch (error: any) {
      console.error("Error loading designs:", error);
      toast.error("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("designs").delete().eq("id", id);

      if (error) throw error;

      setDesigns(designs.filter((d) => d.id !== id));
      toast.success("Design deleted");
    } catch (error: any) {
      console.error("Error deleting design:", error);
      toast.error("Failed to delete design");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading your designs...</div>;
  }

  if (designs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground mb-4">No designs yet</p>
        <p className="text-muted-foreground">
          Create your first design using one of our tools!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => (
        <Card key={design.id} className="overflow-hidden hover-scale">
          <div className="aspect-video bg-gradient-subtle relative">
            {design.thumbnail_url ? (
              <img
                src={design.thumbnail_url}
                alt={design.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No preview
              </div>
            )}
            <Badge className="absolute top-2 right-2" variant="secondary">
              {design.type}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-2 truncate">{design.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Updated {new Date(design.updated_at).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const routes: Record<string, string> = {
                    certificate: "/certificate-creator",
                    card: "/card-designer",
                    image: "/image-optimizer",
                  };
                  window.location.href = routes[design.type] || "/";
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(design.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
