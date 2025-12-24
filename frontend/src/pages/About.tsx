import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Wrench,
  Truck,
  CheckCircle2,
  Users,
  Clock,
  Shield,

} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="About Us - 20 Years of Expert Accident Management"
        description="Leading UK accident management company with 20 years experience.  Specialist credit hire, vehicle recovery, and personal injury claims support for non-fault victims."
        canonical="/about"
        keywords="about AAA Accident Solutions LTD, accident management company UK, credit hire specialists, 20 years experience"
      />
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/car-insurance-form-accidental-concept.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gold">ABOUT US</h1>
                <p className="text-lg opacity-90">Company / About Us</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Who Is AAA Accident Solutions LTD Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-semibold text-gold uppercase">ABOUT US</span>

                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                  WHO IS <span className="text-gold">AAA ACCIDENT SOLUTIONS LTD?</span>
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground mb-8">
                  <p>
                    AAA Accident Solutions LTD is an accident management and regulated vehicle hiring solution for credit hire
                    to the innocent victims of non-fault road traffic accidents. We provide the best vehicle, credit hire,
                    rental car, or replacement car.
                  </p>
                  <p>
                    We are a non-fault accident management company that focuses on what really matters for a non-fault
                    accident victims. We have been supporting non-fault accident victims for highly specialized in non-fault
                    accident claims and compensation from the at-fault party's insurer.
                  </p>
                  <p>
                    With 20 years of experience, AAA Accident Solutions LTD accident management can find a solution for you.
                    We are building a good reputation across the UK, especially in London. We provide a hassle-free and
                    quick service, and we help to recover the damage to the car. In addition, we provide a wide range of
                    cars and fleets.
                  </p>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Dedicated team of professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Free of charge service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">24 hours a day, 7 days a week</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">Excellent customer service</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold">
                  OUR MISSION
                </h2>
                <p className="text-lg text-muted-foreground mb-12">
                  Our mission is to build trust by providing the best and most reliable credit hire services. Our aim is
                  to reduce your stress. We are committed to providing you with a precise, transparent, and hassle-free service.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardContent className="pt-8 text-center">
                      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                        <Car className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4">CREDIT HIRE</h3>
                      <p className="text-muted-foreground">
                        We provide a wide range of services, including credit hire, vehicle recovery, vehicle repair,
                        storage, credit hire claims, personal injury claims, and legal assistance.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-xl transition-shadow">
                    <CardContent className="pt-8 text-center">
                      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wrench className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4">REPAIR YOUR VEHICLE</h3>
                      <p className="text-muted-foreground">
                        You are eligible to receive a free car for your damaged vehicle repair with higher quality parts
                        and services.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-xl transition-shadow">
                    <CardContent className="pt-8 text-center">
                      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                        <Truck className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4">RECOVER YOUR VEHICLE</h3>
                      <p className="text-muted-foreground">
                        We help you recover your vehicle on your behalf. Our team will ensure that your vehicle is recovered
                        safely and efficiently.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Expert In Handling Claims Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <AnimatedSection>
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                    EXPERT IN <span className="text-gold">HANDLING CLAIMS</span> ANYTIME
                  </h2>
                  <p className="text-lg mb-8 opacity-95 leading-relaxed">
                    We are always on the scene, equipped and ready to provide you with helping hand anytime. Our highly
                    dedicated in-house team of expert legal advisors will provide you with the best advice and support to
                    ensure your eligibility.
                  </p>
                  <Link to="/make-claim">
                    <Button size="lg" className="bg-gold text-white hover:bg-gold/90 font-bold px-8 h-14 border-none">
                      START CLAIM
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                    <img
                      src="/member-human-resource-team-talking-with-candidate-while-reviewing-his-resume-job-interview-office.jpg"
                      alt="Expert Legal Advisors"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Your All-Time Trusted Partner Section */}
        <section className="py-16 lg:py-24 bg-[#262626]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <AnimatedSection delay={200}>
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                  <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                    <img
                      src="/man-woman-making-deal-work.jpg"
                      alt="Trusted Partner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div>
                  <span className="text-sm font-semibold text-gold uppercase mb-4 block">ABOUT OUR COMPANY</span>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                    YOUR ALL-TIME TRUSTED PARTNER WITH CLEAR VISION
                  </h2>
                  <div className="space-y-4 text-lg text-muted-foreground mb-8">
                    <p>
                      We provide a wide range of services, including credit hire, vehicle recovery, vehicle repair,
                      storage, credit hire claims, personal injury claims, and legal assistance.
                    </p>
                    <p>
                      We have supported our customers throughout the UK and London areas. We provide a hassle-free and
                      quick service, and we help to recover the damage to the car. Our team will ensure that your vehicle
                      is recovered safely and efficiently.
                    </p>

                  </div>
                  <Link to="/contact">
                    <Button size="lg" className="bg-gold text-white hover:bg-gold/90 font-bold px-8 h-14 border-none">
                      CONTACT US
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

