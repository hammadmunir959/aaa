import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  CheckCircle2,
  Phone,
  Fuel,
  Gauge,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { vehiclesApi, type Vehicle } from "@/services/vehiclesApi";

const OurFleet = () => {
  // Hardcoded fleet data from population script
  const fleetListings: Vehicle[] = [
    {
      id: 1,
      manufacturer: "Mercedes-Benz",
      model: "E 300 AMG Line NGT Ed Prem+",
      model_detail: "E300e 9G-Tronic Auto PHEV EQ Power 320 (122Hp/90Kw) Start/Stop",
      color: "Grey",
      body_style: "Saloon",
      fuel_type: "hybrid",
      engine_size: "1991 cc",
      euro_status: "6ap",
      registered_year_date: "01 Nov 2021",
      image: "/generated_mercedes_e300_grey.png",
      image_url: "/generated_mercedes_e300_grey.png",
      type: "sedan",
      daily_rate: "150.00",
      seats: 5,
      registration: "MB-E300-01",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz E 300 AMG Line NGT Ed Prem+"
    },
    {
      id: 2,
      manufacturer: "Mercedes-Benz",
      model: "E 200 D SE Auto",
      model_detail: "E200d Bluetec 9G-Tronic Auto Start/Stop",
      color: "Black",
      body_style: "Saloon",
      fuel_type: "diesel",
      engine_size: "1950 cc",
      euro_status: "6b",
      registered_year_date: "31 Mar 2018",
      image: "/generated_mercedes_e200_black.png",
      image_url: "/generated_mercedes_e200_black.png",
      type: "sedan",
      daily_rate: "120.00",
      seats: 5,
      registration: "MB-E200-02",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz E 200 D SE Auto"
    },
    {
      id: 3,
      manufacturer: "Audi",
      model: "A8 L 60 TFSI E Quattro Auto",
      model_detail: "60 TFSIe 449 Quattro Tip PHEV 17.9kWh Auto Start/Stop",
      color: "Black",
      body_style: "Limousine",
      fuel_type: "hybrid",
      engine_size: "2995 cc",
      euro_status: "6dg",
      registered_year_date: "22 Jul 2020",
      image: "/generated_audi_a8_black.png",
      image_url: "/generated_audi_a8_black.png",
      type: "limousine",
      daily_rate: "200.00",
      seats: 5,
      registration: "AU-A800-03",
      status: "available",
      transmission: "automatic",
      name: "Audi A8 L 60 TFSI E Quattro Auto"
    },
    {
      id: 4,
      manufacturer: "Mercedes-Benz",
      model: "C 200 AMG Line Auto",
      model_detail: "C200 9G-Tronic BlueEfficiency Auto Start/Stop MHEV EQ Boost",
      color: "Black",
      body_style: "Cabriolet",
      fuel_type: "petrol",
      engine_size: "1497 cc",
      euro_status: "6c",
      registered_year_date: "31 Oct 2018",
      image: "/generated_mercedes_c200_black.png",
      image_url: "/generated_mercedes_c200_black.png",
      type: "convertible",
      daily_rate: "130.00",
      seats: 4,
      registration: "MB-C200-04",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz C 200 AMG Line Auto"
    },
    {
      id: 5,
      manufacturer: "Land Rover",
      model: "Discovery SE SD4 Auto",
      model_detail: "SD4 240 Auto Start/Stop",
      color: "Black",
      body_style: "SUV",
      fuel_type: "diesel",
      engine_size: "1999 cc",
      euro_status: "6c",
      registered_year_date: "12 Sep 2018",
      image: "/generated_land_rover_discovery_black.png",
      image_url: "/generated_land_rover_discovery_black.png",
      type: "suv",
      daily_rate: "160.00",
      seats: 7,
      registration: "LR-DISC-05",
      status: "available",
      transmission: "automatic",
      name: "Land Rover Discovery SE SD4 Auto"
    },
    {
      id: 6,
      manufacturer: "Land Rover",
      model: "Range Rover Sport Autobiography Dynamic",
      model_detail: "SDV6 306 CommandShift Auto Start/Stop",
      color: "Black",
      body_style: "SUV",
      fuel_type: "diesel",
      engine_size: "2993 cc",
      euro_status: "6ag",
      registered_year_date: "30 Sep 2019",
      image: "/generated_range_rover_sport_black.png",
      image_url: "/generated_range_rover_sport_black.png",
      type: "suv",
      daily_rate: "180.00",
      seats: 5,
      registration: "LR-RRS-06",
      status: "available",
      transmission: "automatic",
      name: "Land Rover Range Rover Sport Autobiography Dynamic"
    },
    {
      id: 7,
      manufacturer: "Volkswagen",
      model: "Tiguan Life TSI S-A",
      model_detail: "1.5 TSI EVO 150 DSG Auto 2WD Start/Stop",
      color: "White",
      body_style: "SUV",
      fuel_type: "petrol",
      engine_size: "1498 cc",
      euro_status: "6ap",
      registered_year_date: "Year 2022",
      image: "/generated_vw_tiguan_white.png",
      image_url: "/generated_vw_tiguan_white.png",
      type: "suv",
      daily_rate: "90.00",
      seats: 5,
      registration: "VW-TIG-07",
      status: "available",
      transmission: "automatic",
      name: "Volkswagen Tiguan Life TSI S-A"
    },
    {
      id: 8,
      manufacturer: "Mercedes-Benz",
      model: "V-Class",
      model_detail: "—",
      color: "—",
      body_style: "MPV",
      fuel_type: "diesel",
      engine_size: "—",
      euro_status: "—",
      registered_year_date: "Year 2025",
      image: "/generated_mercedes_v_class.png",
      image_url: "/generated_mercedes_v_class.png",
      type: "mpv",
      daily_rate: "150.00",
      seats: 7,
      registration: "MB-VCLS-08",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz V-Class"
    },
    {
      id: 9,
      manufacturer: "Mercedes-Benz",
      model: "S-Class",
      model_detail: "—",
      color: "—",
      body_style: "Saloon",
      fuel_type: "hybrid",
      engine_size: "—",
      euro_status: "—",
      registered_year_date: "Year 2023",
      image: "/generated_mercedes_s_class_saloon.png",
      image_url: "/generated_mercedes_s_class_saloon.png",
      type: "sedan",
      daily_rate: "250.00",
      seats: 5,
      registration: "MB-SCLS-09",
      status: "available",
      transmission: "automatic",
      name: "Mercedes-Benz S-Class"
    },
    {
      id: 10,
      manufacturer: "Kia",
      model: "Niro",
      model_detail: "—",
      color: "—",
      body_style: "SUV",
      fuel_type: "hybrid",
      engine_size: "—",
      euro_status: "—",
      registered_year_date: "—",
      image: "/generated_kia_niro_suv.png",
      image_url: "/generated_kia_niro_suv.png",
      type: "suv",
      daily_rate: "80.00",
      seats: 5,
      registration: "KIA-NIR-10",
      status: "available",
      transmission: "automatic",
      name: "Kia Niro"
    }
  ];

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading for better UX
    const fetchVehicles = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/pexels-rockwell-branding-agency-85164430-9137222.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gold">OUR FLEET</h1>
                <p className="text-lg opacity-90">Services / Our Fleet</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto mb-12 text-center">
              <AnimatedSection>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight uppercase text-gold">
                  FLEET CAR HIRE: SUPPORTING YOU AT EVERY STEP OF POST-ACCIDENT
                </h1>
                <p className="text-lg lg:text-xl mb-6 text-muted-foreground leading-relaxed">
                  DON'T LET ACCIDENTS STOP YOUR FLEET. CONTACT AAA ACCIDENT SOLUTIONS LTD FOR LUXURY FLEET CAR HIRE OR COURTESY
                  VEHICLES THAT WILL KEEP YOU ON THE ROAD WITHOUT MISSING A BEAT.
                </p>
                <p className="text-lg lg:text-xl mb-8 font-semibold text-foreground">
                  WE HAVE A FLEET OF LUXURY AND STANDARD VEHICLES, INCLUDING:
                </p>
              </AnimatedSection>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fleetListings.map((listing, index) => (
                <AnimatedSection key={listing.id} delay={index * 50}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300">
                    <div className="h-56 w-full overflow-hidden rounded-t-lg bg-muted relative group">
                      <img
                        src={listing.image_url || listing.image || "/placeholder.svg"}
                        onError={(event) => {
                          const target = event.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                          target.onerror = null; // Prevent infinite loop
                        }}
                        alt={`${listing.manufacturer} ${listing.model}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">
                          {listing.registered_year_date || "—"}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground tracking-wide">
                          {listing.color !== "" ? listing.color : "—"}
                        </span>
                      </div>
                      <CardTitle className="text-xl leading-tight">
                        {listing.manufacturer} {listing.model}
                      </CardTitle>
                      {listing.model_detail && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={listing.model_detail}>
                          {listing.model_detail}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 flex-1">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gold" />
                          <span className="text-muted-foreground">Body:</span>
                          <span className="font-semibold">{listing.body_style || listing.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-gold" />
                          <span className="text-muted-foreground">Fuel:</span>
                          <span className="font-semibold capitalize">{listing.fuel_type && listing.fuel_type !== "" ? listing.fuel_type : "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-gold" />
                          <span className="text-muted-foreground">Engine:</span>
                          <span className="font-semibold">{listing.engine_size && listing.engine_size !== "" ? listing.engine_size : "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-gold" />
                          <span className="text-muted-foreground">Euro:</span>
                          <span className="font-semibold">{listing.euro_status && listing.euro_status !== "" ? listing.euro_status : "N/A"}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 flex gap-2">
                        <Link to="/contact" className="w-full">
                          <Button className="w-full bg-gold text-black hover:bg-gold/90 font-bold border-none">
                            Enquire Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* What Sets Us Apart Section */}
        <section className="py-16 lg:py-24 bg-black text-white border-t border-gray-800">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold">
                  WHAT SETS OUR FLEET CAR HIRE APART FROM OTHERS
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Our expertise in accident management and fleet car hire sets us apart from other providers. We understand
                  the unique needs of fleet operators and provide comprehensive solutions that keep your operations running
                  smoothly.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">No upfront payment to pay</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">Fully maintained, no extra charges or fees</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">Replacement vehicle for the duration of your repairs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">Same-day replacement car</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">A dedicated and experienced team of claim handlers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">24/7 customer support for claim management or fleet hire</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-white">Stringent maintenance standards</span>
                  </li>
                </ul>
                <p className="text-lg text-gray-300">
                  We're committed to managing your accident claims efficiently and professionally, ensuring you receive
                  the maximum support and compensation available. Our team works tirelessly to keep your fleet operational
                  and your business running smoothly.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Call to Action Bar */}
        <section className="py-12 bg-black text-white">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gold">
                  WHO PAYS FOR THE FLEET CAR HIRE SERVICES?
                </h2>
                <div className="space-y-4 text-lg text-gray-300 mb-8">
                  <p>
                    For non-fault accidents, the at-fault party's insurer typically covers all costs associated with fleet car
                    hire services, including replacement vehicles, recovery, and storage. AAA Accident Solutions LTD works directly
                    with insurance companies to recover these costs, so you don't have to pay anything upfront.
                  </p>
                  <p>
                    We handle all the complex negotiations and paperwork, ensuring that all costs are properly recovered from
                    the at-fault party's insurer. This means you can access our fleet services without any financial burden,
                    allowing you to focus on keeping your operations running smoothly.
                  </p>
                  <p>
                    Our team has extensive experience in credit hire and accident claim management, ensuring that all costs
                    are properly documented and recovered. We work tirelessly to ensure you receive the maximum support
                    available under your claim.
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">
                      Standard and high-end vehicles from the Mercedes Benz and BMW to name a few.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">
                      A team of fully trained and highly experienced staff.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">
                      Helping you manage your credit hire and accident claim with our professional management.
                    </span>
                  </li>
                </ul>
                <p className="text-lg text-gray-300">
                  We're committed to providing the best fleet car hire service regardless of your location or fault status.
                  Our goal is to ensure your fleet operations continue seamlessly, with minimal disruption to your business.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default OurFleet;
