import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CertificateCanvas } from "@/components/certificate/CertificateCanvas";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Award, Sparkles, ShieldCheck, Loader2 } from "lucide-react";

export default function CertificateCreator() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gradient-primary opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[520px] h-[520px] rounded-full bg-gradient-accent opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[420px] h-[420px] rounded-full bg-gradient-secondary opacity-15 blur-3xl" />
      </div>

      <Navigation />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero header */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                <Award className="w-3.5 h-3.5" />
                Certificate Studio
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
                Certificate{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Creator
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Craft professional, award-worthy certificates with elegant
                templates, AI-generated copy, and full creative control.
              </p>
            </div>

            {/* Feature chips */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/70 backdrop-blur-lg border border-border shadow-soft min-w-[88px]">
                <Sparkles className="w-5 h-5 text-accent-aqua" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Copy</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/70 backdrop-blur-lg border border-border shadow-soft min-w-[88px]">
                <Award className="w-5 h-5 text-accent-gold" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Templates</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/70 backdrop-blur-lg border border-border shadow-soft min-w-[88px]">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Print Ready</span>
              </div>
            </div>
          </div>

          {/* Studio frame */}
          <div className="relative rounded-3xl p-[1.5px] bg-gradient-hero shadow-elegant">
            <div className="rounded-[calc(1.5rem-1.5px)] bg-background/60 backdrop-blur-xl p-4 md:p-6">
          <CertificateCanvas />
            </div>
          </div>

          {/* Helper footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Tip: Export as high-resolution PNG, or save to{" "}
            <span className="font-semibold text-foreground">My Designs</span> to edit later.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
