import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  DollarSign,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  Clock,
  TrendingUp,
  Users,
  FileCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import SellCarModal from "@/components/SellCarModal";

const CarSaleBuy = () => {
  const [isSellCarModalOpen, setIsSellCarModalOpen] = useState(false);
  const benefits = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Wide Selection",
      description: "Browse through our extensive inventory of quality vehicles, from economy to luxury models."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Vehicles",
      description: "All vehicles undergo thorough inspection and verification to ensure quality and reliability."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Competitive Pricing",
      description: "Get the best deals with transparent pricing and flexible payment options."
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Easy Process",
      description: "Streamlined buying and selling process with professional support every step of the way."
    }
  ];

  const sellingSteps = [
    {
      step: "1",
      title: "Submit Your Vehicle",
      description: "Fill out our simple form with your vehicle details and photos."
    },
    {
      step: "2",
      title: "Get Valuation",
      description: "Our experts will assess your vehicle and provide a fair market valuation."
    },
    {
      step: "3",
      title: "Accept Offer",
      description: "Review our offer and accept if you're satisfied with the price."
    },
    {
      step: "4",
      title: "Complete Sale",
      description: "We handle all paperwork and transfer, making the process hassle-free."
    }
  ];

  const buyingSteps = [
    {
      step: "1",
      title: "Browse Inventory",
      description: "Explore our wide range of quality vehicles with detailed specifications."
    },
    {
      step: "2",
      title: "Schedule Viewing",
      description: "Book a convenient time to view and test drive your chosen vehicle."
    },
    {
      step: "3",
      title: "Finance Options",
      description: "Choose from our flexible financing options or pay upfront."
    },
    {
      step: "4",
      title: "Drive Away",
      description: "Complete the purchase and drive away in your new vehicle."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/pexels-gustavo-fring-4895413.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                  Buy & Sell Cars with Confidence
                </h1>
                <p className="text-xl lg:text-2xl mb-8 opacity-95">
                  Your trusted partner for buying quality vehicles or selling your car at the best price.
                  Professional service, transparent pricing, and hassle-free transactions.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/car-sales">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-14 font-bold px-8 border-none text-base">
                      Browse Cars for Sale
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 border-none h-14 font-bold px-8 text-base"
                    onClick={() => setIsSellCarModalOpen(true)}
                  >
                    Sell Your Car
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
                Why Choose Us for Car Buying & Selling?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {benefits.map((benefit, index) => (
                  <AnimatedSection key={index} delay={index * 100}>
                    <Card className="hover:shadow-xl transition-shadow h-full">
                      <CardContent className="pt-8 text-center">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold">
                          {benefit.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Selling Your Car Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <AnimatedSection>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                    Selling Your Car? We Make It Easy
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Get the best price for your vehicle with our professional selling service. We handle
                    everything from valuation to paperwork, making the process quick and stress-free.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">Free vehicle valuation and inspection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">Competitive market prices</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">Fast payment and transfer process</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">Professional documentation handling</span>
                    </li>
                  </ul>
                  <Button
                    size="lg"
                    className="bg-gold text-black hover:bg-gold/90 h-14 font-bold px-8 border-none"
                    onClick={() => setIsSellCarModalOpen(true)}
                  >
                    Get Your Car Valued
                  </Button>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">How It Works</h3>
                  {sellingSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-black">{step.step}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Buying a Car Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <AnimatedSection>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">Buying Process</h3>
                  {buyingSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-black">{step.step}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                    Find Your Perfect Car
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Browse our extensive inventory of quality vehicles. From economy cars to luxury models,
                    we have something for everyone. All vehicles are thoroughly inspected and come with
                    detailed history reports.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">Comprehensive vehicle history checks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">Flexible financing options available</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">Test drive before you buy</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">Warranty options available</span>
                    </li>
                  </ul>
                  <Link to="/car-sales">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-14 font-bold px-8 border-none">
                      View Our Inventory
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
                  What We Offer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardContent className="pt-8 text-center">
                      <TrendingUp className="w-12 h-12 text-gold mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-3">Best Market Prices</h3>
                      <p className="text-muted-foreground">
                        We ensure you get competitive prices whether you're buying or selling.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardContent className="pt-8 text-center">
                      <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-3">Quick Transactions</h3>
                      <p className="text-muted-foreground">
                        Fast and efficient process from start to finish, saving you time.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardContent className="pt-8 text-center">
                      <Users className="w-12 h-12 text-gold mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                      <p className="text-muted-foreground">
                        Our experienced team is here to help you every step of the way.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-16 lg:py-24 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/pexels-negativespace-97079.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Ready to Buy or Sell?
                </h2>
                <p className="text-lg mb-8 opacity-95">
                  Get started today with our professional car buying and selling service.
                  Contact us for a free consultation or browse our current inventory.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/car-sales">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-14 font-bold px-8 border-none">
                      Browse Cars
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-14 px-8 border-none">
                      Contact Us
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>+44 (20) 743 7407</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>info@aaa-as.co.uk</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />

      <SellCarModal
        open={isSellCarModalOpen}
        onOpenChange={setIsSellCarModalOpen}
      />
    </div>
  );
};

export default CarSaleBuy;

