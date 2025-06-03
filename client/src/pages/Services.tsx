import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { Link } from "wouter";
import { 
  Home, 
  Building, 
  Hammer, 
  Wrench, 
  CheckCircle, 
  Star,
  ArrowRight,
  Calculator,
  Clock,
  Shield,
  Award,
  Users,
  Lightbulb,
  Bot,
  MessageCircle
} from "lucide-react";

export default function Services() {
  const [selectedService, setSelectedService] = useState("residential");

  const services = [
    {
      id: "residential",
      icon: Home,
      title: "Residential Construction",
      description: "Custom homes, renovations, and residential projects built with precision and attention to detail.",
      features: [
        "Custom Home Design & Architecture",
        "Complete House Construction", 
        "Renovation & Remodeling",
        "Interior & Exterior Finishing",
        "Kitchen & Bathroom Upgrades",
        "Roofing & Foundation Work"
      ],
      benefits: [
        "Personalized design consultation",
        "Quality materials & craftsmanship",
        "Project management & coordination",
        "Warranty & after-sales support"
      ],
      timeline: "2-6 months",
      startingPrice: "$25,000",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "commercial",
      icon: Building,
      title: "Commercial Construction",
      description: "Large-scale commercial buildings, offices, and industrial facilities with modern construction techniques.",
      features: [
        "Office Building Construction",
        "Retail & Shopping Centers",
        "Industrial Facilities",
        "Warehouses & Distribution Centers",
        "Healthcare Facilities",
        "Educational Buildings"
      ],
      benefits: [
        "LEED certification options",
        "Advanced project management",
        "Compliance with building codes",
        "Sustainable construction practices"
      ],
      timeline: "6-18 months",
      startingPrice: "$200,000",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "renovation",
      icon: Hammer,
      title: "Renovation & Remodeling",
      description: "Transform existing spaces with modern upgrades while preserving structural integrity and heritage.",
      features: [
        "Kitchen & Bathroom Remodeling",
        "Home Extensions & Additions",
        "Heritage Building Restoration",
        "Space Optimization",
        "Accessibility Improvements",
        "Energy Efficiency Upgrades"
      ],
      benefits: [
        "Preserve existing structure",
        "Increase property value",
        "Modern functionality",
        "Cost-effective solutions"
      ],
      timeline: "1-4 months",
      startingPrice: "$15,000",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80"
    },
    {
      id: "hardware",
      icon: Wrench,
      title: "Hardware Supply",
      description: "Premium construction materials, tools, and hardware supplies for contractors and DIY enthusiasts.",
      features: [
        "Construction Materials",
        "Professional Tools & Equipment",
        "Electrical & Plumbing Supplies",
        "Paint & Finishing Products",
        "Safety Equipment",
        "Bulk & Wholesale Orders"
      ],
      benefits: [
        "Quality guaranteed products",
        "Competitive wholesale pricing",
        "Fast delivery service",
        "Technical support & advice"
      ],
      timeline: "Same day - 1 week",
      startingPrice: "$50",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2127&q=80"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      description: "Initial meeting to understand your vision, requirements, and budget constraints."
    },
    {
      step: "02", 
      title: "AI Estimation",
      description: "Our AI system analyzes your project to provide accurate cost estimates and timelines."
    },
    {
      step: "03",
      title: "Design & Planning",
      description: "Detailed project planning, design development, and permit acquisition."
    },
    {
      step: "04",
      title: "Construction",
      description: "Professional execution with quality control and regular progress updates."
    },
    {
      step: "05",
      title: "Completion",
      description: "Final inspection, handover, and ongoing support for your completed project."
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "15+ Years Experience",
      description: "Proven track record with over 500 successful projects across Uganda."
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "We stand behind our work with comprehensive warranties and quality assurance."
    },
    {
      icon: Bot,
      title: "AI-Powered Solutions",
      description: "Cutting-edge technology for accurate estimates and project optimization."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Skilled craftsmen, engineers, and project managers dedicated to excellence."
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "Reliable project timelines with transparent progress tracking."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Modern construction techniques and sustainable building practices."
    }
  ];

  const currentService = services.find(s => s.id === selectedService) || services[0];
  const ServiceIcon = currentService.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-sterling-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Construction <span className="text-sterling-gold">Services</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              From residential homes to commercial buildings, we deliver exceptional construction services with cutting-edge technology and traditional craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedService === service.id 
                      ? 'border-sterling-gold shadow-lg scale-105' 
                      : 'hover:shadow-md hover:scale-102'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                      selectedService === service.id 
                        ? 'bg-sterling-gold text-white' 
                        : 'bg-sterling-stone text-sterling-navy'
                    }`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-sterling-navy mb-2">{service.title}</h3>
                    <p className="text-sterling-taupe text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Service View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-sterling-gold w-16 h-16 rounded-xl flex items-center justify-center mr-4">
                  <ServiceIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-sterling-navy">{currentService.title}</h2>
                  <Badge variant="secondary" className="mt-2">
                    Starting from {currentService.startingPrice}
                  </Badge>
                </div>
              </div>

              <p className="text-sterling-taupe text-lg mb-8 leading-relaxed">
                {currentService.description}
              </p>

              <Tabs defaultValue="features" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentService.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-sterling-gold mr-2" />
                        <span className="text-sterling-navy">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="benefits" className="mt-6">
                  <div className="space-y-3">
                    {currentService.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <Star className="w-5 h-5 text-sterling-gold mr-2" />
                        <span className="text-sterling-navy">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-sterling-stone rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-sterling-gold mr-2" />
                    <span className="font-semibold text-sterling-navy">Timeline</span>
                  </div>
                  <span className="text-sterling-taupe">{currentService.timeline}</span>
                </div>
                <div className="bg-sterling-stone rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calculator className="w-5 h-5 text-sterling-gold mr-2" />
                    <span className="font-semibold text-sterling-navy">Starting Price</span>
                  </div>
                  <span className="text-sterling-taupe">{currentService.startingPrice}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-sterling-gold hover:bg-sterling-gold/90">
                    <Calculator className="w-5 h-5 mr-2" />
                    Get AI Quote
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="border-sterling-navy text-sterling-navy hover:bg-sterling-navy hover:text-white">
                    View Projects
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <img 
                src={currentService.image} 
                alt={currentService.title}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sterling-navy/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 bg-sterling-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sterling-navy mb-6">Our Process</h2>
            <p className="text-xl text-sterling-taupe max-w-3xl mx-auto">
              A streamlined approach that ensures quality, transparency, and on-time delivery for every project.
            </p>
          </div>

          <div className="relative">
            {/* Process Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-sterling-gold/30"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="bg-sterling-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-sterling-navy mb-3">{step.title}</h3>
                  <p className="text-sterling-taupe leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sterling-navy mb-6">Why Choose Sterling Contractors</h2>
            <p className="text-xl text-sterling-taupe max-w-3xl mx-auto">
              We combine traditional craftsmanship with modern technology to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="bg-sterling-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-sterling-gold" />
                    </div>
                    <h3 className="text-xl font-semibold text-sterling-navy mb-3">{item.title}</h3>
                    <p className="text-sterling-taupe leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 bg-sterling-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">AI-Powered Construction</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Experience the future of construction with our AI-integrated services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-sterling-gold/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Bot className="w-6 h-6 text-sterling-gold mr-2" />
                  Smart Estimation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 mb-4">
                  Our AI analyzes project requirements, local material costs, and construction complexity to provide accurate estimates instantly.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Real-time cost analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Material optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Timeline predictions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-sterling-gold/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <MessageCircle className="w-6 h-6 text-sterling-gold mr-2" />
                  24/7 AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 mb-4">
                  Get instant answers to construction questions, material advice, and project guidance any time of day.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Technical support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Product recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Project guidance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-sterling-gold/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Lightbulb className="w-6 h-6 text-sterling-gold mr-2" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 mb-4">
                  Receive personalized recommendations for materials, design choices, and construction methods based on your specific needs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Personalized solutions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Cost optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                    <span className="text-sm">Quality assurance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sterling-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-sterling-navy mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-sterling-taupe mb-8 max-w-2xl mx-auto">
            Get a personalized quote with our AI-powered estimation system and take the first step toward your dream project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-sterling-gold hover:bg-sterling-gold/90">
                <Calculator className="w-5 h-5 mr-2" />
                Get Free AI Quote
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="border-sterling-navy text-sterling-navy hover:bg-sterling-navy hover:text-white">
                <ArrowRight className="w-5 h-5 mr-2" />
                View Our Work
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
