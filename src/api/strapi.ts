import axios, { AxiosInstance } from "axios";
import type { Product, Category, Order } from "@/types/strapi";

// Base URLs
const RAW_BASE_URL =
  (import.meta as any).env?.VITE_STRAPI_URL || "http://localhost:1337";
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, "") + "/api";

const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getImageUrl(path?: string | null): string {
  if (!path) return "/public/placeholder.svg";
  if (/^https?:\/\//i.test(path)) return path;
  return RAW_BASE_URL.replace(/\/$/, "") + path;
}

export const productsApi = {
  async getAll(): Promise<Product[]> {
    try {
      const { data } = await http.get("/products", {
        params: { populate: "*" },
      });
      // Expect Strapi v4/v5 response { data: [...] }
      return Array.isArray(data?.data) ? data.data : [];
    } catch (e) {
      console.warn("productsApi.getAll fallback [] due to:", e);
      return [];
    }
  },

  async getById(id: number | string): Promise<Product | null> {
    try {
      const { data } = await http.get(`/products/${id}`, {
        params: { populate: "*" },
      });
      return data?.data ?? null;
    } catch (e) {
      console.warn("productsApi.getById fallback null due to:", e);
      return null;
    }
  },
};

export const adminProductsApi = {
  async create(product: Product): Promise<Product> {
    const payload = {
      data: product?.attributes ? product : { attributes: product },
    } as any;
    const { data } = await http.post("/products", payload);
    return data?.data;
  },
  async update(id: number | string, product: Product): Promise<Product> {
    const payload = {
      data: product?.attributes ? product : { attributes: product },
    } as any;
    const { data } = await http.put(`/products/${id}`, payload);
    return data?.data;
  },
  async delete(id: number): Promise<void> {
    await http.delete(`/products/${id}`);
  },
};

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    try {
      const { data } = await http.get("/categories");
      return Array.isArray(data?.data) ? data.data : [];
    } catch (e) {
      console.warn("categoriesApi.getAll fallback [] due to:", e);
      return [];
    }
  },
  async getBySlug(slug: string): Promise<Category | null> {
    try {
      const { data } = await http.get("/categories", {
        params: {
          filters: { slug: { $eq: slug } },
          pagination: { pageSize: 1 },
        },
      });
      const list = Array.isArray(data?.data) ? data.data : [];
      return list[0] ?? null;
    } catch (e) {
      console.warn("categoriesApi.getBySlug fallback null due to:", e);
      return null;
    }
  },
};

type OrderCreate = Omit<Order, "status"> & { status?: Order["status"] } & {
  products?: Array<{
    productId: number;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
};

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    try {
      const { data } = await http.get("/orders");
      return Array.isArray(data?.data) ? data.data : [];
    } catch (e) {
      console.warn("ordersApi.getAll fallback [] due to:", e);
      return [];
    }
  },
  async create(order: OrderCreate): Promise<Order | null> {
    try {
      const payload = { data: order } as any;
      const { data } = await http.post("/orders", payload);
      return data?.data ?? null;
    } catch (e) {
      console.warn("ordersApi.create fallback null due to:", e);
      return null;
    }
  },
  async updateStatus(id: number, status: Order["status"]): Promise<void> {
    await http.put(`/orders/${id}`, { data: { status } });
  },
};

export default {
  getImageUrl,
  productsApi,
  adminProductsApi,
  categoriesApi,
  ordersApi,
};
