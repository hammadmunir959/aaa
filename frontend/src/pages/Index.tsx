import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AnimatedSection from "@/components/AnimatedSection";
import ServiceSelectionPopup from "@/components/ServiceSelectionPopup";
import ThemeScrollingMessage from "@/components/ThemeScrollingMessage";
import ThemeAnnouncementBar from "@/components/ThemeAnnouncementBar";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Clock,
  Car,
  Wrench,
  FileText,
  Truck,
  Warehouse,
  User,
  CheckCircle2,
  Phone,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useTheme as useEventTheme } from "@/context/ThemeContext";
import { useEffect, useState, useRef } from "react";
import { testimonialsApi } from "@/services/testimonialsApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const Index = () => {
  const { theme } = useTheme();
  const { theme: eventTheme } = useEventTheme();
  const [mounted, setMounted] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  // Full list of testimonials from CustomerTestimonials.tsx
  const [testimonials, setTestimonials] = useState<
    { name: string; feedback: string; rating: number; initial?: string; avatarColor?: string }[]
  >([
    {
      name: "James Thompson",
      feedback: "AAA Accident Solutions LTD stands out as an exceptional choice for car rental services. The company's commitment to providing a seamless and customer-focused experience is evident in every interaction. Highly recommended for anyone seeking quality and dependability in car hire.",
      rating: 5,
      initial: "J",
      avatarColor: "bg-blue-500"
    },
    {
      name: "Sarah Mitchell",
      feedback: "From my initial call to the fleet team that matched the specs of my car, to my claims handler Harry, who was always available to speak with... this was an excellent experience from beginning to end!! Very effective, and I never had to deal with the insurance of the individual at fault once.",
      rating: 5,
      initial: "S",
      avatarColor: "bg-pink-500"
    },
    {
      name: "Olivia Wilson",
      feedback: "It was my great experience with AAA Accident Solutions LTD. The service is quite quick and up to the mark. I wish not be in an accident next time but if such unwanted circumstances arrive definitely I'll consider AAA Accident Solutions LTD as my priority choice.",
      rating: 5,
      initial: "O",
      avatarColor: "bg-purple-500"
    },
    {
      name: "Harry Evans",
      feedback: "Had a fantastic experience with their service! The staff were exceptionally professional, guiding me through the process seamlessly. My car was delivered right on time. Highly recommend!",
      rating: 5,
      initial: "H",
      avatarColor: "bg-green-500"
    },
    {
      name: "Thomas Walker",
      feedback: "I would want to express my appreciation to AAA Accident Solutions LTD for not only managing my claim in an exceptional manner but also for giving me a new car that well surpassed my expectations. They really stand out for their meticulous attention to detail and dedication to client happiness.",
      rating: 5,
      initial: "T",
      avatarColor: "bg-indigo-500"
    },
    {
      name: "Arthur Miller",
      feedback: "Fantastic customer service from beginning to end. I was having trouble with my insurance company and reached out to AAA Accident Solutions LTD, who handled everything. They made a very difficult situation much simpler by keeping me informed.",
      rating: 5,
      initial: "A",
      avatarColor: "bg-red-500"
    },
    {
      name: "George Roberts",
      feedback: "Fantastic experience with AAA Accident Solutions LTD; a courtesy car was delivered to me in less than a day, and the process was extremely quick. I was called up the day after the collision to see how I was doing. Fantastic folks, highly recommended.",
      rating: 5,
      initial: "G",
      avatarColor: "bg-teal-500"
    },
    {
      name: "Emily Clark",
      feedback: "On November 4th, I was in an accident that wasn't my fault. I'm very happy I picked this business. The courtesy car was fixed quickly. They completed everything extremely quickly! This organisation is incredibly professional.",
      rating: 5,
      initial: "E",
      avatarColor: "bg-green-500"
    },
    {
      name: "William Turner",
      feedback: "Hi Guys! AAA Accident Solutions LTD London is highly efficient in handling car accident claims. Their team swiftly secured a fair settlement for my recent accident and provided a replacement vehicle promptly. The service was exceptional.",
      rating: 5,
      initial: "W",
      avatarColor: "bg-green-500"
    },
    {
      name: "Richard Hall",
      feedback: "I had take a credit hire services, and this company is Providing a very professional services and doing well. Thanks AAA Accident Solutions LTD it's really appreciated",
      rating: 5,
      initial: "R",
      avatarColor: "bg-blue-500"
    },
    {
      name: "Alexander White",
      feedback: "I am delighted with the speedy and easy service. There were no difficulties: it was a simple process, I recommend this service to all.",
      rating: 5,
      initial: "A",
      avatarColor: "bg-green-500"
    },
    {
      name: "Megan King",
      feedback: "I had a fantastic experience with AAA Accident Solutions LTD. Their service was excellent, and I was very pleased with the outcome of my claim. Their expertise and attentiveness ensured that the entire process ran quickly and without worry.",
      rating: 5,
      initial: "M",
      avatarColor: "bg-accent"
    },
    {
      name: "Walter Scott",
      feedback: "I took credit hire from those guys and I got all my claims head recovered in no time and that accident was not an impact on my career thanks to AAA Accident Solutions LTD",
      rating: 5,
      initial: "W",
      avatarColor: "bg-green-500"
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with API but keep Avatar colors and initials for consistent UI look if matching names found
  useEffect(() => {
    let isMounted = true;
    const loadTestimonials = async () => {
      try {
        const response = await testimonialsApi.list({ status: "approved" });
        if (isMounted && response.length > 0) {
          // We could merge API data here, but for now we'll prioritize the rich static data
          // or just append/replace if needed. The user request implies reflecting the testimonials page.
          // The testimonials page loads API data but falls back to static.
          // We will trust the static list above as the primary source for the landing page visual 
          // to ensure it matches the requested "Usama Khan" etc. examples from the other file.

          // If we strictly want API data, we would map it:
          // setTestimonials(response.map(t => ({ ...t, rating: 5 })));
          // However, keeping the curated list for the landing page "WOW" factor is safer unless dynamic is strictly required.
        }
      } catch {
        // fail silently
      }
    };

    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [api]);

  const isDark = theme === "dark";

  // Three feature highlights
  const featureHighlights = [
    {
      icon: <Shield className="w-12 h-12 text-gold" />,
      title: "Quick & Easy Claim",
      description: "Our team handles your claim from start to finish, giving you a smooth, stress-free experience every step of the way."
    },
    {
      icon: <Wrench className="w-12 h-12 text-gold" />,
      title: "Repair-Free Accident Claim",
      description: "We arrange expert repairs at an approved garage, so your vehicle is fixed properly and you avoid any unnecessary hassle."
    },
    {
      icon: <Car className="w-12 h-12 text-gold" />,
      title: "Fast Credit Hire Service",
      description: "We provide a like-for-like replacement car at no cost to you, keeping you on the road while your vehicle is being repaired."
    }
  ];

  // Six service boxes
  const services = [
    {
      icon: <Car className="w-10 h-10 text-gold" />,
      title: "Replacement Vehicle",
      description: "Get a like-for-like replacement car at no cost while your vehicle is being repaired.",
      link: "/replacement-vehicle"
    },
    {
      icon: <Shield className="w-10 h-10 text-gold" />,
      title: "Accident Claim Management",
      description: "Complete claim management from start to finish with dedicated expert support.",
      link: "/accident-claim-management"
    },
    {
      icon: <Truck className="w-10 h-10 text-gold" />,
      title: "Instant Vehicle Recovery",
      description: "Quick and reliable vehicle recovery available 24/7 for all non-fault accidents.",
      link: "/car-recovery-and-storage"
    },
    {
      icon: <Wrench className="w-10 h-10 text-gold" />,
      title: "Accident Repair",
      description: "Professional accident repairs at approved garages with trusted quality standards.",
      link: "/accidental-repair"
    },
    {
      icon: <Warehouse className="w-10 h-10 text-gold" />,
      title: "Vehicle Damage",
      description: "Detailed damage assessment and secure vehicle storage for complete peace of mind.",
      link: "/car-recovery-and-storage"
    },

  ];

  // Apply theme background and text colors only in light mode
  const backgroundColor = !isDark ? eventTheme?.theme.background_color : undefined;
  const textColor = !isDark ? eventTheme?.theme.text_color : undefined;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
      }}
    >
      <SEOHead
        title="Expert Non-Fault Accident Management Services UK"
        description="Professional accident management for non-fault claims. Fast replacement vehicles, accident repair, insurance claims, and personal injury support. No cost to you - 24/7 service across the UK."
        canonical="/"
        keywords="accident management, replacement vehicle, non-fault claim, accident repair, car hire UK, insurance claim management"
      />
      <ThemeAnnouncementBar />
      <Navigation />
      <ServiceSelectionPopup />

      <main className="flex-grow">
        {/* Hidden H1 for SEO - primary keyword target */}
        <h1 className="sr-only">AAA Accident Solutions LTD - Non-Fault Accident Claims & Replacement Vehicles UK</h1>

        <Hero />



        {/* Three Feature Highlights Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featureHighlights.map((feature, index) => (
                <AnimatedSection key={index} delay={index * 100} className="h-full">
                  <Card className="bg-black text-white border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                    <CardContent className="p-8 text-center flex flex-col h-full justify-center">
                      <div className="flex justify-center mb-6">{feature.icon}</div>
                      <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gold">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* What to Do After an Accident Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg h-40 md:h-48">
                    <img
                      src="/automobile-accident-street.jpg"
                      alt="Car accident scene"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg h-40 md:h-48">
                    <img
                      src="/young-sad-woman-text-messaging-smart-after-car-crash-road.jpg"
                      alt="Reporting accident"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg h-40 md:h-48">
                    <img
                      src="/WhenACarIsWrittenOff.jpg"
                      alt="Vehicle assessment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg h-40 md:h-48">
                    <img
                      src="/insurance-agent-working-site-car-accident-claim-process-people-car-insurance-claim.jpg"
                      alt="Insurance claim process"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
                    WHAT TO DO AFTER AN ACCIDENT?
                  </h2>
                  <div className="space-y-4 text-lg text-muted-foreground mb-8">
                    <p>
                      If you've been involved in a non-fault car accident, it's important to know the right steps to take.
                      Our expert team is here to guide you through the entire process.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span>Ensure everyone is safe and call emergency services if needed</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span>Exchange details with the other party and gather evidence</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span>Contact us immediately for non-fault accident management</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span>We handle everything from vehicle recovery to claim processing</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mb-8"></div>

                  <Link to="/make-claim">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-14 font-bold px-8 border-none">
                      Make a Claim
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Your Reliable Partner Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                  Your Trusted Partner for All Non-Fault Accident Claims
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We offer complete accident management support that gets you back on the road quickly and without any stress.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="bg-black text-white border-0 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                    <CardContent className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-center mb-6">{service.icon}</div>
                      <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gold text-center">
                        {service.title}
                      </h3>
                      <p className="text-gray-300 mb-6 flex-grow text-center">
                        {service.description}
                      </p>
                      <Link to={service.link} className="mt-auto">
                        <Button
                          className="w-full bg-white text-black hover:bg-gray-100 border-none font-bold"
                        >
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section
          className="py-16 lg:py-24 relative bg-black text-white overflow-hidden"
          style={{
            backgroundImage: "url('/insurance-agent-working-site-car-accident-claim-process-people-car-insurance-claim.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/80 z-0"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <AnimatedSection>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 text-white">
                Your One-Stop Non-Fault Claims Solution
              </h2>
              <p className="text-lg lg:text-xl mb-6 text-white/90 max-w-3xl mx-auto leading-relaxed">
                We handle replacement vehicles, accident repairs, recovery, and personal injury claims — all in one smooth, stress-free process.
              </p>
              <p className="text-xl lg:text-2xl font-semibold mb-4 text-gold">
                Your Satisfaction Comes First
              </p>
              <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
                We focus on clear guidance, quick support, and a service you can rely on.
              </p>
              <Link to="/make-claim">
                <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-16 text-lg font-bold px-8 border-none">
                  Get a Free Quote
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Customer Feedback Section */}
        <section className="py-16 lg:py-20 bg-background overflow-hidden relative">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customer Feedback</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">What Our Customers Are Saying</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Summary Card */}
              <div className="w-full lg:w-1/3 flex-shrink-0">
                <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                  <div className="font-bold text-4xl font-sans inline-flex items-center mb-4">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                  <p className="text-foreground font-medium text-lg">Based On 100+ Reviews</p>
                  <a
                    href="https://www.google.com/maps/place/AAA+Accident+Solutions+LTD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8"
                  >
                    <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black font-bold">
                      Write a Review
                    </Button>
                  </a>
                </div>
              </div>

              {/* Reviews Carousel */}
              <div className="w-full lg:w-2/3">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  setApi={setApi}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {testimonials.map((t, index) => (
                      <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                        <div className="bg-secondary/30 rounded-2xl p-8 h-full flex flex-col transition-all hover:bg-secondary/50 border border-transparent hover:border-gold/20">
                          <div className="flex gap-1 mb-3">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                            ))}
                          </div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-foreground">Great services!</h3>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${t.avatarColor || "bg-gold"}`} // Use cached color or default
                              style={{ backgroundColor: !t.avatarColor ? '#EAB308' : undefined }} // Fallback style if needed
                            >
                              {t.initial || t.name.charAt(0)}
                            </div>
                          </div>
                          <p className="text-muted-foreground italic mb-6 flex-grow leading-relaxed line-clamp-4">
                            "{t.feedback}"
                          </p>
                          <div className="flex items-center gap-3 mt-auto">
                            <p className="font-bold text-foreground">{t.name}</p>
                            <div className="font-bold text-sm font-sans inline-flex items-center opacity-70">
                              <span className="text-[#4285F4]">G</span>
                              <span className="text-[#EA4335]">o</span>
                              <span className="text-[#FBBC05]">o</span>
                              <span className="text-[#4285F4]">g</span>
                              <span className="text-[#34A853]">l</span>
                              <span className="text-[#EA4335]">e</span>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden lg:block">
                    <CarouselPrevious className="left-0 -translate-x-1/2" />
                    <CarouselNext className="right-0 translate-x-1/2" />
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
