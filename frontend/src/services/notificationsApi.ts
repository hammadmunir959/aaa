import { withBasePath } from "./apiConfig";
import { authFetch } from "./authFetch";

const NOTIFICATIONS_BASE = withBasePath("/analytics/notifications");

export interface Notification {
  id: number;
  activity_type: string;
  activity_label: string;
  description: string;
  timestamp: string;
  user_name: string;
  icon: string;
  is_read: boolean;
  read_at: string | null;
  notification_type: 'info' | 'success' | 'warning' | 'error';
  notification_type_label: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  priority_label: string;
  action_url: string | null;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkAllReadResponse {
  message: string;
  updated_count: number;
}

const fetchNotifications = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await authFetch(`${NOTIFICATIONS_BASE}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch notifications");
  }

  return response.json();
};

export const notificationsApi = {
  /**
   * Get all notifications for the current user
   */
  async list(params?: { is_read?: boolean; type?: string; page?: number }): Promise<Notification[]> {
    const url = new URL(`${NOTIFICATIONS_BASE}/`);
    if (params?.is_read !== undefined) {
      url.searchParams.append('is_read', String(params.is_read));
    }
    if (params?.type) {
      url.searchParams.append('type', params.type);
    }
    if (params?.page) {
      url.searchParams.append('page', String(params.page));
    }

    const response = await authFetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to load notifications");
    }

    const data = await response.json();
    // Handle paginated response
    if (data.results) {
      return data.results;
    }
    return Array.isArray(data) ? data : [];
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    const response = await authFetch(`${NOTIFICATIONS_BASE}/unread-count/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get unread count");
    }

    const data: UnreadCountResponse = await response.json();
    return data.unread_count;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number): Promise<Notification> {
    const response = await authFetch(`${NOTIFICATIONS_BASE}/${notificationId}/read/`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    return response.json();
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<MarkAllReadResponse> {
    const response = await authFetch(`${NOTIFICATIONS_BASE}/mark-all-read/`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }

    return response.json();
  },

  /**
   * Delete a notification
   */
  async delete(notificationId: number): Promise<void> {
    const response = await authFetch(`${NOTIFICATIONS_BASE}/${notificationId}/`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }
  },
};

