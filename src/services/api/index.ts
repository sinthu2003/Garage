/**
 * ============================================
 * API SERVICES INDEX
 * ============================================
 * 
 * Central export file for all API services.
 * This file contains all API calls organized by domain:
 * - Auth API (login, logout, refresh)
 * - Content API (get, update, apply, discard)
 * - Booking API (submit booking, contact form)
 * - Media API (upload, list, delete images)
 * 
 * @file src/services/api/index.ts
 */

import apiClient, {
  type ApiResponse,
  type PaginatedResponse,
  tokenStorage,
  createFormData,
  getErrorMessage,
  type LoginResponse,
  type AuthUser,
  API_BASE_URL,
} from './config';
import type { SiteContent } from '../../admin-portal';

// ============================================
// RE-EXPORTS FROM CONFIG
// ============================================

export {
  apiClient,
  tokenStorage,
  createFormData,
  getErrorMessage,
  API_BASE_URL,
};

export type {
  ApiResponse,
  PaginatedResponse,
  LoginResponse,
  AuthUser,
};

// ============================================
// AUTH API
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor' | 'viewer';
}

export const authApi = {
  /**
   * Login user and get tokens
   * 
   * @example
   * const { user, accessToken } = await authApi.login({
   *   email: 'admin@example.com',
   *   password: 'password123'
   * });
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<{
      user: AuthUser;
      tokens: { accessToken: string; refreshToken: string };
    }>>(
      '/auth/login',
      credentials
    );
    
    // Backend returns { user, tokens: { accessToken, refreshToken } }
    const { user, tokens } = response.data.data;
    const { accessToken, refreshToken } = tokens;
    
    // Store tokens and user
    tokenStorage.setTokens(accessToken, refreshToken);
    tokenStorage.setUser(user);
    
    // Return flattened structure for frontend compatibility
    return { user, accessToken, refreshToken };
  },

  /**
   * Logout user and clear tokens
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
      console.warn('Logout API error (ignored):', error);
    } finally {
      tokenStorage.clearTokens();
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post<ApiResponse<{ 
      tokens: { accessToken: string; refreshToken: string } 
    }>>(
      '/auth/refresh',
      { refreshToken }
    );
    
    // Backend returns { tokens: { accessToken, refreshToken } }
    const tokens = response.data.data.tokens;
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    
    return tokens;
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<AuthUser> => {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    return response.data.data;
  },

  /**
   * Register a new user (Admin only)
   */
  register: async (data: RegisterData): Promise<{ user: AuthUser }> => {
    const response = await apiClient.post<ApiResponse<{ user: AuthUser }>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenStorage.isAuthenticated();
  },

  /**
   * Get current user from storage
   */
  getCurrentUser: (): AuthUser | null => {
    return tokenStorage.getUser();
  },
};

// ============================================
// CONTENT API
// ============================================

export interface ContentUpdateFieldRequest {
  path: string;
  value: unknown;
}

export interface ContentHistoryItem {
  id: string;
  section: string;
  path: string;
  action: string;
  changedBy: string;
  changedAt: string;
}

export const contentApi = {
  /**
   * Get published content (for public website)
   * No authentication required
   * 
   * @example
   * const content = await contentApi.getPublicContent();
   * // Use content.hero, content.services, etc.
   */
  getPublicContent: async (): Promise<SiteContent> => {
    const response = await apiClient.get<ApiResponse<SiteContent>>('/content/public');
    return response.data.data;
  },

  /**
   * Get specific section of published content
   * 
   * @example
   * const hero = await contentApi.getPublicSection('hero');
   */
  getPublicSection: async <K extends keyof SiteContent>(section: K): Promise<SiteContent[K]> => {
    const response = await apiClient.get<ApiResponse<SiteContent[K]>>(`/content/public/${section}`);
    return response.data.data;
  },

  /**
   * Get working content (with draft changes) - Admin only
   * 
   * @example
   * const content = await contentApi.getWorkingContent();
   * // Includes draft changes if any
   */
  getWorkingContent: async (): Promise<SiteContent> => {
    const response = await apiClient.get<ApiResponse<SiteContent>>('/content/working');
    return response.data.data;
  },

  /**
   * Get all content including draft status - Admin only
   */
  getAllContent: async (): Promise<{
    content: SiteContent;
    draftContent: SiteContent | null;
    hasUnsavedChanges: boolean;
    version: number;
  }> => {
    const response = await apiClient.get<ApiResponse<{
      content: SiteContent;
      draftContent: SiteContent | null;
      hasUnsavedChanges: boolean;
      version: number;
    }>>('/content');
    return response.data.data;
  },

  /**
   * Update a specific field in a section
   * Changes are saved to draft, not published immediately
   * 
   * @example
   * // Update hero headline
   * await contentApi.updateField('hero', {
   *   path: 'headline.line1',
   *   value: 'Premium Car'
   * });
   * 
   * // Update specific service
   * await contentApi.updateField('services', {
   *   path: 'items.0.price',
   *   value: 2999
   * });
   * 
   * // Update booking widget brand
   * await contentApi.updateField('bookingWidget', {
   *   path: 'brands.5',
   *   value: { id: 'kia', name: 'Kia', logo: 'https://...' }
   * });
   */
  updateField: async (section: keyof SiteContent, data: ContentUpdateFieldRequest): Promise<SiteContent> => {
    const response = await apiClient.patch<ApiResponse<SiteContent>>(
      `/content/${section}/field`,
      data
    );
    return response.data.data;
  },

  /**
   * Update entire section
   * 
   * @example
   * await contentApi.updateSection('hero', {
   *   badge: '#1 Car Service',
   *   headline: { line1: 'Premium', line2: 'Car', highlight: 'Service' },
   *   // ... all hero fields
   * });
   */
  updateSection: async <K extends keyof SiteContent>(
    section: K,
    value: SiteContent[K]
  ): Promise<SiteContent> => {
    const response = await apiClient.put<ApiResponse<SiteContent>>(
      `/content/${section}`,
      value
    );
    return response.data.data;
  },

  /**
   * Apply changes - Publish draft to live site
   * 
   * @example
   * await contentApi.applyChanges();
   * // All draft changes are now live
   */
  applyChanges: async (): Promise<{ content: SiteContent; version: number }> => {
    const response = await apiClient.post<ApiResponse<{ content: SiteContent; version: number }>>(
      '/content/apply'
    );
    return response.data.data;
  },

  /**
   * Discard changes - Revert to last published version
   * 
   * @example
   * await contentApi.discardChanges();
   * // All draft changes are discarded
   */
  discardChanges: async (): Promise<{ content: SiteContent }> => {
    const response = await apiClient.post<ApiResponse<{ content: SiteContent }>>(
      '/content/discard'
    );
    return response.data.data;
  },

  /**
   * Reset content to defaults
   * 
   * @example
   * await contentApi.resetContent();
   * // Content is reset to original defaults
   */
  resetContent: async (): Promise<{ content: SiteContent }> => {
    const response = await apiClient.post<ApiResponse<{ content: SiteContent }>>(
      '/content/reset'
    );
    return response.data.data;
  },

  /**
   * Export content as JSON
   */
  exportContent: async (): Promise<SiteContent> => {
    const response = await apiClient.get<ApiResponse<SiteContent>>('/content/export');
    return response.data.data;
  },

  /**
   * Import content from JSON
   */
  importContent: async (content: Partial<SiteContent>): Promise<SiteContent> => {
    const response = await apiClient.post<ApiResponse<SiteContent>>(
      '/content/import',
      content
    );
    return response.data.data;
  },

  /**
   * Check if there are unsaved changes
   */
  checkUnsavedChanges: async (): Promise<{ hasChanges: boolean }> => {
    const response = await apiClient.get<ApiResponse<{ hasChanges: boolean }>>(
      '/content/changes'
    );
    return response.data.data;
  },

  /**
   * Get content change history
   */
  getHistory: async (params?: {
    limit?: number;
    section?: string;
  }): Promise<ContentHistoryItem[]> => {
    const response = await apiClient.get<ApiResponse<ContentHistoryItem[]>>(
      '/content/history',
      { params }
    );
    return response.data.data;
  },
};

// ============================================
// BOOKING API
// ============================================

export interface BookingSubmitData {
  phone: string;
  countryCode?: string;
  name?: string;
  email?: string;
  city: string;
  brand: string;
  brandName: string;
  model: string;
  fuelType: string;
  service?: {
    id: string;
    name: string;
    price?: number;
  };
  source?: 'booking_widget' | 'service_page' | 'service_detail' | 'contact_form' | 'whatsapp' | 'call';
  sourcePage?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  countryCode?: string; 
  message: string;
  source?: 'contact_page' | 'footer' | 'service_page' | 'faq_page';
  sourcePage?: string;
}

export interface Booking {
  id: string;
  phone: string;
  countryCode: string;
  name?: string;
  email?: string;
  city: string;
  brand: string;
  brandName: string;
  model: string;
  fuelType: string;
  service?: {
    id: string;
    name: string;
    price?: number;
  };
  source: string;
  sourcePage?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_response';
  notes?: string;
  followUpDate?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  replyMessage?: string;
  createdAt: string;
}

export interface BookingListParams {
  page?: number;
  limit?: number;
  status?: string;
  city?: string;
  brand?: string;
  source?: string;
  service?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  bookings: {
    total: number;
    new: number;
    contacted: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
  contacts: {
    total: number;
    unread: number;
  };
  todayLeads: number;
  pendingFollowUps: number;
}

export const bookingApi = {
  /**
   * Submit a booking from booking widget or service page
   * No authentication required (public endpoint)
   * 
   * @example
   * // From BookingWidget.tsx
   * await bookingApi.submit({
   *   phone: '9876543210',
   *   city: 'chennai',
   *   brand: 'maruti',
   *   brandName: 'Maruti Suzuki',
   *   model: 'Swift',
   *   fuelType: 'Petrol',
   *   source: 'booking_widget'
   * });
   * 
   * // From ServiceDetailPage.tsx (with service info)
   * await bookingApi.submit({
   *   phone: '9876543210',
   *   city: 'chennai',
   *   brand: 'maruti',
   *   brandName: 'Maruti Suzuki',
   *   model: 'Swift',
   *   fuelType: 'Petrol',
   *   source: 'service_page',
   *   service: {
   *     id: 'periodic-service',
   *     name: 'Periodic Service',
   *     price: 2999
   *   }
   * });
   */
  submit: async (data: BookingSubmitData): Promise<{
    id: string;
    message: string;
    isExisting?: boolean;
  }> => {
    const response = await apiClient.post<ApiResponse<{
      id: string;
      message: string;
      isExisting?: boolean;
    }>>('/bookings/submit', data);
    return response.data.data;
  },

  /**
   * Submit contact form inquiry
   * No authentication required (public endpoint)
   * 
   * @example
   * await bookingApi.submitContact({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   phone: '9876543210',
   *   service: 'AC Service',
   *   message: 'I need AC repair for my car'
   * });
   */
  submitContact: async (data: ContactFormData): Promise<{
    id: string;
    message: string;
  }> => {
    const response = await apiClient.post<ApiResponse<{
      id: string;
      message: string;
    }>>('/bookings/contact', data);
    return response.data.data;
  },

  // ============================================
  // ADMIN ENDPOINTS (Require Authentication)
  // ============================================

  /**
   * Get all bookings with filters (Admin)
   */
  list: async (params?: BookingListParams): Promise<{
    items: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<PaginatedResponse<Booking>>(
      '/bookings',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get a single booking by ID (Admin)
   */
  getById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },

  /**
   * Update a booking (Admin)
   */
  update: async (id: string, data: Partial<Booking>): Promise<Booking> => {
    const response = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a booking (Admin)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },

  /**
   * Get dashboard statistics (Admin)
   */
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      '/bookings/stats',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get today's leads (Admin)
   */
  getTodayLeads: async (): Promise<Booking[]> => {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/today');
    return response.data.data;
  },

  /**
   * Get pending follow-ups (Admin)
   */
  getFollowUps: async (): Promise<Booking[]> => {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/follow-ups');
    return response.data.data;
  },

  /**
   * Bulk update booking status (Admin)
   */
  bulkUpdateStatus: async (ids: string[], status: string): Promise<{
    updatedCount: number;
  }> => {
    const response = await apiClient.post<ApiResponse<{ updatedCount: number }>>(
      '/bookings/bulk-update',
      { ids, status }
    );
    return response.data.data;
  },

  /**
   * Export bookings as CSV (Admin)
   */
  export: async (params?: BookingListParams): Promise<Blob> => {
    const response = await apiClient.get('/bookings/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get analytics by city (Admin)
   */
  getByCity: async (): Promise<{ _id: string; count: number }[]> => {
    const response = await apiClient.get<ApiResponse<{ _id: string; count: number }[]>>(
      '/bookings/analytics/by-city'
    );
    return response.data.data;
  },

  /**
   * Get analytics by source (Admin)
   */
  getBySource: async (): Promise<{ _id: string; count: number }[]> => {
    const response = await apiClient.get<ApiResponse<{ _id: string; count: number }[]>>(
      '/bookings/analytics/by-source'
    );
    return response.data.data;
  },

  /**
   * Get analytics by service (Admin)
   */
  getByService: async (): Promise<{ _id: string; count: number }[]> => {
    const response = await apiClient.get<ApiResponse<{ _id: string; count: number }[]>>(
      '/bookings/analytics/by-service'
    );
    return response.data.data;
  },

  // ============================================
  // CONTACT INQUIRY ENDPOINTS (Admin)
  // ============================================

  /**
   * List contact inquiries (Admin)
   */
  listContacts: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{
    items: ContactInquiry[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<PaginatedResponse<ContactInquiry>>(
      '/bookings/contacts',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get unread contact count (Admin)
   */
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      '/bookings/contacts/unread-count'
    );
    return response.data.data;
  },

  /**
   * Update contact inquiry (Admin)
   */
  updateContact: async (id: string, data: {
    status?: string;
    replyMessage?: string;
  }): Promise<ContactInquiry> => {
    const response = await apiClient.patch<ApiResponse<ContactInquiry>>(
      `/bookings/contacts/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete contact inquiry (Admin)
   */
  deleteContact: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/contacts/${id}`);
  },
};

// ============================================
// MEDIA API
// ============================================

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  s3Key?: string;
  folder: string;
  alt?: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  usedIn?: Array<{
    section: string;
    path: string;
  }>;
  createdAt: string;
}

export interface MediaUploadResult {
  media: MediaItem;
  url: string;
}

export interface MediaListParams {
  page?: number;
  limit?: number;
  folder?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  totalSizeFormatted: string;
  byFolder: Record<string, { count: number; size: number }>;
}

export const mediaApi = {
  /**
   * Upload a single image
   * 
   * @example
   * const file = event.target.files[0];
   * const result = await mediaApi.upload(file, 'hero', 'Hero background');
   * console.log(result.url); // S3 URL of uploaded image
   */
  upload: async (
    file: File,
    folder: string = 'general',
    alt?: string
  ): Promise<MediaUploadResult> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    if (alt) formData.append('alt', alt);

    const response = await apiClient.post<ApiResponse<MediaUploadResult>>(
      '/media/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Upload multiple images
   */
  uploadMultiple: async (
    files: File[],
    folder: string = 'general'
  ): Promise<MediaUploadResult[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await apiClient.post<ApiResponse<MediaUploadResult[]>>(
      '/media/upload-multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Get presigned URL for direct S3 upload (large files)
   */
  getPresignedUrl: async (
    filename: string,
    folder: string = 'general'
  ): Promise<{
    uploadUrl: string;
    key: string;
    publicUrl: string;
  }> => {
    const response = await apiClient.post<ApiResponse<{
      uploadUrl: string;
      key: string;
      publicUrl: string;
    }>>('/media/presigned-url', { filename, folder });
    return response.data.data;
  },

  /**
   * Confirm presigned upload (after direct S3 upload)
   */
  confirmPresignedUpload: async (data: {
    key: string;
    publicUrl: string;
    originalName: string;
    mimeType: string;
    size: number;
    folder?: string;
    alt?: string;
  }): Promise<MediaItem> => {
    const response = await apiClient.post<ApiResponse<MediaItem>>(
      '/media/confirm-upload',
      data
    );
    return response.data.data;
  },

  /**
   * List all media files
   */
  list: async (params?: MediaListParams): Promise<{
    items: MediaItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<PaginatedResponse<MediaItem>>(
      '/media',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get a single media item
   */
  getById: async (id: string): Promise<MediaItem> => {
    const response = await apiClient.get<ApiResponse<MediaItem>>(`/media/${id}`);
    return response.data.data;
  },

  /**
   * Update media metadata
   */
  update: async (id: string, data: {
    alt?: string;
    folder?: string;
  }): Promise<MediaItem> => {
    const response = await apiClient.patch<ApiResponse<MediaItem>>(
      `/media/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a media item
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },

  /**
   * Get unused media (Admin)
   */
  getUnused: async (): Promise<MediaItem[]> => {
    const response = await apiClient.get<ApiResponse<MediaItem[]>>('/media/unused');
    return response.data.data;
  },

  /**
   * Cleanup unused media (Admin)
   */
  cleanupUnused: async (daysOld?: number): Promise<{ deletedCount: number }> => {
    const response = await apiClient.post<ApiResponse<{ deletedCount: number }>>(
      '/media/cleanup',
      {},
      { params: { daysOld } }
    );
    return response.data.data;
  },

  /**
   * Get storage statistics (Admin)
   */
  getStats: async (): Promise<StorageStats> => {
    const response = await apiClient.get<ApiResponse<StorageStats>>('/media/stats');
    return response.data.data;
  },
};

// ============================================
// UNIFIED API OBJECT
// ============================================

/**
 * Unified API object for all services
 * 
 * @example
 * import { api } from './services/api';
 * 
 * // Auth
 * await api.auth.login({ email, password });
 * 
 * // Content
 * const content = await api.content.getPublicContent();
 * 
 * // Booking
 * await api.booking.submit({ phone, city, brand, ... });
 * 
 * // Media
 * const result = await api.media.upload(file, 'hero');
 */
export const api = {
  auth: authApi,
  content: contentApi,
  booking: bookingApi,
  media: mediaApi,
};

export default api;