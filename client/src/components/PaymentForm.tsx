import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building, Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PaymentFormProps {
  amount: number;
  purpose: string;
  onSuccess?: () => void;
}

export default function PaymentForm({ amount, purpose, onSuccess }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  const { toast } = useToast();

  const createPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/create-payment-intent', data);
      return response.json();
    },
    onSuccess: (data) => {
      // In a real implementation, this would redirect to Stripe checkout
      // or open mobile money payment flow
      toast({
        title: "Payment Initiated",
        description: "Please complete your payment in the opened window.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Information Required",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createPaymentMutation.mutate({
      amount,
      paymentMethod,
      customerInfo,
      purpose,
    });
  };

  const paymentMethods = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "International cards via Stripe"
    },
    {
      id: "mtn",
      name: "MTN Mobile Money",
      icon: Smartphone,
      description: "Pay with MTN Mobile Money"
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: Smartphone,
      description: "Pay with Airtel Money"
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct bank transfer"
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-sterling-navy">Secure Payment</CardTitle>
        <p className="text-sterling-taupe">
          Complete your payment for: {purpose}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Amount */}
          <div className="bg-sterling-stone rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-sterling-navy">Total Amount:</span>
              <span className="text-2xl font-bold text-sterling-gold">${amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sterling-navy">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={customerInfo.fullName}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
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
                  placeholder="Kampala, Uganda"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sterling-navy">Payment Method</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      paymentMethod === method.id
                        ? 'border-sterling-gold bg-sterling-gold/10'
                        : 'border-gray-200 hover:border-sterling-gold/50'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-6 h-6 text-sterling-navy" />
                      <div>
                        <h4 className="font-medium text-sterling-navy">{method.name}</h4>
                        <p className="text-sm text-sterling-taupe">{method.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Security Notice */}
          <div className="bg-sterling-navy/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-sterling-gold" />
              <span className="font-medium text-sterling-navy">Secure Payment</span>
            </div>
            <p className="text-sm text-sterling-taupe">
              Your payment information is encrypted and secure. We use industry-standard SSL encryption and PCI compliance.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-sterling-gold hover:bg-sterling-gold/90 text-white py-4 text-lg font-semibold"
            disabled={createPaymentMutation.isPending}
          >
            {createPaymentMutation.isPending ? (
              <>
                <div className="spinner mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Secure Payment - ${amount.toLocaleString()}
              </>
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our{" "}
            <a href="#" className="text-sterling-gold hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-sterling-gold hover:underline">Payment Policy</a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
