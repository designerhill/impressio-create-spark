import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const [method, setMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  const load = async () => {
    if (!user) return;
    const [{ data: w }, { data: t }, { data: p }] = await Promise.all([
      supabase.from("wallets").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("wallet_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      supabase.from("payout_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    ]);
    setWallet(w); setTxs(t || []); setPayouts(p || []);
  };
  useEffect(() => { load(); }, [user]);

  const requestPayout = async () => {
    const cents = Math.round(parseFloat(amount || "0") * 100);
    if (cents < 1000) { toast.error("Minimum payout is $10"); return; }
    if (!method.trim()) { toast.error("Add a payout method (e.g. PayPal email)"); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("request-payout", {
        body: { amount_cents: cents, payout_method: method.trim() },
      });
      if (error) throw error;
      toast.success("Payout requested");
      setOpen(false); setAmount("10"); setMethod("");
      load();
    } catch (e: any) { toast.error(e.message); } finally { setSubmitting(false); }
  };

  if (!user) return null;
  const balance = wallet?.balance_cents || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div>
            <h1 className="text-4xl font-black mb-2">Wallet</h1>
            <p className="text-lg text-muted-foreground">Your marketplace earnings and payouts.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card><CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Available balance</div>
              <div className="text-4xl font-black mt-1">${(balance / 100).toFixed(2)}</div>
              <Button className="mt-4" disabled={balance < 1000} onClick={() => setOpen(true)}>
                <ArrowDownToLine className="w-4 h-4 mr-2" /> Request payout
              </Button>
              {balance < 1000 && <p className="text-xs text-muted-foreground mt-2">Minimum payout: $10.00</p>}
            </CardContent></Card>
            <Card><CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Lifetime earnings</div>
              <div className="text-4xl font-black mt-1">${((wallet?.lifetime_earnings_cents || 0) / 100).toFixed(2)}</div>
            </CardContent></Card>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Transactions</h2>
            <Card><CardContent className="p-0">
              {txs.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">No transactions yet.</div>
              ) : (
                <ul className="divide-y">
                  {txs.map((t) => (
                    <li key={t.id} className="px-5 py-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{t.note || t.type}</div>
                        <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
                      </div>
                      <div className={`font-bold ${t.amount_cents < 0 ? "text-destructive" : "text-emerald-600"}`}>
                        {t.amount_cents < 0 ? "-" : "+"}${Math.abs(t.amount_cents / 100).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent></Card>
          </div>

          {payouts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3">Payout requests</h2>
              <Card><CardContent className="p-0"><ul className="divide-y">
                {payouts.map((p) => (
                  <li key={p.id} className="px-5 py-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">${(p.amount_cents / 100).toFixed(2)} • {p.payout_method}</div>
                      <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
                    </div>
                    <span className="text-xs font-bold uppercase">{p.status}</span>
                  </li>
                ))}
              </ul></CardContent></Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request payout</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount (USD)</Label>
              <Input type="number" min="10" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">Available: ${(balance / 100).toFixed(2)}</p>
            </div>
            <div>
              <Label>Payout method</Label>
              <Input value={method} onChange={(e) => setMethod(e.target.value)} placeholder="PayPal email, bank account info, etc." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={requestPayout} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}