import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Truck,
  Warehouse,
  Car,
  User,
  Clock,
  Shield,
  DollarSign,
  Phone,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const CarRecoveryAndStorage = () => {
  const faqItems = [
    {
      question: "Who pays for car recovery?",
      answer: "If you're a non-fault driver, the at-fault party's insurer covers the costs. AAA Accident Solutions LTD handles the recovery directly with them, so you don't have to pay anything upfront. All recovery and storage costs are recovered from the at-fault party's insurance company."
    },
    {
      question: "How long does the accident car recovery process take?",
      answer: "The recovery process typically begins within hours of your call. Our team works quickly to arrange recovery from the accident scene, with most vehicles recovered on the same day. The exact timeline depends on location and circumstances, but we prioritize speed and efficiency."
    },
    {
      question: "Do I pay an excess if I am not at fault?",
      answer: "No, you don't pay any excess if you're not at fault. As a non-fault driver, all costs including recovery, storage, and replacement vehicle are recovered from the at-fault party's insurer. There are zero upfront costs for you."
    },
    {
      question: "Who pays storage fees after a car accident?",
      answer: "For non-fault drivers, storage fees are covered by the at-fault party's insurer. We handle all billing directly with the insurance company, so you don't have to worry about storage costs. Our secure storage facilities are provided at no cost to you."
    },
    {
      question: "Can you provide storage if that is a total loss?",
      answer: "Yes, we can provide secure storage for total loss vehicles. Whether your vehicle is being repaired or has been declared a total loss, we offer safe and secure storage facilities. We'll work with the insurance company to determine the appropriate storage duration and handle all arrangements."
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
              backgroundImage: "url('/pexels-alesustinau-29870958.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gold">CAR RECOVERY AND STORAGE</h1>
                <p className="text-lg opacity-90">Services / Car Recovery and Storage</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Intro Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight text-gold">
                  HAD A NON-FAULT CAR ACCIDENT? GET INSTANT CAR RECOVERY!
                </h1>
                <p className="text-lg lg:text-xl mb-8 leading-relaxed max-w-3xl mx-auto text-muted-foreground">
                  If you're a non-fault driver, we can arrange instant recovery, a comparable replacement vehicle, and secure storage at no upfront cost. All costs are recovered from the at-fault party's insurer, so you don't have to worry about anything.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/make-claim">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 text-base font-medium px-8 h-14 border-none border-none">
                      BEGIN YOUR CLAIM
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Navigate Your Damaged Vehicle Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
                  NAVIGATE YOUR DAMAGED VEHICLE EASILY WITH US!
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    We are your one-stop solution for accident management. From instant vehicle recovery to secure storage,
                    replacement vehicles, and comprehensive claim management, we handle everything to make the process as
                    stress-free as possible.
                  </p>
                  <p>
                    Our experienced team is available 24/7 to assist you with vehicle recovery, storage arrangements, and
                    all aspects of your non-fault accident claim. We understand that accidents are stressful, which is why
                    we're committed to making the entire process seamless and hassle-free.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Don't Drive Unroadworthy Car Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                  DON'T DRIVE AN UNROADWORTHY CAR! CALL US FOR INSTANT RECOVERY
                </h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <span className="text-lg text-muted-foreground">
                      We charge the vehicle recovery & storage cost to the fault party.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <span className="text-lg text-muted-foreground">
                      We can also process personal injury claims on your behalf against the at-fault party's insurers.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <span className="text-lg text-muted-foreground">
                      We help you get maximum compensation from the fault party's insurer.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <span className="text-lg text-muted-foreground">
                      Contact our experienced advisors to get 24/7 free claim assistance or vehicle recovery.
                    </span>
                  </li>
                </ul>
                <Link to="/contact">
                  <Button size="lg" className="bg-gold text-black hover:bg-gold/90 border-none h-14 px-8">
                    CONTACT US
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* How Does AAA Accident Solutions LTD Recover Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gold dark:text-gold">
                  HOW DOES AAA ACCIDENT SOLUTIONS LTD RECOVER DAMAGED VEHICLE?
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground mb-8">
                  <p>
                    Our vehicle recovery process is simple and straightforward. When you contact us after a non-fault accident,
                    we'll gather the necessary details about your accident and vehicle location.
                  </p>
                  <p>
                    We then arrange for immediate recovery of your damaged vehicle from the accident scene. Our professional
                    recovery team uses specialized equipment to safely transport your vehicle to our secure storage facility or
                    directly to an approved repair shop.
                  </p>
                  <p>
                    Once your vehicle is recovered, we assess the damage and work with insurance companies to determine whether
                    repairs are feasible or if it's a total loss. Throughout this process, we handle all communications and
                    paperwork, ensuring you receive the maximum compensation you're entitled to.
                  </p>
                </div>
                <Link to="/contact">
                  <Button size="lg" className="bg-gold text-black hover:bg-gold/90 border-none h-14 px-8">
                    CONTACT US
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* How Much Does Car Recovery Cost Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gold dark:text-gold">
                  HOW MUCH DOES CAR RECOVERY COST AT AAA Accident Solutions LTD?
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground mb-8">
                  <p>
                    For non-fault drivers, there are no upfront costs for vehicle recovery and storage. All costs are
                    recovered directly from the at-fault party's insurer, so you don't have to pay anything out of pocket.
                  </p>
                  <p>
                    We understand that accidents can be financially stressful, which is why we've designed our service to be
                    completely cost-free for non-fault drivers. Our team handles all billing and negotiations with insurance
                    companies on your behalf.
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <span className="text-lg text-muted-foreground">
                      Free vehicle recovery and storage.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <span className="text-lg text-muted-foreground">
                      Free comparable replacement vehicle for anything including vehicle recovery and storage.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <span className="text-lg text-muted-foreground">
                      Free personal injury claim assistance.
                    </span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Service Feature Blocks */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="space-y-16 max-w-6xl mx-auto">
              {/* Vehicle Storage */}
              <AnimatedSection>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl">
                      <img
                        src="/pexels-pixabay-221047.jpg"
                        alt="Vehicle Storage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-6 text-gold">VEHICLE STORAGE</h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      We provide safe and secure vehicle storage facilities after an accident. Whether your vehicle needs
                      temporary storage while awaiting repairs or long-term storage for a total loss claim, our facilities
                      are fully secured and monitored.
                    </p>
                    <p className="text-lg text-muted-foreground">
                      We can arrange recovery directly to our secure storage facility, ensuring your vehicle is protected
                      from the moment it's recovered. Our storage facilities are equipped with 24/7 security and climate
                      control where necessary.
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Offer Comparable Replacement Vehicle */}
              <AnimatedSection delay={200}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:order-2 relative">
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl">
                      <img
                        src="/pexels-mikebirdy-170811.jpg"
                        alt="Offer Comparable Replacement Vehicle"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="lg:order-1">
                    <h3 className="text-3xl font-bold mb-6 text-gold">OFFER A COMPARABLE REPLACEMENT VEHICLE</h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      For non-fault accident claim management, we offer a fleet of high-end and standard vehicles. If your
                      car is being repaired due to a non-fault incident, you can rely on our comparable replacement vehicles
                      to keep you mobile.
                    </p>
                    <p className="text-lg text-muted-foreground">
                      Our replacement vehicles are matched to your original vehicle in terms of size, type, and features,
                      ensuring you don't experience any disruption to your daily routine. Best of all, there's no charge for
                      the replacement vehicle - all costs are recovered from the at-fault party's insurer.
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Personal Injury Claim */}
              <AnimatedSection delay={400}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl">
                      <img
                        src="/pexels-pavel-danilyuk-6754168.jpg"
                        alt="Personal Injury Claim"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-6 text-gold">PERSONAL INJURY CLAIM</h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      Besides providing vehicle recovery and storage services for non-faulty parties, AAA Accident Solutions LTD also offers personal
                      injury claim services. If you've sustained injuries in an accident that wasn't your fault, you may be
                      entitled to compensation.
                    </p>
                    <p className="text-lg text-muted-foreground">
                      We connect you with experienced legal experts who specialize in personal injury claims. They'll work
                      on your behalf to secure the maximum compensation for your injuries, medical expenses, and any loss of
                      earnings. All legal fees are recovered from the at-fault party's insurer, so there's no cost to you.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Four-Column Feature Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                <Card className="hover:shadow-xl transition-shadow text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">QUICK RECOVERY</h3>
                    <p className="text-muted-foreground">
                      We offer fast and efficient vehicle recovery, getting you back on the road quickly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">TOTAL SECURITY</h3>
                    <p className="text-muted-foreground">
                      Providing peace of mind with secure vehicle storage and comprehensive claim management.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">ZERO DEDUCTIBLE</h3>
                    <p className="text-muted-foreground">
                      Don't worry about excess payments; we handle it for you.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">24/7 SUPPORT</h3>
                    <p className="text-muted-foreground">
                      Our dedicated team is available round the clock to assist you.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Need Extra Space Section */}
        <section className="py-16 lg:py-24 bg-black text-white">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gold">
                  NEED EXTRA SPACE FOR A DAMAGED CAR? WE'VE GOT YOU COVERED!
                </h2>
                <p className="text-lg mb-8 opacity-90 text-gray-200">
                  Whether your vehicle needs storage while awaiting repairs or secure storage for a total loss claim, we provide
                  comprehensive storage solutions. Our facilities are fully secured, monitored, and designed to protect your
                  vehicle throughout the claims process.
                </p>
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
      </main>

      <Footer />
    </div>
  );
};

export default CarRecoveryAndStorage;

