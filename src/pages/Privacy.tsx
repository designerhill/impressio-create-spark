import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Database, Users, Globe } from "lucide-react";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-hero">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <Shield className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">
                        Privacy Policy
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto drop-shadow-md">
                        Your privacy is our priority. Learn how we protect and handle your data.
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
                                Impressio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our design platform.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {/* Information We Collect */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Database className="w-6 h-6 text-primary" />
                                    Information We Collect
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Personal Information</h4>
                                        <p className="text-muted-foreground font-medium">
                                            We may collect personal information such as your name, email address, and profile information when you create an account or use our services.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Usage Data</h4>
                                        <p className="text-muted-foreground font-medium">
                                            We collect information about how you use our platform, including design preferences, templates used, and interaction patterns.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Design Content</h4>
                                        <p className="text-muted-foreground font-medium">
                                            Your designs, templates, and creative content are stored securely and are only accessible to you and authorized team members.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* How We Use Information */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Eye className="w-6 h-6 text-primary" />
                                    How We Use Your Information
                                </h3>
                                <div className="space-y-4">
                                    <ul className="space-y-2 text-muted-foreground font-medium">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Provide and maintain our design platform services
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Process transactions and manage your account
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Improve our services and develop new features
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Send you important updates and notifications
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Provide customer support and respond to inquiries
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Data Security */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Lock className="w-6 h-6 text-primary" />
                                    Data Security
                                </h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    We implement industry-standard security measures to protect your information:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Encryption</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            All data is encrypted in transit and at rest using AES-256 encryption.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Access Controls</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Strict access controls ensure only authorized personnel can access your data.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Regular Audits</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            We conduct regular security audits and penetration testing.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Compliance</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            We comply with GDPR, CCPA, and other relevant privacy regulations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Data Sharing */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Users className="w-6 h-6 text-primary" />
                                    Data Sharing and Disclosure
                                </h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                                </p>
                                <ul className="space-y-2 text-muted-foreground font-medium">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        With your explicit consent
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        To comply with legal obligations
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        To protect our rights and safety
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        With trusted service providers who assist in our operations
                                    </li>
                                </ul>
                            </div>

                            {/* Your Rights */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Globe className="w-6 h-6 text-primary" />
                                    Your Privacy Rights
                                </h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    You have the following rights regarding your personal information:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Access your personal data</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Correct inaccurate information</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Request deletion of your data</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Object to data processing</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Data portability</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            <span className="text-muted-foreground font-medium">Withdraw consent</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-primary-soft p-8 rounded-lg">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Contact Us</h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="space-y-2 text-muted-foreground font-medium">
                                    <p><strong>Email:</strong> privacy@impressio.com</p>
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

export default Privacy; 