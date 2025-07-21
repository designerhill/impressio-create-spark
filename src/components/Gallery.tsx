import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "Achievement Certificate",
    category: "Certificates",
    color: "bg-gradient-primary",
    preview: "🏆 Outstanding Performance Award"
  },
  {
    id: 2, 
    title: "Birthday Celebration",
    category: "Birthday Cards",
    color: "bg-gradient-secondary",
    preview: "🎉 Happy Birthday Wishes"
  },
  {
    id: 3,
    title: "5-Year Milestone",
    category: "Work Anniversary", 
    color: "bg-gradient-accent",
    preview: "🎊 Celebrating Your Journey"
  },
  {
    id: 4,
    title: "Course Completion",
    category: "Certificates",
    color: "bg-accent-gold",
    preview: "✨ Certificate of Excellence"
  },
  {
    id: 5,
    title: "Team Appreciation",
    category: "Recognition",
    color: "bg-gradient-primary",
    preview: "🌟 Thank You Card"
  },
  {
    id: 6,
    title: "Holiday Greeting",
    category: "Seasonal Cards",
    color: "bg-gradient-secondary", 
    preview: "❄️ Season's Greetings"
  }
];

export const Gallery = () => {
  return (
    <section className="py-24 bg-primary-soft">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Inspiration Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what's possible with Impressio. Browse templates and get inspired for your next creation.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl shadow-soft hover:shadow-primary transition-all duration-300 overflow-hidden"
            >
              {/* Preview Card */}
              <div className={`${item.color} h-48 flex items-center justify-center text-white text-center p-6`}>
                <div>
                  <div className="text-3xl mb-2">{item.preview.split(' ')[0]}</div>
                  <div className="text-lg font-semibold">{item.preview.substring(2)}</div>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-6">
                <div className="text-sm text-accent-aqua font-medium mb-2">{item.category}</div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{item.title}</h3>
                
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="hero" size="lg" className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  Create Similar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="default" size="lg">
            View All Templates
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};