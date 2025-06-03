import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  ShoppingCart, 
  Building, 
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  User
} from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isLoading) {
      toast({
        title: "Welcome back!",
        description: `Hello ${user.firstName || 'there'}, ready to continue your projects?`,
      });
    }
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const quickActions = [
    {
      title: "Get AI Quote",
      description: "Get instant project estimates with our AI system",
      icon: Calculator,
      href: "/contact",
      color: "bg-sterling-gold"
    },
    {
      title: "Browse Hardware",
      description: "Shop our premium construction materials",
      icon: ShoppingCart,
      href: "/shop",
      color: "bg-sterling-navy"
    },
    {
      title: "View Projects",
      description: "Explore our portfolio of completed works",
      icon: Building,
      href: "/projects",
      color: "bg-sterling-taupe"
    },
    {
      title: "Make Deposit",
      description: "Secure your project with a deposit payment",
      icon: CreditCard,
      href: "/deposit",
      color: "bg-sterling-gold"
    }
  ];

  const recentActivity = [
    {
      type: "quote",
      title: "Residential Project Quote",
      description: "AI estimate for 3-bedroom house construction",
      time: "2 hours ago",
      status: "pending"
    },
    {
      type: "order",
      title: "Hardware Order #1234",
      description: "Premium cement and tools delivery",
      time: "1 day ago",
      status: "completed"
    },
    {
      type: "deposit",
      title: "Project Deposit",
      description: "Payment for Villa Kampala Hills project",
      time: "3 days ago",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-sterling-gold rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-sterling-navy">
                  Welcome back, {user?.firstName || 'there'}!
                </h1>
                <p className="text-sterling-taupe">
                  Ready to continue building your dreams?
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className="card-hover cursor-pointer border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className={`${action.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-sterling-navy mb-2">{action.title}</h3>
                      <p className="text-sterling-taupe text-sm">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sterling-navy flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {activity.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sterling-navy">{activity.title}</h4>
                          <p className="text-sterling-taupe text-sm">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats & Quick Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sterling-navy flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sterling-taupe">Projects</span>
                      <span className="font-semibold text-sterling-navy">3 Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sterling-taupe">Orders</span>
                      <span className="font-semibold text-sterling-navy">12 Total</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sterling-taupe">Deposits</span>
                      <span className="font-semibold text-sterling-navy">$15K Paid</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sterling-navy text-white">
                <CardHeader>
                  <CardTitle className="text-white">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 mb-4">
                    Our AI assistant is here 24/7 to help with your construction questions.
                  </p>
                  <Button className="w-full bg-sterling-gold hover:bg-sterling-gold/90">
                    Chat with AI Assistant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AIChat />
    </div>
  );
}
