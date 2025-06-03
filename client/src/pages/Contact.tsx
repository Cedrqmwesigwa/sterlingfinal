import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Bot,
  CheckCircle,
  Building,
  Home,
  Hammer,
  Wrench,
  User,
  Calendar,
  AlertCircle
} from "lucide-react";

const contactFormSchema = insertInquirySchema.extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      projectType: "",
      message: "",
    },
  });

  const submitInquiryMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest('POST', '/api/inquiries', data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours with a personalized response.",
      });
      // Invalidate queries if needed
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
    },
    onError: (error) => {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Failed to Send Message",
        description: "There was an error sending your message. Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitInquiryMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      primary: "+256 751 979 777",
      secondary: "Mon-Sat: 8:00 AM - 6:00 PM",
      action: "tel:+256751979777"
    },
    {
      icon: Mail,
      title: "Email",
      primary: "mctyptys@gmail.com",
      secondary: "We respond within 24 hours",
      action: "mailto:mctyptys@gmail.com"
    },
    {
      icon: MapPin,
      title: "Location",
      primary: "Kampala, Uganda",
      secondary: "Serving Central & Eastern Uganda",
      action: null
    },
    {
      icon: Clock,
      title: "Business Hours",
      primary: "Mon-Sat: 8AM-6PM",
      secondary: "Sunday: Emergency only",
      action: null
    }
  ];

  const projectTypes = [
    { value: "residential", label: "Residential Construction", icon: Home },
    { value: "commercial", label: "Commercial Building", icon: Building },
    { value: "renovation", label: "Renovation", icon: Hammer },
    { value: "hardware", label: "Hardware Supply", icon: Wrench },
    { value: "consultation", label: "Consultation Only", icon: User }
  ];

  const whyContactUs = [
    {
      icon: CheckCircle,
      title: "Expert Consultation",
      description: "Get professional advice from our experienced construction team."
    },
    {
      icon: Calendar,
      title: "Quick Response",
      description: "We respond to all inquiries within 24 hours with detailed information."
    },
    {
      icon: Bot,
      title: "AI-Powered Estimates",
      description: "Receive accurate project estimates powered by our AI technology."
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
              Get In <span className="text-sterling-gold">Touch</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Ready to start your next project? Contact us today for a consultation and personalized quote. Our team of experts is here to help bring your vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="bg-sterling-gold/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-sterling-gold" />
                    </div>
                    <h3 className="text-lg font-semibold text-sterling-navy mb-2">{info.title}</h3>
                    {info.action ? (
                      <a 
                        href={info.action}
                        className="text-sterling-gold hover:text-sterling-gold/80 font-medium transition-colors duration-200"
                      >
                        {info.primary}
                      </a>
                    ) : (
                      <p className="text-sterling-navy font-medium">{info.primary}</p>
                    )}
                    <p className="text-sterling-taupe text-sm mt-1">{info.secondary}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-sterling-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              {isSubmitted ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6 text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4">Message Sent Successfully!</h3>
                    <p className="text-green-700 mb-6">
                      Thank you for contacting Sterling Contractors. We'll review your inquiry and get back to you within 24 hours with a personalized response.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      className="bg-sterling-gold hover:bg-sterling-gold/90"
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-sterling-navy">Send Us a Message</CardTitle>
                    <p className="text-sterling-taupe">
                      Fill out the form below and we'll get back to you with a detailed response.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+256 XXX XXX XXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="projectType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select project type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {projectTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    return (
                                      <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center">
                                          <IconComponent className="w-4 h-4 mr-2" />
                                          {type.label}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  rows={5}
                                  placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-sterling-gold hover:bg-sterling-gold/90 text-white py-4 text-lg font-semibold"
                          disabled={submitInquiryMutation.isPending}
                        >
                          {submitInquiryMutation.isPending ? (
                            <>
                              <div className="spinner mr-2" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>

                        <p className="text-sm text-gray-500 text-center">
                          We'll get back to you within 24 hours with a personalized response.
                        </p>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Chatbot Preview */}
              <Card className="bg-gradient-to-r from-sterling-navy to-sterling-navy/90 text-white">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bot className="w-6 h-6 text-sterling-gold mr-2" />
                    AI Assistant Available 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 mb-4">
                    Get instant answers to your construction questions with our AI-powered chatbot. Available around the clock for immediate assistance.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-200">
                      <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                      Instant cost estimates
                    </div>
                    <div className="flex items-center text-sm text-gray-200">
                      <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                      Material recommendations
                    </div>
                    <div className="flex items-center text-sm text-gray-200">
                      <CheckCircle className="w-4 h-4 text-sterling-gold mr-2" />
                      Project guidance
                    </div>
                  </div>
                  <Button className="w-full bg-sterling-gold hover:bg-sterling-gold/90 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start AI Conversation
                  </Button>
                </CardContent>
              </Card>

              {/* Why Contact Us */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sterling-navy">Why Contact Sterling Contractors?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {whyContactUs.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="bg-sterling-gold/20 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-sterling-gold" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sterling-navy mb-1">{item.title}</h4>
                            <p className="text-sterling-taupe text-sm">{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sterling-navy flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sterling-taupe">Monday - Friday</span>
                      <span className="text-sterling-navy font-medium">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sterling-taupe">Saturday</span>
                      <span className="text-sterling-navy font-medium">9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sterling-taupe">Sunday</span>
                      <span className="text-sterling-navy font-medium">Emergency Only</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-sterling-stone rounded-lg">
                    <div className="flex items-center text-sm text-sterling-navy">
                      <AlertCircle className="w-4 h-4 text-sterling-gold mr-2" />
                      For urgent matters outside business hours, call our emergency line.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sterling-navy mb-4">Visit Our Location</h2>
            <p className="text-sterling-taupe max-w-2xl mx-auto">
              We're centrally located in Kampala, serving clients across Central and Eastern Uganda with our premium construction services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-sterling-stone rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-sterling-navy mb-6">Sterling Contractors Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-sterling-gold mt-1" />
                    <div>
                      <p className="font-medium text-sterling-navy">Address</p>
                      <p className="text-sterling-taupe">Kampala, Uganda</p>
                      <p className="text-sterling-taupe">Serving Central & Eastern Uganda</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-sterling-gold mt-1" />
                    <div>
                      <p className="font-medium text-sterling-navy">Phone</p>
                      <a href="tel:+256751979777" className="text-sterling-gold hover:text-sterling-gold/80">
                        +256 751 979 777
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-sterling-gold mt-1" />
                    <div>
                      <p className="font-medium text-sterling-navy">Email</p>
                      <a href="mailto:mctyptys@gmail.com" className="text-sterling-gold hover:text-sterling-gold/80">
                        mctyptys@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sterling-stone rounded-2xl p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-sterling-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-sterling-navy mb-2">Interactive Map</h3>
                <p className="text-sterling-taupe">
                  Find us in the heart of Kampala, easily accessible from all major roads and transport links.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </div>
  );
}
