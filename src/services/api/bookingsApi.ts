/**
 * ============================================
 * BOOKINGS API SERVICE
 * ============================================
 * * API service for Dashboard, Bookings Management, and Contact Inquiries
 * All endpoints use existing backend APIs from booking.routes.ts
 * * @file src/services/api/bookingsApi.ts
 */

import apiClient, { type ApiResponse } from './config';

// ============================================
// TYPES
// ============================================

// Booking status enum
export type BookingStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';

// Contact inquiry status enum
export type InquiryStatus = 'new' | 'read' | 'replied' | 'resolved' | 'spam';

// Booking interface
export interface Booking {
  _id: string;
  phone: string;
  countryCode: string;
  name?: string;
  email?: string;
  city: string;
  brand: string;
  brandName: string;
  carModel: string;
  fuelType: string;
  service?: {
    id: string;
    name: string;
    price?: number;
  };
  source: string;
  sourcePage?: string;
  status: BookingStatus;
  notes?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  followUpDate?: string;
  scheduledDate?: string;
  contactedAt?: string;
  completedAt?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  deviceInfo?: {
    userAgent?: string;
    platform?: string;
    isMobile?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Contact inquiry interface
export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  service?: string;
  message: string;
  source: string;
  sourcePage?: string;
  status: InquiryStatus;
  replyMessage?: string;
  repliedAt?: string;
  repliedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  deviceInfo?: {
    userAgent?: string;
    platform?: string;
    isMobile?: boolean;
    ip?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Dashboard stats interface
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

// Aggregated Dashboard Data Interface
export interface DashboardData {
  stats: DashboardStats;
  todayLeads: Booking[];
  followUps: Booking[];
  unreadCount: number;
}

// Analytics data interface
export interface AnalyticsData {
  _id: string;
  count: number;
}

// List options for bookings
export interface BookingListOptions {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  status?: BookingStatus | '';
  city?: string;
  brand?: string;
  source?: string;
  service?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// List options for inquiries
export interface InquiryListOptions {
  page?: number;
  limit?: number;
  status?: InquiryStatus;
  search?: string;
}

// Update booking data
export interface UpdateBookingData {
  status?: BookingStatus;
  notes?: string;
  assignedTo?: string;
  followUpDate?: string;
  scheduledDate?: string;
  name?: string;
  email?: string;
}

// Update inquiry data
export interface UpdateInquiryData {
  status?: InquiryStatus;
  replyMessage?: string;
}

// Paginated list result (standardized)
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Specialized result for bookings to include Facets
export interface BookingPaginatedResult extends PaginatedResult<Booking> {
  facets?: {
    cities: string[];
    brands: string[];
  };
}

// ============================================
// DASHBOARD APIs
// ============================================

/**
 * Get aggregated dashboard data
 * @route GET /api/bookings/dashboard
 */
export const getDashboardData = async (
  startDate?: string,
  endDate?: string
): Promise<DashboardData> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await apiClient.get<ApiResponse<DashboardData>>(
    `/bookings/dashboard${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data.data;
};

/**
 * Get bookings by city (for charts)
 */
export const getBookingsByCity = async (): Promise<AnalyticsData[]> => {
  const response = await apiClient.get<ApiResponse<AnalyticsData[]>>('/bookings/analytics/by-city');
  return response.data.data || [];
};

/**
 * Get bookings by source (for charts)
 */
export const getBookingsBySource = async (): Promise<AnalyticsData[]> => {
  const response = await apiClient.get<ApiResponse<AnalyticsData[]>>('/bookings/analytics/by-source');
  return response.data.data || [];
};

/**
 * Get bookings by service (for charts)
 */
export const getBookingsByService = async (): Promise<AnalyticsData[]> => {
  const response = await apiClient.get<ApiResponse<AnalyticsData[]>>('/bookings/analytics/by-service');
  return response.data.data || [];
};

// ============================================
// BOOKINGS MANAGEMENT APIs
// ============================================

/**
 * List all bookings with filtering and facets
 * @route GET /api/bookings
 */
export const listBookings = async (
  options: BookingListOptions = {}
): Promise<BookingPaginatedResult> => {
  const params = new URLSearchParams();
  
  // Standard pagination & sorting
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.sortBy) params.append('sortBy', options.sortBy);
  if (options.sortOrder) params.append('sortOrder', options.sortOrder);
  
  // Filters
  if (options.search) params.append('search', options.search);
  if (options.status) params.append('status', options.status);
  if (options.city) params.append('city', options.city);
  if (options.brand) params.append('brand', options.brand);
  if (options.source) params.append('source', options.source);
  if (options.service) params.append('service', options.service);
  
  // Date Filters (Support both direct dateFrom/To and aggregated logic keys)
  if (options.dateFrom) params.append('dateFrom', options.dateFrom);
  if (options.dateTo) params.append('dateTo', options.dateTo);
  if (options.startDate) params.append('dateFrom', options.startDate);
  if (options.endDate) params.append('dateTo', options.endDate);

  const response = await apiClient.get(
    `/bookings${params.toString() ? `?${params.toString()}` : ''}`
  );

  const apiResponse = response.data;
  
  // Handle both possible response structures (data in data or root)
  const items = Array.isArray(apiResponse.data) ? apiResponse.data : [];
  
  return {
    items,
    total: apiResponse.meta?.total || 0,
    page: apiResponse.meta?.page || 1,
    limit: apiResponse.meta?.limit || 20,
    totalPages: apiResponse.meta?.totalPages || 1,
    facets: apiResponse.facets || { cities: [], brands: [] } // <-- Facets from backend
  };
};

/**
 * Get a single booking by ID
 */
export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
  return response.data.data;
};

/**
 * Update a booking
 */
export const updateBooking = async (
  id: string,
  data: UpdateBookingData
): Promise<Booking> => {
  const response = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}`, data);
  return response.data.data;
};

/**
 * Delete a booking
 */
export const deleteBooking = async (id: string): Promise<void> => {
  await apiClient.delete(`/bookings/${id}`);
};

/**
 * Bulk update booking status
 */
export const bulkUpdateBookings = async (
  ids: string[],
  status: BookingStatus
): Promise<{ updatedCount: number }> => {
  const response = await apiClient.post<ApiResponse<{ updatedCount: number }>>(
    '/bookings/bulk-update',
    { ids, status }
  );
  return response.data.data;
};

/**
 * Export bookings as CSV (returns blob URL)
 */
export const exportBookings = async (
  options: Omit<BookingListOptions, 'page' | 'limit' | 'sortBy' | 'sortOrder'> = {}
): Promise<string> => {
  const params = new URLSearchParams();

  if (options.status) params.append('status', options.status);
  if (options.city) params.append('city', options.city);
  if (options.brand) params.append('brand', options.brand);
  if (options.source) params.append('source', options.source);
  if (options.dateFrom) params.append('dateFrom', options.dateFrom);
  if (options.dateTo) params.append('dateTo', options.dateTo);
  if (options.startDate) params.append('dateFrom', options.startDate);
  if (options.endDate) params.append('dateTo', options.endDate);

  const response = await apiClient.get(
    `/bookings/export${params.toString() ? `?${params.toString()}` : ''}`,
    { responseType: 'blob' }
  );

  const blob = new Blob([response.data], { type: 'text/csv' });
  return URL.createObjectURL(blob);
};

// ============================================
// CONTACT INQUIRIES APIs
// ============================================

export const listContactInquiries = async (
  options: InquiryListOptions = {}
): Promise<PaginatedResult<ContactInquiry>> => {
  const params = new URLSearchParams();

  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.status) params.append('status', options.status);
  if (options.search) params.append('search', options.search);

  const response = await apiClient.get(
    `/bookings/contacts${params.toString() ? `?${params.toString()}` : ''}`
  );

  const apiResponse = response.data;

  return {
    items: Array.isArray(apiResponse.data) ? apiResponse.data : [],
    total: apiResponse.meta?.total || 0,
    page: apiResponse.meta?.page || 1,
    limit: apiResponse.meta?.limit || 20,
    totalPages: apiResponse.meta?.totalPages || 1,
  };
};

export const getContactInquiryById = async (id: string): Promise<ContactInquiry> => {
  const response = await apiClient.get<ApiResponse<ContactInquiry>>(`/bookings/contacts/${id}`);
  return response.data.data;
};

export const updateContactInquiry = async (
  id: string,
  data: UpdateInquiryData
): Promise<ContactInquiry> => {
  const response = await apiClient.patch<ApiResponse<ContactInquiry>>(
    `/bookings/contacts/${id}`,
    data
  );
  return response.data.data;
};

export const deleteContactInquiry = async (id: string): Promise<void> => {
  await apiClient.delete(`/bookings/contacts/${id}`);
};

// ============================================
// PUBLIC CONTACT FORM API
// ============================================

export interface SubmitContactData {
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  service?: string;
  message: string;
  source?: string;
  sourcePage?: string;
}

export const submitContact = async (data: SubmitContactData): Promise<ContactInquiry> => {
  const response = await apiClient.post<ApiResponse<ContactInquiry>>('/bookings/contacts', data);
  return response.data.data;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const getBookingStatusColor = (status: BookingStatus): string => {
  const colors: Record<BookingStatus, string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    scheduled: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

export const getInquiryStatusColor = (status: InquiryStatus): string => {
  const colors: Record<InquiryStatus, string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    read: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    replied: 'bg-green-500/20 text-green-400 border-green-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    spam: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

export const formatPhone = (phone: string, countryCode?: string): string => {
  const code = countryCode || '+91';
  return `${code} ${phone.slice(0, 5)} ${phone.slice(5)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

export default {
  // Dashboard
  getDashboardData,
  getBookingsByCity,
  getBookingsBySource,
  getBookingsByService,
  // Bookings
  listBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  bulkUpdateBookings,
  exportBookings,
  // Inquiries
  listContactInquiries,
  getContactInquiryById,
  updateContactInquiry,
  deleteContactInquiry,
  // Public
  submitContact,
  // Utils
  getBookingStatusColor,
  getInquiryStatusColor,
  formatPhone,
  formatDate,
  formatDateTime,
  getRelativeTime,
};