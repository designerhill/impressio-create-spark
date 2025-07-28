import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Database, Users, Globe, CheckCircle, AlertTriangle, Zap } from "lucide-react";

const Security = () => {
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
                        Security
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto drop-shadow-md">
                        Your data security is our top priority. Learn about our comprehensive security measures.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="prose prose-lg max-w-none">
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-foreground mb-6">Security Overview</h2>
                            <p className="text-muted-foreground font-medium mb-8">
                                At Impressio, we implement industry-leading security measures to protect your data, designs, and privacy. Our security framework is built on multiple layers of protection to ensure your information remains safe and secure.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {/* Data Encryption */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Lock className="w-6 h-6 text-primary" />
                                    Data Encryption
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">In Transit</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            All data transmitted between your browser and our servers is encrypted using TLS 1.3, the latest and most secure encryption protocol.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">At Rest</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            All stored data is encrypted using AES-256 encryption, ensuring your designs and personal information remain secure even if our systems are compromised.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Database Security</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Our databases are encrypted at the disk level and protected with strict access controls and monitoring.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Key Management</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Encryption keys are managed using industry-standard key management systems with automatic rotation.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Access Controls */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Users className="w-6 h-6 text-primary" />
                                    Access Controls
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Multi-Factor Authentication</h4>
                                        <p className="text-muted-foreground font-medium">
                                            We support MFA for all user accounts, providing an additional layer of security beyond passwords. Users can enable SMS, email, or authenticator app verification.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Role-Based Access</h4>
                                        <p className="text-muted-foreground font-medium">
                                            Our platform implements role-based access controls, ensuring users only have access to the data and features they need for their specific role.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Session Management</h4>
                                        <p className="text-muted-foreground font-medium">
                                            User sessions are automatically managed with secure timeouts and the ability to revoke sessions remotely if suspicious activity is detected.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Infrastructure Security */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-primary" />
                                    Infrastructure Security
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xl font-semibold text-foreground mb-2">Cloud Security</h4>
                                            <p className="text-muted-foreground font-medium text-sm">
                                                Our infrastructure is hosted on secure cloud platforms with enterprise-grade security features and compliance certifications.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-foreground mb-2">Network Security</h4>
                                            <p className="text-muted-foreground font-medium text-sm">
                                                We use advanced firewalls, DDoS protection, and intrusion detection systems to protect against external threats.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xl font-semibold text-foreground mb-2">Physical Security</h4>
                                            <p className="text-muted-foreground font-medium text-sm">
                                                Our data centers feature 24/7 monitoring, biometric access controls, and environmental safeguards.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-foreground mb-2">Backup Security</h4>
                                            <p className="text-muted-foreground font-medium text-sm">
                                                Regular encrypted backups are stored in geographically distributed locations with strict access controls.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Monitoring */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Eye className="w-6 h-6 text-primary" />
                                    Security Monitoring & Incident Response
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">24/7 Monitoring</h4>
                                        <p className="text-muted-foreground font-medium">
                                            Our security team monitors our systems around the clock, using advanced tools to detect and respond to potential threats in real-time.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Incident Response</h4>
                                        <p className="text-muted-foreground font-medium">
                                            We have a comprehensive incident response plan that includes immediate containment, investigation, and communication protocols.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Vulnerability Management</h4>
                                        <p className="text-muted-foreground font-medium">
                                            Regular security assessments, penetration testing, and vulnerability scanning help us identify and address potential security issues proactively.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Compliance */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary" />
                                    Compliance & Certifications
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">GDPR Compliance</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            We fully comply with the General Data Protection Regulation, ensuring your data rights are protected.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">SOC 2 Type II</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Our security controls are audited annually by independent third parties to ensure compliance with industry standards.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">ISO 27001</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            We follow international information security management standards to protect your data.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">CCPA Compliance</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            We comply with the California Consumer Privacy Act and other state privacy regulations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Best Practices */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <AlertTriangle className="w-6 h-6 text-primary" />
                                    Security Best Practices for Users
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground font-medium mb-4">
                                        While we handle the security of our platform, here are some best practices to keep your account secure:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                <span className="text-muted-foreground font-medium">Enable multi-factor authentication</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                <span className="text-muted-foreground font-medium">Use strong, unique passwords</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                <span className="text-muted-foreground font-medium">Keep your software updated</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                <span className="text-muted-foreground font-medium">Be cautious of phishing attempts</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                <span className="text-muted-foreground font-medium">Log out from shared devices</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                <span className="text-muted-foreground font-medium">Monitor your account activity</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                <span className="text-muted-foreground font-medium">Report suspicious activity</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                <span className="text-muted-foreground font-medium">Regularly review account permissions</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Contact */}
                            <div className="bg-primary-soft p-8 rounded-lg">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Security Contact</h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    If you discover a security vulnerability or have security-related questions, please contact our security team:
                                </p>
                                <div className="space-y-2 text-muted-foreground font-medium">
                                    <p><strong>Security Email:</strong> security@impressio.com</p>
                                    <p><strong>Bug Bounty:</strong> bugs@impressio.com</p>
                                    <p><strong>Emergency:</strong> +1 (555) 123-4567</p>
                                    <p><strong>PGP Key:</strong> Available upon request</p>
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

export default Security; 