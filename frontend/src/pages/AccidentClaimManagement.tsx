import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Scale,
  FileCheck,
  Shield,
  Hand,
  Handshake,
  Clock,
  CheckCircle2,
  Car,
  Truck,
  Warehouse,
  Wrench,
  User,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { bookingsApi } from "@/services/bookingsApi";
import { MessageCircle } from "lucide-react";

const AccidentClaimManagement = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    accident_date: "",
    vehicle_registration: "",
    insurance_company: "",
    policy_number: "",
    accident_details: "",
    pickup_location: "",
    drop_location: "",
    notes: "",
    agreeToTerms: false,
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms and conditions required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }



    setIsSubmitting(true);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'agreeToTerms' && value) {
          formDataObj.append(key, value as string);
        }
      });

      if (!formDataObj.get("notes")) {
        formDataObj.set("notes", "");
      }

      formDataObj.set("honeypot", "");

      await bookingsApi.submitClaim(formDataObj);

      toast({
        title: "Claim submitted successfully",
        description: "Our team will contact you shortly to arrange your replacement vehicle.",
      });

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        accident_date: "",
        vehicle_registration: "",
        insurance_company: "",
        policy_number: "",
        accident_details: "",
        pickup_location: "",
        drop_location: "",
        notes: "",
        agreeToTerms: false,
      });

    } catch (error) {
      toast({
        title: "Unable to submit claim",
        description: error instanceof Error ? error.message : "Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: "What is a Non-Fault Claim?",
      answer: "A non-fault claim is when you've been involved in an accident that was not your fault. In these cases, you may be entitled to compensation and a replacement vehicle while your car is being repaired, all at no cost to you."
    },
    {
      question: "How much will I pay for my claim?",
      answer: "We work on a 'No Win No Fee' basis, meaning you only pay us if we successfully recover compensation for your claim. There are no upfront costs, and all fees are recovered from the at-fault party's insurance."
    },
    {
      question: "What documents do I need to provide for my claim?",
      answer: "You'll need to provide details about the accident, including photos if available, your insurance information, and any witness statements. Our dedicated claim handler will guide you through exactly what's needed for your specific case."
    },
    {
      question: "Can I do anything while the claim is ongoing?",
      answer: "Yes, you can continue with your normal daily activities. We handle all the paperwork, negotiations, and communications with insurance companies, so you can focus on your recovery and daily life."
    },
    {
      question: "What should I do if I have an accident after a non-fault car accident?",
      answer: "If you're involved in another accident, contact us immediately. We'll assess the situation and determine how it affects your existing claim. Our team will guide you through the process and ensure all claims are properly managed."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/pexels-artyom-kulakov-1190754-2265634.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gold">ACCIDENT CLAIM MANAGEMENT</h1>
                <p className="text-lg opacity-90">Services / Accident Claim Management</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Intro Section */}
        <section className="relative py-20 lg:py-32 bg-background text-foreground overflow-hidden">
          {/* Background image removed */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <AnimatedSection>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                  UNSOLVED CLAIM? <span className="text-gold">GET EXPERT HELP FROM OUR CLAIMS MANAGEMENT COMPANY.</span>
                </h1>
                <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                  Don't let the stress of an accident overwhelm you. Our expert team is here to manage your claim from start to finish, ensuring you receive the compensation you deserve. We manage <span className="font-bold">THE CLAIM WHILE YOU RECOVER.</span>
                </p>
                <p className="text-base lg:text-lg opacity-80 font-semibold">
                  We are <span className="text-gold">THE MOST TRUSTED ACCIDENT CLAIMS MANAGEMENT SPECIALISTS AND OFFERING NATIONWIDE COVERAGE.</span>
                </p>
              </AnimatedSection>

              {/* Right Side - Make a Claim Form */}
              <AnimatedSection delay={200}>
                <Card className="bg-transparent shadow-none border-0">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gold">FIND OUT IF YOU CAN CLAIM</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="first_name" className="text-sm font-medium">First Name *</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name" className="text-sm font-medium">Last Name *</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      {/* Contact Fields */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                          placeholder="john.doe@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                          placeholder="+44 7700 900000"
                        />
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">Full Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                          placeholder="123 Main Street, London"
                        />
                      </div>

                      {/* Accident Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="accident_date" className="text-sm font-medium">Accident Date *</Label>
                          <Input
                            id="accident_date"
                            name="accident_date"
                            type="date"
                            value={formData.accident_date}
                            onChange={handleChange}
                            required
                            className="bg-white border-gray-300 text-gray-900 focus:border-accent focus:ring-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicle_registration" className="text-sm font-medium">Vehicle Registration *</Label>
                          <Input
                            id="vehicle_registration"
                            name="vehicle_registration"
                            value={formData.vehicle_registration}
                            onChange={handleChange}
                            required
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                            placeholder="AB12 CDE"
                          />
                        </div>
                      </div>

                      {/* Insurance Details */}
                      <div className="space-y-2">
                        <Label htmlFor="insurance_company" className="text-sm font-medium">Insurance Company *</Label>
                        <Input
                          id="insurance_company"
                          name="insurance_company"
                          value={formData.insurance_company}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                          placeholder="Your Insurance Provider"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="policy_number" className="text-sm font-medium">Policy Number *</Label>
                        <Input
                          id="policy_number"
                          name="policy_number"
                          value={formData.policy_number}
                          onChange={handleChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                          placeholder="POL123456789"
                        />
                      </div>

                      {/* Accident Details */}
                      <div className="space-y-2">
                        <Label htmlFor="accident_details" className="text-sm font-medium">Accident Details *</Label>
                        <Textarea
                          id="accident_details"
                          name="accident_details"
                          value={formData.accident_details}
                          onChange={handleChange}
                          required
                          rows={3}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 resize-none focus:border-accent focus:ring-accent"
                          placeholder="Please describe what happened during the accident..."
                        />
                      </div>

                      {/* Locations */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="pickup_location" className="text-sm font-medium">Pickup Location *</Label>
                          <Input
                            id="pickup_location"
                            name="pickup_location"
                            value={formData.pickup_location}
                            onChange={handleChange}
                            required
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                            placeholder="Accident site"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="drop_location" className="text-sm font-medium">Drop-off Location *</Label>
                          <Input
                            id="drop_location"
                            name="drop_location"
                            value={formData.drop_location}
                            onChange={handleChange}
                            required
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-accent"
                            placeholder="Return location"
                          />
                        </div>
                      </div>



                      {/* Terms */}
                      <div className="flex items-start space-x-2 pt-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked === true })}
                          className="mt-1"
                        />
                        <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer leading-tight">
                          I agree to the terms and conditions and privacy policy
                        </Label>
                      </div>

                      {/* Hidden honeypot field */}
                      <input
                        type="text"
                        name="website"
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-gold text-black hover:bg-gold/90 font-semibold py-6 text-base"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Claim"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-white border-green-600 text-green-600 hover:bg-gray-50 dark:hover:bg-gray-100 font-semibold py-6 text-base"
                          onClick={() => {
                            const whatsappData = {
                              name: `${formData.first_name || ""} ${formData.last_name || ""}`.trim(),
                              email: formData.email,
                              phone: formData.phone,
                              address: formData.address,
                              accident_date: formData.accident_date,
                              vehicle_registration: formData.vehicle_registration,
                              insurance_company: formData.insurance_company,
                              policy_number: formData.policy_number,
                              accident_details: formData.accident_details,
                              pickup_location: formData.pickup_location,
                              drop_location: formData.drop_location,
                              notes: formData.notes || "",
                            };
                            const message = formatWhatsAppMessage(whatsappData, 'claim');
                            openWhatsApp(import.meta.env.VITE_WHATSAPP_PHONE || "+447943770119", message);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send on WhatsApp
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <AnimatedSection delay={0}>
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 text-center">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Scale className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">NO WIN NO FEE CLAIM HELP</h3>
                    <p className="text-muted-foreground">
                      We work on a 'No Win No Fee' basis, meaning you only pay us if we successfully recover compensation for your claim.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 text-center">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileCheck className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">DEDICATED CLAIM HANDLER</h3>
                    <p className="text-muted-foreground">
                      You will be assigned a dedicated claim handler who will guide you through every step of the process.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 text-center">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">15+ YEARS EXPERIENCE</h3>
                    <p className="text-muted-foreground">
                      Our team has over 15 years of experience in handling accident claims, ensuring expert and reliable service.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Most Trusted Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <AnimatedSection>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold">MOST TRUSTED ACCIDENT CLAIMS MANAGEMENT COMPANY</h2>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Expert legal advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Dedicated agents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">24/7 Assistance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Fast settlements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Transparent process</span>
                  </li>
                </ul>
                <Link to="/contact">
                  <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-14 px-8 border-none">
                    Read More
                  </Button>
                </Link>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg">
                    At Premium Vehicle Replacement, we are committed to providing the highest quality accident claims management services. Our experienced team understands the stress and confusion that can follow an accident, and we're here to make the process as smooth and straightforward as possible.
                  </p>
                  <p className="text-lg">
                    We work tirelessly to ensure you receive the maximum compensation you're entitled to, handling all negotiations with insurance companies and third parties on your behalf. Our transparent approach means you'll always know exactly where your claim stands.
                  </p>
                  <p className="text-lg">
                    With nationwide coverage and a proven track record of successful claims, we're the trusted choice for thousands of accident victims across the UK.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Your All-Time Claim Handler Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
              <AnimatedSection>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold">YOUR ALL-TIME CLAIM HANDLER</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg">
                    When you choose our accident claims management service, you're not just getting a company - you're getting a dedicated claim handler who will be with you every step of the way.
                  </p>
                  <p className="text-lg">
                    Your dedicated handler will take the time to understand your unique situation, answer all your questions, and provide personalized support throughout the entire claims process. They'll handle all the complex paperwork, negotiations, and communications, so you can focus on what matters most - your recovery.
                  </p>
                  <p className="text-lg">
                    This personalized approach ensures that nothing falls through the cracks and that you always have someone to turn to when you need answers or reassurance. Your claim handler becomes your advocate, working tirelessly to secure the best possible outcome for your case.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="relative">
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl">
                    <img
                      src="/pexels-mikhail-nilov-7736045.jpg"
                      alt="Dedicated Claim Handler"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Meet Standards Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
              <AnimatedSection>
                <div className="relative">
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl">
                    <img
                      src="/pexels-jakubzerdzicki-34862508.jpg"
                      alt="Meet Standards"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold">MEET STANDARDS TO FULFIL YOUR CLAIM</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg">
                    We maintain the highest standards in accident claims management, ensuring that every aspect of your claim is handled with professionalism, efficiency, and care.
                  </p>
                  <p className="text-lg">
                    Our team is fully trained and certified in claims management, staying up-to-date with the latest regulations and best practices. We follow strict quality control processes to ensure accuracy and compliance at every stage.
                  </p>
                  <p className="text-lg">
                    We're committed to transparency, keeping you informed throughout the process and ensuring you understand every step. Our goal is not just to process your claim, but to exceed your expectations and provide you with peace of mind.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Streamline Your Claim Section */}


        {/* Seamless Process Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center text-gold">OUR SEAMLESS ACCIDENT CLAIM PROCESS</h2>
                <p className="text-lg text-muted-foreground mb-12 text-center">
                  Our streamlined process is designed to make claiming as simple and stress-free as possible. Here's how we handle your claim from start to finish.
                </p>
                <div className="space-y-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-black">1</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gold">Contact Us</h3>
                      <p className="text-muted-foreground">
                        When you contact us, our team will gather all necessary information about your accident. We'll assess your case, explain your options, and determine the best course of action. This initial consultation is completely free and without obligation.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-black">2</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gold">Claim Management</h3>
                      <p className="text-muted-foreground">
                        Once you decide to proceed, we'll assign you a dedicated claim handler who will manage every aspect of your claim. They'll collect evidence, communicate with insurance companies, handle all paperwork, and negotiate on your behalf to secure the maximum compensation.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-black">3</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gold">Settlement</h3>
                      <p className="text-muted-foreground">
                        Once negotiations are complete and an agreement is reached, we'll finalize all documentation and ensure you receive your compensation promptly. We'll keep you informed throughout and handle any final details to ensure a smooth conclusion to your claim.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Immediate Response Banner */}
        <section className="relative py-24 lg:py-32 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/pexels-mikebirdy-5351111.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="text-3xl lg:text-5xl font-bold mb-8">
                IMMEDIATE RESPONSE TO YOUR CLAIM THROUGH A DEDICATED HANDLER
              </h2>
              <Link to="/make-claim">
                <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-14 px-8 border-none">
                  Get a Quote
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* What Do We Cover Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-gold">WHAT DO WE COVER IN ACCIDENT MANAGEMENT SERVICE?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                <Card className="hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-bold mb-3">REPLACEMENT VEHICLE</h3>
                    <p className="text-sm text-muted-foreground">
                      If you are a non-fault driver, we will make sure you get a replacement vehicle to keep you on the road while your vehicle is being repaired or replaced.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-bold mb-3">VEHICLE RECOVERY</h3>
                    <p className="text-sm text-muted-foreground">
                      We will arrange the recovery of your vehicle from the accident scene to a safe storage location or repair shop.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Warehouse className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-bold mb-3">VEHICLE STORAGE</h3>
                    <p className="text-sm text-muted-foreground">
                      If your vehicle is not safe to drive after an accident, we can arrange secure storage until repairs are completed or a settlement is reached.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wrench className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-bold mb-3">VEHICLE REPAIR</h3>
                    <p className="text-sm text-muted-foreground">
                      We work with a network of approved repair shops to ensure your vehicle is repaired to the highest standards.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-bold mb-3">PERSONAL INJURY</h3>
                    <p className="text-sm text-muted-foreground">
                      If you have sustained injuries in an accident, we can connect you with legal experts to help you claim compensation.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-gold dark:text-gold">FREQUENTLY ASKED QUESTIONS</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />


    </div>
  );
};

export default AccidentClaimManagement;

