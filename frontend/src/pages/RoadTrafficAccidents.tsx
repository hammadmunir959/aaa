import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  CheckCircle,
  UserCheck,
  Clock,
  Scale,
  Car,
  Shield,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck
} from "lucide-react";
import { Link } from "react-router-dom";

const RoadTrafficAccidents = () => {
  const services = [
    "Free, no-obligation advice and assistance.",
    "Arrangement of vehicle recovery and storage.",
    "Provision of a like-for-like replacement vehicle.",
    "Arrangement of vehicle repairs.",
    "Assistance with personal injury claims.",
    "Assistance with uninsured loss recovery.",
    "No excess to pay.",
    "No impact on your own insurance policy.",
    "No upfront costs."
  ];

  const differentiators = [
    {
      icon: <UserCheck className="w-12 h-12" />,
      title: "Dedicated Claim Handlers",
      description: "Your claim is managed by a single expert from start to finish."
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Fast Claim Processing",
      description: "We handle your claim quickly and efficiently."
    },
    {
      icon: <Scale className="w-12 h-12" />,
      title: "Expert Legal Support",
      description: "Receive comprehensive advice from our legal team."
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Prompt & Professional Service",
      description: "Every claim is treated with urgency and care."
    }
  ];

  const nonFaultCriteria = [
    "The accident was not your fault.",
    "You have the details of the at-fault driver.",
    "The at-fault driver has valid insurance.",
    "You have sustained damage to your vehicle.",
    "You have sustained personal injury.",
    "You have incurred other losses."
  ];

  const faqs = [
    {
      question: "What services do we provide?",
      answer: "We provide a comprehensive road traffic accident claim management service including free advice, vehicle recovery and storage, replacement vehicles, vehicle repairs, personal injury claims assistance, and uninsured loss recovery. All services are provided with no excess to pay, no impact on your insurance policy, and no upfront costs."
    },
    {
      question: "What happens next with my claim?",
      answer: "Once you contact us, we'll assign a dedicated claim handler who will guide you through the entire process. They will handle all communication with insurance companies, arrange vehicle recovery if needed, organize a replacement vehicle, and manage repairs. We'll keep you informed at every step."
    },
    {
      question: "Can I choose my own vehicle repair company or garage?",
      answer: "Yes, you can choose your preferred repair company or garage. However, we work with a network of approved repairers who can often provide faster service and better rates. Our team can help you make the best decision for your situation."
    },
    {
      question: "How much compensation will I receive for my claim?",
      answer: "The amount of compensation depends on various factors including the extent of vehicle damage, personal injuries sustained, loss of earnings, and other uninsured losses. Our expert team will assess your case and ensure you receive the maximum compensation you're entitled to."
    },
    {
      question: "Can I make a claim if the accident was not my fault but I was injured?",
      answer: "Absolutely. If you were injured in a non-fault accident, you are entitled to claim compensation for your injuries. We have experienced personal injury specialists who will handle your injury claim alongside your vehicle damage claim."
    },
    {
      question: "How long does a car accident claim take?",
      answer: "The duration of a claim varies depending on the complexity of the case, the extent of damage, and whether there are personal injuries involved. Simple vehicle damage claims can be resolved in a few weeks, while more complex cases with injuries may take several months. We aim to resolve all claims as quickly as possible while ensuring you receive full compensation."
    }
  ];

  const latestArticles = [
    {
      title: "What Happens When A Car Is Written Off?",
      description: "Understanding the process and what to expect when your vehicle is declared a total loss after an accident.",
      image: "/WhenACarIsWrittenOff.jpg"
    },
    {
      title: "Will A Non-Fault Accident Affect My Insurance?",
      description: "Learn about how non-fault accidents are handled and their impact on your insurance premiums and no-claims bonus.",
      image: "/AccidentAffectMyInsurance.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-black py-24 lg:py-32 text-primary-foreground">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{
              backgroundImage: "url('/young-sad-woman-text-messaging-smart-after-car-crash-road.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <AnimatedSection>
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 lg:p-12 shadow-xl">
                  <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
                    Your Trusted Partner for <span className="text-gold">Road Traffic Accident</span> Claim Management
                  </h1>
                  <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed">
                    Frustrated after a road traffic accident? <span className="font-bold text-gold">AAA Accident Solutions LTD</span> is here to support you with complete accident claim management, taking the stress off your shoulders and handling the entire process from start to finish.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/make-claim">
                      <Button size="lg" className="bg-gold text-white hover:bg-gold/90 w-full sm:w-auto font-bold text-lg h-14 px-8 border-none">
                        Make a Claim
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button size="lg" className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto font-bold text-lg h-14 px-8 border-none">
                        CONTACT US
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Don't Know What To Do Section */}
        <section className="py-16 lg:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center">
                  DON'T KNOW WHAT TO DO AFTER AN ACCIDENT? <span className="text-gold">TRUST OUR LEGAL HANDLERS!</span>
                </h2>
                <p className="text-lg text-muted-foreground text-center leading-relaxed">
                  We are a team of experienced accident claim handlers dedicated to providing comprehensive support and guidance throughout the entire claims process. When you're involved in a non-fault accident, the last thing you need is added stress. Let us handle everything for you.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Help & Make A Free Claim Section */}
        <section className="py-16 lg:py-20 bg-background border-y border-border">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
                  HELP & MAKE A FREE ROAD TRAFFIC ACCIDENT CLAIM WITH US!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground">{service}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* We Are Different Section */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Why Choose Us for Your Road Traffic Accident Claim?
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {differentiators.map((item, index) => (
                  <AnimatedSection key={index} delay={index * 100} className="h-full">
                    <Card className="text-center hover:shadow-xl transition-shadow border-none bg-white dark:bg-gray-800 h-full flex flex-col justify-between rounded-lg overflow-hidden">
                      <CardContent className="pt-8 pb-6 flex flex-col items-center h-full">
                        <div className="flex justify-center mb-6">
                          {/* Icon wrapper */}
                          <div className="text-gold">
                            {React.cloneElement(item.icon as React.ReactElement, { className: "w-12 h-12 text-gold" })}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground mb-6 flex-grow">{item.description}</p>
                        <Button className="bg-gold text-white hover:bg-gold/90 w-full mt-auto rounded-md font-bold">
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Non-Faulty Accident Criteria Section */}
        <section className="relative py-16 lg:py-20 bg-secondary">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: "url('/auto-repairman-talking-displeased-customers-about-vehicle-breakdown-workshop.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
                  HOW DO I KNOW THAT I WAS INVOLVED IN A NON-FAULTY ACCIDENT?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nonFaultCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <p className="text-foreground">{criterion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Get Back On The Roads Section */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center">
                  Get Back on the Road Quickly After a <span className="text-gold">Non-Fault Accident</span>
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg">
                  <p>
                    If you’ve been in a non-fault accident, we make getting back on the road simple and stress-free. Our expert team handles:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 marker:text-gold">
                    <li>Vehicle recovery and repair management</li>
                    <li>Like-for-like replacement vehicles</li>
                    <li>Personal injury and uninsured loss claims</li>
                  </ul>
                  <p>
                    No upfront costs, no excess, and no impact on your insurance policy. We take care of everything so you can focus on getting back to normal.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Expert Team Section */}
        <section className="relative py-24 lg:py-32 bg-black text-primary-foreground">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: "url('/insurance-agent-working-site-car-accident-claim-process-people-car-insurance-claim (1).jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
                  Expert <span className="text-gold">Road Traffic Accident Claim</span> Support When You Need It
                </h2>
                <p className="text-lg lg:text-xl mb-4 opacity-90 text-gray-200">
                  Our experienced team guides you through every step of the claims process, providing full support and advice.
                </p>
                <p className="text-lg lg:text-xl mb-8 opacity-90 font-semibold text-gray-200">
                  <span className="text-gold">Stressed?</span> Relax<span className="text-gold">—</span>we handle everything for you!
                </p>
                <Link to="/contact">
                  <Button size="lg" className="bg-gold text-white hover:bg-gold/90 h-14 px-8 border-none">
                    CONTACT US
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Worrying About Accident Section */}
        <section className="py-16 lg:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
                  Non-Fault Accident? We Handle Everything for You
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground">
                      Being in a non-fault accident can be stressful. Our expert team provides:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">Free, no-obligation advice and support</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">Vehicle recovery and storage</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">Like-for-like replacement vehicles</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">Vehicle repair coordination</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">Personal injury claims assistance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">Uninsured loss recovery</span>
                      </li>
                    </ul>
                    <p className="text-lg text-muted-foreground pt-2">
                      Relax—we take care of it all so you can focus on getting back to normal.
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src="/logos/aaa_logo.png"
                      alt="AAA Accident Solutions LTD Logo"
                      className="w-full max-w-md"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Latest News & Articles Section */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  LATEST <span className="text-gold">NEWS</span> & <span className="text-gold">ARTICLES</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {latestArticles.map((article, index) => (
                  <AnimatedSection key={index} delay={index * 100}>
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-50">{article.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{article.description}</p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section >

        {/* FAQ Section */}
        < section className="py-16 lg:py-20 bg-secondary" >
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-gold dark:text-gold-light">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AnimatedSection>
          </div>
        </section >


      </main >

      <Footer />
    </div >
  );
};

export default RoadTrafficAccidents;

