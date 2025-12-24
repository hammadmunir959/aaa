import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, X, Loader2, ChevronRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationsApi, type Notification } from "@/services/notificationsApi";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications - only when dropdown is open to reduce unnecessary requests
  const { data: notifications = [], isLoading, error: notificationsError } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const data = await notificationsApi.list();
        console.log("Notifications fetched:", data);
        // Ensure we return an array
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // Return empty array on error instead of throwing to prevent UI breaking
        return [];
      }
    },
    refetchInterval: isOpen ? 30000 : false, // Only refetch when open
    enabled: isOpen, // Only fetch when dropdown is open
    retry: 1,
  });

  // Fetch unread count - always fetch to show badge
  const { data: unreadCount = 0, error: countError } = useQuery<number>({
    queryKey: ["notification-unread-count"],
    queryFn: async () => {
      try {
        const count = await notificationsApi.getUnreadCount();
        console.log("Unread count:", count);
        return count;
      } catch (error) {
        console.error("Error fetching unread count:", error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) => notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-unread-count"] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-unread-count"] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
  });

  // Map activity types to routes (similar to AdminDashboard)
  const getNotificationRoute = (notification: Notification): string => {
    const activityType = notification.activity_type;
    
    // Map activity types to correct routes (prioritize activity type over potentially incorrect action_url)
    if (activityType === 'inquiry_received') {
      return '/admin/dashboard/inquiries/messages';
    } else if (activityType === 'car_sell_request') {
      return '/admin/dashboard/inquiries/sell-requests';
    } else if (activityType === 'booking_created' || activityType === 'booking_updated' || activityType === 'booking_approved' || activityType === 'booking_cancelled') {
      return '/admin/dashboard/inquiries/bookings';
    } else if (activityType === 'testimonial_submitted' || activityType === 'testimonial_approved' || activityType === 'testimonial_rejected') {
      return '/admin/dashboard/cms/testimonials';
    } else if (activityType === 'backup_completed' || activityType === 'backup_failed') {
      return '/admin/dashboard/backup';
    } else if (activityType.includes('purchase')) {
      return '/admin/dashboard/inquiries/purchase-requests';
    }
    
    // For other activity types, check if action_url exists and is not an old incorrect URL
    if (notification.action_url && notification.action_url !== '') {
      // Fix old incorrect URLs
      const actionUrl = notification.action_url;
      if (actionUrl.includes('/admin/dashboard/cms/inquiries')) {
        // Convert old cms/inquiries route to correct inquiries/messages route
        return '/admin/dashboard/inquiries/messages';
      }
      // Use action_url if it doesn't match known incorrect patterns
      return actionUrl;
    }
    
    // Default to dashboard
    return '/admin/dashboard';
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate to the correct route
    const route = getNotificationRoute(notification);
    navigate(route);
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) {
      return "text-muted-foreground";
    }
    switch (type) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-gold dark:text-yellow-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-border text-foreground hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DropdownMenuLabel className="p-0 font-semibold">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({unreadCount} unread)
              </span>
            )}
          </DropdownMenuLabel>
          {hasNotifications && unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="h-8 text-xs"
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <CheckCheck className="h-3 w-3 mr-1" />
              )}
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notificationsError || countError ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">Unable to load notifications</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {notificationsError instanceof Error ? notificationsError.message : "Please try again"}
              </p>
            </div>
          ) : !hasNotifications ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full text-left rounded-lg border border-transparent bg-background/60 p-4 transition-all hover:border-primary/40 hover:bg-background hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 text-lg">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium leading-tight ${
                            notification.is_read
                              ? "text-muted-foreground"
                              : "text-foreground font-semibold"
                          }`}
                        >
                          {notification.description}
                        </p>
                        {!notification.is_read && (
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(notification.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                        {notification.user_name && notification.user_name !== 'System' && (
                          <>
                            <span>•</span>
                            <span>{notification.user_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        {hasNotifications && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              className="w-full justify-center text-xs"
              onClick={() => {
                // Navigate to the most recent notification's route
                if (notifications.length > 0) {
                  const route = getNotificationRoute(notifications[0]);
                  navigate(route);
                } else {
                  navigate("/admin/dashboard");
                }
                setIsOpen(false);
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;

