import { redirectToLogin, shouldForceLogoutFromResponse } from "./sessionManager";
import { getAccessToken } from "./authStorage";

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  if (!token) {
    redirectToLogin();
  }

  const headers =
    options.headers instanceof Headers ? options.headers : new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  // Add CSRF token for state-changing methods
  if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(options.method || 'GET')) {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (await shouldForceLogoutFromResponse(response)) {
    redirectToLogin();
  }

  return response;
};

