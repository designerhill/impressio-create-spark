import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DesignsList } from "@/components/designs/DesignsList";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function MyDesigns() {
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
            <h1 className="text-4xl font-black mb-2">My Designs</h1>
            <p className="text-xl text-muted-foreground">
              Access and manage all your saved designs
            </p>
          </div>
          <DesignsList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
