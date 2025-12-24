import { withBasePath } from './apiConfig';
import { authFetch } from './authFetch';

export interface ThemeConfig {
  name: string;
  scrolling_message?: string;
  scrolling_background_color?: string;
}

export interface ThemeEvent {
  id?: number;
  name: string;
  slug: string;
  start_date: string;
  end_date: string;
  theme_key: string;
  is_active?: boolean;
}

export interface Theme {
  key: string;
  name: string;
  config: ThemeConfig;
  event?: ThemeEvent | null;
  is_custom?: boolean;
  is_active?: boolean;
}

export interface ActiveThemeResponse {
  theme_key: string;
  theme: ThemeConfig;
  event: {
    name: string;
    slug: string;
  } | null;
  preview?: boolean;
}

export const themeApi = {
  async getActiveTheme(): Promise<ActiveThemeResponse> {
    const response = await fetch(withBasePath(`/theming/active-theme/?_t=${new Date().getTime()}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include', // Include cookies for session
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active theme');
    }

    return response.json();
  },

  async setPreviewTheme(themeKey: string | null): Promise<{ success: boolean; message: string; theme_key: string | null }> {
    const response = await authFetch(withBasePath('/theming/preview-theme/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include', // Include cookies for session
      body: JSON.stringify({ theme_key: themeKey || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set preview theme');
    }

    return response.json();
  },

  // List all themes
  async listThemes(): Promise<Theme[]> {
    const response = await authFetch(withBasePath('/theming/themes/'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch themes');
    }

    return response.json();
  },

  // Get a specific theme
  async getTheme(themeKey: string): Promise<Theme> {
    const response = await authFetch(withBasePath(`/theming/themes/${themeKey}/`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch theme');
    }

    return response.json();
  },

  // Create theme
  async createTheme(themeData: {
    key: string;
    name: string;
    scrolling_message?: string;
    scrolling_background_color?: string;
    is_active?: boolean;
  }): Promise<Theme> {
    const response = await authFetch(withBasePath('/theming/themes/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(themeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create theme');
    }

    const data = await response.json();
    return {
      key: data.key,
      name: data.name,
      config: data.config,
      is_custom: data.is_custom,
    };
  },

  // Update theme configuration
  async updateTheme(themeKey: string, config: Partial<ThemeConfig>): Promise<Theme> {
    const response = await authFetch(withBasePath(`/theming/themes/${themeKey}/`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update theme');
    }

    return response.json();
  },

  // List theme events
  async listEvents(): Promise<ThemeEvent[]> {
    const response = await authFetch(withBasePath('/theming/events/'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch events');
    }

    return response.json();
  },

  // Create theme event
  async createEvent(event: Omit<ThemeEvent, 'id'>): Promise<ThemeEvent> {
    const response = await authFetch(withBasePath('/theming/events/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create event');
    }

    return response.json();
  },

  // Update theme event
  async updateEvent(eventId: number, event: Partial<ThemeEvent>): Promise<ThemeEvent> {
    const response = await authFetch(withBasePath(`/theming/events/${eventId}/`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update event');
    }

    return response.json();
  },

  // Delete theme event
  async deleteEvent(eventId: number): Promise<void> {
    const response = await authFetch(withBasePath(`/theming/events/${eventId}/`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete event');
    }
  },
};

