import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Car, CheckCircle2, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ReplacementVehicle = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Free Replacement Vehicle for Non-Fault Accidents UK"
        description="Get a free like-for-like replacement car after a non-fault accident. No upfront costs, fast delivery, and hassle-free credit hire service across the UK."
        canonical="/replacement-vehicle"
        keywords="replacement vehicle, credit hire, non-fault accident, free replacement car, accident car hire UK"
      />
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/Replacement-vehicle.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gold">REPLACEMENT VEHICLE</h1>
                <p className="text-lg opacity-90">Services / Replacement Vehicle</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Intro Section */}
        <section className="relative bg-gradient-to-r from-background via-background to-[accent]/20 py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Image */}
              <AnimatedSection>
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-2xl relative z-10">
                    <img
                      src="/pexels-tdcat-70912.jpg"
                      alt="Premium replacement vehicle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>

              {/* Right Side - Content */}
              <AnimatedSection delay={200}>
                <div className="relative text-black dark:text-white">
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                    <span className="text-gold">ARE YOU A NON-FAULT DRIVER?</span> GET A REPLACEMENT CAR TO STAY ON THE ROADS!
                  </h1>
                  <p className="text-lg lg:text-xl mb-8 opacity-95 leading-relaxed">
                    At Premium Vehicle Replacement, we ensure you're never without a car. Our complimentary Replacement Car Hire service allows you to continue your daily routine, work, and leisure activities without interruption.
                  </p>
                  <Link to="/make-claim">
                    <Button
                      size="lg"
                      className="bg-gold text-black hover:bg-gold/90 text-base font-medium px-8 h-14 rounded-md border-none"
                    >
                      GET A REPLACEMENT CAR
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* We Don't Leave You Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <AnimatedSection>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold dark:text-gold">
                    WE DON'T LEAVE YOU UNTIL YOU GET A VEHICLE REPLACEMENT
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    If you've been involved in a non-fault road traffic accident, you're entitled to a replacement vehicle while your car is being repaired. At Premium Vehicle Replacement, we specialize in providing non-fault drivers with quality replacement vehicles through our Credit Hire Agreement service.
                  </p>

                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Our service is designed to be completely hassle-free. There are no upfront costs for you - we handle everything through a Credit Hire Agreement, working directly with the at-fault party's insurance company to recover costs. You simply get a quality replacement vehicle and continue with your life.
                  </p>
                  <Link to="/make-claim">
                    <Link to="/make-claim">
                      <Button size="lg" className="bg-gold text-black hover:bg-gold/90 border-none h-14 px-8 text-base">
                        Get Started Today
                      </Button>
                    </Link>
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                    <img
                      src="/pexels-mikebirdy-116675.jpg"
                      alt="Luxury replacement vehicles"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Peace of Mind Section */}
        <section className="py-16 lg:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <AnimatedSection>
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                    <img
                      src="/pexels-mikebirdy-136872.jpg"
                      alt="Peace of Mind"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="lg:pl-8">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold dark:text-gold">
                    HAVE PEACE OF MIND WITH OUR RELIABLE COMPARABLE VEHICLE
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    When you choose Premium Vehicle Replacement, you're choosing quality and reliability. All our replacement vehicles are well-maintained, regularly serviced, and comparable to your original vehicle in terms of size, type, and features.
                  </p>

                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Our Credit Hire Agreement means you don't pay anything upfront. We work directly with the at-fault party's insurance company to recover all costs, so you can focus on getting back to your normal routine.
                  </p>
                  <Link to="/contact">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 border-none h-14 px-8 text-base">
                      CALL US NOW
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Need a Reliable Ride Section */}
        <section className="py-16 lg:py-24 bg-black text-white relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <AnimatedSection>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
                    <span className="text-gold">NEED A RELIABLE RIDE AFTER AN ACCIDENT?</span> CHOOSE OUR COMPARABLE VEHICLE
                  </h2>
                  <p className="text-lg mb-4 text-gray-200 leading-relaxed">
                    After a non-fault accident, getting back on the road quickly is essential. Our replacement vehicle service ensures you don't have to put your life on hold while waiting for your car to be repaired.
                  </p>
                  <p className="text-lg mb-6 text-gray-200 leading-relaxed">
                    We provide you with a comparable replacement vehicle that matches your original car's specifications. Our team handles all the paperwork, insurance communications, and claim management, so you can simply get in and drive.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/make-claim">
                      <Button size="lg" className="bg-white text-black hover:bg-gray-100 border-none h-14 px-8 text-base">
                        Get a Quote
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button size="lg" className="bg-gold text-black hover:bg-gold/90 border-none h-14 px-8 text-base">
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                  <div className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden shadow-xl relative z-10">
                    <img
                      src="/pexels-mikebirdy-452099.jpg"
                      alt="Reliable Ride"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <AnimatedSection>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose <span className="text-gold">Premium Vehicle Replacement?</span></h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We make the process simple, stress-free, and completely transparent.
                </p>
              </AnimatedSection>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <AnimatedSection delay={0}>
                <Card className="hover:shadow-xl transition-shadow h-full">
                  <CardContent className="pt-8 text-center flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 text-gold mb-6" />
                    <h3 className="text-xl font-bold mb-3">No Upfront Costs</h3>
                    <p className="text-muted-foreground">
                      Our Credit Hire Agreement means you don't pay anything upfront. All costs are recovered from the at-fault party's insurance.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <Card className="hover:shadow-xl transition-shadow h-full">
                  <CardContent className="pt-8 text-center flex flex-col items-center">
                    <Car className="w-12 h-12 text-gold mb-6" />
                    <h3 className="text-xl font-bold mb-3">Comparable Vehicles</h3>
                    <p className="text-muted-foreground">
                      We provide replacement vehicles that match your original car in size, type, and features.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <Card className="hover:shadow-xl transition-shadow h-full">
                  <CardContent className="pt-8 text-center flex flex-col items-center">
                    <Phone className="w-12 h-12 text-gold mb-6" />
                    <h3 className="text-xl font-bold mb-3">Fast Service</h3>
                    <p className="text-muted-foreground">
                      We understand urgency. Our team works quickly to get you back on the road, often within hours of your call.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-16 lg:py-24 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/pexels-pixabay-533562.jpg')"
            }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <AnimatedSection>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
                Ready to Get Your Replacement Vehicle?
              </h2>
              <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto text-gray-200">
                Don't let a non-fault accident disrupt your life. Contact us today and get back on the road with a quality replacement vehicle.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/make-claim">
                  <Button size="lg" className="bg-gold text-black hover:bg-gold/90 text-base font-medium px-8 h-14 rounded-md border-none">
                    GET A REPLACEMENT CAR
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-base font-medium px-8 h-14 rounded-md border-none">
                    CONTACT US
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReplacementVehicle;

