import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 z-10" />

          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
            style={{
              backgroundImage: "url('/pexels-olly-3760072.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-20">
            <AnimatedSection>
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gold">Privacy Policy</h1>
                </div>
                <p className="text-lg opacity-90 text-gray-300">
                  Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="mt-4 text-gray-400 max-w-2xl">
                  A transparent overview of how we handle your data for accident management and vehicle hire services.
                </p>
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
                  {/* 1. Introduction */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gold mb-6">1. Introduction</h2>
                    <p className="text-muted-foreground mb-4">
                      AAA Accident Solutions LTD ("we," "our," or "us") operates as a Data Controller registered with the Information Commissioner's Office (ICO). We are dedicated to processing your data securely and in strict compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                    </p>
                  </div>

                  {/* 2. Data Collection */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gold mb-6">2. Information We Collect</h2>
                    <p className="text-muted-foreground mb-4">
                      We strictly collect only the data necessary to provide replacement vehicles, manage accident claims, and liaise with insurers. This includes:
                    </p>

                    <div className="space-y-6">
                      <div className="bg-muted/30 p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-bold text-gold mb-3">2.1 Driver & Identity Data</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Full Name, Current Address, and Contact Details.</li>
                          <li>Driving Licence Number and history.</li>
                          <li>Identity verification documents (e.g., Passport, Utility Bills).</li>
                          <li>National Insurance Number (where required for injury claims).</li>
                        </ul>
                      </div>

                      <div className="bg-muted/30 p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-bold text-gold mb-3">2.2 Vehicle & Insurance Data</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Vehicle Registration Number (VRN), Make, Model, and Mileage.</li>
                          <li>Insurance Policy numbers and coverage details.</li>
                          <li>MOT and Road Tax status.</li>
                        </ul>
                      </div>

                      <div className="bg-muted/30 p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-bold text-gold mb-3">2.3 Incident Details</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Date, time, and location of the accident.</li>
                          <li>Photographic evidence of damage and scene.</li>
                          <li>Third-party driver details and witness statements.</li>
                          <li>Police reference numbers (if applicable).</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 3. Usage */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gold mb-6">3. How We Use Your Data</h2>
                    <p className="text-muted-foreground mb-4">
                      Your data is processed solely for the performance of our contract and legitimate business interests, specifically to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Assess liability and validity of the accident claim.</li>
                      <li>Arrange and authorise credit hire (replacement) vehicles.</li>
                      <li>Recover costs from the at-fault party's insurer.</li>
                      <li>Facilitate vehicle repairs and engineering inspections.</li>
                      <li>Comply with legal obligations (e.g., reporting to police or insurers).</li>
                    </ul>
                  </div>

                  {/* 4. Data Sharing */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gold mb-6">4. Data Sharing</h2>
                    <p className="text-muted-foreground mb-4">
                      We do not sell your data. We share data only with authorised third parties involved in the claims process, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li><strong>Insurers:</strong> Your insurer and the at-fault party's insurer.</li>
                      <li><strong>Legal Counsel:</strong> Solicitors appointed to manage injury or loss recovery.</li>
                      <li><strong>Repairers & Engineers:</strong> Approved garages and vehicle assessors.</li>
                      <li><strong>Authorities:</strong> Police or DVLA when legally mandated.</li>
                    </ul>
                  </div>

                  {/* 5. Security & Retention */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gold mb-6">5. Security & Retention</h2>
                    <p className="text-muted-foreground mb-4">
                      We utilise enterprise-grade encryption and access controls to protect your data. Data related to claims is retained for 7 years to satisfy legal limitation periods for civil litigation and auditing purposes, after which it is securely destroyed.
                    </p>
                  </div>

                  {/* 6. Your Rights */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gold mb-6">6. Your Rights</h2>
                    <p className="text-muted-foreground mb-4">
                      Under UK GDPR, you have the right to request access, rectification, or erasure of your data. You may also object to processing based on legitimate interests.
                    </p>
                    <p className="text-muted-foreground">
                      To exercise these rights, please contact our Data Protection Officer below.
                    </p>
                  </div>

                  {/* 7. Contact */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gold mb-6">7. Contact Us</h2>
                    <div className="bg-black text-white p-8 rounded-2xl shadow-lg border border-gray-800">
                      <p className="text-xl font-bold text-gold mb-4">Data Protection Officer</p>
                      <p className="text-gray-300 mb-2">AAA Accident Solutions LTD</p>
                      <p className="text-gray-300 mb-2">Email: info@aaa-as.co.uk</p>
                      <p className="text-gray-300 mb-6">Website: www.aaa-as.co.uk</p>
                      <div className="border-t border-gray-700 pt-6">
                        <p className="text-sm text-gray-400">
                          You have the right to lodge a complaint with the ICO (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.ico.org.uk</a>) if you believe your rights have been violated.
                        </p>
                      </div>
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

export default PrivacyPolicy;

