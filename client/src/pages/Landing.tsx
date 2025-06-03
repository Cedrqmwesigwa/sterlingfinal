import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { Link } from "wouter";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Building, 
  Clock,
  Calculator,
  Eye,
  ChevronDown,
  Home,
  Hammer,
  Wrench,
  Zap,
  Bot,
  MessageCircle,
  Lightbulb
} from "lucide-react";

export default function Landing() {
  const stats = [
    { value: "500+", label: "Projects Completed" },
    { value: "250+", label: "Happy Clients" },
    { value: "15+", label: "Years Experience" }
  ];

  const services = [
    {
      icon: Home,
      title: "Residential Construction",
      description: "Custom homes, renovations, and residential projects built with precision and attention to detail.",
      features: ["Custom Home Design", "Renovation & Remodeling", "Interior Finishing"],
      href: "/services"
    },
    {
      icon: Building,
      title: "Commercial Construction",
      description: "Large-scale commercial buildings, offices, and industrial facilities with modern construction techniques.",
      features: ["Office Buildings", "Industrial Facilities", "Retail Spaces"],
      href: "/services"
    },
    {
      icon: Hammer,
      title: "Hardware Supply",
      description: "Premium construction materials, tools, and hardware supplies for contractors and DIY enthusiasts.",
      features: ["Quality Materials", "Professional Tools", "Bulk Supply"],
      href: "/shop"
    }
  ];

  const projects = [
    {
      id: 1,
      title: "Luxury Villa - Kampala Hills",
      category: "Residential",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      description: "Modern 5-bedroom villa with contemporary design and premium finishes.",
      budget: "$250,000"
    },
    {
      id: 2,
      title: "Sterling Business Tower",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      description: "12-story commercial building with state-of-the-art facilities.",
      budget: "$2.5M"
    },
    {
      id: 3,
      title: "Garden View Apartments",
      category: "Residential",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      description: "50-unit residential complex with modern amenities and green spaces.",
      budget: "$1.8M"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80" 
            alt="Modern construction site with cranes and building framework"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-hero font-bold mb-6 leading-tight slide-up">
              Premium Construction <span className="text-sterling-gold">& Hardware Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed fade-in">
              Transform your vision into reality with Sterling Contractors. Professional construction, quality hardware supply, and innovative solutions across Uganda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 fade-in">
              <Link href="/contact">
                <Button size="lg" className="btn-sterling">
                  <Calculator className="w-5 h-5 mr-2" />
                  Get AI Quote
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('projects')}
                className="btn-outline-sterling"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Our Work
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center scale-in">
                  <div className="text-3xl font-bold text-sterling-gold mb-2">{stat.value}</div>
                  <p className="text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-section font-bold text-sterling-navy mb-6">Our Premium Services</h2>
            <p className="text-xl text-sterling-taupe max-w-3xl mx-auto">
              From residential projects to commercial developments, we deliver excellence with cutting-edge technology and traditional craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="card-hover gradient-sterling text-white border-0">
                  <CardContent className="p-8">
                    <div className="bg-sterling-gold/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-sterling-gold" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-gray-200 mb-6 leading-relaxed">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={service.href}>
                      <Button className="w-full bg-sterling-gold hover:bg-sterling-gold/90">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* AI Features */}
          <div className="mt-20 bg-gradient-to-r from-sterling-navy to-sterling-navy/90 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Solutions</h3>
              <p className="text-xl text-gray-200">Revolutionizing construction with artificial intelligence</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-sterling-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-sterling-gold" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Smart Cost Estimation</h4>
                <p className="text-gray-300">AI analyzes your project details for accurate, instant quotes</p>
              </div>
              <div className="text-center">
                <div className="bg-sterling-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-sterling-gold" />
                </div>
                <h4 className="text-xl font-semibold mb-2">24/7 AI Assistant</h4>
                <p className="text-gray-300">Get instant answers to your construction questions</p>
              </div>
              <div className="text-center">
                <div className="bg-sterling-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-sterling-gold" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Smart Recommendations</h4>
                <p className="text-gray-300">Personalized material and service suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-sterling-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-section font-bold text-sterling-navy mb-6">Our Featured Projects</h2>
            <p className="text-xl text-sterling-taupe max-w-3xl mx-auto">
              Discover our portfolio of exceptional construction projects, from luxury homes to commercial developments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="card-hover overflow-hidden border-0 shadow-lg">
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <Badge className="absolute top-4 left-4 bg-sterling-gold">
                    {project.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-sterling-navy mb-2">{project.title}</h3>
                  <p className="text-sterling-taupe mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sterling-gold font-semibold text-lg">{project.budget}</span>
                    <Link href="/projects">
                      <Button variant="ghost" size="sm" className="text-sterling-navy hover:text-sterling-gold">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button size="lg" className="bg-sterling-navy hover:bg-sterling-navy/90 text-white">
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sterling-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Get a personalized quote with our AI-powered estimation system and secure your project with flexible payment options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="btn-sterling">
                <Calculator className="w-5 h-5 mr-2" />
                Get Free Quote
              </Button>
            </Link>
            <Link href="/deposit">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sterling-navy">
                Make Deposit
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
