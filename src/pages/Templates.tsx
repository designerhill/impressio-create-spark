import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Award, Gift, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Template {
  id: string;
  title: string;
  type: string;
  preview_url: string | null;
  template_data: any;
}

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("id, title, type, preview_url, template_data")
        .eq("is_public", true)
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Failed to load templates");
      } else {
        setTemplates((data as Template[]) || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const useTemplate = (template: Template) => {
    const route = template.type === "certificate" ? "/certificate-creator" : "/card-designer";
    navigate(`${route}?templateId=${template.id}`);
  };

  const filterMap: Record<string, string | null> = {
    all: null,
    certificates: "certificate",
    cards: "card",
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const wantedType = filterMap[selectedCategory];
    const matchesCategory = !wantedType || t.type === wantedType;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Templates", count: templates.length },
    { id: "certificates", name: "Certificates", count: templates.filter((t) => t.type === "certificate").length },
    { id: "cards", name: "Cards", count: templates.filter((t) => t.type === "card").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">
              Design Templates
            </h1>
            <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto mb-8 drop-shadow-md">
              Choose from our collection of professionally designed templates for certificates and cards
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm font-semibold">
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-8">
              {loading && (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="group hover:shadow-primary transition-all duration-300 overflow-hidden">
                    {/* Template Preview */}
                    <div
                      className="h-48 relative flex items-center justify-center text-white overflow-hidden bg-gradient-primary"
                      style={
                        template.preview_url
                          ? { backgroundImage: `url(${template.preview_url})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : template.template_data?.background?.startsWith("linear-gradient")
                          ? { background: template.template_data.background }
                          : template.template_data?.background
                          ? { backgroundColor: template.template_data.background }
                          : undefined
                      }
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative text-center px-4">
                        {template.type === "certificate" ? (
                          <Award className="w-8 h-8 mx-auto mb-2" />
                        ) : (
                          <Gift className="w-8 h-8 mx-auto mb-2" />
                        )}
                        <h3 className="font-bold">{template.title}</h3>
                      </div>

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                        <Button size="sm" className="font-bold" onClick={() => useTemplate(template)}>
                          Use Template
                        </Button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm">{template.title}</h4>
                        <Badge variant="outline" className="text-xs font-semibold capitalize">
                          {template.type}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {!loading && filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">No templates found</h3>
                  <p className="text-muted-foreground font-medium">
                    Try adjusting your search or browse different categories
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-soft">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Can't find what you need?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 font-medium">
            Create custom designs from scratch with our powerful design tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/certificate-creator">
              <Button size="lg" variant="outline" className="font-semibold">
                <Award className="w-5 h-5 mr-2" />
                Create Certificate
              </Button>
            </Link>
            <Link to="/card-designer">
              <Button size="lg" variant="default" className="font-bold">
                <Gift className="w-5 h-5 mr-2" />
                Design Card
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Templates;