/**
 * ============================================
 * API CONFIGURATION
 * ============================================
 * * This file sets up:
 * - Axios instance with base URL
 * - Request interceptors (add auth token & targeted cache busting)
 * - Response interceptors (handle errors, refresh token)
 * - Token management utilities
 * * @file src/services/api/config.ts
 */

import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================

/**
 * API Base URL from environment variable
 * Set in .env file: VITE_API_URL=http://localhost:5000
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * API version prefix
 */
export const API_VERSION = '/api';

/**
 * Full API URL
 */
export const API_URL = `${API_BASE_URL}${API_VERSION}`;

// ============================================
// TOKEN MANAGEMENT
// ============================================

const TOKEN_KEY = 'addax_access_token';
const REFRESH_TOKEN_KEY = 'addax_refresh_token';
const USER_KEY = 'addax_user';

/**
 * Token storage utilities
 */
export const tokenStorage = {
  /**
   * Get access token from localStorage
   */
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Save tokens to localStorage
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  /**
   * Remove tokens from localStorage
   */
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },

  /**
   * Save user data to localStorage
   */
  setUser: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get user data from localStorage
   */
  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
};

// ============================================
// TYPES
// ============================================

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * API Error response
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * User object from auth
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

/**
 * Auth tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// AXIOS INSTANCE
// ============================================

/**
 * Create axios instance with default config
 * Note: Global headers removed to prevent affecting all requests
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

/**
 * Add auth token to requests
 * TARGETED: Adds cache busting ONLY for public content API
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // [FIX] TARGETED CACHE BUSTING
    // Only apply to the specific public content endpoint
    if (config.method === 'get' && config.url?.includes('/content/public')) {
      // 1. Add timestamp param to force fresh fetch
      config.params = { ...config.params, _t: Date.now() };

      // 2. Add headers to prevent caching for this specific request
      if (config.headers) {
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

/**
 * Flag to prevent multiple refresh attempts
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Handle response errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response data
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't attempt to refresh token if the failed request was a login attempt
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Wait for token refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token, logout user
        tokenStorage.clearTokens();
        // window.location.href = '/admin/login';
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post<ApiResponse<AuthTokens>>(
          `${API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        tokenStorage.setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        tokenStorage.clearTokens();
        //window.location.href = '/admin/login';
        console.error("Refresh failed", refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

    // Log error for debugging
    console.error('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: errorMessage,
    });

    return Promise.reject(error);
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create FormData for file uploads
 */
export const createFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((file) => {
        formData.append(key, file);
      });
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item);
        } else {
          formData.append(key, JSON.stringify(item));
        }
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return !error.response && error.code === 'ERR_NETWORK';
  }
  return false;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401;
  }
  return false;
};

// ============================================
// EXPORTS
// ============================================

export default apiClient;
export { apiClient };