// Detect Environment
// 1. If VITE_BACKEND_URL is set (e.g. in Vercel), use that.
// 2. If PROD is true (but no specific URL), assume relative path '/api' (Single container)
// 3. Otherwise, use localhost.

export const getBaseUrl = () => {
  // @ts-ignore
  if (import.meta.env?.VITE_BACKEND_URL) {
    // @ts-ignore
    return import.meta.env.VITE_BACKEND_URL;
  }
  // @ts-ignore
  if (import.meta.env?.PROD) {
    return '/api';
  }
  return 'http://localhost:3001/api';
}

const API_BASE_URL = getBaseUrl();

export const getAuthToken = () => localStorage.getItem('authToken');
export const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
export const removeAuthToken = () => localStorage.removeItem('authToken');

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers as any,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  // Construct full URL
  // If API_BASE_URL contains http, we prepend it. 
  // If it's relative (/api), we just append.
  const url = endpoint.startsWith('/') ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;

  const response = await fetch(url, config);

  // Handle session expiry (401)
  if (response.status === 401) {
    removeAuthToken();
    // Prevent infinite loops: Only redirect to home if we aren't already there or on an auth page
    if (!window.location.pathname.includes('auth') && window.location.pathname !== '/') {
      window.location.assign('/');
    }
    throw new Error('Session expired. Please log in again.');
  }

  // Handle empty responses (e.g., 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  // Check if response is JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data as T;
  } else {
    // Handle non-JSON response (likely an error page from Vercel/Railway)
    const text = await response.text();
    console.error(`Received non-JSON response from API: ${response.status} ${response.statusText}`, text);
    throw new Error(`API returned an unexpected response (${response.status} ${response.statusText}). It might be down or misconfigured.`);
  }
}

export const api = {
  auth: {
    signup: (email: string, password: string, name: string) =>
      request<{ token: string, user: any }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
      }),
    login: (email: string, password: string) =>
      request<{ token: string, user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
    getMe: () => request<{ user: any }>('/auth/me'),
  },
  projects: {
    list: () => request<any[]>('/projects'),
    create: (name: string) =>
      request<any>('/projects', {
        method: 'POST',
        body: JSON.stringify({ name })
      }),
    delete: (id: string) =>
      request<{ success: true }>('/projects/' + id, {
        method: 'DELETE'
      }),
  },
  assets: {
    create: (projectId: string, assetData: any) =>
      request<any>(`/projects/${projectId}/assets`, {
        method: 'POST',
        body: JSON.stringify(assetData)
      }),
    delete: (projectId: string, assetId: string) =>
      request<{ success: true }>(`/projects/${projectId}/assets/${assetId}`, {
        method: 'DELETE'
      }),
  },
  payment: {
    checkout: (provider: string, data: any) =>
      request<{ url: string }>('/payment/checkout', {
        method: 'POST',
        body: JSON.stringify({ provider, ...data })
      }),
    verify: (provider: string, transaction_id: string) =>
      request<{ success: boolean }>('/payment/verify', {
        method: 'POST',
        body: JSON.stringify({ provider, transaction_id })
      }),
  },
  // Generic helper for ad-hoc requests
  post: (endpoint: string, body: any) =>
    request<any>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }),
};