/**
 * ============================================
 * API SERVICES INDEX
 * ============================================
 * 
 * Central export file for all API services.
 * This file contains all API calls organized by domain:
 * - Auth API (login, logout, refresh)
 * - Content API (get, update, apply, discard)
 * - Services API (CRUD for services) [NEW]
 * - Car Data API (CRUD for brands/models) [NEW]
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
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<{
      user: AuthUser;
      tokens: { accessToken: string; refreshToken: string };
    }>>(
      '/auth/login',
      credentials
    );
    
    const { user, tokens } = response.data.data;
    const { accessToken, refreshToken } = tokens;
    
    tokenStorage.setTokens(accessToken, refreshToken);
    tokenStorage.setUser(user);
    
    return { user, accessToken, refreshToken };
  },

  /**
   * Logout user and clear tokens
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
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
   * Services and car data are merged from separate collections
   */
  getPublicContent: async (): Promise<SiteContent> => {
    const response = await apiClient.get<ApiResponse<SiteContent>>('/content/public');
    return response.data.data;
  },

  /**
   * Get specific section of published content
   */
  getPublicSection: async <K extends keyof SiteContent>(section: K): Promise<SiteContent[K]> => {
    const response = await apiClient.get<ApiResponse<SiteContent[K]>>(`/content/public/${section}`);
    return response.data.data;
  },

  /**
   * Get working content (with draft changes) - Admin only
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
   * [NEW] Get a specific section only (for lazy loading)
   * For services: returns metadata only (badge, headline, description, viewAllCta)
   * For bookingWidget: returns static fields only (title, labels, cities, fuelTypes)
   */
  getSection: async <K extends keyof SiteContent>(section: K): Promise<SiteContent[K]> => {
    const response = await apiClient.get<ApiResponse<SiteContent[K]>>(`/content/${section}`);
    return response.data.data;
  },

  /**
   * Update a specific field in a section
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
   * [NEW] Update section metadata only (for services/bookingWidget)
   * Does not affect services.items or bookingWidget brands/carModels
   */
  updateSectionMetadata: async <K extends keyof SiteContent>(
    section: K,
    metadata: Partial<SiteContent[K]>
  ): Promise<SiteContent[K]> => {
    const response = await apiClient.patch<ApiResponse<SiteContent[K]>>(
      `/content/${section}`,
      metadata
    );
    return response.data.data;
  },

  /**
   * Apply changes - Publish draft to live site
   */
  applyChanges: async (): Promise<{ content: SiteContent; version: number }> => {
    const response = await apiClient.post<ApiResponse<{ content: SiteContent; version: number }>>(
      '/content/apply'
    );
    return response.data.data;
  },

  /**
   * Discard changes - Revert to last published version
   */
  discardChanges: async (): Promise<{ content: SiteContent }> => {
    const response = await apiClient.post<ApiResponse<{ content: SiteContent }>>(
      '/content/discard'
    );
    return response.data.data;
  },

  /**
   * Reset content to defaults
   */
  resetContent: async (): Promise<{ content: SiteContent; version: number }> => {
    const response = await apiClient.post<ApiResponse<{ content: SiteContent; version: number }>>(
      '/content/reset'
    );
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
   * Export content as JSON
   */
  exportContent: async (): Promise<SiteContent> => {
    const response = await apiClient.get<ApiResponse<SiteContent>>('/content/export');
    return response.data.data;
  },

  /**
   * Get content change history
   */
  getHistory: async (limit?: number, section?: string): Promise<ContentHistoryItem[]> => {
    const response = await apiClient.get<ApiResponse<ContentHistoryItem[]>>(
      '/content/history',
      { params: { limit, section } }
    );
    return response.data.data;
  },
};

// ============================================
// [NEW] SERVICES API - Separate Collection
// ============================================

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  price: number;
  originalPrice: number;
  image: string;
  gallery: string[];
  features: string[];
  includes: string[];
  process: ServiceProcessStep[];
  faqs: ServiceFAQ[];
  duration: string;
  warranty: string;
  category?: string;
  displayOrder: number;
  isActive: boolean;
  discountPercentage?: number;
  savings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  title: string;
  description: string;
  icon?: string;
  price: number;
  originalPrice: number;
  image: string;
  gallery?: string[];
  features?: string[];
  includes?: string[];
  process?: ServiceProcessStep[];
  faqs?: ServiceFAQ[];
  duration?: string;
  warranty?: string;
  category?: string;
}

export interface UpdateServiceData {
  title?: string;
  description?: string;
  icon?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  gallery?: string[];
  features?: string[];
  includes?: string[];
  process?: ServiceProcessStep[];
  faqs?: ServiceFAQ[];
  duration?: string;
  warranty?: string;
  category?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface ServiceListParams {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
  search?: string;
  sortBy?: 'displayOrder' | 'title' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export const servicesApi = {
  /**
   * Get all active services (for public website)
   */
  getPublicServices: async (): Promise<Service[]> => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services/public');
    return response.data.data;
  },

  /**
   * Get a single service by slug (for service detail page)
   */
  getPublicServiceBySlug: async (slug: string): Promise<Service> => {
    const response = await apiClient.get<ApiResponse<Service>>(`/services/public/${slug}`);
    return response.data.data;
  },

  /**
   * Get all services with optional filters (for admin)
   * [FIX] Handle both response formats:
   * - Backend returns: { success, data: [...], meta: { page, limit, total } }
   * - Expected format: { items: [...], page, limit, total, totalPages }
   */
  getAll: async (params: ServiceListParams = {}): Promise<{
    items: Service[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<any>('/services', { params });
    
    // Handle the actual backend response format
    const responseData = response.data;
    
    // Check if data is an array (actual backend format) or has items (expected format)
    if (Array.isArray(responseData.data)) {
      // Backend format: { success, data: [...], meta: {...} }
      return {
        items: responseData.data,
        total: responseData.meta?.total || responseData.data.length,
        page: responseData.meta?.page || 1,
        limit: responseData.meta?.limit || 100,
        totalPages: responseData.meta?.totalPages || 1,
      };
    } else if (responseData.data?.items) {
      // Expected format: { success, data: { items: [...], ... } }
      return responseData.data;
    }
    
    // Fallback
    console.warn('[servicesApi.getAll] Unexpected response format:', responseData);
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 100,
      totalPages: 0,
    };
  },

  /**
   * Get a single service by ID (for admin editing)
   */
  getById: async (id: string): Promise<Service> => {
    const response = await apiClient.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.data;
  },

  /**
   * Create a new service
   */
  create: async (data: CreateServiceData): Promise<Service> => {
    const response = await apiClient.post<ApiResponse<Service>>('/services', data);
    return response.data.data;
  },

  /**
   * Update a service
   */
  update: async (id: string, data: UpdateServiceData): Promise<Service> => {
    const response = await apiClient.patch<ApiResponse<Service>>(`/services/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a service
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },

  /**
   * Reorder services
   */
  reorder: async (orderedIds: string[]): Promise<void> => {
    await apiClient.patch('/services/reorder', { orderedIds });
  },

  /**
   * Toggle service active status
   */
  toggleStatus: async (id: string): Promise<Service> => {
    const response = await apiClient.patch<ApiResponse<Service>>(`/services/${id}/toggle`);
    return response.data.data;
  },

  /**
   * Duplicate a service
   */
  duplicate: async (id: string): Promise<Service> => {
    const response = await apiClient.post<ApiResponse<Service>>(`/services/${id}/duplicate`);
    return response.data.data;
  },
};

// ============================================
// [NEW] CAR DATA API - Separate Collections
// ============================================

export interface CarModel {
  _id: string;
  brandId: string;
  name: string;
  slug: string;
  type: string;
  image: string;
  fuelTypes: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarBrand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  urlName: string;
  displayOrder: number;
  isActive: boolean;
  modelCount?: number;
  models?: CarModel[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandData {
  name: string;
  logo: string;
  urlName?: string;
}

export interface UpdateBrandData {
  name?: string;
  logo?: string;
  urlName?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateModelData {
  name: string;
  type: string;
  image?: string;
  fuelTypes?: string[];
}

export interface UpdateModelData {
  name?: string;
  type?: string;
  image?: string;
  fuelTypes?: string[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface BookingWidgetCarData {
  brands: {
    id: string;
    name: string;
    logo: string;
    urlName: string;
  }[];
  carModels: Record<string, { name: string; type: string; image: string }[]>;
}

export interface CarDataStats {
  totalBrands: number;
  activeBrands: number;
  totalModels: number;
  activeModels: number;
  modelsByType: { type: string; count: number }[];
}

export const carDataApi = {
  /**
   * Get car data formatted for booking widget (public)
   */
  getBookingWidgetData: async (): Promise<BookingWidgetCarData> => {
    const response = await apiClient.get<ApiResponse<BookingWidgetCarData>>('/car-data/booking-widget');
    return response.data.data;
  },

  /**
   * Get all car brands
   */
  getAllBrands: async (options: {
    includeModels?: boolean;
    includeInactive?: boolean;
  } = {}): Promise<CarBrand[]> => {
    const params: Record<string, string> = {};
    if (options.includeModels) params.includeModels = 'true';
    if (options.includeInactive) params.includeInactive = 'true';

    const response = await apiClient.get<ApiResponse<CarBrand[]>>('/car-brands', { params });
    return response.data.data;
  },

  /**
   * Get a single brand by ID
   */
  getBrandById: async (id: string, includeModels = false): Promise<CarBrand> => {
    const params = includeModels ? { includeModels: 'true' } : {};
    const response = await apiClient.get<ApiResponse<CarBrand>>(`/car-brands/${id}`, { params });
    return response.data.data;
  },

  /**
   * Create a new car brand
   */
  createBrand: async (data: CreateBrandData): Promise<CarBrand> => {
    const response = await apiClient.post<ApiResponse<CarBrand>>('/car-brands', data);
    return response.data.data;
  },

  /**
   * Update a car brand
   */
  updateBrand: async (id: string, data: UpdateBrandData): Promise<CarBrand> => {
    const response = await apiClient.patch<ApiResponse<CarBrand>>(`/car-brands/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a car brand and all its models
   */
  deleteBrand: async (id: string): Promise<void> => {
    await apiClient.delete(`/car-brands/${id}`);
  },

  /**
   * Reorder car brands
   */
  reorderBrands: async (orderedIds: string[]): Promise<void> => {
    await apiClient.patch('/car-brands/reorder', { orderedIds });
  },

  /**
   * Get all models for a brand
   */
  getModelsByBrand: async (brandId: string, includeInactive = false): Promise<CarModel[]> => {
    const params = includeInactive ? { includeInactive: 'true' } : {};
    const response = await apiClient.get<ApiResponse<CarModel[]>>(
      `/car-brands/${brandId}/models`,
      { params }
    );
    return response.data.data;
  },

  /**
   * Add a model to a brand
   */
  addModelToBrand: async (brandId: string, data: CreateModelData): Promise<CarModel> => {
    const response = await apiClient.post<ApiResponse<CarModel>>(
      `/car-brands/${brandId}/models`,
      data
    );
    return response.data.data;
  },

  /**
   * Get a single model by ID
   */
  getModelById: async (id: string): Promise<CarModel> => {
    const response = await apiClient.get<ApiResponse<CarModel>>(`/car-models/${id}`);
    return response.data.data;
  },

  /**
   * Update a car model
   */
  updateModel: async (id: string, data: UpdateModelData): Promise<CarModel> => {
    const response = await apiClient.patch<ApiResponse<CarModel>>(`/car-models/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a car model
   */
  deleteModel: async (id: string): Promise<void> => {
    await apiClient.delete(`/car-models/${id}`);
  },

  /**
   * Reorder models within a brand
   */
  reorderModels: async (brandId: string, orderedIds: string[]): Promise<void> => {
    await apiClient.patch(`/car-brands/${brandId}/models/reorder`, { orderedIds });
  },

  /**
   * Get car data statistics
   */
  getStats: async (): Promise<CarDataStats> => {
    const response = await apiClient.get<ApiResponse<CarDataStats>>('/car-data/stats');
    return response.data.data;
  },
};

// ============================================
// BOOKING API
// ============================================

// src/services/api/index.ts (or wherever BookingSubmitData is defined)

export interface BookingSubmitData {
  phone: string;
  countryCode: string;
  city: string;
  brand: string;
  brandName: string;
  model: string;
  fuelType: string;
  source: 'booking_widget' | 'service_detail' | 'contact_page';
  sourcePage: string;
  // Update this property to accept the object structure
  service?: {
    id: string;
    name: string;
    price?: number;
  };
}

export interface ContactSubmitData {
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
}

export interface BookingLead {
  id: string;
  phone: string;
  city: string;
  brand: string;
  model: string;
  fuelType: string;
  service?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  newBookings: number;
  contactedBookings: number;
  convertedBookings: number;
  totalContacts: number;
  unreadContacts: number;
  conversionRate: number;
  todayBookings: number;
  weeklyBookings: number;
  monthlyBookings: number;
}

export const bookingApi = {
  /**
   * Submit a new booking (public)
   */
  submit: async (data: BookingSubmitData): Promise<{ booking: BookingLead; message: string }> => {
    const response = await apiClient.post<ApiResponse<{ booking: BookingLead; message: string }>>(
      '/bookings/submit',
      data
    );
    return response.data.data;
  },

  /**
   * Submit a contact inquiry (public)
   */
  contact: async (data: ContactSubmitData): Promise<{ inquiry: ContactInquiry; message: string }> => {
    const response = await apiClient.post<ApiResponse<{ inquiry: ContactInquiry; message: string }>>(
      '/bookings/contact',
      data
    );
    return response.data.data;
  },

  /**
   * List all bookings (Admin)
   */
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    city?: string;
    brand?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    items: BookingLead[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<PaginatedResponse<BookingLead>>(
      '/bookings',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get dashboard statistics (Admin)
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/bookings/stats');
    return response.data.data;
  },

  /**
   * Update booking status (Admin)
   */
  updateStatus: async (id: string, data: {
    status: string;
    notes?: string;
  }): Promise<BookingLead> => {
    const response = await apiClient.patch<ApiResponse<BookingLead>>(
      `/bookings/${id}/status`,
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
   * Export bookings as CSV (Admin)
   */
  exportCsv: async (params?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Blob> => {
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
   * Get analytics by brand (Admin)
   */
  getByBrand: async (): Promise<{ _id: string; count: number }[]> => {
    const response = await apiClient.get<ApiResponse<{ _id: string; count: number }[]>>(
      '/bookings/analytics/by-brand'
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
 * // Services [NEW]
 * const services = await api.services.getAll();
 * 
 * // Car Data [NEW]
 * const brands = await api.carData.getAllBrands({ includeModels: true });
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
  services: servicesApi,
  carData: carDataApi,
  booking: bookingApi,
  media: mediaApi,
};

export default api;