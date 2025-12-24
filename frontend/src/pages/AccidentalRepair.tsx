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
  Warehouse,
  Truck,
  Clock,
  User,
  Wrench,
  CheckCircle2,
  Phone,
  Car
} from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const AccidentalRepair = () => {
  const faqItems = [
    {
      question: "How long does it take to repair a car after an accident?",
      answer: "The repair time depends on the extent of the damage. Minor repairs can be completed within a few days, while more extensive damage may take 1-2 weeks. We work with a network of 400+ approved garages across the UK to ensure fast turnaround times. Our team will keep you updated throughout the repair process and provide a comparable replacement vehicle while your car is being repaired."
    },
    {
      question: "How does your service ensure transparency in the accidental car repair process?",
      answer: "We maintain complete transparency throughout the repair process. You'll receive regular updates on the repair status, detailed reports of all work carried out, and clear communication about any additional work required. All repairs are documented, and we work directly with your insurance company to ensure everything is handled properly. You can contact your dedicated claim handler at any time for updates."
    },
    {
      question: "Is it worth repairing a damaged car?",
      answer: "Whether it's worth repairing depends on the extent of the damage and the value of your vehicle. Our expert team will assess your vehicle and work with insurance assessors to determine if repairs are economically viable. If the cost of repairs exceeds the vehicle's value, we'll help you navigate the total loss process and ensure you receive fair compensation."
    },
    {
      question: "Can you replace a new accident without insurance in the UK?",
      answer: "If you're a non-fault driver, the at-fault party's insurance will cover the costs of repairs and replacement vehicles. We handle all communication with insurance companies on your behalf. If the other party is uninsured, we can help you pursue compensation through the Motor Insurers' Bureau (MIB). Our team will guide you through all available options."
    },
    {
      question: "What happens if I have to pay an excess?",
      answer: "As a non-fault driver, you shouldn't have to pay any excess. All costs, including repairs, replacement vehicles, and recovery, are recovered from the at-fault party's insurer. If you're asked to pay an excess, we'll challenge this on your behalf and ensure the at-fault party's insurance covers all costs."
    },
    {
      question: "How do you ensure customer satisfaction throughout the accidental car repair process?",
      answer: "Customer satisfaction is our top priority. We assign a dedicated claim handler to each case, provide regular updates, and ensure all repairs meet the highest standards. We work with approved garages that are vetted for quality and service. Our team is available 24/7 to address any concerns, and we follow up after repairs are complete to ensure you're completely satisfied with the service."
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
              backgroundImage: "url('/pexels-maltelu-2244746.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gold">ACCIDENTAL REPAIR</h1>
                <p className="text-lg opacity-90">Services / Accidental Repair</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight text-gold">
                  HAD A NON-FAULT ACCIDENT?
                </h1>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  CHOOSE US FOR CAR ACCIDENTAL REPAIRS
                </h2>
                <p className="text-lg lg:text-xl mb-8 leading-relaxed text-muted-foreground">
                  If you've been involved in a non-fault accident, we provide comprehensive repair services with no upfront costs.
                  We work directly with insurance companies, arrange repairs at approved garages, and provide replacement vehicles
                  while your car is being fixed.
                </p>
                <Link to="/make-claim">
                  <Button size="lg" className="bg-gold text-black hover:bg-gold/90 text-base font-bold px-8 h-14 border-none">
                    START YOUR CLAIM
                  </Button>
                </Link>
              </AnimatedSection>

              <AnimatedSection delay={200} className="flex justify-center items-center">
                <Logo className="w-full max-w-lg h-32 lg:h-40" />
              </AnimatedSection>
            </div>
          </div>
        </section>





        {/* Let Us Take Care Section */}
        <section className="py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-gold">
                  LET US TAKE CARE OF YOUR CAR WHILE YOU RECOVER!
                </h2>
                <p className="text-lg lg:text-xl mb-8 leading-relaxed text-muted-foreground">
                  After a non-fault accident, your focus should be on recovery, not on dealing with insurance companies and repair
                  arrangements. Our dedicated team handles every aspect of your claim - from vehicle recovery and storage to repairs
                  and replacement vehicles. We work tirelessly to ensure you receive the maximum compensation you're entitled to,
                  all while keeping you informed every step of the way.
                </p>
                <Link to="/make-claim">
                  <Button size="lg" className="bg-gold text-black hover:bg-gold/90 text-base font-bold px-8 h-14 border-none">
                    START YOUR ACCIDENT CLAIM
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Trust AAA Accident Solutions LTD Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gold">
                  TRUST AAA ACCIDENT SOLUTIONS LTD FOR EXPERIENCED ACCIDENTAL REPAIRS
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground mb-8">
                  <p>
                    With years of experience in accident management and vehicle repairs, we've built a reputation for excellence
                    and reliability. Our team of expert claim handlers understands the complexities of insurance claims and works
                    diligently to ensure you receive the best possible outcome.
                  </p>
                  <p>
                    We partner with a network of 400+ approved garages across the UK, all vetted for quality, professionalism,
                    and customer service. This means we can arrange repairs at a location convenient for you, and you can be
                    confident that your vehicle will be restored to its pre-accident condition.
                  </p>
                  <p>
                    Our commitment to customer satisfaction means we don't just process claims - we provide comprehensive support
                    throughout the entire process, ensuring you're informed, supported, and satisfied with the service you receive.
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

        {/* Feature Icons Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                <Card className="hover:shadow-xl transition-shadow text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Warehouse className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">400+ Garages in UK</h3>
                    <p className="text-sm text-muted-foreground">
                      Extensive network of approved repair facilities across the country.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Door to Door Recovery & Repair</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete service from accident scene to repair completion.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Instant Response</h3>
                    <p className="text-sm text-muted-foreground">
                      Quick response times to get you back on the road faster.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-shadow text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Expert Claim Handlers</h3>
                    <p className="text-sm text-muted-foreground">
                      Experienced professionals managing your claim from start to finish.
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

export default AccidentalRepair;

