import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const leftColumnFAQs = [
    {
      question: "What is a claims management company?",
      answer: (
        <div className="space-y-3">
          <p>
            At AAA Accident Solutions LTD, we manage non-fault accident claims across England and become the choice of our customers.
            When it comes to defining the role of a particular industry such as a claims management company, it simply refers to a
            legal department alternative to the insurance company that manages claims to provide compensation to deserving clients.
          </p>
          <p>
            We are also a trusted partner for those who are looking for credit hire after a non-fault accident. We not only cover
            the non-fault drivers but also companies like us who need replacement vehicles as per their customer requirements.
          </p>
        </div>
      ),
      defaultOpen: true,
    },
    {
      question: "What is credit hire, and how much will I have to pay for it?",
      answer: (
        <div className="space-y-3">
          <p>
            Credit hire is a service that provides you with a replacement vehicle while your damaged vehicle is being repaired,
            without requiring upfront payment. The cost is recovered from the at-fault party's insurance company. As a non-fault
            driver, you typically don't have to pay anything upfront - all costs are recovered from the responsible party.
          </p>
          <p>
            The amount charged depends on various factors including the type of vehicle, duration of hire, and your specific needs.
            Our team will work to ensure you receive a suitable replacement vehicle at a reasonable rate that can be recovered from
            the at-fault party.
          </p>
        </div>
      ),
    },
    {
      question: "What is the highest personal injury payout in the UK?",
      answer: (
        <div className="space-y-3">
          <p>
            Personal injury payouts in the UK vary significantly based on the severity of injuries, impact on quality of life,
            loss of earnings, and medical expenses. While there have been cases with multi-million pound settlements for severe
            catastrophic injuries, most claims fall within a more moderate range.
          </p>
          <p>
            The Judicial College Guidelines provide a framework for compensation amounts, ranging from a few thousand pounds for
            minor injuries to hundreds of thousands or millions for severe, life-changing injuries. Our experienced team can help
            assess the potential value of your claim based on your specific circumstances.
          </p>
        </div>
      ),
    },
    {
      question: "How long does an accident claim take?",
      answer: (
        <div className="space-y-3">
          <p>
            The duration of an accident claim can vary depending on several factors, including the complexity of the case, whether
            liability is disputed, the extent of injuries, and the cooperation of all parties involved.
          </p>
          <p>
            Simple cases where liability is clear and injuries are minor may be resolved within 3-6 months. More complex cases
            involving disputed liability, serious injuries, or multiple parties can take 12-24 months or longer. Our team works
            diligently to resolve claims as efficiently as possible while ensuring you receive fair compensation.
          </p>
        </div>
      ),
    },
    {
      question: "Who pays for car recovery after an accident?",
      answer: (
        <div className="space-y-3">
          <p>
            If you are a non-fault driver, the at-fault party's insurance company is responsible for covering the cost of vehicle
            recovery. This includes towing your vehicle from the accident scene to a safe location, repair facility, or storage yard.
          </p>
          <p>
            We can arrange vehicle recovery on your behalf and ensure all costs are properly documented and recovered from the
            responsible party. You should not have to pay for recovery costs if you were not at fault for the accident.
          </p>
        </div>
      ),
    },
    {
      question: "Who pays storage fees after a car accident?",
      answer: (
        <div className="space-y-3">
          <p>
            Storage fees incurred after an accident are typically the responsibility of the at-fault party's insurance company.
            These fees cover the cost of storing your vehicle at a secure facility while repairs are being arranged or while the
            claim is being processed.
          </p>
          <p>
            It's important to ensure your vehicle is stored at a reasonable facility with fair rates, as excessive storage fees
            may not be fully recoverable. Our team can help arrange appropriate storage and ensure costs are kept reasonable and
            recoverable from the at-fault party.
          </p>
        </div>
      ),
    },
    {
      question: "Am I liable for credit hire?",
      answer: (
        <div className="space-y-3">
          <p>
            As a non-fault driver, you are not personally liable for credit hire costs. The at-fault party's insurance company
            is responsible for covering the reasonable costs of your replacement vehicle while your car is being repaired.
          </p>
          <p>
            However, it's important to note that you have a duty to mitigate your losses - meaning you should accept a reasonable
            replacement vehicle and not unnecessarily extend the hire period. Our team ensures that all hire arrangements are
            reasonable and fully recoverable from the at-fault party.
          </p>
        </div>
      ),
    },
    {
      question: "What are the particulars of the claim for credit hire?",
      answer: (
        <div className="space-y-3">
          <p>
            The particulars of a credit hire claim typically include: proof that you were not at fault for the accident, evidence
            that you needed a replacement vehicle (your vehicle was damaged and unusable), documentation of the hire period,
            evidence of the hire rate being reasonable, and proof that you mitigated your losses.
          </p>
          <p>
            Key documents include the police report, insurance correspondence, vehicle damage assessments, repair estimates, hire
            agreements, and evidence of your need for a replacement vehicle. Our team handles all documentation to ensure your
            claim is properly supported and recoverable.
          </p>
        </div>
      ),
    },
  ];

  const rightColumnFAQs = [
    {
      question: "How do I get a replacement car after an accident?",
      answer: (
        <div className="space-y-3">
          <p>
            It is very simple to get a replacement vehicle from the accident management company, the only condition is you must
            be a non-fault driver. After the accident, you can make a non-fault claim to our company and receive a vehicle.
          </p>
          <p>
            All costs will be recovered from the at fault party. Further, in replacing your own damaged vehicle, the fault party
            will pay the cost of repairs.
          </p>
        </div>
      ),
      defaultOpen: true,
    },
    {
      question: "Do I have to pay for credit hire?",
      answer: (
        <div className="space-y-3">
          <p>
            No, as a non-fault driver, you do not have to pay for credit hire upfront. The credit hire company provides you with
            a replacement vehicle on credit, and all costs are recovered directly from the at-fault party's insurance company.
          </p>
          <p>
            You only become responsible for costs if it's determined that you were at fault for the accident, or if the hire
            period or rates are found to be unreasonable. Our team ensures all arrangements are reasonable and fully recoverable.
          </p>
        </div>
      ),
    },
    {
      question: "Who pays for hire car after accident?",
      answer: (
        <div className="space-y-3">
          <p>
            The at-fault party's insurance company is responsible for paying for your hire car after an accident, provided you
            were not at fault. This includes both the daily hire rate and any associated costs.
          </p>
          <p>
            The hire costs must be reasonable and necessary. This means the vehicle should be similar to your own, the hire period
            should not be excessive, and the daily rate should be competitive. Our team ensures all hire arrangements meet these
            criteria to maximize recoverability.
          </p>
        </div>
      ),
    },
    {
      question: "Is it worth using an accident management company?",
      answer: (
        <div className="space-y-3">
          <p>
            Yes, using an accident management company like AAA Accident Solutions LTD can be highly beneficial. We handle all aspects
            of your claim, from arranging vehicle recovery and replacement to negotiating with insurance companies and managing
            repairs. This saves you time and stress while ensuring you receive fair compensation.
          </p>
          <p>
            We have expertise in dealing with insurance companies, understanding legal requirements, and maximizing your claim value.
            Our services are typically free for non-fault drivers, as all costs are recovered from the at-fault party. This means
            you get professional support without any upfront costs.
          </p>
        </div>
      ),
    },
    {
      question: "How much can I get from a car accident claim?",
      answer: (
        <div className="space-y-3">
          <p>
            The amount you can claim depends on several factors: the extent of vehicle damage, medical expenses, lost earnings,
            pain and suffering, and other related costs. There's no fixed amount - each claim is assessed individually based on
            your specific circumstances.
          </p>
          <p>
            Compensation typically covers: vehicle repair or replacement costs, credit hire charges, vehicle recovery and storage
            fees, medical expenses, lost wages, and compensation for pain and suffering. Our team works to ensure you receive the
            maximum compensation you're entitled to under the law.
          </p>
        </div>
      ),
    },
    {
      question: "What benefits can I claim after an accident?",
      answer: (
        <div className="space-y-3">
          <p>
            After a non-fault accident, you may be entitled to claim various benefits including: a replacement vehicle while
            yours is being repaired, vehicle recovery and storage costs, repair costs for your damaged vehicle, medical expenses
            and treatment costs, lost earnings if you're unable to work, compensation for pain and suffering, and compensation
            for any other out-of-pocket expenses.
          </p>
          <p>
            The specific benefits available depend on your circumstances and the nature of the accident. Our team can assess your
            case and identify all potential claims to ensure you receive full compensation.
          </p>
        </div>
      ),
    },
    {
      question: "Why use a credit hire company?",
      answer: (
        <div className="space-y-3">
          <p>
            Using a credit hire company provides several advantages: you get a replacement vehicle immediately without upfront
            payment, professional handling of all claim aspects, expertise in dealing with insurance companies, assistance with
            vehicle recovery and storage, help with repair arrangements, and support throughout the entire claims process.
          </p>
          <p>
            Credit hire companies specialize in non-fault accident claims and understand the legal and insurance processes. This
            expertise helps ensure you receive fair treatment and maximum compensation while minimizing your stress and inconvenience.
          </p>
        </div>
      ),
    },
    {
      question: "What is personal injury legally in the UK?",
      answer: (
        <div className="space-y-3">
          <p>
            In UK law, personal injury refers to any physical or psychological harm suffered as a result of someone else's negligence
            or wrongful act. This includes injuries from road traffic accidents, workplace accidents, medical negligence, and other
            incidents where another party is at fault.
          </p>
          <p>
            To make a successful personal injury claim, you must prove that: the other party owed you a duty of care, they breached
            that duty through negligence, and you suffered injury as a direct result. Compensation can cover medical expenses,
            lost earnings, care costs, and damages for pain and suffering. Our team can help assess whether you have a valid claim
            and guide you through the process.
          </p>
        </div>
      ),
    },
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
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
                  <span className="text-gold">FREQUENTLY ASKED QUESTIONS</span> (FAQ)
                </h1>
                <p className="text-lg opacity-90">
                  Home / FAQ's
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-primary">
                  <span className="text-gold">FREQUENTLY ASKED QUESTIONS</span> (FAQ)
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Left Column */}
                  <div>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      defaultValue={leftColumnFAQs.find(faq => faq.defaultOpen) ? "item-0" : undefined}
                    >
                      {leftColumnFAQs.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                          <AccordionTrigger className="text-left font-semibold text-base hover:no-underline py-4">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  {/* Right Column */}
                  <div>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      defaultValue={rightColumnFAQs.find(faq => faq.defaultOpen) ? "item-0" : undefined}
                    >
                      {rightColumnFAQs.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                          <AccordionTrigger className="text-left font-semibold text-base hover:no-underline py-4">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </div>
            </AnimatedSection>
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
                    className="bg-gold text-black hover:bg-gold/90 h-14 font-bold px-8 border-none"
                  >
                    START YOUR CLAIM
                  </Button>
                </Link>
                <a href="tel:+442087437469">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 h-14 font-bold px-8 border-none"
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
    </div>
  );
};

export default FAQ;

