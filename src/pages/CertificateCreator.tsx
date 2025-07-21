import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Download, Eye, Palette, Type, Layout } from "lucide-react";

const CertificateCreator = () => {
  const [certificateData, setCertificateData] = useState({
    recipientName: "",
    achievement: "",
    description: "",
    date: "",
    template: "modern"
  });

  const templates = [
    { id: "modern", name: "Modern Gradient", preview: "bg-gradient-primary" },
    { id: "classic", name: "Classic Elegant", preview: "bg-gradient-secondary" },
    { id: "creative", name: "Creative Burst", preview: "bg-gradient-accent" },
    { id: "corporate", name: "Corporate Clean", preview: "bg-gradient-subtle" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Certificate Creator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Design professional certificates that celebrate achievements and milestones
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Certificate Form */}
            <div className="space-y-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Type className="w-5 h-5 text-primary" />
                  Certificate Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      value={certificateData.recipientName}
                      onChange={(e) => setCertificateData({...certificateData, recipientName: e.target.value})}
                      placeholder="Enter recipient's full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="achievement">Achievement Title</Label>
                    <Input
                      id="achievement"
                      value={certificateData.achievement}
                      onChange={(e) => setCertificateData({...certificateData, achievement: e.target.value})}
                      placeholder="e.g., Excellence in Performance"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={certificateData.description}
                      onChange={(e) => setCertificateData({...certificateData, description: e.target.value})}
                      placeholder="Brief description of the achievement..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={certificateData.date}
                      onChange={(e) => setCertificateData({...certificateData, date: e.target.value})}
                    />
                  </div>
                </div>
              </Card>

              {/* Template Selection */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Choose Template
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`relative cursor-pointer rounded-lg border-2 transition-colors ${
                        certificateData.template === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setCertificateData({...certificateData, template: template.id})}
                    >
                      <div className={`h-24 rounded-t-lg ${template.preview}`} />
                      <div className="p-3">
                        <p className="font-medium text-sm">{template.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Certificate Preview */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" />
                  Live Preview
                </h3>
                
                {/* Certificate Preview */}
                <div className="aspect-[4/3] bg-gradient-primary rounded-lg p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                  <div className="relative h-full flex flex-col justify-center text-center">
                    <div className="mb-6">
                      <Award className="w-16 h-16 mx-auto mb-4 text-white/90" />
                      <h2 className="text-3xl font-bold mb-2">Certificate of Achievement</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-lg">This is to certify that</p>
                      <h3 className="text-2xl font-bold">
                        {certificateData.recipientName || "Recipient Name"}
                      </h3>
                      <p className="text-lg">has successfully achieved</p>
                      <h4 className="text-xl font-semibold">
                        {certificateData.achievement || "Achievement Title"}
                      </h4>
                      {certificateData.description && (
                        <p className="text-sm opacity-90 max-w-md mx-auto">
                          {certificateData.description}
                        </p>
                      )}
                      <p className="text-sm mt-6">
                        Date: {certificateData.date || "Select Date"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" disabled>
                  <Eye className="w-4 h-4 mr-2" />
                  Full Preview
                </Button>
                <Button variant="default" className="flex-1" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                Fill in the details to enable preview and download
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CertificateCreator;