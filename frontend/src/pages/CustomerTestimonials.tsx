import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import WriteReviewModal from "@/components/WriteReviewModal";
import { testimonialsApi, type Testimonial as ApiTestimonial } from "@/services/testimonialsApi";

interface Testimonial {
  name: string;
  text: string;
  avatar?: string;
  initial?: string;
  avatarColor?: string;
}

const CustomerTestimonials = () => {
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [realTestimonials, setRealTestimonials] = useState<ApiTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const testimonials = await testimonialsApi.list();
        setRealTestimonials(testimonials);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Unable to load testimonials right now.");
        setRealTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Refresh testimonials after a new one is submitted
  const handleTestimonialSubmitted = async () => {
    try {
      const testimonials = await testimonialsApi.list();
      setRealTestimonials(testimonials);
    } catch (err) {
      console.error("Error refreshing testimonials:", err);
    }
  };


  const STATIC_TESTIMONIALS: Testimonial[] = [
    {
      name: "James Thompson",
      text: "AAA Accident Solutions LTD stands out as an exceptional choice for car rental services. The company's commitment to providing a seamless and customer-focused experience is evident in every interaction. Their fleet of well-maintained vehicles offers a wide range of options to suit any need, from compact cars to luxury models.",
      avatar: undefined,
      initial: "J",
      avatarColor: "bg-blue-500",
    },
    {
      name: "Sarah Mitchell",
      text: "From my initial call to the fleet team that matched the specs of my car (a BMW 3 series GT), which arrived within hours, to my claims handler Harry, who was always available to speak with by phone, email, or pigeon, this was an excellent experience from beginning to end!!",
      avatar: undefined,
      initial: "S",
      avatarColor: "bg-pink-500",
    },
    {
      name: "Olivia Wilson",
      text: "It was my great experience with AAA Accident Solutions LTD. The service is quite quick and up to the mark. I wish not be in an accident next time but if such unwanted circumstances arrive definitely I'll consider AAA Accident Solutions LTD as my priority choice.",
      avatar: undefined,
      initial: "O",
      avatarColor: "bg-purple-500",
    },
    {
      name: "Charlotte Davies",
      text: "I had an excellent encounter with AAA Accident Solutions LTD. I would unquestionably advise anyone who has been in an accident to use their services. I received a courtesy car in a few days and received updates on the claim on a frequent basis.",
      avatar: undefined,
      initial: "C",
      avatarColor: "bg-pink-500",
    },
    {
      name: "Harry Evans",
      text: "Had a fantastic experience with their service! The staff were exceptionally professional, guiding me through the process seamlessly. My car was delivered right on time. Highly recommend!",
      avatar: undefined,
      initial: "H",
      avatarColor: "bg-green-500",
    },
    {
      name: "Thomas Walker",
      text: "I would want to express my appreciation to AAA Accident Solutions LTD for not only managing my claim in an exceptional manner but also for giving me a new car that well surpassed my expectations. They really stand out for their meticulous attention to detail.",
      avatar: undefined,
      initial: "T",
      avatarColor: "bg-indigo-500",
    },
    {
      name: "Arthur Miller",
      text: "Fantastic customer service from beginning to end. I was having trouble with my insurance company and reached out to Continentalcarhire.co.uk, who handled everything. I can't say enough good things about them; they made a very difficult situation much simpler.",
      avatar: undefined,
      initial: "A",
      avatarColor: "bg-red-500",
    },
    {
      name: "George Roberts",
      text: "Fantastic experience with AAA Accident Solutions LTD; a courtesy car was delivered to me in less than a day, and the process was extremely quick. I was called up the day after the collision to see how I was doing. Fantastic folks.",
      avatar: undefined,
      initial: "G",
      avatarColor: "bg-teal-500",
    },
    {
      name: "Emily Clark",
      text: "On November 4th, I was in an accident that wasn't my fault. I'm very happy I picked this business. The courtesy car was fixed quickly. They completed everything extremely quickly! This organisation is incredibly professional.",
      avatar: undefined,
      initial: "E",
      avatarColor: "bg-green-500",
    },
    {
      name: "William Turner",
      text: "Hi Guys! AAA Accident Solutions LTD London is highly efficient in handling car accident claims. Their team swiftly secured a fair settlement for my recent accident and provided a replacement vehicle promptly. The service was exceptional.",
      avatar: undefined,
      initial: "W",
      avatarColor: "bg-green-500",
    },
  ];

  /* Combine real (API) and static testimonials for display */
  /* API testimonials need to be mapped to match local Testimonial interface if they differ significantly, */
  /* but here we iterate over them separately in the original code. Let's unify them. */

  const displayTestimonials: (Testimonial & { id?: number, rating?: number })[] = [
    ...STATIC_TESTIMONIALS.map((t, i) => ({ ...t, id: -1 * (i + 1), rating: 5 })),
    ...realTestimonials.map(t => ({
      name: t.name,
      text: t.feedback || "",
      rating: t.rating,
      id: t.id,
      initial: t.name.charAt(0).toUpperCase(),
      avatarColor: "bg-blue-500", // Default color for API items
      avatar: undefined // API doesn't seem to return avatar URL in the simplified view
    }))
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
              backgroundImage: "url('/odinei-ramone-UUGaMVsD63A-unsplash.jpg')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                  Testimonial
                </h1>
                <p className="text-xl lg:text-2xl mb-8 opacity-90">
                  Your satisfaction drives us. Share your experience today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gold text-black hover:bg-gold/90 h-14 px-8 font-bold border-none"
                    onClick={() => setIsWriteReviewModalOpen(true)}
                  >
                    WRITE A REVIEW
                  </Button>
                  <Link to="/contact">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-14 px-8 font-bold border-none">
                      CONTACT US
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
          {/* Floating stars effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className="absolute text-gold opacity-20 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
                size={20 + Math.random() * 30}
              />
            ))}
          </div>
        </section>

        {/* Testimonials Grid Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-7xl mx-auto">
                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading testimonials...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                ) : (

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {displayTestimonials.map((testimonial, index) => (
                      <Card key={testimonial.id || index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              {testimonial.avatar ? (
                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                              ) : (
                                <AvatarFallback className={`${testimonial.avatarColor || 'bg-blue-500'} text-white font-semibold`}>
                                  {testimonial.initial || testimonial.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < (testimonial.rating || 5)
                                        ? "fill-yellow-500 text-gold"
                                        : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {testimonial.text}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                )}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Write a Review Button Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gold text-black hover:bg-gold/90 h-14 px-8 border-none font-bold"
                onClick={() => setIsWriteReviewModalOpen(true)}
              >
                WRITE A REVIEW
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-gold" />
                <span className="text-xl lg:text-2xl font-semibold">
                  +44 (208) 743 7469
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/make-claim">
                  <Button
                    size="lg"
                    className="bg-gold text-black hover:bg-gold/90 h-14 px-8 border-none font-bold"
                  >
                    START YOUR CLAIM
                  </Button>
                </Link>
                <a href="tel:+442087437469">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 h-14 px-8 border-none font-bold"
                  >
                    CALL NOW
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <WriteReviewModal
        open={isWriteReviewModalOpen}
        onOpenChange={setIsWriteReviewModalOpen}
        onSuccess={handleTestimonialSubmitted}
      />
    </div>
  );
};

export default CustomerTestimonials;

