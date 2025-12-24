import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { inquiriesApi } from "@/services/inquiriesApi";
import { cmsApi, type LandingPageConfig } from "@/services/cmsApi";
import { formatWhatsAppMessage, openWhatsApp } from "@/utils/whatsapp";
import { MessageCircle } from "lucide-react";


const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cmsConfig, setCmsConfig] = useState<LandingPageConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const loadCmsConfig = async () => {
      try {
        const config = await cmsApi.getConfig();
        setCmsConfig(config);
      } catch (error) {
        console.error("Failed to load CMS configuration:", error);
        // Continue with default values if CMS config fails to load
      } finally {
        setIsLoadingConfig(false);
      }
    };

    loadCmsConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await inquiriesApi.create({
        name: formData.get("name")?.toString() || "",
        email: formData.get("contactEmail")?.toString() || "",
        phone: formData.get("contactPhone")?.toString() || "",
        subject: formData.get("subject")?.toString() || "",
        message: formData.get("message")?.toString() || "",
        vehicle_interest: "",
        honeypot: "", // Empty honeypot field
      });

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Contact Us - AAA Accident Solutions LTD"
        description="Get in touch with our expert team 24/7. Fast response for accident claims, replacement vehicles, and insurance support across the UK."
        canonical="/contact"
        keywords="contact AAA Accident Solutions, accident helpline, 24/7 support, car hire contact UK"
      />
      <Navigation />

      <main className="flex-grow">
        <section
          className="relative py-24 bg-center bg-cover"
          style={{ backgroundImage: "url('/contactuspage.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 container px-4 mx-auto text-center text-white">
            <AnimatedSection>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl text-gold">Contact Us</h1>
              <p className="max-w-2xl mx-auto text-lg opacity-90">
                Get in touch with our team. We're here to help you 24/7.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <AnimatedSection delay={0}>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Phone className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-sm text-muted-foreground">
                      {cmsConfig?.contact_phone || "+44 (0) 800 011 6197"}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
              <AnimatedSection delay={100}>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Mail className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      {cmsConfig?.contact_email || "info@aaa-as.co.uk"}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MapPin className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {cmsConfig?.contact_address || "First Floor, The Urban Building, 3–9 Albert Street, Slough, SL1 2BE"}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      {cmsConfig?.contact_hours || "24/7 Emergency Service"}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatedSection delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gold">Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" name="name" required placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Address *</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          type="tel"
                          placeholder="+44 7700 900000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input id="subject" name="subject" required placeholder="How can we help?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                        />
                      </div>

                      {/* Hidden honeypot field */}
                      <input
                        type="text"
                        name="website"
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="submit"
                          size="lg"
                          className="flex-1 bg-gold text-black hover:bg-gold/90 h-14 font-bold border-none"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                        <Button
                          type="button"
                          size="lg"
                          className="flex-1 bg-white text-green-600 border border-green-600 hover:bg-green-50 h-14 font-bold"
                          onClick={() => {
                            const form = formRef.current;
                            if (!form) return;
                            const formData = new FormData(form);
                            const whatsappData = {
                              name: formData.get("name")?.toString() || "",
                              email: formData.get("contactEmail")?.toString() || "",
                              phone: formData.get("contactPhone")?.toString() || "",
                              subject: formData.get("subject")?.toString() || "",
                              message: formData.get("message")?.toString() || "",
                            };
                            const message = formatWhatsAppMessage(whatsappData, "contact");
                            const phoneNumber =
                              cmsConfig?.contact_phone || import.meta.env.VITE_WHATSAPP_PHONE || "+44 (0) 800 011 6197";
                            openWhatsApp(phoneNumber, message);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send on WhatsApp
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <div className="space-y-6">
                <AnimatedSection delay={200}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-gold">Visit Our Office</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg overflow-hidden bg-muted">
                        {cmsConfig?.google_map_embed_url ? (
                          <div dangerouslySetInnerHTML={{ __html: cmsConfig.google_map_embed_url }} />
                        ) : (
                          <iframe
                            title="AAA Accident Solutions LTD Office Location"
                            src="https://maps.google.com/maps?q=First+Floor,+The+Urban+Building,+3–9+Albert+Street,+Slough,+SL1+2BE&z=15&output=embed"
                            className="w-full h-[300px] border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                <AnimatedSection delay={300}>
                  <Card className="bg-black text-white border-0">
                    <CardHeader>
                      <CardTitle className="text-gold">Emergency Assistance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 opacity-90">
                        If you've been in an accident and need immediate assistance, please call our emergency line.
                      </p>
                      <div className="space-y-2">
                        <p className="font-semibold">24/7 Emergency Line:</p>
                        <p className="text-gold text-2xl font-bold">+44 (0) 800 011 6197</p>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
