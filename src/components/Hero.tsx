import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Palette, Download } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 animate-[float_6s_ease-in-out_infinite]">
          <Sparkles className="w-8 h-8 text-accent-gold opacity-60" />
        </div>
        <div className="absolute top-40 right-32 animate-[float_8s_ease-in-out_infinite_reverse]">
          <Wand2 className="w-10 h-10 text-accent-aqua opacity-50" />
        </div>
        <div className="absolute bottom-32 left-40 animate-[float_7s_ease-in-out_infinite]">
          <Palette className="w-6 h-6 text-primary-glow opacity-70" />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Heading */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 leading-tight drop-shadow-lg">
            Impressio
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-white font-bold">
            <Sparkles className="w-6 h-6 text-accent-gold" />
            <span>Design. Delight. Deliver.</span>
            <Sparkles className="w-6 h-6 text-accent-gold" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white font-semibold mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up drop-shadow-md">
          Create stunning certificates, cards, and announcements with AI-powered design tools.
          Transform your ideas into beautiful digital assets in minutes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Button asChild variant="hero" size="xl" className="group font-bold">
            <Link to="/certificate-creator">
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Creating
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white hover:text-foreground font-semibold">
            <Link to="/templates">
              <Download className="w-5 h-5" />
              View Examples
            </Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 animate-fade-in animation-delay-500">
          <p className="text-white font-semibold text-base mb-4 drop-shadow-md">Trusted by creative professionals worldwide</p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-white font-bold text-lg">10K+ Assets Created</div>
            <div className="w-px h-6 bg-white/50"></div>
            <div className="text-white font-bold text-lg">99% Satisfaction</div>
            <div className="w-px h-6 bg-white/50"></div>
            <div className="text-white font-bold text-lg">5-Star Rated</div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Floating Animation */
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(10deg); }
  }
  .animation-delay-500 { animation-delay: 0.5s; }
`;
document.head.appendChild(style);