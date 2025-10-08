import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CardCanvas } from "@/components/card/CardCanvas";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CardDesigner() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">Card Designer</h1>
            <p className="text-xl text-muted-foreground">
              Create stunning greeting cards with AI-powered designs
            </p>
          </div>
          <CardCanvas />
        </div>
      </main>
      <Footer />
    </div>
  );
}
