import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ImageOff, Loader2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function MarketplaceListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("marketplace_listings")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setListing(data);
        setLoading(false);
      });
  }, [id]);

  const handleBuy = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!listing) return;
    setBuying(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-marketplace-checkout", {
        body: { listingId: listing.id },
      });
      if (error) throw error;
      if (data?.free) {
        toast.success("Added to your designs!");
        navigate("/my-designs");
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to start checkout");
    } finally {
      setBuying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
  );
  if (!listing) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <p>Listing not found</p>
      <Button asChild variant="outline"><Link to="/marketplace">Back to marketplace</Link></Button>
    </div>
  );

  const isOwn = user?.id === listing.seller_id;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <Button variant="ghost" asChild className="mb-4"><Link to="/marketplace"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link></Button>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted">
                {listing.preview_url ? (
                  <img src={listing.preview_url} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageOff className="w-10 h-10" /></div>
                )}
              </div>
            </Card>
            <div>
              <Badge variant="secondary" className="capitalize mb-3">{listing.type}</Badge>
              <h1 className="text-3xl font-black mb-3">{listing.title}</h1>
              <p className="text-muted-foreground mb-6">{listing.description || "No description provided."}</p>
              <div className="text-4xl font-black mb-2">
                {listing.price_cents === 0 ? "Free" : `$${(listing.price_cents / 100).toFixed(2)}`}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{listing.sales_count} people already got this design.</p>
              {isOwn ? (
                <Button size="lg" variant="outline" disabled>Your listing</Button>
              ) : (
                <Button size="lg" onClick={handleBuy} disabled={buying} className="w-full">
                  {buying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingBag className="w-4 h-4 mr-2" />}
                  {listing.price_cents === 0 ? "Get for free" : "Buy now"}
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-3">You'll get an editable copy in your designs and can download it as needed.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}