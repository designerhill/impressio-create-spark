import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Lightbulb, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "User-Centric Design",
      description: "We put our users at the center of everything we create, ensuring intuitive and delightful experiences."
    },
    {
      icon: Target,
      title: "Quality Excellence",
      description: "We're committed to delivering the highest quality designs and tools that exceed expectations."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously innovate to bring cutting-edge design technology to everyone."
    },
    {
      icon: Heart,
      title: "Passion for Design",
      description: "Design is our passion, and we love helping others bring their creative visions to life."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            About Impressio
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're on a mission to democratize design by making professional-quality digital assets 
            accessible to everyone, regardless of their design experience.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Impressio was born from a simple observation: creating professional-looking certificates, 
                  cards, and digital assets shouldn't require expensive software or years of design training.
                </p>
                <p>
                  Founded in 2024, we've helped thousands of individuals and organizations create stunning 
                  designs that celebrate achievements, mark milestones, and communicate with impact.
                </p>
                <p>
                  Today, we continue to innovate and expand our platform, always with the goal of making 
                  beautiful design accessible to everyone.
                </p>
              </div>
            </div>
            <div className="bg-gradient-primary rounded-lg p-8 text-white text-center">
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-white/80">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50,000+</div>
                  <div className="text-white/80">Designs Created</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">99%</div>
                  <div className="text-white/80">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-elegant transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;