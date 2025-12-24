import { withBasePath } from "./apiConfig";
import { authFetch } from "./authFetch";

const BACKUP_BASE = withBasePath("/backup");

const buildEndpoint = (suffix: string) =>
  `${BACKUP_BASE}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;

const fetchBackupData = async <T>(suffix: string, options?: RequestInit): Promise<T> => {
  const response = await authFetch(buildEndpoint(suffix), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    // Try to parse as JSON first, fallback to text
    let errorMessage = "Failed to load backup data.";
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        // If it's HTML, extract meaningful error or use default
        if (errorText.includes("CSRF")) {
          errorMessage = "CSRF verification failed. Please refresh the page and try again.";
        } else if (errorText.trim()) {
          errorMessage = errorText.substring(0, 200); // Limit error message length
        }
      }
    } catch (parseError) {
      // If parsing fails, use default message
      console.error("Error parsing error response:", parseError);
    }
    throw new Error(errorMessage);
  }

  // Ensure response is JSON before parsing
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned non-JSON response. Please check your connection.");
  }

  return response.json() as Promise<T>;
};

const postBackupData = async <T>(suffix: string, data?: any): Promise<T> => {
  const response = await authFetch(buildEndpoint(suffix), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    // Try to parse as JSON first, fallback to text
    let errorMessage = "Failed to perform backup operation.";
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        // If it's HTML, extract meaningful error or use default
        if (errorText.includes("CSRF")) {
          errorMessage = "CSRF verification failed. Please refresh the page and try again.";
        } else if (errorText.trim()) {
          errorMessage = errorText.substring(0, 200); // Limit error message length
        }
      }
    } catch (parseError) {
      // If parsing fails, use default message
      console.error("Error parsing error response:", parseError);
    }
    throw new Error(errorMessage);
  }

  // Ensure response is JSON before parsing
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned non-JSON response. Please check your connection.");
  }

  return response.json() as Promise<T>;
};

// Types
export interface BackupFile {
  filename: string;
  path: string;
  size: number;
  created: string;
  type: 'database' | 'media' | 'full' | 'unknown';
}

export interface BackupStats {
  total_backups: number;
  total_size_bytes: number;
  total_size_mb: number;
  backup_directory: string;
  oldest_backup: string | null;
  newest_backup: string | null;
  backups_by_type: {
    database: number;
    media: number;
    full: number;
    unknown: number;
  };
}

export interface BackupConfig {
  enabled: boolean;
  retention_days: number;
  storage: string;
  schedule_hour: number;
  backup_directory: string;
}

export interface BackupCreateResponse {
  message: string;
  task_id: string;
  type: 'database' | 'media' | 'full';
}

export interface BackupVerifyResponse {
  path: string;
  valid: boolean;
  message: string;
}

export interface BackupCleanupResponse {
  message: string;
  deleted_count: number;
  retention_days: number;
}

export interface BackupTaskStatusResponse {
  task_id: string;
  status: string;
  ready: boolean;
  result?: string;
  error?: string;
  message: string;
}

// API Service Functions
export const backupApi = {
  // Get backup statistics
  async getStats(): Promise<BackupStats> {
    return fetchBackupData<BackupStats>("/stats/");
  },

  // List all backups
  async list(): Promise<{ backups: BackupFile[] }> {
    return fetchBackupData<{ backups: BackupFile[] }>("/list/");
  },

  // Create a backup
  async create(type: 'database' | 'media' | 'full' = 'full'): Promise<BackupCreateResponse> {
    return postBackupData<BackupCreateResponse>("/create/", { type });
  },

  // Verify backup integrity
  async verify(path: string): Promise<BackupVerifyResponse> {
    return postBackupData<BackupVerifyResponse>("/verify/", { path });
  },

  // Cleanup old backups
  async cleanup(days: number = 30): Promise<BackupCleanupResponse> {
    return postBackupData<BackupCleanupResponse>("/cleanup/", { days });
  },

  // Get backup configuration
  async getConfig(): Promise<BackupConfig> {
    return fetchBackupData<BackupConfig>("/config/");
  },

  // Download a backup file
  async download(filename: string): Promise<void> {
    const response = await authFetch(buildEndpoint(`/download/${encodeURIComponent(filename)}/`), {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to download backup file.");
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Get task status
  async getTaskStatus(taskId: string): Promise<BackupTaskStatusResponse> {
    return fetchBackupData<BackupTaskStatusResponse>(`/task/${encodeURIComponent(taskId)}/`);
  },
};

