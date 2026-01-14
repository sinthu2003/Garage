/**
 * ============================================
 * CAR DATA API
 * ============================================
 * 
 * API calls for car brands and models CRUD operations.
 * Used by BookingWidgetEditor.
 * 
 * @file src/services/api/carDataApi.ts
 */

import apiClient from './config';
import type { ApiResponse } from './config';

// ============================================
// TYPES
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

// ============================================
// PUBLIC API (No auth required)
// ============================================

/**
 * Get car data formatted for booking widget (public)
 */
export const getBookingWidgetData = async (): Promise<BookingWidgetCarData> => {
  const response = await apiClient.get<ApiResponse<BookingWidgetCarData>>('/car-data/booking-widget');
  return response.data.data;
};

// ============================================
// BRAND API (Auth required)
// ============================================

/**
 * Get all car brands
 */
export const getAllBrands = async (options: {
  includeModels?: boolean;
  includeInactive?: boolean;
} = {}): Promise<CarBrand[]> => {
  const params: Record<string, string> = {};
  if (options.includeModels) params.includeModels = 'true';
  if (options.includeInactive) params.includeInactive = 'true';

  const response = await apiClient.get<ApiResponse<CarBrand[]>>('/car-brands', { params });
  return response.data.data;
};

/**
 * Get a single brand by ID
 */
export const getBrandById = async (id: string, includeModels = false): Promise<CarBrand> => {
  const params = includeModels ? { includeModels: 'true' } : {};
  const response = await apiClient.get<ApiResponse<CarBrand>>(`/car-brands/${id}`, { params });
  return response.data.data;
};

/**
 * Create a new car brand
 */
export const createBrand = async (data: CreateBrandData): Promise<CarBrand> => {
  const response = await apiClient.post<ApiResponse<CarBrand>>('/car-brands', data);
  return response.data.data;
};

/**
 * Update a car brand
 */
export const updateBrand = async (id: string, data: UpdateBrandData): Promise<CarBrand> => {
  const response = await apiClient.patch<ApiResponse<CarBrand>>(`/car-brands/${id}`, data);
  return response.data.data;
};

/**
 * Delete a car brand and all its models
 */
export const deleteBrand = async (id: string): Promise<void> => {
  await apiClient.delete(`/car-brands/${id}`);
};

/**
 * Reorder car brands
 */
export const reorderBrands = async (orderedIds: string[]): Promise<void> => {
  await apiClient.patch('/car-brands/reorder', { orderedIds });
};

// ============================================
// MODEL API (Auth required)
// ============================================

/**
 * Get all models for a brand
 */
export const getModelsByBrand = async (
  brandId: string,
  includeInactive = false
): Promise<CarModel[]> => {
  const params = includeInactive ? { includeInactive: 'true' } : {};
  const response = await apiClient.get<ApiResponse<CarModel[]>>(
    `/car-brands/${brandId}/models`,
    { params }
  );
  return response.data.data;
};

/**
 * Add a model to a brand
 */
export const addModelToBrand = async (
  brandId: string,
  data: CreateModelData
): Promise<CarModel> => {
  const response = await apiClient.post<ApiResponse<CarModel>>(
    `/car-brands/${brandId}/models`,
    data
  );
  return response.data.data;
};

/**
 * Get a single model by ID
 */
export const getModelById = async (id: string): Promise<CarModel> => {
  const response = await apiClient.get<ApiResponse<CarModel>>(`/car-models/${id}`);
  return response.data.data;
};

/**
 * Update a car model
 */
export const updateModel = async (id: string, data: UpdateModelData): Promise<CarModel> => {
  const response = await apiClient.patch<ApiResponse<CarModel>>(`/car-models/${id}`, data);
  return response.data.data;
};

/**
 * Delete a car model
 */
export const deleteModel = async (id: string): Promise<void> => {
  await apiClient.delete(`/car-models/${id}`);
};

/**
 * Reorder models within a brand
 */
export const reorderModels = async (brandId: string, orderedIds: string[]): Promise<void> => {
  await apiClient.patch(`/car-brands/${brandId}/models/reorder`, { orderedIds });
};

// ============================================
// STATISTICS API
// ============================================

/**
 * Get car data statistics
 */
export const getCarDataStats = async (): Promise<CarDataStats> => {
  const response = await apiClient.get<ApiResponse<CarDataStats>>('/car-data/stats');
  return response.data.data;
};

// ============================================
// EXPORT DEFAULT OBJECT
// ============================================

export const carDataApi = {
  // Public
  getBookingWidgetData,

  // Brands
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  reorderBrands,

  // Models
  getModelsByBrand,
  addModelToBrand,
  getModelById,
  updateModel,
  deleteModel,
  reorderModels,

  // Stats
  getCarDataStats,
};

export default carDataApi;