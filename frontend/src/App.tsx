import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ThemeProvider from "@/components/ThemeProvider";
import { ThemeProvider as EventThemeProvider } from "@/context/ThemeContext";
import ThemeAnimations from "@/components/ThemeAnimations";
import ThemePopup from "@/components/ThemePopup";
import ThemeScrollingMessage from "@/components/ThemeScrollingMessage";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";

import AIChatWidget from "@/components/AIChatWidget";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnalyticsManager from "@/components/AnalyticsManager";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MakeClaim from "./pages/MakeClaim";
import Contact from "./pages/Contact";
import WhatWeDo from "./pages/WhatWeDo";
import PersonalAssistance from "./pages/PersonalAssistance";
import IntroducerSupport from "./pages/IntroducerSupport";
import InsuranceServices from "./pages/InsuranceServices";
import ReplacementVehicle from "./pages/ReplacementVehicle";
import AccidentClaimManagement from "./pages/AccidentClaimManagement";
import CarRecoveryAndStorage from "./pages/CarRecoveryAndStorage";
import AccidentalRepair from "./pages/AccidentalRepair";
import PCOReplacement from "./pages/PCOReplacement";
import OurFleet from "./pages/OurFleet";
import CarSaleBuy from "./pages/CarSaleBuy";
import About from "./pages/About";
import OurBlogs from "./pages/OurBlogs";
import WhatToDoAfterAccident from "./pages/WhatToDoAfterAccident";
import FAQ from "./pages/FAQ";
import CustomerTestimonials from "./pages/CustomerTestimonials";
import RoadTrafficAccidents from "./pages/RoadTrafficAccidents";
import AdminHome from "./pages/AdminHome";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";
import AdminStatus from "./pages/AdminStatus";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminConfigurations from "./pages/SuperAdminConfigurations";
import AdminDashboard from "./pages/AdminDashboard";
import Vehicles from "./pages/Vehicles";
import Bookings from "./pages/Bookings";
import Inquiries from "./pages/Inquiries";
import NewsManagement from "./pages/News";
import TestimonialsManagement from "./pages/Testimonials";
import CarSales from "./pages/CarSales";
import CarSalesManagement from "./pages/CarSalesManagement";
import PurchaseRequests from "./pages/PurchaseRequests";
import AdminActivity from "./pages/AdminActivity";
import WebAnalytics from "./pages/WebAnalytics";
import NewsletterManagement from "./pages/NewsletterManagement";
import Unsubscribe from "./pages/Unsubscribe";
import CMS from "./pages/CMS";
import ChatbotContext from "./pages/ChatbotContext";
import ChatbotSessions from "./pages/ChatbotSessions";
import ChatbotSettings from "./pages/ChatbotSettings";
import Staff from "./pages/Staff";
import ThemesManagement from "./pages/ThemesManagement";
import DataBackup from "./pages/DataBackup";

import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";

const DashboardLegacyRedirect = () => {
  const location = useLocation();
  const subPath = location.pathname.replace(/^\/dashboard/, "");
  const targetPath = `/admin/dashboard${subPath}`;

  return (
    <Navigate
      to={{
        pathname: targetPath,
        search: location.search,
        hash: location.hash,
      }}
      replace
    />
  );
};

const queryClient = new QueryClient();

import WhatsAppButton from "@/components/WhatsAppButton";

// Component to conditionally render AIChatWidget and WhatsAppButton (hide on admin routes)
const ConditionalChatWidget = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin');

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <AIChatWidget />
      <WhatsAppButton />
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <EventThemeProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <ThemeAnimations />
                <ThemePopup />
                <CookieConsent />
                <AnalyticsManager />
                <ConditionalChatWidget />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/make-claim" element={<MakeClaim />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/our-fleet" element={<OurFleet />} />
                  <Route path="/car-sales" element={<CarSales />} />
                  <Route path="/what-we-do" element={<WhatWeDo />} />
                  <Route path="/unsubscribe" element={<Unsubscribe />} />
                  <Route path="/personal-assistance" element={<PersonalAssistance />} />
                  <Route path="/introducer-support" element={<IntroducerSupport />} />
                  <Route path="/insurance-services" element={<InsuranceServices />} />
                  <Route path="/replacement-vehicle" element={<ReplacementVehicle />} />
                  <Route path="/accident-claim-management" element={<AccidentClaimManagement />} />
                  <Route path="/car-recovery-and-storage" element={<CarRecoveryAndStorage />} />
                  <Route path="/accidental-repair" element={<AccidentalRepair />} />
                  <Route path="/pco-replacement" element={<PCOReplacement />} />
                  <Route path="/car-sale-buy" element={<CarSaleBuy />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/our-blogs" element={<OurBlogs />} />
                  <Route path="/what-to-do-after-accident" element={<WhatToDoAfterAccident />} />
                  <Route path="/faqs" element={<FAQ />} />
                  <Route path="/testimonials" element={<CustomerTestimonials />} />
                  <Route path="/road-traffic-accidents" element={<RoadTrafficAccidents />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  {/* Admin landing and auth routes */}
                  <Route path="/admin/home" element={<AdminHome />} />
                  <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
                  <Route path="/admin/register" element={<AdminRegister />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                  <Route path="/admin/otp-verification" element={<OTPVerification />} />
                  <Route path="/admin/reset-password" element={<ResetPassword />} />
                  <Route path="/admin/status" element={<AdminStatus />} />

                  <Route element={<ProtectedRoute allowedRoles={["super-admin"]} />}>
                    <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
                    <Route path="/super-admin/configs" element={<SuperAdminConfigurations />} />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={["admin", "super-admin"]} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    {/* CMS consolidated routes */}
                    <Route path="/admin/dashboard/cms" element={<Navigate to="/admin/dashboard/cms/car-sales" replace />} />

                    <Route path="/admin/dashboard/cms/car-sales" element={<CMS />} />
                    <Route path="/admin/dashboard/cms/news" element={<CMS />} />
                    <Route path="/admin/dashboard/cms/testimonials" element={<CMS />} />
                    <Route path="/admin/dashboard/cms/staff" element={<CMS />} />
                    <Route path="/admin/dashboard/chatbot" element={<ChatbotSessions />} />
                    {/* Legacy routes → redirect to CMS */}
                    <Route path="/admin/dashboard/vehicles" element={<Navigate to="/admin/dashboard/cms/car-sales" replace />} />
                    {/* Consolidated Inquiries hub with section-specific URLs */}
                    <Route path="/admin/dashboard/inquiries" element={<Navigate to="/admin/dashboard/inquiries/messages" replace />} />
                    <Route path="/admin/dashboard/inquiries/messages" element={<Inquiries />} />
                    <Route path="/admin/dashboard/inquiries/purchase-requests" element={<Inquiries />} />
                    <Route path="/admin/dashboard/inquiries/sell-requests" element={<Inquiries />} />
                    <Route path="/admin/dashboard/inquiries/bookings" element={<Inquiries />} />
                    <Route path="/admin/dashboard/activity" element={<AdminActivity />} />
                    <Route path="/admin/dashboard/web-analytics" element={<WebAnalytics />} />
                    <Route path="/admin/dashboard/car-sales" element={<Navigate to="/admin/dashboard/cms/car-sales" replace />} />
                    {/* Legacy routes → redirect to Inquiries hub */}
                    <Route path="/admin/dashboard/bookings" element={<Navigate to="/admin/dashboard/inquiries/bookings" replace />} />
                    <Route path="/admin/dashboard/purchase-requests" element={<Navigate to="/admin/dashboard/inquiries/purchase-requests" replace />} />
                    <Route path="/admin/dashboard/news" element={<Navigate to="/admin/dashboard/cms/news" replace />} />
                    {/* Newsletter routes with section-specific URLs */}
                    <Route path="/admin/dashboard/newsletter" element={<Navigate to="/admin/dashboard/newsletter/subscribers" replace />} />
                    <Route path="/admin/dashboard/newsletter/subscribers" element={<NewsletterManagement />} />
                    <Route path="/admin/dashboard/newsletter/campaigns" element={<NewsletterManagement />} />
                    <Route path="/admin/dashboard/testimonials" element={<TestimonialsManagement />} />
                    <Route path="/admin/dashboard/staff" element={<Navigate to="/admin/dashboard/cms/staff" replace />} />
                    <Route path="/admin/dashboard/themes" element={<ThemesManagement />} />
                    <Route path="/admin/dashboard/backup" element={<DataBackup />} />

                  </Route>
                  <Route path="/admin/admin-dashboard/*" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/super-admin-dashboard/*" element={<Navigate to="/super-admin/dashboard" replace />} />
                  <Route path="/super-admin-dashboard/*" element={<Navigate to="/super-admin/dashboard" replace />} />
                  <Route path="/dashboard/*" element={<DashboardLegacyRedirect />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </EventThemeProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
