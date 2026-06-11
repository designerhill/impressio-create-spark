import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ImageOff, Loader2, Store, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ListDesignDialog } from "@/components/marketplace/ListDesignDialog";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  type: string;
  preview_url: string | null;
  price_cents: number;
  sales_count: number;
  created_at: string;
}

export default function Marketplace() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "certificate" | "card">("all");
  const [tier, setTier] = useState<"all" | "free" | "paid">("all");
  const [openList, setOpenList] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketplace_listings")
      .select("id,title,description,type,preview_url,price_cents,sales_count,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    setListings((data as Listing[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      if (type !== "all" && l.type !== type) return false;
      if (tier === "free" && l.price_cents !== 0) return false;
      if (tier === "paid" && l.price_cents === 0) return false;
      if (q && !l.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [listings, query, type, tier]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Store className="w-4 h-4" /> Marketplace
              </div>
              <h1 className="text-4xl font-black mb-2">Discover designs from creators</h1>
              <p className="text-lg text-muted-foreground">Buy or grab free certificate & card designs. Sell your own and earn.</p>
            </div>
            {user && (
              <Button size="lg" onClick={() => setOpenList(true)}>
                <Sparkles className="w-4 h-4 mr-2" /> Sell a design
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search designs…" className="pl-9 h-11" />
            </div>
            <Tabs value={type} onValueChange={(v) => setType(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="certificate">Certificates</TabsTrigger>
                <TabsTrigger value="card">Cards</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs value={tier} onValueChange={(v) => setTier(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="free">Free</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed">
              <p className="text-lg font-medium mb-1">No listings yet</p>
              <p className="text-sm text-muted-foreground">Be the first to share a design with the community.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((l) => (
                <Link key={l.id} to={`/marketplace/${l.id}`}>
                  <Card className="overflow-hidden border-border hover:shadow-xl transition-all h-full">
                    <div className="aspect-video bg-muted relative">
                      {l.preview_url ? (
                        <img src={l.preview_url} alt={l.title} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageOff className="w-6 h-6" /></div>
                      )}
                      <Badge className="absolute top-2 left-2 capitalize" variant="secondary">{l.type}</Badge>
                      <Badge className="absolute top-2 right-2 font-bold" variant={l.price_cents === 0 ? "default" : "secondary"}>
                        {l.price_cents === 0 ? "FREE" : `$${(l.price_cents / 100).toFixed(2)}`}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold truncate mb-1">{l.title}</h3>
                      <p className="text-xs text-muted-foreground">{l.sales_count} sold</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ListDesignDialog open={openList} onOpenChange={setOpenList} onListed={load} />
    </div>
  );
}