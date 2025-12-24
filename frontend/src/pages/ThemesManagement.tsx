import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Palette,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Plus,
  Save,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardNavBar from "@/components/DashboardNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { themeApi, type Theme, type ThemeEvent, type ThemeConfig } from "@/services/themeApi";
import { useTheme as useEventTheme } from "@/context/ThemeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ThemesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { theme: activeTheme, refreshTheme } = useEventTheme();

  // State for themes
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [themeKey, setThemeKey] = useState<string>(""); // For creating new themes
  const [isThemeActive, setIsThemeActive] = useState(false);
  const [isSettingPreview, setIsSettingPreview] = useState(false);

  // State for events
  const [events, setEvents] = useState<ThemeEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ThemeEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  // Form states for theme editing
  const [themeForm, setThemeForm] = useState<Partial<ThemeConfig>>({
    name: "",
    scrolling_message: "",
    scrolling_background_color: "#000000",
  });

  // Form states for event editing
  const [eventForm, setEventForm] = useState<Partial<ThemeEvent>>({
    name: "",
    slug: "",
    theme_key: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  // Fetch themes
  const { data: themesData, isLoading: isLoadingThemes } = useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: themeApi.listThemes,
    staleTime: 60 * 1000,
  });

  // Fetch events
  const { data: eventsData, isLoading: isLoadingEvents } = useQuery<ThemeEvent[]>({
    queryKey: ["theme-events"],
    queryFn: themeApi.listEvents,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (themesData) {
      setThemes(themesData);
    }
  }, [themesData]);

  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData);
    }
  }, [eventsData]);

  // Create theme mutation
  const createThemeMutation = useMutation({
    mutationFn: (themeData: {
      key: string;
      name: string;
      scrolling_message?: string;
      scrolling_background_color?: string;
      is_active?: boolean;
    }) => themeApi.createTheme(themeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["active-theme"] });
      toast({
        title: "Theme created",
        description: "New theme has been created successfully.",
      });
      setIsThemeDialogOpen(false);
      setSelectedTheme(null);
      resetThemeForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create theme",
        variant: "destructive",
      });
    },
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: ({ themeKey, config }: { themeKey: string; config: Partial<ThemeConfig> }) =>
      themeApi.updateTheme(themeKey, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["active-theme"] });
      toast({
        title: "Theme updated",
        description: "Theme configuration has been saved successfully.",
      });
      setIsThemeDialogOpen(false);
      setSelectedTheme(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update theme",
        variant: "destructive",
      });
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: (event: Omit<ThemeEvent, "id">) => themeApi.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme-events"] });
      queryClient.invalidateQueries({ queryKey: ["active-theme"] });
      toast({
        title: "Event created",
        description: "Theme event has been created successfully.",
      });
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
      resetEventForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, event }: { eventId: number; event: Partial<ThemeEvent> }) =>
      themeApi.updateEvent(eventId, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme-events"] });
      queryClient.invalidateQueries({ queryKey: ["active-theme"] });
      toast({
        title: "Event updated",
        description: "Theme event has been updated successfully.",
      });
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
      resetEventForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (eventId: number) => themeApi.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme-events"] });
      queryClient.invalidateQueries({ queryKey: ["active-theme"] });
      toast({
        title: "Event deleted",
        description: "Theme event has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    },
  });

  const resetThemeForm = () => {
    setThemeForm({
      name: "",
      scrolling_message: "",
      scrolling_background_color: "#000000",
    });
    setThemeKey("");
    setIsThemeActive(false);
  };

  const resetEventForm = () => {
    setEventForm({
      name: "",
      slug: "",
      theme_key: "",
      start_date: "",
      end_date: "",
      is_active: true,
    });
  };

  const handleCreateTheme = () => {
    setSelectedTheme(null);
    resetThemeForm();
    setIsEditingTheme(false);
    setIsThemeDialogOpen(true);
  };

  const handleEditTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    setThemeKey(theme.key);
    setThemeForm({
      name: theme.config.name,
      scrolling_message: theme.config.scrolling_message || "",
      scrolling_background_color: theme.config.scrolling_background_color || "#000000",
    });
    setIsThemeActive(theme.is_active || false);
    setIsEditingTheme(true);
    setIsThemeDialogOpen(true);
  };

  const handleSaveTheme = () => {
    const configData = {
      name: themeForm.name,
      scrolling_message: themeForm.scrolling_message || "",
      scrolling_background_color: themeForm.scrolling_background_color || "#000000",
    };

    if (isEditingTheme && selectedTheme) {
      // Update existing theme
      updateThemeMutation.mutate({
        themeKey: selectedTheme.key,
        config: { ...configData, is_active: isThemeActive } as any,
      });
    } else {
      // Create new theme
      if (!themeKey.trim() || !themeForm.name?.trim()) {
        toast({
          title: "Validation error",
          description: "Please provide a theme key and name",
          variant: "destructive",
        });
        return;
      }

      createThemeMutation.mutate({
        key: themeKey.trim().toLowerCase().replace(/\s+/g, '_'),
        name: themeForm.name!,
        ...configData,
        is_active: isThemeActive,
      });
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    resetEventForm();
    setIsEditingEvent(false);
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: ThemeEvent) => {
    setSelectedEvent(event);
    setEventForm({
      name: event.name,
      slug: event.slug,
      theme_key: event.theme_key,
      start_date: event.start_date,
      end_date: event.end_date,
      is_active: event.is_active ?? true,
    });
    setIsEditingEvent(true);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (isEditingEvent && selectedEvent?.id) {
      updateEventMutation.mutate({
        eventId: selectedEvent.id,
        event: eventForm,
      });
    } else {
      if (!eventForm.name || !eventForm.slug || !eventForm.theme_key || !eventForm.start_date || !eventForm.end_date) {
        toast({
          title: "Validation error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      createEventMutation.mutate({
        name: eventForm.name!,
        slug: eventForm.slug!,
        theme_key: eventForm.theme_key!,
        start_date: eventForm.start_date!,
        end_date: eventForm.end_date!,
        is_active: eventForm.is_active ?? true,
      });
    }
  };

  const handleDeleteEvent = (event: ThemeEvent) => {
    if (!event.id) return;
    if (window.confirm(`Are you sure you want to delete the event "${event.name}"?`)) {
      deleteEventMutation.mutate(event.id);
    }
  };

  const getThemeName = (themeKey: string) => {
    const theme = themes.find((t) => t.key === themeKey);
    return theme?.name || themeKey;
  };

  const isEventActive = (event: ThemeEvent) => {
    if (!event.is_active) return false;
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    return now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Themes Management</h1>
          <p className="text-muted-foreground">
            Manage calendar-based themes and customize landing page popups. Themes automatically change based on calendar events.
            <span className="block mt-1 text-sm">💡 <strong>Tip:</strong> The event name is displayed as the scrolling banner message on the homepage.</span>
          </p>
        </div>

        {/* Active Theme Selector Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Theme Control</CardTitle>
            <CardDescription>
              The active theme changes automatically based on calendar events. You can manually override it here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Current Active Theme</Label>
                  <div className="mt-2 p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {activeTheme?.theme && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: activeTheme.theme.scrolling_background_color || '#000000' }}
                        />
                      )}
                      <div>
                        <p className="font-medium">{activeTheme?.theme?.name || "Loading..."}</p>
                        {activeTheme?.event && (
                          <p className="text-sm text-muted-foreground">
                            Active via event: {activeTheme.event.name}
                          </p>
                        )}
                        {activeTheme?.preview && (
                          <Badge variant="default" className="mt-1">Preview Mode</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <Label>Manually Select Theme (Preview)</Label>
                  <Select
                    value={activeTheme?.preview ? activeTheme.theme_key : "auto"}
                    onValueChange={async (value) => {
                      setIsSettingPreview(true);
                      try {
                        const themeKey = value === "auto" ? null : value;
                        await themeApi.setPreviewTheme(themeKey);
                        await refreshTheme();
                        queryClient.invalidateQueries({ queryKey: ["themes"] });
                        toast({
                          title: value === "auto" ? "Preview Disabled" : "Preview Enabled",
                          description: value === "auto"
                            ? "Active theme will be used based on calendar events."
                            : `Previewing "${themes.find((t) => t.key === value)?.name || value}" theme. Visit the frontend to see it.`,
                        });
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: error instanceof Error ? error.message : "Failed to set preview theme",
                          variant: "destructive",
                        });
                      } finally {
                        setIsSettingPreview(false);
                      }
                    }}
                    disabled={isSettingPreview}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select theme to preview..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Use Calendar-Based Theme (Auto)</SelectItem>
                      {themes.map((theme) => (
                        <SelectItem key={theme.key} value={theme.key}>
                          {theme.config.name} {theme.is_custom && "(Custom)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {activeTheme?.preview && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setIsSettingPreview(true);
                      try {
                        await themeApi.setPreviewTheme(null);
                        await refreshTheme();
                        queryClient.invalidateQueries({ queryKey: ["themes"] });
                        toast({
                          title: "Preview Disabled",
                          description: "Active theme will be used based on calendar events.",
                        });
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: error instanceof Error ? error.message : "Failed to clear preview",
                          variant: "destructive",
                        });
                      } finally {
                        setIsSettingPreview(false);
                      }
                    }}
                    disabled={isSettingPreview}
                  >
                    Clear Preview
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Preview mode is active. The selected theme will override calendar-based themes.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Themes Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Themes
                  </CardTitle>
                  <CardDescription>Manage scrolling banner themes</CardDescription>
                </div>
                <Button onClick={handleCreateTheme} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Theme
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingThemes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : themes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No themes found</p>
              ) : (
                <div className="space-y-2">
                  {themes.map((theme) => (
                    <div
                      key={theme.key}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border shadow-sm"
                          style={{ backgroundColor: theme.config.scrolling_background_color || '#000000' }}
                          title="Banner Background Color"
                        />
                        <div>
                          <p className="font-medium">
                            {theme.config.name}
                            {theme.is_active && (
                              <Badge variant="default" className="ml-2 bg-green-500 hover:bg-green-600">
                                Global Active
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {theme.config.scrolling_message || "No message"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTheme(theme)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Events Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Calendar Events
                  </CardTitle>
                  <CardDescription>Manage calendar-based theme events. Event names appear as scrolling banner messages.</CardDescription>
                </div>
                <Button onClick={handleCreateEvent} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No events found</p>
              ) : (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{event.name}</p>
                          {isEventActive(event) && (
                            <Badge variant="default" className="bg-green-500">
                              Active
                            </Badge>
                          )}
                          {!event.is_active && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getThemeName(event.theme_key)} • {format(new Date(event.start_date), "MMM d")} - {format(new Date(event.end_date), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          Banner: "{event.name}"
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Theme Edit/Create Dialog */}
        <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditingTheme ? `Edit Theme: ${selectedTheme?.config.name}` : "Create New Theme"}
              </DialogTitle>
              <DialogDescription>
                {isEditingTheme
                  ? "Customize the scrolling banner for this theme."
                  : "Create a new theme with a custom scrolling banner message and background color."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Theme Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">Basic Settings</h3>
                {!isEditingTheme && (
                  <div>
                    <Label htmlFor="theme-key">Theme Key</Label>
                    <Input
                      id="theme-key"
                      value={themeKey}
                      onChange={(e) => setThemeKey(e.target.value)}
                      placeholder="e.g., summer_2024"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Unique identifier. Use lowercase letters, numbers, and underscores only.
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="theme-name">Theme Name</Label>
                  <Input
                    id="theme-name"
                    value={themeForm.name || ""}
                    onChange={(e) => setThemeForm({ ...themeForm, name: e.target.value })}
                    placeholder="e.g., Summer Sale"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    id="theme-active"
                    checked={isThemeActive}
                    onCheckedChange={setIsThemeActive}
                  />
                  <Label htmlFor="theme-active">Set as Global Active Theme</Label>
                </div>
              </div>

              {/* Scrolling Banner Settings */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">Scrolling Banner</h3>
                <div>
                  <Label htmlFor="scrolling-message">Banner Message</Label>
                  <Textarea
                    id="scrolling-message"
                    value={themeForm.scrolling_message || ""}
                    onChange={(e) => setThemeForm({ ...themeForm, scrolling_message: e.target.value })}
                    placeholder="Enter the message to display in the scrolling banner..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="scrolling-bg">Background Color</Label>
                  <div className="flex gap-4 items-center mt-2">
                    <Input
                      id="scrolling-bg"
                      type="color"
                      value={themeForm.scrolling_background_color || "#000000"}
                      onChange={(e) => setThemeForm({ ...themeForm, scrolling_background_color: e.target.value })}
                      className="w-12 h-12 p-1 rounded-md cursor-pointer"
                    />
                    <Input
                      value={themeForm.scrolling_background_color || "#000000"}
                      onChange={(e) => setThemeForm({ ...themeForm, scrolling_background_color: e.target.value })}
                      className="font-mono w-32"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the background color for the scrolling banner.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsThemeDialogOpen(false);
                resetThemeForm();
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveTheme}
                disabled={updateThemeMutation.isPending || createThemeMutation.isPending}
              >
                {(updateThemeMutation.isPending || createThemeMutation.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditingTheme ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditingTheme ? "Save Changes" : "Create Theme"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Event Edit Dialog */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditingEvent ? "Edit Event" : "Create New Event"}
              </DialogTitle>
              <DialogDescription>
                Set up a calendar-based theme event. The event name will be displayed as a scrolling banner message on the homepage.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="event-name">Event Name (Scrolling Banner Message)</Label>
                <Input
                  id="event-name"
                  value={eventForm.name || ""}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="e.g., Happy New Year!"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This message will appear in the scrolling banner when this event is active.
                </p>
              </div>
              <div>
                <Label htmlFor="event-slug">Slug</Label>
                <Input
                  id="event-slug"
                  value={eventForm.slug || ""}
                  onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })}
                  placeholder="new-year-event"
                />
              </div>
              <div>
                <Label htmlFor="event-theme">Theme to Apply</Label>
                <Select
                  value={eventForm.theme_key || ""}
                  onValueChange={(value) => setEventForm({ ...eventForm, theme_key: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme..." />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.key} value={theme.key}>
                        {theme.config.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={eventForm.start_date || ""}
                    onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={eventForm.end_date || ""}
                    onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={eventForm.is_active ?? true}
                  onCheckedChange={(checked) => setEventForm({ ...eventForm, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEvent}
                disabled={createEventMutation.isPending || updateEventMutation.isPending}
              >
                {(createEventMutation.isPending || updateEventMutation.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditingEvent ? "Update" : "Create"} Event
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ThemesManagement;
