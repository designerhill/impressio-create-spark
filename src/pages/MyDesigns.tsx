import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Download, Edit, Trash2, Copy, Folder, Award, Gift, Calendar, Clock } from "lucide-react";

const MyDesigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const designs = [
    {
      id: 1,
      title: "Employee Excellence Certificate",
      type: "certificate",
      status: "completed",
      lastEdited: "2 hours ago",
      created: "Jan 15, 2025",
      thumbnail: "bg-gradient-primary",
      downloads: 12
    },
    {
      id: 2,
      title: "Birthday Card - Sarah",
      type: "card",
      status: "draft",
      lastEdited: "1 day ago",
      created: "Jan 14, 2025",
      thumbnail: "bg-gradient-accent",
      downloads: 0
    },
    {
      id: 3,
      title: "5 Year Work Anniversary",
      type: "card",
      status: "completed",
      lastEdited: "3 days ago",
      created: "Jan 12, 2025",
      thumbnail: "bg-gradient-gold",
      downloads: 5
    },
    {
      id: 4,
      title: "Achievement Award Template",
      type: "certificate",
      status: "completed",
      lastEdited: "1 week ago",
      created: "Jan 8, 2025",
      thumbnail: "bg-gradient-secondary",
      downloads: 23
    },
    {
      id: 5,
      title: "Team Celebration Card",
      type: "card",
      status: "draft",
      lastEdited: "1 week ago",
      created: "Jan 7, 2025",
      thumbnail: "bg-gradient-primary",
      downloads: 0
    }
  ];

  const stats = {
    total: designs.length,
    certificates: designs.filter(d => d.type === "certificate").length,
    cards: designs.filter(d => d.type === "card").length,
    totalDownloads: designs.reduce((sum, d) => sum + d.downloads, 0)
  };

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || design.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                My Designs
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage and organize all your created designs
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 lg:mt-0">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Designs</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-secondary">{stats.certificates}</div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-accent">{stats.cards}</div>
                <div className="text-sm text-muted-foreground">Cards</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-green-600">{stats.totalDownloads}</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search your designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Folder className="w-4 h-4 mr-2" />
                New Folder
              </Button>
              <Button>
                <Award className="w-4 h-4 mr-2" />
                New Design
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Filter Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all">All Designs</TabsTrigger>
              <TabsTrigger value="certificate">Certificates</TabsTrigger>
              <TabsTrigger value="card">Cards</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-8">
              {/* Designs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDesigns.map((design) => (
                  <Card key={design.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden">
                    
                    {/* Design Thumbnail */}
                    <div className={`h-48 ${design.thumbnail} relative flex items-center justify-center text-white`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative text-center">
                        {design.type === "certificate" ? (
                          <Award className="w-8 h-8 mx-auto mb-2" />
                        ) : (
                          <Gift className="w-8 h-8 mx-auto mb-2" />
                        )}
                        <h3 className="font-semibold text-sm">{design.title}</h3>
                      </div>
                      
                      {/* Status Badge */}
                      <Badge 
                        className={`absolute top-3 left-3 ${
                          design.status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-500 text-black'
                        }`}
                      >
                        {design.status === 'completed' ? 'Ready' : 'Draft'}
                      </Badge>
                      
                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Design Info */}
                    <div className="p-4">
                      <h4 className="font-semibold text-sm mb-2 truncate">{design.title}</h4>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {design.lastEdited}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created {design.created}
                        </div>
                        {design.downloads > 0 && (
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {design.downloads} downloads
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1" disabled={design.status === 'draft'}>
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {filteredDesigns.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No designs found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "Try adjusting your search or create a new design"
                      : "Get started by creating your first design"}
                  </p>
                  <Button>
                    <Award className="w-4 h-4 mr-2" />
                    Create New Design
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyDesigns;