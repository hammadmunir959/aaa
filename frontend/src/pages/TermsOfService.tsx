import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { FileText, Shield, Scale } from "lucide-react";

const TermsOfService = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url('/pexels-mikhail-nilov-8730374.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gold">Terms of Service</h1>
                </div>
                <p className="text-lg opacity-90">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection>
                <div className="prose prose-lg max-w-none">
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-gold">1. Introduction</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Welcome to AAA Accident Solutions LTD ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website, services, and any related platforms operated by AAA Accident Solutions LTD.
                    </p>
                    <p className="text-muted-foreground">
                      By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our services.
                    </p>
                  </div>

                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-gold">2. Services</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      AAA Accident Solutions LTD provides accident management services, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>Credit hire and replacement vehicle services</li>
                      <li>Insurance claim management and assistance</li>
                      <li>Vehicle recovery and storage services</li>
                      <li>Accident repair coordination</li>
                      <li>Personal injury claim support</li>
                    </ul>
                    <p className="text-muted-foreground">
                      We provide these services exclusively to non-fault victims of road traffic accidents within the United Kingdom.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">3. Eligibility</h2>
                    <p className="text-muted-foreground mb-4">
                      To use our services, you must:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>Be at least 18 years of age</li>
                      <li>Be a non-fault party in a road traffic accident</li>
                      <li>Hold valid motor insurance</li>
                      <li>Provide accurate and complete information</li>
                      <li>Comply with all applicable laws and regulations</li>
                    </ul>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">4. Service Agreement</h2>
                    <p className="text-muted-foreground mb-4">
                      When you engage our services, you enter into a contractual agreement with AAA Accident Solutions LTD. By proceeding with our services, you acknowledge and agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>The terms and conditions set out in our credit hire agreement</li>
                      <li>Our right to recover costs from the at-fault party's insurer</li>
                      <li>Your obligation to provide accurate information about the accident</li>
                      <li>Your cooperation in the claims process</li>
                    </ul>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">5. Fees and Charges</h2>
                    <p className="text-muted-foreground mb-4">
                      Our services are provided on a credit hire basis, meaning:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>You will not be charged for our services if you are a non-fault party</li>
                      <li>We recover our costs directly from the at-fault party's insurer</li>
                      <li>No upfront payments or deposits are required</li>
                      <li>All charges are subject to successful recovery from the third party</li>
                    </ul>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">6. Vehicle Use</h2>
                    <p className="text-muted-foreground mb-4">
                      When using our replacement vehicles, you must:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>Hold a valid UK driving licence</li>
                      <li>Use the vehicle only for personal purposes</li>
                      <li>Maintain the vehicle in good condition</li>
                      <li>Report any damage or incidents immediately</li>
                      <li>Return the vehicle when your claim is resolved</li>
                      <li>Comply with all traffic laws and regulations</li>
                    </ul>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">7. Claims Process</h2>
                    <p className="text-muted-foreground mb-4">
                      We will manage your insurance claim on your behalf. You agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>Provide accurate and truthful information</li>
                      <li>Cooperate fully with the claims process</li>
                      <li>Respond promptly to any requests for information</li>
                      <li>Authorise us to communicate with relevant parties on your behalf</li>
                    </ul>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">8. Limitation of Liability</h2>
                    <p className="text-muted-foreground mb-4">
                      To the maximum extent permitted by law:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>Our liability is limited to the provision of the agreed services</li>
                      <li>We are not liable for indirect, consequential, or special damages</li>
                      <li>We are not responsible for delays caused by third parties</li>
                      <li>Our total liability shall not exceed the fees paid for our services</li>
                    </ul>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">9. Intellectual Property</h2>
                    <p className="text-muted-foreground mb-4">
                      All content on this website, including text, graphics, logos, and software, is the property of AAA Accident Solutions LTD and is protected by copyright and other intellectual property laws.
                    </p>
                    <p className="text-muted-foreground">
                      You may not reproduce, distribute, or create derivative works from our content without express written permission.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">10. Termination</h2>
                    <p className="text-muted-foreground mb-4">
                      We reserve the right to terminate or suspend access to our services immediately, without prior notice, for any breach of these Terms.
                    </p>
                    <p className="text-muted-foreground">
                      You may terminate our services at any time, subject to any outstanding obligations or fees that may apply.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">11. Changes to Terms</h2>
                    <p className="text-muted-foreground mb-4">
                      We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on this page and updating the "Last updated" date.
                    </p>
                    <p className="text-muted-foreground">
                      Your continued use of our services after any changes constitutes acceptance of the new Terms.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">12. Governing Law</h2>
                    <p className="text-muted-foreground mb-4">
                      These Terms shall be governed by and construed in accordance with the laws of England and Wales.
                    </p>
                    <p className="text-muted-foreground">
                      Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">13. Contact Information</h2>
                    <p className="text-muted-foreground mb-4">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <div className="bg-muted p-6 rounded-lg">
                      <p className="text-muted-foreground mb-2"><strong>AAA Accident Solutions LTD</strong></p>
                      <p className="text-muted-foreground mb-2">Email: info@aaa-as.co.uk</p>
                      <p className="text-muted-foreground">Website: www.aaa-as.co.uk</p>
                    </div>
                  </div>
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

export default TermsOfService;

