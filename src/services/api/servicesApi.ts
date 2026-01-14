/**
 * ============================================
 * SERVICES API
 * ============================================
 * 
 * API calls for services CRUD operations.
 * Used by ServiceDetailEditor page.
 * 
 * @file src/services/api/servicesApi.ts
 */

import apiClient from './config';
import type { ApiResponse, PaginatedResponse } from './config';

// ============================================
// TYPES
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

// ============================================
// PUBLIC API (No auth required)
// ============================================

/**
 * Get all active services (for public website)
 */
export const getPublicServices = async (): Promise<Service[]> => {
  const response = await apiClient.get<ApiResponse<Service[]>>('/services/public');
  return response.data.data;
};

/**
 * Get a single service by slug (for service detail page)
 */
export const getPublicServiceBySlug = async (slug: string): Promise<Service> => {
  const response = await apiClient.get<ApiResponse<Service>>(`/services/public/${slug}`);
  return response.data.data;
};

// ============================================
// ADMIN API (Auth required)
// ============================================

/**
 * Get all services with optional filters (for admin)
 */
export const getAllServices = async (params: ServiceListParams = {}): Promise<{
  items: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  const response = await apiClient.get<PaginatedResponse<Service>>('/services', { params });
  return {
    items: response.data.data.items,
    total: response.data.data.total,
    page: response.data.data.page,
    limit: response.data.data.limit,
    totalPages: response.data.data.totalPages,
  };
};

/**
 * Get a single service by ID (for admin editing)
 */
export const getServiceById = async (id: string): Promise<Service> => {
  const response = await apiClient.get<ApiResponse<Service>>(`/services/${id}`);
  return response.data.data;
};

/**
 * Create a new service
 */
export const createService = async (data: CreateServiceData): Promise<Service> => {
  const response = await apiClient.post<ApiResponse<Service>>('/services', data);
  return response.data.data;
};

/**
 * Update a service
 */
export const updateService = async (id: string, data: UpdateServiceData): Promise<Service> => {
  const response = await apiClient.patch<ApiResponse<Service>>(`/services/${id}`, data);
  return response.data.data;
};

/**
 * Delete a service
 */
export const deleteService = async (id: string): Promise<void> => {
  await apiClient.delete(`/services/${id}`);
};

/**
 * Reorder services
 */
export const reorderServices = async (orderedIds: string[]): Promise<void> => {
  await apiClient.patch('/services/reorder', { orderedIds });
};

/**
 * Toggle service active status
 */
export const toggleServiceStatus = async (id: string): Promise<Service> => {
  const response = await apiClient.patch<ApiResponse<Service>>(`/services/${id}/toggle`);
  return response.data.data;
};

/**
 * Duplicate a service
 */
export const duplicateService = async (id: string): Promise<Service> => {
  const response = await apiClient.post<ApiResponse<Service>>(`/services/${id}/duplicate`);
  return response.data.data;
};

// ============================================
// EXPORT DEFAULT OBJECT
// ============================================

export const servicesApi = {
  // Public
  getPublicServices,
  getPublicServiceBySlug,
  
  // Admin
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
  toggleServiceStatus,
  duplicateService,
};

export default servicesApi;