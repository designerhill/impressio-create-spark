import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Cookie, Settings, Eye, Shield, Info, CheckCircle } from "lucide-react";

const Cookies = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-hero">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <Cookie className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">
                        Cookie Policy
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto drop-shadow-md">
                        Learn how we use cookies to improve your experience on Impressio.
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
                                This Cookie Policy explains how Impressio uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {/* What Are Cookies */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Info className="w-6 h-6 text-primary" />
                                    What Are Cookies?
                                </h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
                                </p>
                                <p className="text-muted-foreground font-medium">
                                    Cookies set by the website owner (in this case, Impressio) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website.
                                </p>
                            </div>

                            {/* Why We Use Cookies */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Settings className="w-6 h-6 text-primary" />
                                    Why We Use Cookies
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Essential Cookies</h4>
                                        <p className="text-muted-foreground font-medium">
                                            These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Performance Cookies</h4>
                                        <p className="text-muted-foreground font-medium">
                                            These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Functional Cookies</h4>
                                        <p className="text-muted-foreground font-medium">
                                            These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Types of Cookies We Use */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Cookie className="w-6 h-6 text-primary" />
                                    Types of Cookies We Use
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Session Cookies</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Temporary cookies that are erased when you close your browser. They help us remember your preferences during your current session.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Persistent Cookies</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Cookies that remain on your device until they expire or you delete them. They help us remember your preferences across sessions.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Authentication Cookies</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Cookies that help us verify your identity and keep you logged in securely while using our platform.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Analytics Cookies</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Cookies that help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Specific Cookies We Use */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Eye className="w-6 h-6 text-primary" />
                                    Specific Cookies We Use
                                </h3>
                                <div className="space-y-6">
                                    <div className="border border-border rounded-lg p-6">
                                        <h4 className="text-xl font-semibold text-foreground mb-3">Essential Cookies</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground font-medium">impressio_session</span>
                                                <span className="text-sm text-muted-foreground">Session</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Maintains your session and authentication state while using our platform.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border border-border rounded-lg p-6">
                                        <h4 className="text-xl font-semibold text-foreground mb-3">Performance Cookies</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground font-medium">_ga</span>
                                                <span className="text-sm text-muted-foreground">2 years</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Google Analytics cookie used to distinguish unique users and track page views.
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground font-medium">_gid</span>
                                                <span className="text-sm text-muted-foreground">24 hours</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Google Analytics cookie used to distinguish users for analytics purposes.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border border-border rounded-lg p-6">
                                        <h4 className="text-xl font-semibold text-foreground mb-3">Functional Cookies</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground font-medium">user_preferences</span>
                                                <span className="text-sm text-muted-foreground">1 year</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Stores your design preferences, theme choices, and interface settings.
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground font-medium">recent_designs</span>
                                                <span className="text-sm text-muted-foreground">30 days</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Remembers your recently accessed designs and templates for quick access.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Third-Party Cookies */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-primary" />
                                    Third-Party Cookies
                                </h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    We use third-party services that may set cookies on your device:
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Google Analytics</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            We use Google Analytics to understand how visitors use our website. Google Analytics uses cookies to collect information about your use of our website, including your IP address.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Payment Processors</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            When you make a payment, our payment processors may set cookies to ensure secure transactions and prevent fraud.
                                        </p>
                                    </div>
                                    <div className="bg-primary-soft p-6 rounded-lg">
                                        <h4 className="font-bold text-foreground mb-2">Social Media</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Social media platforms may set cookies when you use social sharing features or log in with social media accounts.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Managing Cookies */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Settings className="w-6 h-6 text-primary" />
                                    Managing Your Cookie Preferences
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Browser Settings</h4>
                                        <p className="text-muted-foreground font-medium">
                                            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Cookie Consent</h4>
                                        <p className="text-muted-foreground font-medium">
                                            When you first visit our website, you'll see a cookie consent banner. You can change your preferences at any time by clicking the "Cookie Settings" link in our footer.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-2">Opting Out</h4>
                                        <p className="text-muted-foreground font-medium">
                                            You can opt out of non-essential cookies by adjusting your preferences in our cookie settings. However, some features may not work properly without certain cookies.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Cookie Duration */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary" />
                                    Cookie Duration
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <h4 className="font-bold text-foreground mb-2">Session Cookies</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Deleted when you close your browser
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-bold text-foreground mb-2">Persistent Cookies</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Remain until expiration or deletion
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-bold text-foreground mb-2">Third-Party Cookies</h4>
                                        <p className="text-muted-foreground font-medium text-sm">
                                            Duration set by third-party providers
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Updates to Policy */}
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-4">Updates to This Policy</h3>
                                <p className="text-muted-foreground font-medium">
                                    We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on our website and updating the "Last Updated" date.
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-primary-soft p-8 rounded-lg">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Contact Us</h3>
                                <p className="text-muted-foreground font-medium mb-4">
                                    If you have any questions about our use of cookies, please contact us:
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

export default Cookies; 