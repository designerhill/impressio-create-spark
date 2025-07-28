import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Calendar,
    Briefcase,
    ImageIcon,
    Zap,
    Palette,
    Sparkles,
    Wand2,
    Download,
    Share2,
    Lock,
    Users,
    ArrowRight,
    Check,
    Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
    const features = [
        {
            icon: Award,
            title: "Beautiful Certificates",
            description: "Create professional certificates for achievements, courses, and recognition with customizable templates.",
            details: [
                "Professional certificate templates",
                "Customizable text and graphics",
                "High-quality print-ready exports",
                "Digital signature support",
                "Multiple format options"
            ],
            color: "bg-gradient-primary",
            accent: "text-primary"
        },
        {
            icon: Calendar,
            title: "Birthday Cards",
            description: "Design personalized birthday cards with stunning designs, custom messages, and festive elements.",
            details: [
                "Birthday card templates",
                "Personalized messaging",
                "Age-appropriate designs",
                "Digital and print formats",
                "Social media sharing"
            ],
            color: "bg-gradient-secondary",
            accent: "text-secondary"
        },
        {
            icon: Briefcase,
            title: "Work Anniversaries",
            description: "Celebrate milestones with elegant work anniversary announcements and appreciation cards.",
            details: [
                "Anniversary card templates",
                "Company branding options",
                "Milestone recognition",
                "Team celebration designs",
                "Professional layouts"
            ],
            color: "bg-gradient-accent",
            accent: "text-accent-aqua"
        },
        {
            icon: ImageIcon,
            title: "Image Optimization",
            description: "Advanced tools to compress, resize, and enhance your images without losing quality.",
            details: [
                "Smart compression algorithms",
                "Multiple format support",
                "Batch processing",
                "Quality preservation",
                "Fast processing"
            ],
            color: "bg-accent-gold",
            accent: "text-accent-gold"
        },
        {
            icon: Zap,
            title: "AI-Powered Design",
            description: "Smart suggestions and automated layouts that adapt to your content and preferences.",
            details: [
                "Intelligent layout suggestions",
                "Content-aware design",
                "Style recommendations",
                "Auto-sizing elements",
                "Smart color matching"
            ],
            color: "bg-gradient-primary",
            accent: "text-primary"
        },
        {
            icon: Palette,
            title: "Custom Branding",
            description: "Add your logos, colors, and fonts to create consistent branded materials.",
            details: [
                "Logo upload and management",
                "Brand color palettes",
                "Custom font integration",
                "Brand guidelines",
                "Template customization"
            ],
            color: "bg-gradient-secondary",
            accent: "text-secondary"
        },
        {
            icon: Share2,
            title: "Easy Sharing",
            description: "Share your designs instantly with team members, clients, or on social media platforms.",
            details: [
                "One-click sharing",
                "Social media integration",
                "Team collaboration",
                "Public galleries",
                "Download options"
            ],
            color: "bg-gradient-accent",
            accent: "text-accent-aqua"
        },
        {
            icon: Lock,
            title: "Secure & Private",
            description: "Your designs are protected with enterprise-grade security and privacy controls.",
            details: [
                "End-to-end encryption",
                "Private design storage",
                "Access controls",
                "Data protection",
                "GDPR compliance"
            ],
            color: "bg-accent-gold",
            accent: "text-accent-gold"
        }
    ];

    const stats = [
        { number: "10K+", label: "Designs Created", icon: Sparkles },
        { number: "500+", label: "Templates", icon: Wand2 },
        { number: "99%", label: "Satisfaction", icon: Star },
        { number: "24/7", label: "Support", icon: Users }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-hero">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">
                        Powerful Features
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto mb-8 drop-shadow-md">
                        Everything you need to create stunning certificates, cards, and announcements with AI-powered design tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="hero" size="xl" className="font-bold">
                            <Wand2 className="w-5 h-5" />
                            Start Creating
                        </Button>
                        <Link to="/templates">
                            <Button variant="outline" size="xl" className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white hover:text-foreground font-semibold">
                                <Download className="w-5 h-5" />
                                View Templates
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-black text-foreground mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-muted-foreground font-semibold">
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                            Everything You Need to Create
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                            Powerful features designed to make your creative process effortless and enjoyable
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} className="group p-8 hover:shadow-primary transition-all duration-300 hover:-translate-y-2">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className={`text-2xl font-bold ${feature.accent} mb-4`}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                                        {feature.description}
                                    </p>

                                    {/* Feature Details */}
                                    <ul className="space-y-3 mb-6">
                                        {feature.details.map((detail, detailIndex) => (
                                            <li key={detailIndex} className="flex items-center gap-3 text-sm">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-muted-foreground font-medium">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Learn More Button */}
                                    <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform font-semibold text-base w-full">
                                        Learn More
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary-soft">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 font-medium">
                        Join thousands of creative professionals who trust Impressio for their design needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="default" size="lg" className="font-bold">
                            Start Free Trial
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="lg" className="font-semibold">
                            View Pricing
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features; 