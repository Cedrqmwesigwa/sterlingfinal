import { useState } from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PaymentForm from "@/components/PaymentForm";
import { Link } from "wouter";
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Package, 
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Shield,
  Check
} from "lucide-react";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_fake"
);

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Kampala",
    region: "Central",
    country: "Uganda"
  });
  const [deliveryMethod, setDeliveryMethod] = useState("standard");

  // Mock cart items (in real app, this would come from global state)
  const cartItems = [
    {
      id: 1,
      name: "Professional Drill Set",
      price: 299.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      name: "Premium Cement (50kg)",
      price: 12.00,
      quantity: 10,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      name: "Electrical Wire Kit", 
      price: 85.00,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = deliveryMethod === "express" ? 15 : deliveryMethod === "standard" ? 5 : 0;
  const tax = subtotal * 0.18; // 18% VAT in Uganda
  const total = subtotal + shipping + tax;

  const deliveryOptions = [
    {
      id: "pickup",
      name: "Store Pickup",
      description: "Pick up from our Kampala store",
      time: "Ready in 2 hours",
      price: 0
    },
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Delivery within Kampala and suburbs",
      time: "1-2 business days",
      price: 5
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Same-day delivery in Kampala",
      time: "Within 4 hours",
      price: 15
    }
  ];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || !shippingInfo.phone) {
      return;
    }
    setStep(2);
  };

  const handlePaymentSuccess = () => {
    setStep(3);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-sterling-stone w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-sterling-taupe" />
            </div>
            <h1 className="text-3xl font-bold text-sterling-navy mb-4">Your Cart is Empty</h1>
            <p className="text-sterling-taupe mb-8">
              Add some products to your cart to proceed with checkout.
            </p>
            <Link href="/shop">
              <Button className="bg-sterling-gold hover:bg-sterling-gold/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/shop">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-sterling-navy">Checkout</h1>
            
            {/* Progress Steps */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className={`flex items-center ${step >= 1 ? 'text-sterling-gold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-sterling-gold bg-sterling-gold text-white' : 'border-gray-300'}`}>
                    {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <span className="ml-2 font-medium">Shipping</span>
                </div>
                <div className={`mx-4 h-0.5 w-16 ${step >= 2 ? 'bg-sterling-gold' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-sterling-gold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-sterling-gold bg-sterling-gold text-white' : 'border-gray-300'}`}>
                    {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </div>
                  <span className="ml-2 font-medium">Payment</span>
                </div>
                <div className={`mx-4 h-0.5 w-16 ${step >= 3 ? 'bg-sterling-gold' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-sterling-gold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-sterling-gold bg-sterling-gold text-white' : 'border-gray-300'}`}>
                    {step >= 3 ? <Check className="w-4 h-4" /> : '3'}
                  </div>
                  <span className="ml-2 font-medium">Complete</span>
                </div>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Information */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+256 XXX XXX XXX"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter your full address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Select value={shippingInfo.city} onValueChange={(value) => setShippingInfo(prev => ({ ...prev, city: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Kampala">Kampala</SelectItem>
                              <SelectItem value="Entebbe">Entebbe</SelectItem>
                              <SelectItem value="Wakiso">Wakiso</SelectItem>
                              <SelectItem value="Mukono">Mukono</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="region">Region</Label>
                          <Select value={shippingInfo.region} onValueChange={(value) => setShippingInfo(prev => ({ ...prev, region: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Central">Central</SelectItem>
                              <SelectItem value="Eastern">Eastern</SelectItem>
                              <SelectItem value="Northern">Northern</SelectItem>
                              <SelectItem value="Western">Western</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" value="Uganda" disabled />
                        </div>
                      </div>

                      {/* Delivery Options */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-sterling-navy mb-4">Delivery Method</h3>
                        <div className="space-y-3">
                          {deliveryOptions.map((option) => (
                            <div
                              key={option.id}
                              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                                deliveryMethod === option.id
                                  ? 'border-sterling-gold bg-sterling-gold/5'
                                  : 'border-gray-200 hover:border-sterling-gold/50'
                              }`}
                              onClick={() => setDeliveryMethod(option.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-sterling-navy">{option.name}</h4>
                                  <p className="text-sm text-sterling-taupe">{option.description}</p>
                                  <p className="text-sm font-medium text-sterling-gold">{option.time}</p>
                                </div>
                                <span className="font-semibold text-sterling-navy">
                                  {option.price === 0 ? 'Free' : `$${option.price}`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-sterling-gold hover:bg-sterling-gold/90 mt-6"
                      >
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sterling-navy text-sm">{item.name}</h4>
                            <p className="text-sterling-taupe text-xs">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-sterling-navy">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sterling-taupe">Subtotal</span>
                        <span className="text-sterling-navy">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sterling-taupe">Shipping</span>
                        <span className="text-sterling-navy">${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sterling-taupe">VAT (18%)</span>
                        <span className="text-sterling-navy">${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-sterling-navy">Total</span>
                        <span className="text-sterling-gold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-sterling-taupe">
                      <Shield className="w-5 h-5 mr-2" />
                      <span className="text-sm">Secure checkout with SSL encryption</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-4xl mx-auto">
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  amount={total}
                  purpose={`Hardware Store Order - ${cartItems.length} items`}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="text-sterling-navy"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shipping
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-sterling-navy mb-4">Order Complete!</h1>
              <p className="text-sterling-taupe mb-8">
                Thank you for your order. We'll send you a confirmation email with tracking information.
              </p>
              
              <div className="bg-sterling-stone rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-sterling-navy mb-4">Order Details</h3>
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span>Order Total:</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Method:</span>
                    <span>{deliveryOptions.find(d => d.id === deliveryMethod)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Address:</span>
                    <span>{shippingInfo.address}, {shippingInfo.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button className="bg-sterling-gold hover:bg-sterling-gold/90">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="border-sterling-navy text-sterling-navy hover:bg-sterling-navy hover:text-white">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
