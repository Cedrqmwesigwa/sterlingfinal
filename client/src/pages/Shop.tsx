import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Filter,
  Hammer,
  Wrench,
  Zap,
  Droplets,
  Plus,
  Minus,
  Package,
  Truck,
  Shield,
  Bot,
  Sparkles
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  category: string;
  price: string;
  stockQuantity: number | null;
  imageUrl: string | null;
  featured: boolean | null;
  rating: string | null;
  specifications: any;
}

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [aiInput, setAiInput] = useState("");
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", { category: selectedCategory !== "all" ? selectedCategory : undefined }],
  });

  const aiRecommendationMutation = useMutation({
    mutationFn: async (projectDescription: string) => {
      const response = await apiRequest('POST', '/api/ai/recommendations', {
        projectDescription,
        budget: 10000
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AI Recommendations Ready!",
        description: "We've found the perfect products for your project.",
      });
    },
    onError: () => {
      toast({
        title: "Recommendation Failed", 
        description: "Unable to generate recommendations. Please try again.",
        variant: "destructive",
      });
    }
  });

  const categories = [
    { value: "all", label: "All Products", icon: Package },
    { value: "tools", label: "Tools", icon: Hammer },
    { value: "materials", label: "Materials", icon: Package },
    { value: "electrical", label: "Electrical", icon: Zap },
    { value: "plumbing", label: "Plumbing", icon: Droplets },
    { value: "hardware", label: "Hardware", icon: Wrench }
  ];

  // Default products for demonstration
  const defaultProducts = [
    {
      id: 1,
      name: "Professional Drill Set",
      description: "Complete cordless drill kit with multiple bits and carrying case. Perfect for professional construction work.",
      category: "tools",
      price: "299.00",
      stockQuantity: 25,
      imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true,
      rating: "4.8",
      specifications: { power: "18V", battery: "2.0Ah", bits: "20 pieces" }
    },
    {
      id: 2,
      name: "Premium Cement",
      description: "High-grade Portland cement, 50kg bags. Ideal for all construction projects with excellent binding strength.",
      category: "materials",
      price: "12.00",
      stockQuantity: 500,
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      rating: "4.6",
      specifications: { weight: "50kg", type: "Portland", grade: "42.5" }
    },
    {
      id: 3,
      name: "Electrical Wire Kit",
      description: "Complete wiring solution for residential projects. Includes various gauge wires and connectors.",
      category: "electrical",
      price: "85.00",
      stockQuantity: 40,
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true,
      rating: "4.9",
      specifications: { voltage: "240V", length: "100m", gauge: "2.5mm²" }
    },
    {
      id: 4,
      name: "Premium Paint Set",
      description: "Professional grade interior/exterior paint with brushes and rollers. Weather-resistant formula.",
      category: "materials",
      price: "145.00",
      stockQuantity: 30,
      imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      rating: "4.7",
      specifications: { coverage: "12m²/L", finish: "Satin", colors: "20 available" }
    },
    {
      id: 5,
      name: "Pipe Fitting Set",
      description: "Complete plumbing fittings for bathroom and kitchen installations. High-quality brass fittings.",
      category: "plumbing",
      price: "120.00",
      stockQuantity: 20,
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true,
      rating: "4.8",
      specifications: { material: "Brass", sizes: "15-50mm", pieces: "25 fittings" }
    },
    {
      id: 6,
      name: "Heavy Duty Hammer",
      description: "Professional claw hammer with ergonomic grip. Perfect for framing and general construction work.",
      category: "tools",
      price: "45.00",
      stockQuantity: 60,
      imageUrl: "https://images.unsplash.com/photo-1609205807107-e5e5f20a43ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      rating: "4.5",
      specifications: { weight: "450g", handle: "Fiberglass", head: "Steel" }
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  const filteredProducts = displayProducts.filter((product: Product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      case "name":
        return a.name.localeCompare(b.name);
      default: // featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    toast({
      title: "Added to Cart",
      description: "Product added successfully!",
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, quantity]) => {
      const product = displayProducts.find((p: Product) => p.id === parseInt(productId));
      return sum + (product ? parseFloat(product.price) * quantity : 0);
    }, 0);
  };

  const handleAIRecommendations = () => {
    if (!aiInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe your project to get AI recommendations.",
        variant: "destructive",
      });
      return;
    }
    aiRecommendationMutation.mutate(aiInput);
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
              Premium Hardware <span className="text-sterling-gold">Store</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Quality construction materials, professional tools, and hardware supplies with AI-powered recommendations for your projects.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.value}
                  className={`cursor-pointer text-center p-4 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.value
                      ? 'bg-sterling-gold text-white'
                      : 'bg-sterling-stone hover:bg-sterling-gold/20'
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-medium text-sm">{category.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-6 bg-sterling-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cart Summary */}
            <div className="flex items-center gap-4">
              <Link href="/checkout">
                <Button className="bg-sterling-gold hover:bg-sterling-gold/90">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart ({getTotalItems()}) - ${getTotalPrice().toFixed(2)}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-12 bg-gradient-to-r from-sterling-gold/10 to-sterling-navy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-sterling-gold/20">
            <CardHeader>
              <CardTitle className="text-sterling-navy flex items-center">
                <Bot className="w-6 h-6 text-sterling-gold mr-2" />
                AI-Powered Product Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sterling-taupe mb-4">
                Describe your construction project and get personalized product recommendations from our AI system.
              </p>
              <div className="flex gap-4">
                <Textarea
                  placeholder="Describe your project (e.g., building a 3-bedroom house, renovating a kitchen...)"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <Button 
                  onClick={handleAIRecommendations}
                  disabled={aiRecommendationMutation.isPending}
                  className="bg-sterling-gold hover:bg-sterling-gold/90"
                >
                  {aiRecommendationMutation.isPending ? (
                    <div className="spinner mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Get Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-sterling-stone w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-sterling-taupe" />
              </div>
              <h3 className="text-2xl font-semibold text-sterling-navy mb-4">No Products Found</h3>
              <p className="text-sterling-taupe mb-8">
                We couldn't find any products matching your search. Try adjusting your filters.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product: Product) => (
                <Card key={product.id} className="card-hover overflow-hidden border-0 shadow-lg">
                  <div className="relative">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.featured && (
                        <Badge className="bg-sterling-gold text-white">
                          Best Seller
                        </Badge>
                      )}
                      {product.stockQuantity && product.stockQuantity < 10 && (
                        <Badge variant="destructive">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-sterling-navy mb-2">{product.name}</h3>
                    <p className="text-sterling-taupe text-sm mb-4 line-clamp-3">
                      {product.description || "Quality construction product with professional-grade materials."}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-sterling-gold">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(parseFloat(product.rating || "5"))
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-sterling-taupe ml-1">
                          ({product.rating || "5.0"})
                        </span>
                      </div>
                    </div>

                    {product.stockQuantity !== null && (
                      <div className="flex items-center text-sm text-sterling-taupe mb-4">
                        <Package className="w-4 h-4 mr-1" />
                        {product.stockQuantity > 0 ? (
                          <span>{product.stockQuantity} in stock</span>
                        ) : (
                          <span className="text-red-500">Out of stock</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {cart[product.id] ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(product.id)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium">{cart[product.id]}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(product.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => addToCart(product.id)}
                          disabled={product.stockQuantity === 0}
                          className="bg-sterling-navy hover:bg-sterling-navy/90"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-sterling-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-sterling-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-sterling-navy mb-2">Fast Delivery</h3>
              <p className="text-sterling-taupe">Same-day delivery available in Kampala. Free shipping on orders over $200.</p>
            </div>
            <div className="text-center">
              <div className="bg-sterling-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-sterling-navy mb-2">Quality Guarantee</h3>
              <p className="text-sterling-taupe">All products come with warranty. 30-day money-back guarantee on all items.</p>
            </div>
            <div className="text-center">
              <div className="bg-sterling-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-sterling-navy mb-2">Expert Support</h3>
              <p className="text-sterling-taupe">24/7 AI assistant and professional advice for all your construction needs.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
}
