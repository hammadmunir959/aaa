import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Phone,
  Camera,
  FileText,
  Heart,
  Scale,
  Truck,
  DollarSign,
  CheckCircle2,
  Shield,
  Users,
  ClipboardList
} from "lucide-react";
import { Link } from "react-router-dom";

const WhatToDoAfterAccident = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/man-having-problem-with-his-car.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
                  <span className="text-gold">DON'T KNOW WHAT TO DO AFTER A CAR ACCIDENT?</span> WE ARE HERE TO ASSIST!
                </h1>
                <p className="text-lg opacity-90 mb-6">
                  Our team of experienced attorneys is here to guide you through the complex legal process.
                </p>
                <div className="flex gap-4">
                  <Link to="/make-claim">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 font-bold px-8 h-14 border-none">
                      Get a Free Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>



        {/* Section 1: Immediate Steps To Take After A Car Accident */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-gold">1.</span>
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Immediate Steps To Take After A Car Accident
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="order-2 lg:order-1 relative">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                      <img
                        src="/image-auto-accident-involving-two-cars.jpg"
                        alt="Immediate steps after accident"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Check Yourself for Injuries</h3>
                        <p className="text-muted-foreground">
                          First and foremost, assess your physical condition. Check yourself and any passengers for injuries.
                          If anyone is seriously injured, do not move them unless there is an immediate danger.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Move to a Safe Location/Park your car on a roadside</h3>
                        <p className="text-muted-foreground">
                          If your vehicle is still operational and you're not seriously injured, move it to the side of the road
                          or a safe location to avoid blocking traffic and prevent further accidents.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Turn on the car's Hazard Lights</h3>
                        <p className="text-muted-foreground">
                          Activate your hazard lights immediately to alert other drivers of the accident scene and make your
                          vehicle more visible, especially in low-light conditions or poor weather.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Section 2: Contact Emergency Services */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-gold">2.</span>
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Contact Emergency Services
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">When to Call the Police</h3>
                        <p className="text-muted-foreground">
                          Always call the police if there are injuries, significant property damage, or if the other driver
                          appears to be under the influence. A police report can be crucial for insurance claims and legal
                          proceedings. Even for minor accidents, having an official report can protect your interests.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Report the Accident to the Medical Services</h3>
                        <p className="text-muted-foreground">
                          If anyone is injured, call 999 immediately for medical assistance. Even if injuries seem minor,
                          it's important to get medical attention as some symptoms may not appear immediately. Document all
                          medical treatment received.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                      <img
                        src="/handsome-young-male-paramedic-talking-by-portable-radio-while-sitting-ambulance.jpg"
                        alt="Contact Emergency Services"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Section 3: Gather Information And Evidence */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-gold">3.</span>
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Gather Information And Evidence
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="order-2 lg:order-1 relative">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                      <img
                        src="/insurance-agent-working-site-car-accident-claim-process-people-car-insurance-claim (2).jpg"
                        alt="Gather Information And Evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Exchange the Information With Other Driver</h3>
                        <p className="text-muted-foreground">
                          Collect the other driver's name, contact information, driver's license number, insurance company
                          and policy number, vehicle registration number, and vehicle make/model. Provide your information
                          as well. Be polite but avoid discussing fault or admitting liability.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Take the Photos and Videos of Accident Scene</h3>
                        <p className="text-muted-foreground">
                          Document everything with photos and videos: damage to all vehicles, license plates, the accident
                          scene from multiple angles, road conditions, traffic signs, weather conditions, and any visible
                          injuries. This evidence can be crucial for your claim.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Record Witness Details and Statements</h3>
                        <p className="text-muted-foreground">
                          If there are witnesses, get their names, contact information, and brief statements about what they
                          saw. Witness testimony can be invaluable in determining fault and supporting your insurance claim.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Section 4: Reporting The Accident */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-gold">4.</span>
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Reporting The Accident
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Inform Your Insurance Company</h3>
                        <p className="text-muted-foreground">
                          Contact your insurance company as soon as possible, ideally within 24 hours of the accident.
                          Provide them with all the details and documentation you've collected. Be honest and accurate in
                          your account of what happened.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Fulfill the Legal Reporting Requirements</h3>
                        <p className="text-muted-foreground">
                          In the UK, you must report an accident to the police within 24 hours if someone was injured or
                          if there was significant damage. Failure to report can result in penalties. Keep copies of all
                          reports and correspondence.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Inform the DMV (Driving and Vehicle Licensing Agency)</h3>
                        <p className="text-muted-foreground">
                          If required by law in your jurisdiction, report the accident to the DVLA. This is typically necessary
                          for accidents involving injuries or significant property damage. Check your local requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                      <img
                        src="/pexels-rui-dias-469842-35162427.jpg"
                        alt="Reporting The Accident"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Section 5: Seek Medical Attention */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-gold">5.</span>
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Seek Medical Attention
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="order-2 lg:order-1 relative">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                      <img
                        src="/pexels-pavel-danilyuk-6753445.jpg"
                        alt="Seek Medical Attention"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Don't Ignore Delayed Symptoms</h3>
                        <p className="text-muted-foreground">
                          Some injuries, such as whiplash, concussions, or internal injuries, may not show symptoms immediately.
                          Even if you feel fine, it's important to see a doctor within 24-48 hours. Delayed medical attention
                          can not only harm your health but also weaken your personal injury claim.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Compile the Medical Records</h3>
                        <p className="text-muted-foreground">
                          Keep detailed records of all medical visits, treatments, medications, and expenses. This documentation
                          is essential for claiming medical expenses and proving the extent of your injuries in a personal injury
                          claim. Include receipts, doctor's notes, and treatment plans.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Section 6: Understanding Your Legal Rights And Responsibilities */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-gold">6.</span>
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Understanding Your Legal Rights And Responsibilities
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Determine Who's Liable for the Accident</h3>
                        <p className="text-muted-foreground">
                          Liability is determined based on negligence and fault. The at-fault party's insurance typically covers
                          damages. However, fault can be shared, and comparative negligence laws may apply. Consult with a legal
                          professional to understand your specific situation.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">What to Do if the Other Driver is Uninsured</h3>
                        <p className="text-muted-foreground">
                          If the other driver is uninsured, you may need to file a claim with your own insurance company under
                          uninsured motorist coverage. Keep all documentation and consider consulting with an attorney to ensure
                          you receive fair compensation.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">What if the Other Driver Leaves the Scene (Hit and Run)</h3>
                        <p className="text-muted-foreground">
                          If the other driver flees the scene, call the police immediately. Try to remember as many details as
                          possible about the vehicle (make, model, color, license plate). File a police report and contact your
                          insurance company. You may be covered under your uninsured motorist policy.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">What are the Legal Obligations After an Accident?</h3>
                        <p className="text-muted-foreground">
                          You have legal obligations to stop, provide information, and report the accident. Failure to do so
                          can result in criminal charges. You must also cooperate with insurance investigations and preserve
                          evidence. Consult with an attorney to understand your specific obligations.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                      <img
                        src="/pexels-rdne-7841506.jpg"
                        alt="Understanding Legal Rights"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Section 7: Call For Vehicle Recovery */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-gold">7.</span>
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Call For Vehicle Recovery
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <div className="order-2 lg:order-1 relative">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                      <img
                        src="/pexels-tim-samuel-5835017.jpg"
                        alt="Vehicle Recovery"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">When Do I Need Vehicle Recovery?</h3>
                        <p className="text-muted-foreground mb-4">
                          Vehicle recovery is necessary when your car is not drivable due to damage, safety concerns, or if it's
                          blocking traffic. Common scenarios include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                          <li>Severe structural damage that makes the vehicle unsafe to drive</li>
                          <li>Mechanical failure preventing the vehicle from operating</li>
                          <li>Vehicle is blocking traffic or creating a hazard</li>
                          <li>Police require the vehicle to be removed from the scene</li>
                          <li>Vehicle needs to be transported to a repair facility or storage location</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg mb-4">Vehicle Recovery Decision Factors</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-border p-3 text-left">Vehicle Type</th>
                              <th className="border border-border p-3 text-left">Damage Level</th>
                              <th className="border border-border p-3 text-left">Location</th>
                              <th className="border border-border p-3 text-left">Time of Day</th>
                              <th className="border border-border p-3 text-left">Weather Conditions</th>
                              <th className="border border-border p-3 text-left">Road Conditions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-border p-3">Car/Motorcycle</td>
                              <td className="border border-border p-3">Severe/Moderate</td>
                              <td className="border border-border p-3">Highway/Urban</td>
                              <td className="border border-border p-3">Day/Night</td>
                              <td className="border border-border p-3">Clear/Rain/Snow</td>
                              <td className="border border-border p-3">Dry/Wet/Icy</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Section 8: Claiming Compensation And Insurance Processes */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-gold">8.</span>
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Claiming Compensation And Insurance Processes
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">How to Prepare a Claim</h3>
                        <p className="text-muted-foreground mb-3">
                          To prepare a strong claim, gather and organize all documentation:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                          <li>Police report and accident scene photos</li>
                          <li>Medical records and bills</li>
                          <li>Vehicle repair estimates and receipts</li>
                          <li>Witness statements and contact information</li>
                          <li>Insurance correspondence</li>
                          <li>Lost wages documentation (if applicable)</li>
                          <li>Receipts for any out-of-pocket expenses</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Types of Damages</h3>
                        <p className="text-muted-foreground mb-3">
                          You may be entitled to compensation for various types of damages:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                          <li><strong>Property Damage:</strong> Vehicle repair or replacement costs</li>
                          <li><strong>Medical Expenses:</strong> Hospital bills, doctor visits, medications, therapy</li>
                          <li><strong>Lost Wages:</strong> Income lost due to injury-related inability to work</li>
                          <li><strong>Pain and Suffering:</strong> Physical and emotional distress</li>
                          <li><strong>Loss of Consortium:</strong> Impact on relationships and quality of life</li>
                          <li><strong>Future Medical Costs:</strong> Ongoing treatment and rehabilitation</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Negotiating with Insurance Companies</h3>
                        <p className="text-muted-foreground">
                          Insurance companies may try to minimize your claim. Be prepared to negotiate, but don't accept the
                          first offer if it seems inadequate. Consider consulting with an attorney who specializes in accident
                          claims. They can help you understand the true value of your claim and negotiate on your behalf.
                          Keep detailed records of all communications and never sign anything without understanding it fully.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full z-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(234, 179, 8, 0.2) 10px, rgba(234, 179, 8, 0.2) 12px)" }}></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold/20 rounded-full z-0"></div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl relative z-10">
                      <img
                        src="/pexels-mikhail-nilov-8943323.jpg"
                        alt="Claiming Compensation"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-16 lg:py-24 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/pexels-ann-h-45017-32437427.jpg')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Need Help After Your Accident?
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Our experienced team is here to guide you through every step of the process. From vehicle recovery to
                  insurance claims, we're here to help you get back on the road.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/make-claim">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 font-bold px-8 h-14 border-none">
                      Get a Free Consultation
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-14 px-8 border-none">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WhatToDoAfterAccident;

