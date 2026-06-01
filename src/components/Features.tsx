import { Button } from "@/components/ui/button";
import { Award, Calendar, Briefcase, ImageIcon, Zap, Palette } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Award,
    title: "Beautiful Certificates",
    description: "Professional certificates for achievements, courses, and recognition with customizable templates.",
    color: "bg-gradient-primary",
    accent: "text-primary"
  },
  {
    icon: Calendar,
    title: "Birthday Cards",
    description: "Personalized birthday cards with stunning designs, custom messages, and festive elements.",
    color: "bg-gradient-secondary",
    accent: "text-secondary"
  },
  {
    icon: Briefcase,
    title: "Work Anniversaries",
    description: "Celebrate milestones with elegant work anniversary announcements and appreciation cards.",
    color: "bg-gradient-accent",
    accent: "text-accent-aqua"
  },
  {
    icon: ImageIcon,
    title: "Image Optimization",
    description: "Advanced tools to compress, resize, and enhance your images without losing quality.",
    color: "bg-accent-gold",
    accent: "text-accent-gold"
  },
  {
    icon: Zap,
    title: "AI-Powered Design",
    description: "Smart suggestions and automated layouts that adapt to your content and preferences.",
    color: "bg-gradient-primary",
    accent: "text-primary"
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description: "Add your logos, colors, and fonts to create consistent branded materials.",
    color: "bg-gradient-secondary",
    accent: "text-secondary"
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Powerful features designed to make your creative process effortless and enjoyable
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-card p-8 rounded-xl shadow-soft hover:shadow-primary transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold ${feature.accent} mb-3`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <Button asChild variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform font-semibold text-base">
                  <Link to="/features">Learn More →</Link>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link to="/features">
            <Button variant="default" size="lg" className="font-bold">
              Explore All Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};