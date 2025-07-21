import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Download, Eye, Palette, Type, Layout, Heart, PartyPopper } from "lucide-react";

const CardDesigner = () => {
  const [cardData, setCardData] = useState({
    recipientName: "",
    occasion: "birthday",
    message: "",
    senderName: "",
    template: "festive"
  });

  const occasions = [
    { value: "birthday", label: "Birthday", icon: Gift },
    { value: "anniversary", label: "Work Anniversary", icon: PartyPopper },
    { value: "celebration", label: "General Celebration", icon: Heart }
  ];

  const templates = [
    { id: "festive", name: "Festive Fun", preview: "bg-gradient-primary" },
    { id: "elegant", name: "Elegant Gold", preview: "bg-gradient-gold" },
    { id: "modern", name: "Modern Clean", preview: "bg-gradient-secondary" },
    { id: "playful", name: "Playful Burst", preview: "bg-gradient-accent" }
  ];

  const getOccasionIcon = () => {
    const occasion = occasions.find(o => o.value === cardData.occasion);
    const IconComponent = occasion?.icon || Gift;
    return <IconComponent className="w-8 h-8 text-white/90" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Card Designer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create personalized birthday cards and work anniversary celebrations
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Card Form */}
            <div className="space-y-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Type className="w-5 h-5 text-primary" />
                  Card Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="occasion">Occasion Type</Label>
                    <Select value={cardData.occasion} onValueChange={(value) => setCardData({...cardData, occasion: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        {occasions.map((occasion) => (
                          <SelectItem key={occasion.value} value={occasion.value}>
                            <div className="flex items-center gap-2">
                              <occasion.icon className="w-4 h-4" />
                              {occasion.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      value={cardData.recipientName}
                      onChange={(e) => setCardData({...cardData, recipientName: e.target.value})}
                      placeholder="Who is this card for?"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Personal Message</Label>
                    <Textarea
                      id="message"
                      value={cardData.message}
                      onChange={(e) => setCardData({...cardData, message: e.target.value})}
                      placeholder="Write your heartfelt message..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="senderName">From</Label>
                    <Input
                      id="senderName"
                      value={cardData.senderName}
                      onChange={(e) => setCardData({...cardData, senderName: e.target.value})}
                      placeholder="Your name or team name"
                    />
                  </div>
                </div>
              </Card>

              {/* Template Selection */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Choose Style
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`relative cursor-pointer rounded-lg border-2 transition-colors ${
                        cardData.template === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setCardData({...cardData, template: template.id})}
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

            {/* Card Preview */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" />
                  Live Preview
                </h3>
                
                {/* Card Preview */}
                <div className="aspect-[3/4] bg-gradient-primary rounded-xl p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                  <div className="relative h-full flex flex-col justify-between">
                    
                    {/* Header */}
                    <div className="text-center">
                      <div className="mb-4">
                        {getOccasionIcon()}
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        {cardData.occasion === 'birthday' && 'Happy Birthday!'}
                        {cardData.occasion === 'anniversary' && 'Congratulations!'}
                        {cardData.occasion === 'celebration' && 'Celebration Time!'}
                      </h2>
                      {cardData.recipientName && (
                        <h3 className="text-xl font-semibold">
                          {cardData.recipientName}
                        </h3>
                      )}
                    </div>
                    
                    {/* Message */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        {cardData.message ? (
                          <p className="text-lg leading-relaxed">
                            {cardData.message}
                          </p>
                        ) : (
                          <p className="text-white/70 italic">
                            Your personal message will appear here...
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="text-center">
                      {cardData.senderName && (
                        <p className="text-sm opacity-90">
                          From: {cardData.senderName}
                        </p>
                      )}
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

export default CardDesigner;