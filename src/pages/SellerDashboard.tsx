import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, EyeOff, Eye, Wallet as WalletIcon, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { ListDesignDialog } from "@/components/marketplace/ListDesignDialog";

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [wallet, setWallet] = useState<{ balance_cents: number; lifetime_earnings_cents: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: ls }, { data: w }] = await Promise.all([
      supabase.from("marketplace_listings").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
      supabase.from("wallets").select("balance_cents, lifetime_earnings_cents").eq("user_id", user.id).maybeSingle(),
    ]);
    setListings(ls || []);
    setWallet(w as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase.from("marketplace_listings").update({ is_published: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(current ? "Unpublished" : "Published");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    const { error } = await supabase.from("marketplace_listings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black mb-2">Seller dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage your marketplace listings and earnings.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link to="/wallet"><WalletIcon className="w-4 h-4 mr-2" /> Wallet</Link></Button>
              <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> List a design</Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card><CardContent className="p-5">
              <div className="text-sm text-muted-foreground">Available balance</div>
              <div className="text-2xl font-black mt-1">${((wallet?.balance_cents || 0) / 100).toFixed(2)}</div>
            </CardContent></Card>
            <Card><CardContent className="p-5">
              <div className="text-sm text-muted-foreground">Lifetime earnings</div>
              <div className="text-2xl font-black mt-1">${((wallet?.lifetime_earnings_cents || 0) / 100).toFixed(2)}</div>
            </CardContent></Card>
            <Card><CardContent className="p-5">
              <div className="text-sm text-muted-foreground">Active listings</div>
              <div className="text-2xl font-black mt-1">{listings.filter((l) => l.is_published).length}</div>
            </CardContent></Card>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed">
              <p className="font-medium mb-1">No listings yet</p>
              <p className="text-sm text-muted-foreground mb-4">List one of your designs to start earning.</p>
              <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> List a design</Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => (
                <Card key={l.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {l.preview_url ? <img src={l.preview_url} className="w-full h-full object-cover" alt={l.title} /> : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageOff className="w-6 h-6" /></div>
                    )}
                    <Badge className="absolute top-2 right-2" variant={l.price_cents === 0 ? "default" : "secondary"}>
                      {l.price_cents === 0 ? "FREE" : `$${(l.price_cents / 100).toFixed(2)}`}
                    </Badge>
                    {!l.is_published && <Badge variant="outline" className="absolute top-2 left-2">Unpublished</Badge>}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold truncate">{l.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{l.sales_count} sold</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => togglePublish(l.id, l.is_published)}>
                        {l.is_published ? <><EyeOff className="w-4 h-4 mr-1" />Unpublish</> : <><Eye className="w-4 h-4 mr-1" />Publish</>}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(l.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ListDesignDialog open={open} onOpenChange={setOpen} onListed={load} />
    </div>
  );
}