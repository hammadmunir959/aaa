import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  Calendar,
  MessageSquare,
  BarChart3,
  ShoppingCart,
  FileText,
  ArrowRight
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const AdminHome = () => {
  const features = [
    {
      icon: <Car className="w-12 h-12 text-gold" />,
      title: "Vehicle Management",
      description: "Manage your entire fleet with ease. Track availability, maintenance, and vehicle details all in one place."
    },
    {
      icon: <Calendar className="w-12 h-12 text-gold" />,
      title: "Booking System",
      description: "Streamlined booking management with real-time availability, customer information, and automated confirmations."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-gold" />,
      title: "AI Chatbot",
      description: "Intelligent customer support with AI-powered chatbot that handles inquiries 24/7 and improves customer satisfaction."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-gold" />,
      title: "Analytics & Reports",
      description: "Comprehensive analytics dashboard with insights into bookings, revenue, customer behavior, and performance metrics."
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-gold" />,
      title: "Car Sales Platform",
      description: "Manage car listings, purchase requests, and sell requests through an integrated sales management system."
    },
    {
      icon: <FileText className="w-12 h-12 text-gold" />,
      title: "Content Management",
      description: "Easily manage blog posts, testimonials, team members, and landing page content with our intuitive CMS."
    }
  ];

  const services = [
    {
      icon: "🚙",
      title: "Accident Replacement Vehicles",
      description: "Immediate access to quality replacement vehicles when customers' cars are off the road due to accidents."
    },
    {
      icon: "🛡️",
      title: "Insurance Claim Management",
      description: "Seamless communication with insurance providers to ensure smooth claim processing and faster resolutions."
    },
    {
      icon: "👥",
      title: "Personal Client Support",
      description: "Dedicated support throughout the customer journey, from initial inquiry to vehicle return."
    },
    {
      icon: "📄",
      title: "Documentation Assistance",
      description: "Help with all necessary paperwork and documentation required for claims and bookings."
    },
    {
      icon: "⏰",
      title: "24/7 Emergency Service",
      description: "Round-the-clock availability for emergencies and urgent vehicle replacement needs."
    },
    {
      icon: "✅",
      title: "Quality Assurance",
      description: "All vehicles are regularly serviced and maintained to the highest standards for customer safety."
    }
  ];

  const stats = [
    { number: "24/7", label: "Customer Support" },
    { number: "100%", label: "Secure Platform" },
    { number: "AI", label: "Powered Solutions" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-black overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
            style={{ backgroundImage: "url('/car-auto-motor-insurance-reimbursement-vehicle-concept.jpg')" }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60 z-10" />

          <div className="container mx-auto px-4 relative z-20">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  Welcome to <span className="text-gold">AAA Accident Solutions LTD</span> Admin Portal
                </h1>
                <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Premium Car Hire Management - Your comprehensive platform for managing car rental operations, bookings, and customer services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/admin/register">
                    <Button size="lg" className="bg-gold text-black hover:bg-gold/90 text-lg px-8 group font-bold border-none">
                      Sign Up
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/admin/login">
                    <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black text-lg px-8 font-bold">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28 bg-background" id="features">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-5 text-foreground tracking-tight">
                  Platform Features
                </h2>
                <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Everything you need to manage your car rental business efficiently
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card className="h-full bg-black text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gold">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 lg:py-28 bg-muted" id="about">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground tracking-tight">
                  About AAA Accident Solutions LTD
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  AAA Accident Solutions LTD is a comprehensive platform designed to streamline
                  car rental operations. We provide accident replacement vehicles, insurance claim management,
                  and exceptional customer support services.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our platform empowers administrators with powerful tools to manage bookings, vehicles,
                  customer inquiries, and business operations efficiently. With AI-powered features and
                  real-time analytics, AAA Accident Solutions LTD helps you deliver exceptional service to your customers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {stats.map((stat, index) => (
                    <AnimatedSection key={index} delay={index * 0.1}>
                      <Card className="bg-black text-white border-0 shadow-lg">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl font-bold text-gold mb-2">{stat.number}</div>
                          <div className="text-gray-300 font-medium">{stat.label}</div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 lg:py-28 bg-background" id="services">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-5 text-foreground tracking-tight">
                  Our Services
                </h2>
                <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Comprehensive solutions for your car rental business
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card className="h-full bg-black text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8">
                      <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-gold">
                        <span className="text-2xl">{service.icon}</span>
                        {service.title}
                      </h4>
                      <p className="text-gray-300 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminHome;

