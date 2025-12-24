import {
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
  MessageSquare,
  Star,
  Bell,
  ShoppingCart,
  ChevronRight,
  Palette,
  Sparkles,
  Heart,
  ShoppingBag,
  Gift,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardNavBar from "@/components/DashboardNavBar";
import AnimatedSection from "@/components/AnimatedSection";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/dashboardApi";
import type { ActivityItem, BookingTrend, SummaryStats } from "@/services/dashboardApi";

import { adminInquiriesApi, type AdminInquiry } from "@/services/adminInquiriesApi";
import { adminCarSalesApi, type CarPurchaseRequest } from "@/services/adminCarSalesApi";
import { claimsApi, type Claim } from "@/services/claimsApi";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { useTheme as useEventTheme } from "@/context/ThemeContext";
import { themeApi } from "@/services/themeApi";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch data from API using React Query
  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useQuery<SummaryStats, Error>({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 60 * 1000,
  });

  const { data: bookingTrendsData, isLoading: isLoadingBookings, error: bookingError } = useQuery<BookingTrend[], Error>({
    queryKey: ['dashboard-bookings'],
    queryFn: dashboardApi.getBookingTrends,
    staleTime: 60 * 1000,
  });

  const { data: recentActivities, isLoading: isLoadingActivity, error: activityError } = useQuery<ActivityItem[], Error>({
    queryKey: ['dashboard-activity'],
    queryFn: dashboardApi.getRecentActivity,
    staleTime: 60 * 1000,
  });

  // Fetch latest notifications
  const { data: latestInquiries = [], isLoading: isLoadingInquiries } = useQuery<AdminInquiry[], Error>({
    queryKey: ['dashboard-latest-inquiries'],
    queryFn: async () => {
      const data = await adminInquiriesApi.list();
      return data.slice(0, 5); // Get latest 5
    },
    staleTime: 30 * 1000,
  });

  const { data: latestPurchaseRequests = [], isLoading: isLoadingPurchaseRequests } = useQuery<CarPurchaseRequest[], Error>({
    queryKey: ['dashboard-latest-purchase-requests'],
    queryFn: async () => {
      const data = await adminCarSalesApi.listPurchaseRequests();
      return data.slice(0, 5); // Get latest 5
    },
    staleTime: 30 * 1000,
  });

  const { data: latestClaims = [], isLoading: isLoadingClaims } = useQuery<Claim[], Error>({
    queryKey: ['dashboard-latest-claims'],
    queryFn: async () => {
      const data = await claimsApi.list();
      return data.slice(0, 5); // Get latest 5
    },
    staleTime: 30 * 1000,
  });

  const safeTrendData = Array.isArray(bookingTrendsData) ? bookingTrendsData : [];
  const safeRecentActivities = Array.isArray(recentActivities) ? recentActivities : [];
  const recentActivityPreview = safeRecentActivities.slice(0, 5);

  const dashboardErrors = [
    summaryError,
    bookingError,
    activityError,
  ].filter((error): error is Error => Boolean(error));

  const trendChartConfig = {
    bookings: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
    inquiries: {
      label: "Inquiries",
      color: "hsl(var(--chart-2))",
    },
    purchaseRequests: {
      label: "Purchase Requests",
      color: "hsl(var(--chart-3))",
    },
  };

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  // Event-based theme selection
  const { theme: activeTheme, refreshTheme } = useEventTheme();
  const { toast } = useToast();
  const [isSettingTheme, setIsSettingTheme] = useState(false);

  const themes = [
    {
      id: "default",
      name: "Default",
      description: "Standard theme",
      icon: <Palette className="w-5 h-5" />,
      color: "bg-blue-500",
      primaryColor: "#0b5cff",
      secondaryColor: "#00d4ff"
    },
    {
      id: "christmas",
      name: "Christmas",
      description: "Festive holiday theme",
      icon: <Gift className="w-5 h-5" />,
      color: "bg-red-600",
      primaryColor: "#C4122E",
      secondaryColor: "#0B6B3A"
    },
    {
      id: "valentine",
      name: "Valentine's Day",
      description: "Romantic theme",
      icon: <Heart className="w-5 h-5" />,
      color: "bg-pink-500",
      primaryColor: "#FF69B4",
      secondaryColor: "#FFC0CB"
    },
    {
      id: "eid",
      name: "Eid",
      description: "Celebration theme",
      icon: <Star className="w-5 h-5" />,
      color: "bg-green-600",
      primaryColor: "#2E7D32",
      secondaryColor: "hsl(196, 47%, 34%)"
    },
    {
      id: "black_friday",
      name: "Black Friday",
      description: "Sale event theme",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "bg-black",
      primaryColor: "#000000",
      secondaryColor: "#FF0000"
    },
    {
      id: "new_year",
      name: "New Year",
      description: "New year celebration",
      icon: <Sparkles className="w-5 h-5" />,
      color: "bg-accent",
      primaryColor: "hsl(196, 47%, 34%)",
      secondaryColor: "#000000"
    }
  ];

  const handleThemeSelect = async (themeKey: string) => {
    setIsSettingTheme(true);
    try {
      await themeApi.setPreviewTheme(themeKey);
      await refreshTheme();
      toast({
        title: "Theme Preview Enabled",
        description: `Previewing "${themes.find(t => t.id === themeKey)?.name || themeKey}" theme. Refresh the page to see changes.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set preview theme",
        variant: "destructive",
      });
    } finally {
      setIsSettingTheme(false);
    }
  };

  const handleClearPreview = async () => {
    setIsSettingTheme(true);
    try {
      await themeApi.setPreviewTheme(null);
      await refreshTheme();
      toast({
        title: "Preview Disabled",
        description: "Active theme will be used based on events.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clear preview",
        variant: "destructive",
      });
    } finally {
      setIsSettingTheme(false);
    }
  };

  const formatNumber = (value?: number | null) => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return "—";
  };

  const formatDurationShort = (seconds?: number | null) => {
    if (seconds === undefined || seconds === null || seconds <= 0) return "0m";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m ${Math.round(remainingSeconds)}s`;
  };



  /* REMOVED ANALYTICS KPIS - DB TABLE DISABLED
   * Replaced with operational metrics (Bookings, Fleet, Inquiries)
   */
  const heroHighlights = [
    summaryData?.totalBookings !== undefined && {
      label: "Total Bookings",
      value: formatNumber(summaryData?.totalBookings),
    },
    summaryData?.totalVehicles !== undefined && {
      label: "Fleet Size",
      value: "10",
    },
    summaryData?.inquiries !== undefined && {
      label: "Inquiries (Total)",
      value: formatNumber(summaryData?.inquiries),
    },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const fallbackHighlights = [
    {
      label: "Total bookings",
      value: summaryData ? formatNumber(summaryData.totalBookings) : "0",
    },
    {
      label: "Fleet size",
      value: "10",
    },
    {
      label: "Inquiries today",
      value: summaryData ? formatNumber(summaryData.inquiries) : "0",
    },
  ];

  const displayHighlights = heroHighlights.length ? heroHighlights : fallbackHighlights;

  const secondaryMetrics = [
    summaryData?.carListings !== undefined && {
      label: "Car Listings",
      value: formatNumber(summaryData.carListings),
    },
    summaryData?.purchaseRequests !== undefined && {
      label: "Purchase Requests",
      value: formatNumber(summaryData.purchaseRequests),
    },
    summaryData?.testimonials !== undefined && {
      label: "Testimonials",
      value: formatNumber(summaryData.testimonials),
    },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const fallbackSecondary = [
    {
      label: "Testimonials live",
      value: summaryData ? formatNumber(summaryData.testimonials) : "0",
    },
    {
      label: "Inquiries today",
      value: summaryData ? formatNumber(summaryData.inquiries) : "0",
    },
  ];

  const displaySecondary = secondaryMetrics.length ? secondaryMetrics : fallbackSecondary;
  const hasDashboardErrors = dashboardErrors.length > 0;

  const formatActivityTimestamp = (timestamp?: string) => {
    if (!timestamp) return "Just now";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  // Combine and sort all notifications by date
  const allNotifications = useMemo(() => {
    const notifications: Array<{
      id: string;
      type: 'inquiry' | 'purchase_request' | 'claim';
      title: string;
      subtitle: string;
      timestamp: string;
      icon: React.ReactNode;
      route: string;
    }> = [];

    latestInquiries.forEach((inquiry) => {
      notifications.push({
        id: `inquiry-${inquiry.id}`,
        type: 'inquiry',
        title: inquiry.subject,
        subtitle: `${inquiry.name} • ${inquiry.email}`,
        timestamp: inquiry.created_at,
        icon: <MessageSquare className="w-4 h-4 text-primary" />,
        route: '/admin/dashboard/inquiries',
      });
    });

    latestPurchaseRequests.forEach((request) => {
      notifications.push({
        id: `purchase-${request.id}`,
        type: 'purchase_request',
        title: `Purchase Request for ${request.car_listing_title || 'Car'}`,
        subtitle: `${request.name} • ${request.email}`,
        timestamp: request.created_at,
        icon: <ShoppingCart className="w-4 h-4 text-primary" />,
        route: '/admin/dashboard/purchase-requests',
      });
    });

    latestClaims.forEach((claim) => {
      notifications.push({
        id: `claim-${claim.id}`,
        type: 'claim',
        title: `Booking from ${claim.first_name} ${claim.last_name}`,
        subtitle: `${claim.vehicle_registration} • ${claim.status}`,
        timestamp: claim.created_at,
        icon: <Calendar className="w-4 h-4 text-primary" />,
        route: '/admin/dashboard/bookings',
      });
    });

    // Sort by timestamp (newest first) and limit to 3 latest notifications
    return notifications.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    }).slice(0, 3); // Show only the 3 most recent
  }, [latestInquiries, latestPurchaseRequests, latestClaims]);

  const isLoadingNotifications = isLoadingInquiries || isLoadingPurchaseRequests || isLoadingClaims;

  return (
    <div
      className="min-h-screen flex flex-col bg-background bg-[radial-gradient(circle_at_top,_hsl(var(--gold)/0.15),_transparent_60%)]"
      data-admin-area
    >
      {/* Header Bar */}
      <DashboardHeader />

      {/* Navigation Bar */}
      <DashboardNavBar />

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <AnimatedSection>
            {hasDashboardErrors && (
              <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Unable to load some dashboard data. {dashboardErrors[0].message}
              </div>
            )}

            {/* Hero */}
            <section className="mb-10 grid gap-6 xl:grid-cols-[2fr,1fr]">
              <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white shadow-2xl">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col gap-6 p-8">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/70">
                    <TrendingUp className="w-4 h-4 text-white" />
                    Executive Overview
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-white">Admin Control Centre</h1>
                    <p className="mt-2 text-base text-white/80 max-w-2xl">
                      Monitor bookings, fleet performance, customer conversations, and sales momentum
                      from one adaptive workspace.
                    </p>
                  </div>
                  {/* Primary CTA buttons removed as requested */}
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {displayHighlights.map((highlight) => (
                      <div
                        key={highlight.label}
                        className="rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                          {highlight.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">{highlight.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border bg-card/80 p-6 shadow-md backdrop-blur">
                <div className="mb-6 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Recent Activity
                    </p>
                    <h3 className="text-xl font-semibold text-foreground">Latest Notifications</h3>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    Live
                  </span>
                </div>
                <div className="space-y-3">
                  {isLoadingNotifications ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : allNotifications.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground">No recent notifications</p>
                    </div>
                  ) : (
                    allNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => navigate(notification.route)}
                        className="w-full text-left rounded-2xl border border-border/60 bg-background/60 p-4 shadow-sm transition-all hover:border-primary/40 hover:bg-background hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {notification.subtitle}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatActivityTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
                {allNotifications.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => {
                        // Navigate to the most recent notification's route
                        if (allNotifications.length > 0) {
                          navigate(allNotifications[0].route);
                        }
                      }}
                    >
                      View All Notifications
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* Main Trend Graph */}
            <section className="mb-10">
              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-1 text-foreground">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Performance Trends
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Monthly bookings, inquiries, and purchase requests
                  </p>
                </div>
                <div>
                  {isLoadingBookings ? (
                    <div className="flex items-center justify-center h-[350px]">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : safeTrendData.length > 0 ? (
                    <ChartContainer config={trendChartConfig} className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={safeTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="month"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                          <Line
                            type="monotone"
                            dataKey="bookings"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="inquiries"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="purchaseRequests"
                            stroke="hsl(var(--chart-3))"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </section>



            {/* Recent Activity */}
            <section className="mb-10">
              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                  </div>
                  <Link
                    to="/admin/dashboard/activity"
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary transition hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-full px-3 py-1"
                  >
                    Show all
                    <span aria-hidden>→</span>
                  </Link>
                </div>
                {isLoadingActivity ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : recentActivityPreview.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {recentActivityPreview.map((activity) => (
                      <li key={activity.id} className="flex items-start gap-3 py-4">
                        <span className="text-lg flex-shrink-0">{activity.icon}</span>
                        <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-sm text-foreground">{activity.text}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatActivityTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No recent activity
                  </p>
                )}
              </div>
            </section>

            {/* Theme Selection */}
            <section className="mb-12">
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Event Theming</p>
                  <h2 className="text-xl font-bold text-foreground">Select Theme</h2>
                </div>
                <div className="flex items-center gap-3">
                  {activeTheme?.preview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearPreview}
                      disabled={isSettingTheme}
                      className="text-xs"
                    >
                      Clear Preview
                    </Button>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Preview event-based themes
                  </p>
                </div>
              </div>
              {activeTheme && (
                <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Current Active Theme:</span> {activeTheme.theme.name}
                    {activeTheme.event && ` (Event: ${activeTheme.event.name})`}
                    {activeTheme.preview && <span className="ml-2 text-primary">(Preview Mode)</span>}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {themes.map((themeOption) => {
                  const isSelected = activeTheme?.theme_key === themeOption.id;
                  const isPreview = activeTheme?.preview && isSelected;
                  return (
                    <button
                      key={themeOption.id}
                      onClick={() => handleThemeSelect(themeOption.id)}
                      disabled={isSettingTheme}
                      className={`group relative rounded-2xl border-2 p-6 shadow-sm transition-all text-left ${isSelected
                        ? "border-primary bg-primary/5 hover:border-primary/80"
                        : "border-border/60 bg-card/80 hover:-translate-y-1 hover:border-primary/40"
                        } ${isSettingTheme ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <div className="rounded-full bg-primary p-1.5">
                            <Palette className="w-3 h-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                      <div className={`mb-4 inline-flex rounded-2xl ${themeOption.color} p-3 text-white shadow-md`}>
                        {themeOption.icon}
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{themeOption.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{themeOption.description}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: themeOption.primaryColor }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: themeOption.secondaryColor }}
                        />
                      </div>
                      {isSelected && (
                        <div className="mt-4 text-xs font-medium text-primary">
                          {isPreview ? "Preview Active ✓" : "Active Theme ✓"}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </AnimatedSection>
        </div>
      </main>

      {/* Quick Actions - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 md:flex-row">
        <button
          onClick={() => navigate("/admin/dashboard/inquiries/messages")}
          className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
        >
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span>New Inquiry</span>
        </button>
        <button
          onClick={() => navigate("/admin/dashboard/web-analytics")}
          className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
        >
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <span>View Analytics</span>
        </button>
        <button
          onClick={() => navigate("/admin/dashboard/backup")}
          className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
        >
          <Database className="w-4 h-4 text-purple-500" />
          <span>Backup Data</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="py-4 mt-8">
        <p className="text-center text-muted-foreground text-xs">
          © 2025 CodeKonix | All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;


