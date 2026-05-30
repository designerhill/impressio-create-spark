import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Search, Loader2, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

interface Design {
  id: string;
  title: string;
  type: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

type SortKey = "updated_desc" | "updated_asc" | "created_desc" | "title_asc";
type TypeFilter = "all" | "certificate" | "card" | "image";

const ROUTES: Record<string, string> = {
  certificate: "/certificate-creator",
  card: "/card-designer",
  image: "/image-optimizer",
};

export const DesignsList = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortKey>("updated_desc");

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = designs.filter((d) => {
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      );
    });
    const sorted = [...result];
    sorted.sort((a, b) => {
      switch (sort) {
        case "updated_asc":
          return +new Date(a.updated_at) - +new Date(b.updated_at);
        case "created_desc":
          return +new Date(b.created_at) - +new Date(a.created_at);
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "updated_desc":
        default:
          return +new Date(b.updated_at) - +new Date(a.updated_at);
      }
    });
    return sorted;
  }, [designs, query, typeFilter, sort]);

  const counts = useMemo(() => {
    const c = { all: designs.length, certificate: 0, card: 0, image: 0 };
    designs.forEach((d) => {
      if (d.type in c) (c as any)[d.type] += 1;
    });
    return c;
  }, [designs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mb-3" />
        <p className="text-sm">Loading your designs…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or type…"
            className="pl-9 h-10 bg-white"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
          <SelectTrigger className="md:w-44 h-10 bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types ({counts.all})</SelectItem>
            <SelectItem value="certificate">Certificates ({counts.certificate})</SelectItem>
            <SelectItem value="card">Cards ({counts.card})</SelectItem>
            <SelectItem value="image">Images ({counts.image})</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="md:w-52 h-10 bg-white">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_desc">Recently updated</SelectItem>
            <SelectItem value="updated_asc">Oldest updated</SelectItem>
            <SelectItem value="created_desc">Recently created</SelectItem>
            <SelectItem value="title_asc">Title (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty state */}
      {designs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white">
          <p className="text-lg font-medium text-slate-900 mb-1">No designs yet</p>
          <p className="text-sm text-slate-500 mb-6">
            Create your first design using one of our tools.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button asChild>
              <Link to="/certificate-creator">New certificate</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/card-designer">New card</Link>
            </Button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white">
          <p className="text-sm text-slate-500">No designs match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((design) => (
            <Card
              key={design.id}
              className="overflow-hidden border-slate-200 hover:shadow-[0_8px_28px_-12px_rgba(15,23,42,0.12)] transition-shadow"
            >
              <div className="aspect-video bg-slate-50 relative">
                {design.thumbnail_url ? (
                  <img
                    src={design.thumbnail_url}
                    alt={design.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ImageOff className="w-6 h-6 mb-1" />
                    <span className="text-xs">No preview</span>
                  </div>
                )}
                <Badge
                  className="absolute top-2 right-2 capitalize"
                  variant="secondary"
                >
                  {design.type}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-base mb-1 truncate">
                  {design.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Updated {new Date(design.updated_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Link to={`${ROUTES[design.type] || "/"}?designId=${design.id}`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(design.id)}
                    className="text-slate-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
