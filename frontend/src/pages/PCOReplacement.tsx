import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Car,
  Scale,
  Truck,
  Wrench,
  DollarSign,
  Bone,
  Phone,
  CheckCircle2,
  User,
  Fuel,
  Gauge,
  Armchair
} from "lucide-react";
import { Link } from "react-router-dom";
import { type Vehicle } from "@/services/vehiclesApi";

const PCOReplacement = () => {
  const serviceIcons = [
    { icon: <Car className="w-8 h-8" />, label: "Replacement Vehicle" },
    { icon: <Scale className="w-8 h-8" />, label: "Legal/Claim Management" },
    { icon: <Truck className="w-8 h-8" />, label: "Car Recovery" },
    { icon: <Wrench className="w-8 h-8" />, label: "Accidental Repair" },
    { icon: <DollarSign className="w-8 h-8" />, label: "Loss of Earnings" },
    { icon: <Bone className="w-8 h-8" />, label: "Personal Injury Claim" },
  ];

  // Hardcoded fleet data
  const vehicles: Vehicle[] = [
    {
      id: 1,
      manufacturer: "Mercedes-Benz",
      model: "E 300 AMG Line NGT Ed Prem+",
      model_detail: "9G-Tronic Plus Start/Stop",
      color: "Grey",
      body_style: "Saloon",
      fuel_type: "petrol",
      engine_size: "1991 cc",
      euro_status: "6b",
      registered_year_date: "23 May 2018",
      image: "/generated_mercedes_e300_grey.png",
      daily_rate: "120.00",
      type: "sedan",
      seats: 5,
      registration: "MB-E300-01",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz E 300 AMG"
    },
    {
      id: 2,
      manufacturer: "Mercedes-Benz",
      model: "E 200 D SE",
      model_detail: "9G-Tronic Plus Start/Stop",
      color: "Black",
      body_style: "Saloon",
      fuel_type: "diesel",
      engine_size: "1950 cc",
      euro_status: "6bd",
      registered_year_date: "10 Mar 2017",
      image: "/generated_mercedes_e200.png",
      daily_rate: "110.00",
      type: "sedan",
      seats: 5,
      registration: "MB-E200-02",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz E 200 D SE"
    },
    {
      id: 3,
      manufacturer: "Audi",
      model: "A8 L 60 TFSI Quattro MHEV",
      model_detail: "Tiptronic Auto Start/Stop",
      color: "Black",
      body_style: "Limousine",
      fuel_type: "petrol",
      engine_size: "3996 cc",
      euro_status: "6bg",
      registered_year_date: "15 Jun 2020",
      image: "/generated_audi_a8_black.png",
      daily_rate: "200.00",
      type: "limousine",
      seats: 5,
      registration: "AU-A800-03",
      status: "available",
      transmission: "automatic",
      name: "Audi A8 L 60 TFSI"
    },
    {
      id: 4,
      manufacturer: "Mercedes-Benz",
      model: "C 200 AMG Line Premium +",
      model_detail: "9G-Tronic Plus Start/Stop",
      color: "Black",
      body_style: "Convertible",
      fuel_type: "petrol",
      engine_size: "1497 cc",
      euro_status: "6bg",
      registered_year_date: "12 Aug 2019",
      image: "/generated_mercedes_c200_convertible.png",
      daily_rate: "130.00",
      type: "convertible",
      seats: 4,
      registration: "MB-C200-04",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz C 200 AMG"
    },
    {
      id: 5,
      manufacturer: "Land Rover",
      model: "Discovery SE SDV6",
      model_detail: "Auto Start/Stop",
      color: "Black",
      body_style: "SUV",
      fuel_type: "diesel",
      engine_size: "2993 cc",
      euro_status: "6ag",
      registered_year_date: "14 Sep 2019",
      image: "/generated_land_rover_discovery_black.png",
      daily_rate: "150.00",
      type: "suv",
      seats: 7,
      registration: "LR-DISC-05",
      status: "available",
      transmission: "automatic",
      name: "Land Rover Discovery SE"
    },
    {
      id: 6,
      manufacturer: "Land Rover",
      model: "Range Rover Sport HSE",
      model_detail: "SDV6 306 CommandShift Auto Start/Stop",
      color: "Black",
      body_style: "SUV",
      fuel_type: "diesel",
      engine_size: "2993 cc",
      euro_status: "6ag",
      registered_year_date: "30 Sep 2019",
      image: "/generated_range_rover_sport_black.png",
      daily_rate: "180.00",
      type: "suv",
      seats: 5,
      registration: "LR-RRS-06",
      status: "available",
      transmission: "automatic",
      name: "Range Rover Sport"
    },
    {
      id: 7,
      manufacturer: "Volkswagen",
      model: "Tiguan Life TSI",
      model_detail: "DSG Auto Start/Stop",
      color: "Grey",
      body_style: "SUV",
      fuel_type: "petrol",
      engine_size: "1498 cc",
      euro_status: "6ap",
      registered_year_date: "01 Nov 2021",
      image: "/generated_vw_tiguan_grey.png",
      daily_rate: "90.00",
      type: "suv",
      seats: 5,
      registration: "VW-TIG-07",
      status: "available",
      transmission: "automatic",
      name: "Volkswagen Tiguan Life"
    },
    {
      id: 8,
      manufacturer: "Mercedes-Benz",
      model: "V 220 D Sport",
      model_detail: "9G-Tronic Plus Start/Stop",
      color: "Black",
      body_style: "MPV",
      fuel_type: "diesel",
      engine_size: "1950 cc",
      euro_status: "6ap",
      registered_year_date: "15 Dec 2020",
      image: "/generated_mercedes_vclass_black.png",
      daily_rate: "160.00",
      type: "mpv",
      seats: 7,
      registration: "MB-VCLS-08",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz V-Class"
    },
    {
      id: 9,
      manufacturer: "Mercedes-Benz",
      model: "S 350 D L AMG Line Exec",
      model_detail: "9G-Tronic Plus Start/Stop",
      color: "Silver",
      body_style: "Saloon",
      fuel_type: "diesel",
      engine_size: "2925 cc",
      euro_status: "6ag",
      registered_year_date: "20 Jan 2019",
      image: "/generated_mercedes_sclass_silver.png",
      daily_rate: "250.00",
      type: "sedan",
      seats: 5,
      registration: "MB-SCLS-09",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz S-Class"
    },
    {
      id: 10,
      manufacturer: "Kia",
      model: "Niro 2 HEV",
      model_detail: "S-A",
      color: "Grey",
      body_style: "Hatchback",
      fuel_type: "hybrid",
      engine_size: "1580 cc",
      euro_status: "6b",
      registered_year_date: "05 Feb 2018",
      image: "/generated_kia_niro_grey.png",
      daily_rate: "80.00",
      type: "suv",
      seats: 5,
      registration: "KIA-NIR-10",
      status: "available",
      transmission: "automatic",
      name: "Kia Niro"
    }
  ];

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Auto-play carousel
  useEffect(() => {
    if (!emblaApi) return;

    let animationFrame: number;
    const autoplay = () => {
      animationFrame = window.setTimeout(() => {
        emblaApi.scrollNext();
        autoplay();
      }, 4000);
    };

    autoplay();

    emblaApi.on("pointerDown", () => {
      window.clearTimeout(animationFrame);
    });

    emblaApi.on("pointerUp", () => {
      autoplay();
    });

    return () => {
      window.clearTimeout(animationFrame);
    };
  }, [emblaApi]);

  const faqItems = [
    {
      question: "How long can I keep the vehicle?",
      answer: "You can keep the replacement vehicle for as long as your taxi is being repaired or until your claim is settled. There's no time limit - we understand that repairs can take time, and we're here to support you throughout the entire process. The vehicle remains with you at no cost until your original vehicle is ready or your claim is resolved."
    },
    {
      question: "What kind of vehicle will I receive?",
      answer: "You'll receive a like-for-like replacement vehicle that matches your original taxi in terms of size, type, and specifications. We have an extensive fleet of PCO-approved vehicles including Audi A6, BMW 5 Series, BMW 3 Series, and more. Our team ensures you get a comparable vehicle that meets all PCO requirements."
    },
    {
      question: "Do I need to pay anything upfront?",
      answer: "No, there are no upfront costs for non-fault taxi accident claims. All costs, including the replacement vehicle, recovery, and storage, are recovered directly from the at-fault party's insurer. You don't pay any excess, and your insurance premium remains intact."
    },
    {
      question: "Can I claim for loss of earnings?",
      answer: "Yes, as a PCO driver, you can claim for loss of earnings while your taxi is being repaired. We'll help you document your lost earnings and include this in your claim against the at-fault party's insurer. This ensures you're compensated for the income you've lost due to the accident."
    },
    {
      question: "How quickly can I get a replacement vehicle?",
      answer: "We aim to provide same-day replacement vehicles for non-fault taxi accidents. Once your claim is verified, we can arrange delivery of a comparable replacement vehicle to your door, often within 24 hours. Our priority is getting you back on the road and earning as quickly as possible."
    },
    {
      question: "What if the other driver is uninsured?",
      answer: "If the at-fault driver is uninsured, we can help you pursue compensation through the Motor Insurers' Bureau (MIB). We'll handle all the necessary paperwork and negotiations to ensure you still receive the compensation and replacement vehicle you're entitled to."
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
              backgroundImage: "url('/pexels-rodolfoclix-1521580.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gold">TAXI REPLACEMENT / PCO REPLACEMENT</h1>
                <p className="text-lg opacity-90">Services / Taxi Replacement / PCO Replacement</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection>
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight text-foreground">
                  Secure Your PCO Accident Claim With AAA Accident Solutions LTD!
                </h2>
                <p className="text-xl lg:text-2xl mb-12 text-muted-foreground">
                  Get a taxi replacement and loss earning while your taxi is repaired.
                </p>

                {/* Service Icons */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
                  {serviceIcons.map((service, index) => (
                    <AnimatedSection key={index} delay={index * 100}>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-2">
                          <div className="text-black">
                            {service.icon}
                          </div>
                        </div>
                        <span className="text-xs md:text-sm text-center font-medium text-muted-foreground">{service.label}</span>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Two-Column Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left Column */}
              <AnimatedSection>
                <Card className="bg-black text-white border-0 h-full">
                  <CardContent className="p-8">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-10 rounded-lg"
                      style={{
                        backgroundImage: "url('/odinei-ramone-UUGaMVsD63A-unsplash.jpg')"
                      }}
                    />
                    <div className="relative z-10">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gold">
                        START YOUR NON-FAULT TAXI ACCIDENT CLAIM FOR FREE
                      </h2>
                      <div className="space-y-4 text-lg opacity-95 mb-6">
                        <p>
                          If you're a PCO driver who has been involved in a non-fault accident, you're entitled to comprehensive
                          support and compensation. We specialize in helping taxi drivers get back on the road quickly and ensure
                          you receive everything you're entitled to.
                        </p>
                        <p>
                          Our service includes a like-for-like replacement vehicle at no upfront cost, allowing you to continue
                          working while your taxi is being repaired. We also help you claim for loss of earnings, ensuring you're
                          compensated for the income you've lost due to the accident.
                        </p>
                        <p>
                          Additionally, if you've sustained any injuries, we can assist with personal injury claims, connecting you
                          with expert legal advisors who will work to secure the maximum compensation for your injuries.
                        </p>
                      </div>
                      <Link to="/make-claim">
                        <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-14 px-8 border-none">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Right Column */}
              <AnimatedSection delay={200}>
                <Card className="bg-white shadow-xl text-black border-0 h-full">
                  <CardContent className="p-8">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-900">
                      GET THE LIKE-FOR-LIKE, SAME-DAY TAXI REPLACEMENT
                    </h2>
                    <div className="space-y-4 text-lg text-gray-600 mb-6">
                      <p>
                        We understand that as a PCO driver, every day off the road means lost earnings. That's why we prioritize
                        getting you back behind the wheel as quickly as possible with a comparable replacement vehicle.
                      </p>
                      <p>
                        Our replacement vehicles are PCO-approved and matched to your original taxi, ensuring you can continue
                        working without interruption. All vehicles are delivered directly to your door, and there are no upfront
                        costs - everything is recovered from the at-fault party's insurer.
                      </p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span className="text-gray-700">No excess to pay</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span className="text-gray-700">Keep your insurance premium intact</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span className="text-gray-700">Get the comparable vehicle</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span className="text-gray-700">24/7 support</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                        <span className="text-gray-700">We will manage your claim from start to end</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Explore Our Fleet Section with Carousel */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <Badge className="mb-4">Premium PCO Fleet</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Explore Our Extensive Range of PCO Fleet
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Choose from our wide selection of PCO-licenced vehicles. From hybrids to luxury executives, we have the perfect car for your needs.
                </p>
              </div>

              <div className="relative mx-auto h-[600px] w-full max-w-7xl mb-12">
                <div className="absolute inset-0 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-colors" ref={emblaRef}>
                  <div className="flex h-full">
                    {vehicles.map((listing) => (
                      <article
                        key={listing.id}
                        className="relative min-w-full h-full group"
                      >
                        <img
                          src={listing.image || "/placeholder.svg"}
                          alt={`${listing.manufacturer} ${listing.model}`}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(event) => {
                            const target = event.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.onerror = null;
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-90 dark:opacity-90" />

                        <div className="absolute inset-0 flex flex-col justify-between p-10 sm:p-14 space-y-6">
                          <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-wide text-white">
                              Available Now
                            </span>
                            <h2 className="text-4xl font-semibold text-white">
                              {listing.registered_year_date} {listing.manufacturer} {listing.model}
                            </h2>
                            <p className="text-white/70 text-lg uppercase tracking-wide">
                              {listing.registration}
                            </p>
                          </div>

                          <div className="space-y-6">
                            <p className="max-w-xl text-white/80 text-lg line-clamp-2">
                              {listing.description}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                                <div className="flex items-center gap-2 mb-1">
                                  <Car className="w-4 h-4 text-gold" />
                                  <p className="text-xs uppercase tracking-wide">Seats</p>
                                </div>
                                <p className="text-base text-white font-semibold">
                                  {listing.seats} Seats
                                </p>
                              </div>
                              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                                <div className="flex items-center gap-2 mb-1">
                                  <Gauge className="w-4 h-4 text-gold" />
                                  <p className="text-xs uppercase tracking-wide">Engine</p>
                                </div>
                                <p className="text-base text-white">
                                  {listing.engine_size || "N/A"}
                                </p>
                              </div>
                              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                                <div className="flex items-center gap-2 mb-1">
                                  <Fuel className="w-4 h-4 text-gold" />
                                  <p className="text-xs uppercase tracking-wide">Fuel</p>
                                </div>
                                <p className="text-base text-white capitalize">
                                  {listing.fuel_type}
                                </p>
                              </div>
                              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                                <div className="flex items-center gap-2 mb-1">
                                  <Armchair className="w-4 h-4 text-gold" />
                                  <p className="text-xs uppercase tracking-wide">Transmission</p>
                                </div>
                                <p className="text-base text-white capitalize">
                                  {listing.transmission}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <Link to="/contact">
                                <Button className="w-fit bg-gold text-black hover:bg-gold/90 font-bold border-none" size="lg">
                                  Enquire Now
                                </Button>
                              </Link>
                              <Link to="/our-fleet">
                                <Button className="w-fit bg-white text-black hover:bg-gray-100 font-bold border-none" size="lg">
                                  Look at our fleet
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <button
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/60 p-3 text-white backdrop-blur transition hover:bg-black/80"
                  aria-label="Previous vehicle"
                >
                  ‹
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/60 p-3 text-white backdrop-blur transition hover:bg-black/80"
                  aria-label="Next vehicle"
                >
                  ›
                </button>
              </div>

              <div className="flex justify-center">
                <Link to="/our-fleet">
                  <Button size="lg" className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black font-bold h-14 px-10 text-lg transition-all">
                    VIEW FULL FLEET
                  </Button>
                </Link>
              </div>

            </AnimatedSection>
          </div>
        </section>



        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-gold dark:text-gold">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
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

        {/* Bottom Call-to-Action Bar */}
        <section className="py-12 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-gold" />
                <div>
                  <p className="font-semibold">SPEAK TO US NOW</p>
                  <p className="text-lg">+44 (20) 743 7407</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/make-claim">
                  <Button size="lg" className="bg-gold text-black hover:bg-gold/90 font-bold h-14 px-8 border-none">
                    START YOUR CLAIM
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-14 px-8 border-none">
                    CALL NOW
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PCOReplacement;

