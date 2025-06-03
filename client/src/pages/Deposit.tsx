import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PaymentForm from "@/components/PaymentForm";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  Shield, 
  Calendar, 
  CheckCircle,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  AlertCircle,
  Bot,
  DollarSign
} from "lucide-react";

export default function Deposit() {
  const [step, setStep] = useState(1);
  const [projectDetails, setProjectDetails] = useState({
    type: "",
    description: "",
    budget: "",
    location: "Kampala, Uganda",
    timeline: "",
    complexity: "medium"
  });
  const [depositCalculation, setDepositCalculation] = useState({
    recommendedDeposit: 0,
    percentage: 25,
    reasoning: "",
    paymentSchedule: []
  });
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  const { toast } = useToast();

  const calculateDepositMutation = useMutation({
    mutationFn: async (details: typeof projectDetails) => {
      const response = await apiRequest('POST', '/api/ai/deposit-calculator', details);
      return response.json();
    },
    onSuccess: (data) => {
      setDepositCalculation(data);
      setStep(2);
    },
    onError: () => {
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate deposit. Please try again.",
        variant: "destructive",
      });
    }
  });

  const submitProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/deposits', data);
      return response.json();
    },
    onSuccess: () => {
      setStep(3);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Unable to submit project details. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectDetails.type || !projectDetails.description || !projectDetails.budget) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required project details.",
        variant: "destructive",
      });
      return;
    }
    calculateDepositMutation.mutate(projectDetails);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required customer information.",
        variant: "destructive",
      });
      return;
    }

    submitProjectMutation.mutate({
      ...projectDetails,
      ...customerInfo,
      amount: depositCalculation.recommendedDeposit,
      status: "pending"
    });
  };

  const depositReasons = [
    {
      icon: Shield,
      title: "Secure Materials",
      description: "Deposits ensure we can purchase quality materials before project commencement."
    },
    {
      icon: Calendar,
      title: "Schedule Labor",
      description: "Secure your preferred timeline with skilled craftsmen and project managers."
    },
    {
      icon: CheckCircle,
      title: "Project Commitment",
      description: "Mutual commitment ensures dedicated resources for your project success."
    }
  ];

  const paymentMethods = [
    {
      icon: CreditCard,
      name: "International Cards",
      description: "Visa, Mastercard via Stripe"
    },
    {
      icon: Smartphone,
      name: "MTN Mobile Money",
      description: "Pay with MTN Mobile Money"
    },
    {
      icon: Smartphone,
      name: "Airtel Money",
      description: "Pay with Airtel Money"
    },
    {
      icon: Building,
      name: "Bank Transfer",
      description: "Direct bank transfer"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-sterling-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Secure Project <span className="text-sterling-gold">Deposits</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Fast, secure, and transparent deposit collection system with AI-powered calculations and multiple payment options for your convenience.
            </p>
          </div>
        </div>
      </section>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Project Details Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Project Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProjectSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="projectType">Project Type *</Label>
                        <Select value={projectDetails.type} onValueChange={(value) => setProjectDetails(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Residential Construction</SelectItem>
                            <SelectItem value="commercial">Commercial Building</SelectItem>
                            <SelectItem value="renovation">Renovation Project</SelectItem>
                            <SelectItem value="industrial">Industrial Facility</SelectItem>
                            <SelectItem value="hardware">Hardware Supply Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="budget">Estimated Project Budget (USD) *</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="50000"
                          value={projectDetails.budget}
                          onChange={(e) => setProjectDetails(prev => ({ ...prev, budget: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Project Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your project requirements, scope, and any specific needs..."
                          value={projectDetails.description}
                          onChange={(e) => setProjectDetails(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={projectDetails.location}
                            onChange={(e) => setProjectDetails(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="timeline">Expected Timeline</Label>
                          <Select value={projectDetails.timeline} onValueChange={(value) => setProjectDetails(prev => ({ ...prev, timeline: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-2 months">1-2 months</SelectItem>
                              <SelectItem value="3-6 months">3-6 months</SelectItem>
                              <SelectItem value="6-12 months">6-12 months</SelectItem>
                              <SelectItem value="12+ months">12+ months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="complexity">Project Complexity</Label>
                        <Select value={projectDetails.complexity} onValueChange={(value) => setProjectDetails(prev => ({ ...prev, complexity: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simple - Standard construction</SelectItem>
                            <SelectItem value="medium">Medium - Some custom features</SelectItem>
                            <SelectItem value="complex">Complex - Advanced/custom design</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        type="submit"
                        className="w-full bg-sterling-gold hover:bg-sterling-gold/90"
                        disabled={calculateDepositMutation.isPending}
                      >
                        {calculateDepositMutation.isPending ? (
                          <>
                            <div className="spinner mr-2" />
                            Calculating Deposit...
                          </>
                        ) : (
                          <>
                            <Bot className="w-4 h-4 mr-2" />
                            Calculate AI Deposit
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Why Deposits Info */}
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-sterling-navy">Why We Require Deposits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {depositReasons.map((reason, index) => {
                        const IconComponent = reason.icon;
                        return (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="bg-sterling-gold/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-sterling-gold" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sterling-navy mb-2">{reason.title}</h4>
                              <p className="text-sterling-taupe">{reason.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sterling-navy">Accepted Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {paymentMethods.map((method, index) => {
                        const IconComponent = method.icon;
                        return (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-sterling-stone rounded-lg">
                            <IconComponent className="w-6 h-6 text-sterling-gold" />
                            <div>
                              <span className="font-medium text-sterling-navy text-sm">{method.name}</span>
                              <p className="text-xs text-sterling-taupe">{method.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-sterling-gold" />
                    AI Deposit Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-sterling-navy mb-4">Project Summary</h3>
                      <div className="space-y-3 text-sterling-taupe">
                        <div><span className="font-medium">Type:</span> {projectDetails.type}</div>
                        <div><span className="font-medium">Budget:</span> ${parseFloat(projectDetails.budget || "0").toLocaleString()}</div>
                        <div><span className="font-medium">Location:</span> {projectDetails.location}</div>
                        <div><span className="font-medium">Timeline:</span> {projectDetails.timeline || "Not specified"}</div>
                      </div>
                    </div>

                    <div className="bg-sterling-gold/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium text-sterling-navy">Recommended Deposit:</span>
                        <span className="text-3xl font-bold text-sterling-gold">
                          ${depositCalculation.recommendedDeposit.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-sterling-taupe mb-4">
                        {depositCalculation.percentage}% of total budget
                      </div>
                      <p className="text-sm text-sterling-navy">
                        {depositCalculation.reasoning || "AI-calculated based on project type, complexity, and market standards."}
                      </p>
                    </div>
                  </div>

                  {depositCalculation.paymentSchedule.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-sterling-navy mb-4">Suggested Payment Schedule</h4>
                      <div className="space-y-3">
                        {depositCalculation.paymentSchedule.map((phase: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-sterling-stone rounded-lg">
                            <div>
                              <span className="font-medium text-sterling-navy">{phase.phase}</span>
                              <p className="text-sm text-sterling-taupe">{phase.description}</p>
                            </div>
                            <span className="font-semibold text-sterling-gold">
                              ${phase.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={customerInfo.fullName}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+256 XXX XXX XXX"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-sterling-gold hover:bg-sterling-gold/90"
                      disabled={submitProjectMutation.isPending}
                    >
                      {submitProjectMutation.isPending ? (
                        <>
                          <div className="spinner mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto">
              <PaymentForm 
                amount={depositCalculation.recommendedDeposit}
                purpose={`Project Deposit - ${projectDetails.type} (${customerInfo.fullName})`}
                onSuccess={() => {
                  toast({
                    title: "Payment Successful!",
                    description: "Your deposit has been processed. We'll contact you soon to start your project.",
                  });
                }}
              />
            </div>
          )}

          {/* Security Notice */}
          <Card className="mt-8 max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center text-sterling-taupe">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">
                  SSL encrypted and PCI compliant. Your payment information is secure.
                </span>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                By proceeding, you agree to our{" "}
                <a href="#" className="text-sterling-gold hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-sterling-gold hover:underline">Deposit Policy</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
