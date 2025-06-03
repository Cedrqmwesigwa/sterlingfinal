import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  DollarSign,
  Eye,
  Star,
  Building,
  Home,
  Hammer,
  Users
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string | null;
  category: string;
  status: string | null;
  budget: string | null;
  location: string | null;
  imageUrl: string | null;
  featured: boolean | null;
  createdAt: string | null;
}

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  useEffect(() => {
    if (projects) {
      let filtered = projects;

      if (selectedCategory !== "all") {
        filtered = filtered.filter((project: Project) => 
          project.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      if (searchTerm) {
        filtered = filtered.filter((project: Project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      setFilteredProjects(filtered);
    }
  }, [projects, searchTerm, selectedCategory]);

  const categories = [
    { value: "all", label: "All Projects", icon: Building },
    { value: "residential", label: "Residential", icon: Home },
    { value: "commercial", label: "Commercial", icon: Building },
    { value: "renovation", label: "Renovation", icon: Hammer },
    { value: "industrial", label: "Industrial", icon: Building }
  ];

  const stats = [
    { value: "500+", label: "Projects Completed", icon: Building },
    { value: "250+", label: "Happy Clients", icon: Users },
    { value: "15+", label: "Years Experience", icon: Star },
    { value: "50+", label: "Ongoing Projects", icon: Calendar }
  ];

  // Fallback projects for demo (empty state handling)
  const defaultProjects = [
    {
      id: 1,
      title: "Luxury Villa - Kampala Hills",
      description: "Modern 5-bedroom villa with contemporary design and premium finishes featuring smart home integration.",
      category: "residential",
      status: "completed",
      budget: "$250,000",
      location: "Kampala Hills, Uganda",
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Sterling Business Tower",
      description: "12-story commercial building with state-of-the-art facilities and LEED certification for sustainable operations.",
      category: "commercial",
      status: "completed",
      budget: "$2,500,000",
      location: "Kampala CBD, Uganda",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      createdAt: "2024-02-20"
    },
    {
      id: 3,
      title: "Garden View Apartments",
      description: "50-unit residential complex with modern amenities, green spaces, and community facilities.",
      category: "residential",
      status: "completed",
      budget: "$1,800,000",
      location: "Entebbe, Uganda",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      createdAt: "2024-03-10"
    },
    {
      id: 4,
      title: "Manufacturing Hub",
      description: "Advanced manufacturing facility with automated systems and sustainability features for local industry.",
      category: "industrial",
      status: "completed",
      budget: "$3,200,000",
      location: "Jinja Industrial Park, Uganda",
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: false,
      createdAt: "2024-04-05"
    },
    {
      id: 5,
      title: "Heritage Home Makeover",
      description: "Complete renovation of a colonial-era home with modern amenities while preserving historical character.",
      category: "renovation",
      status: "completed",
      budget: "$150,000",
      location: "Kololo, Kampala",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80",
      featured: false,
      createdAt: "2024-05-12"
    },
    {
      id: 6,
      title: "Tech-Integrated Villa",
      description: "Ultra-modern home with AI integration, sustainable energy systems, and smart automation throughout.",
      category: "residential",
      status: "completed",
      budget: "$400,000",
      location: "Munyonyo, Kampala",
      imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      createdAt: "2024-06-18"
    }
  ];

  const displayProjects = projects.length > 0 ? filteredProjects : defaultProjects.filter(project => {
    if (selectedCategory !== "all" && project.category !== selectedCategory) return false;
    if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'residential': return Home;
      case 'commercial': return Building;
      case 'renovation': return Hammer;
      case 'industrial': return Building;
      default: return Building;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'residential': return 'bg-sterling-gold';
      case 'commercial': return 'bg-sterling-navy';
      case 'renovation': return 'bg-sterling-taupe';
      case 'industrial': return 'bg-sterling-brown';
      default: return 'bg-sterling-gold';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="spinner" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-sterling-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Project <span className="text-sterling-gold">Portfolio</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Explore our collection of exceptional construction projects across Uganda. From luxury homes to commercial developments, see how we bring visions to life.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-sterling-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-sterling-gold" />
                  </div>
                  <div className="text-3xl font-bold text-sterling-navy mb-2">{stat.value}</div>
                  <p className="text-sterling-taupe">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-sterling-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`${
                      selectedCategory === category.value
                        ? 'bg-sterling-gold hover:bg-sterling-gold/90 text-white'
                        : 'border-sterling-navy text-sterling-navy hover:bg-sterling-gold hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {displayProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-sterling-stone w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-sterling-taupe" />
              </div>
              <h3 className="text-2xl font-semibold text-sterling-navy mb-4">No Projects Found</h3>
              <p className="text-sterling-taupe mb-8">
                We couldn't find any projects matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-sterling-gold hover:bg-sterling-gold/90"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project) => {
                const CategoryIcon = getCategoryIcon(project.category);
                return (
                  <Card key={project.id} className="card-hover overflow-hidden border-0 shadow-lg">
                    <div className="relative">
                      <img 
                        src={project.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                        alt={project.title}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={`${getCategoryColor(project.category)} text-white`}>
                          {project.category}
                        </Badge>
                        {project.featured && (
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-sterling-navy mb-2">{project.title}</h3>
                      <p className="text-sterling-taupe mb-4 line-clamp-3">
                        {project.description || "A premium construction project showcasing our expertise and commitment to quality."}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        {project.location && (
                          <div className="flex items-center text-sm text-sterling-taupe">
                            <MapPin className="w-4 h-4 mr-2" />
                            {project.location}
                          </div>
                        )}
                        {project.budget && (
                          <div className="flex items-center text-sm text-sterling-taupe">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {project.budget}
                          </div>
                        )}
                        {project.createdAt && (
                          <div className="flex items-center text-sm text-sterling-taupe">
                            <Calendar className="w-4 h-4 mr-2" />
                            Completed {new Date(project.createdAt).getFullYear()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CategoryIcon className="w-5 h-5 text-sterling-gold mr-2" />
                          <span className="text-sm font-medium text-sterling-navy capitalize">
                            {project.category}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-sterling-navy hover:text-sterling-gold p-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {displayProjects.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                variant="outline"
                className="border-sterling-navy text-sterling-navy hover:bg-sterling-navy hover:text-white"
              >
                Load More Projects
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sterling-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join our satisfied clients and let us bring your construction vision to life with our proven expertise and innovative approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-sterling-gold hover:bg-sterling-gold/90">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sterling-navy">
                <ArrowRight className="w-5 h-5 mr-2" />
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
}
