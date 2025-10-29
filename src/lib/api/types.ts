import { Product, Category, Order } from "@/types/strapi";

// Base API response type
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  error?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Request options
export interface RequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  authToken?: string;
}

// API error type
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    
    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

// Type for API response data
export type ApiData<T> = T & {
  id: number;
  attributes: T;
  meta?: Record<string, unknown>;
};

// Type for Strapi single response
export type StrapiResponse<T> = {
  data: ApiData<T>;
  meta?: Record<string, unknown>;
};

// Type for Strapi collection response
export type StrapiCollectionResponse<T> = {
  data: Array<ApiData<T>>;
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

// Common API interfaces
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export type FilterValue = string | number | boolean | string[] | undefined;

export interface FilterParams {
  [key: string]: FilterValue;
}

// Specific API request/response types
export interface ProductListParams extends PaginationParams, FilterParams {
  category?: string;
  sort?: string;
  populate?: string | string[];
}

export interface OrderCreateData {
  products: Array<{
    productId: number;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  status?: string;
  total: number;
}
