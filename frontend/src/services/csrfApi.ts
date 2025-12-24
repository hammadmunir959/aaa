import { withBasePath } from './apiConfig';

let csrfToken: string | null = null;

export const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch(withBasePath('/auth/csrf/'), {
      method: 'GET',
      credentials: 'include', // Important: include cookies
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        throw new Error(`CSRF endpoint returned HTML instead of JSON. Status: ${response.status}. This usually means CSRF cookie settings are incorrect.`);
      }
      throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
    }

    // Ensure response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('CSRF endpoint returned non-JSON response. Check server configuration.');
    }

    const data = await response.json();
    
    // Handle both response formats: direct {csrfToken: "..."} or wrapped {data: {csrfToken: "..."}}
    csrfToken = data.csrfToken || data.data?.csrfToken;
    
    if (!csrfToken) {
      throw new Error('CSRF token not found in response');
    }
    
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    // Clear cached token on error
    csrfToken = null;
    throw error;
  }
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

export const getCsrfHeaders = async (): Promise<HeadersInit> => {
  const token = await getCsrfToken();
  return {
    'X-CSRFToken': token,
  };
};
