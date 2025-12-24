import { withBasePath } from "./apiConfig";
import { authFetch } from "./authFetch";

const DASHBOARD_ANALYTICS_BASE = withBasePath("/analytics/dashboard");

const buildEndpoint = (suffix: string) =>
  `${DASHBOARD_ANALYTICS_BASE}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;

const fetchDashboardData = async <T>(suffix: string): Promise<T> => {
  const response = await authFetch(buildEndpoint(suffix), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = "Failed to load dashboard data.";

    try {
      const json = JSON.parse(text);
      if (json.message) errorMessage = json.message;
      else if (json.error) errorMessage = json.error;
      else if (json.detail) errorMessage = json.detail;
      else errorMessage = `Request failed: ${response.statusText}`;
    } catch {
      // use text if short and looks like text, otherwise status
      // HTML responses are usually long and start with <
      if (text.length < 200 && !text.trim().startsWith('<')) errorMessage = text;
      else errorMessage = `Request failed with status ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};

// Types for API responses
export interface SummaryStats {
  totalVehicles: number;
  totalBookings: number;
  inquiries: number;
  testimonials: number;
  inquiries?: number;
  testimonials?: number;
  carListings?: number;
  purchaseRequests?: number;
  galleryImages?: number;
  newsletterSubscribers?: number;
  faqItems?: number;
  pageViewsToday?: number;
  pageViewsWeek?: number;
  pageViewsMonth?: number;
  uniqueVisitorsToday?: number;
  uniqueVisitorsWeek?: number;
  uniqueVisitorsMonth?: number;
}

export interface BookingTrend {
  month: string;
  bookings: number;
  inquiries: number;
  purchaseRequests: number;
}

export interface VehicleUsage {
  name: string;
  value: number;
  percentage: number;
}

export interface ActivityItem {
  id: number;
  text: string;
  icon: string;
  timestamp?: string;
  user?: string;
}

export interface ChatbotStats {
  totalConversations: number;
  totalMessages: number;
  avgResponseTime: string;
  leadsCollected: number;
}

export interface FleetStatus {
  available: number;
  booked: number;
  maintenance: number;
}

export interface SalesPipeline {
  totalValue: number;
  activeRequests: number;
}

export interface UpcomingReturn {
  id: number;
  vehicle: string;
  customer: string;
  returnDate: string;
  daysRemaining: number;
}

// API Service Functions
export const dashboardApi = {
  // Get summary stats for Quick Stats cards
  async getSummary(): Promise<SummaryStats> {
    const data = await fetchDashboardData<any>("/summary/");
    // Normalize snake_case to camelCase if needed
    return {
      totalVehicles: data.totalVehicles ?? data.total_vehicles ?? 0,
      totalBookings: data.totalBookings ?? data.total_bookings ?? 0,
      inquiries: data.inquiries ?? 0,
      testimonials: data.testimonials ?? 0,
      carListings: data.carListings ?? data.car_listings ?? 0,
      purchaseRequests: data.purchaseRequests ?? data.purchase_requests ?? 0,
      galleryImages: data.galleryImages ?? data.gallery_images ?? 0,
      newsletterSubscribers: data.newsletterSubscribers ?? data.newsletter_subscribers ?? 0,
      faqItems: data.faqItems ?? data.faq_items ?? 0,
      uniqueVisitorsMonth: undefined, // Deprecated: AnalyticsMiddleware disabled
    };
  },

  // Get booking trends for line chart
  async getBookingTrends(): Promise<BookingTrend[]> {
    return fetchDashboardData<BookingTrend[]>("/booking-trends/");
  },

  // Get vehicle usage for pie chart
  async getVehicleUsage(): Promise<VehicleUsage[]> {
    return fetchDashboardData<VehicleUsage[]>("/vehicle-usage/");
  },

  // Get recent activity
  async getRecentActivity(): Promise<ActivityItem[]> {
    return fetchDashboardData<ActivityItem[]>("/recent-activity/");
  },

  // Get chatbot stats
  async getChatbotStats(): Promise<ChatbotStats> {
    return fetchDashboardData<ChatbotStats>("/chatbot-stats/");
  },

  // Get fleet status
  async getFleetStatus(): Promise<FleetStatus> {
    return fetchDashboardData<FleetStatus>("/fleet-status/");
  },

  // Get sales pipeline
  async getSalesPipeline(): Promise<SalesPipeline> {
    return fetchDashboardData<SalesPipeline>("/sales-pipeline/");
  },

  // Get upcoming returns
  async getUpcomingReturns(): Promise<UpcomingReturn[]> {
    return fetchDashboardData<UpcomingReturn[]>("/upcoming-returns/");
  },
};

