import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CardCanvas } from "@/components/card/CardCanvas";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  Loader2,
  ChevronRight,
  LayoutGrid,
  Sparkles,
  Wand2,
  Palette,
  Layers,
  CircleDot,
} from "lucide-react";

export default function CardDesigner() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(210_20%_98%)]">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(217_91%_60%)]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(210_20%_98%)] font-studio text-slate-900">
      <Navigation />

      <main className="flex-1 pt-20 pb-10">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Workspace header */}
          <header className="mt-4 mb-6">
            <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4">
              <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/templates" className="hover:text-slate-900 transition-colors">Studio</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900">Card Designer</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(217_91%_60%)] grid place-items-center shadow-[0_8px_24px_-12px_hsl(217_91%_60%/0.6)]">
                  <LayoutGrid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-[28px] leading-tight font-semibold tracking-tight text-slate-900">
                    Card Designer
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    A professional canvas for greeting cards, invitations and gift tags.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200">
                  <CircleDot className="w-3 h-3 text-emerald-500" /> Autosave ready
                </span>
              </div>
            </div>
          </header>

          {/* Dashboard shell */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-5">
            {/* Left rail */}
            <aside className="hidden lg:flex flex-col gap-4">
              <section className="rounded-2xl bg-white border border-slate-200 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
                  Project
                </p>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Type</span>
                    <span className="font-medium text-slate-900">Greeting Card</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Format</span>
                    <span className="font-medium text-slate-900">600 × 800 px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Color</span>
                    <span className="font-medium text-slate-900">RGB</span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-white border border-slate-200 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
                  Toolkit
                </p>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-center gap-2.5 text-slate-700">
                    <Wand2 className="w-4 h-4 text-[hsl(217_91%_60%)]" />
                    AI copy & images
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-700">
                    <Palette className="w-4 h-4 text-[hsl(217_91%_60%)]" />
                    Solid & gradient fills
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-700">
                    <Layers className="w-4 h-4 text-[hsl(217_91%_60%)]" />
                    Object layers & locking
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-700">
                    <Sparkles className="w-4 h-4 text-[hsl(217_91%_60%)]" />
                    Shapes, text & stickers
                  </li>
                </ul>
              </section>

            </aside>

            {/* Canvas surface */}
            <section className="rounded-2xl bg-white border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_28px_-12px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  <span className="ml-3 text-xs font-medium text-slate-500">
                    Untitled card · Draft
                  </span>
                </div>
                <span className="text-xs text-slate-400">Workspace</span>
              </div>
              <div className="p-4 md:p-6">
                <CardCanvas />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
