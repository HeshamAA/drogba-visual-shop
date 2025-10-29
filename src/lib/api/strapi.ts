import { ApiError, StrapiResponse, StrapiCollectionResponse, ProductListParams, OrderCreateData } from './types';
import ApiClient from './base';
import type { Product, Category, Order } from "@/types/strapi";

class StrapiClient extends ApiClient {
  constructor(baseURL: string) {
    super(baseURL);
  }

  // Helper to handle Strapi response format
  private formatResponse<T>(data: any): T {
    // Handle Strapi's response format
    if (data?.data) {
      if (Array.isArray(data.data)) {
        return data.data.map((item: any) => ({
          id: item.id,
          ...item.attributes,
        })) as unknown as T;
      } else {
        return {
          id: data.data.id,
          ...data.data.attributes,
        } as unknown as T;
      }
    }
    return data;
  }

  // Products API
  public products = {
    getAll: async (params?: ProductListParams): Promise<Product[]> => {
      try {
        const response = await this.get<StrapiCollectionResponse<Product>>('/products', {
          params: {
            populate: '*',
            ...params,
            'pagination[page]': params?.page || 1,
            'pagination[pageSize]': params?.pageSize || 10,
          },
        });
        return this.formatResponse<Product[]>(response);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
      }
    },

    getById: async (id: string | number): Promise<Product | null> => {
      try {
        const response = await this.get<StrapiResponse<Product>>(`/products/${id}`, {
          params: { populate: '*' },
        });
        return this.formatResponse<Product>(response);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        console.error(`Failed to fetch product ${id}:`, error);
        throw error;
      }
    },
  };

  // Categories API
  public categories = {
    getAll: async (): Promise<Category[]> => {
      try {
        const response = await this.get<StrapiCollectionResponse<Category>>('/categories', {
          params: { populate: '*' },
        });
        return this.formatResponse<Category[]>(response);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
      }
    },

    getBySlug: async (slug: string): Promise<Category | null> => {
      try {
        const response = await this.get<StrapiCollectionResponse<Category>>('/categories', {
          params: {
            'filters[slug][$eq]': slug,
            populate: '*',
          },
        });
        const categories = this.formatResponse<Category[]>(response);
        return categories[0] || null;
      } catch (error) {
        console.error(`Failed to fetch category ${slug}:`, error);
        throw error;
      }
    },
  };

  // Orders API
  public orders = {
    create: async (order: OrderCreateData): Promise<Order> => {
      try {
        const response = await this.post<StrapiResponse<Order>>('/orders', {
          data: order,
        });
        return this.formatResponse<Order>(response);
      } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
      }
    },

    getById: async (id: string | number): Promise<Order | null> => {
      try {
        const response = await this.get<StrapiResponse<Order>>(`/orders/${id}`, {
          params: { populate: '*' },
        });
        return this.formatResponse<Order>(response);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        console.error(`Failed to fetch order ${id}:`, error);
        throw error;
      }
    },
  };

  // Auth API
  public auth = {
    login: async (identifier: string, password: string) => {
      try {
        const response = await this.post<{ jwt: string; user: any }>('/auth/local', {
          identifier,
          password,
        });
        return response;
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Invalid credentials');
      }
    },

    getMe: async (token: string): Promise<any> => {
      try {
        this.setAuthToken(token);
        return await this.get('/users/me');
      } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
      }
    },
  };
}

// Create and export a singleton instance
const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337') + '/api';
export const strapiClient = new StrapiClient(BASE_URL);

// Helper function to get full image URL
export const getImageUrl = (path?: string | null): string => {
  if (!path) return '/placeholder.svg';
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
  return `${baseUrl}${path}`;
};

export default strapiClient;
