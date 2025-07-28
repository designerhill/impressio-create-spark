import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FileText, Scale, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-hero">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <FileText className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">
                        Terms of Service
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto drop-shadow-md">
                        Please read these terms carefully before using our platform.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="prose prose-lg max-w-none">
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-foreground mb-6">Last Updated: December 2024</h2>
                            <p className="text-muted-foreground font-medium mb-8">
                                These Terms of Service ("Terms") govern your use of the Impressio design platform and services. By accessing or using our services, you agree to be bound by these Terms.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {/* Acceptance of Terms */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary" />
                                    Acceptance of Terms
                                </h3>
                                <p className="text-muted-foreground font-medium">
                                    By accessing or using Impressio, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.
                                </p>
                            </div>

                            {/* Service Description */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Scale className="w-6 h-6 text-primary" />
                                    Service Description
                                </h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    Impressio provides an AI-powered design platform that allows users to:
                                </p>
                                <ul className="space-y-2 text-muted-foreground font-medium">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Create professional certificates and cards
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Access design templates and tools
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Optimize and enhance images
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Share and collaborate on designs
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Store and manage design assets
                                    </li>
                                </ul>
                            </div>

                            {/* User Accounts */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Users className="w-6 h-6 text-primary" />
                                    User Accounts
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Account Creation</h4>
                                        <p className="text-muted-foreground font-medium">
                                            You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Account Security</h4>
                                        <p className="text-muted-foreground font-medium">
                                            You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Account Termination</h4>
                                        <p className="text-muted-foreground font-medium">
                                            We reserve the right to terminate or suspend accounts that violate these Terms or engage in fraudulent activities.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Acceptable Use */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <AlertTriangle className="w-6 h-6 text-primary" />
                                    Acceptable Use
                                </h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    You agree not to use our services to:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Violate any laws or regulations</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Infringe on intellectual property rights</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Upload malicious content or viruses</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Harass or harm others</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Attempt to gain unauthorized access</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Interfere with service operation</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Use automated systems excessively</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-destructive font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Create spam or misleading content</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Intellectual Property */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-primary" />
                                    Intellectual Property
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Your Content</h4>
                                        <p className="text-muted-foreground font-medium">
                                            You retain ownership of the designs and content you create using our platform. You grant us a limited license to host and display your content.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Our Platform</h4>
                                        <p className="text-muted-foreground font-medium">
                                            Impressio and its original content, features, and functionality are owned by us and protected by international copyright, trademark, and other intellectual property laws.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Templates</h4>
                                        <p className="text-muted-foreground font-medium">
                                            Our design templates are provided for your use. You may customize them for your projects, but you may not redistribute or sell them as your own.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Terms */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-primary" />
                                    Payment and Subscription Terms
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Pricing</h4>
                                        <p className="text-muted-foreground font-medium">
                                            Subscription fees are billed in advance on a monthly or annual basis. Prices are subject to change with 30 days notice.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Cancellation</h4>
                                        <p className="text-muted-foreground font-medium">
                                            You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Refunds</h4>
                                        <p className="text-muted-foreground font-medium">
                                            We offer a 30-day money-back guarantee for new subscriptions. Refunds are processed within 5-7 business days.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Limitation of Liability */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    To the maximum extent permitted by law, Impressio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                                </p>
                                <ul className="space-y-2 text-muted-foreground font-medium">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Loss of profits, data, or business opportunities
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Service interruptions or technical issues
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Damages resulting from third-party actions
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Any damages exceeding the amount paid for our services
                                    </li>
                                </ul>
                            </div>

                            {/* Changes to Terms */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h3>
                                <p className="text-muted-foreground font-medium">
                                    We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new Terms.
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-primary-soft p-8 rounded-lg">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Contact Us</h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    If you have any questions about these Terms of Service, please contact us:
                                </p>
                                <div className="space-y-2 text-muted-foreground font-medium">
                                    <p><strong>Email:</strong> legal@impressio.com</p>
                                    <p><strong>Address:</strong> 123 Design Street, Creative City, CC 12345</p>
                                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Terms; 