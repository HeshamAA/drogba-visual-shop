import axiosInstance from "@/lib/api/client";
import { fetchProductBySlug, normalizeProduct } from "@/features/products/api/productsApi";
import type { Product } from "@/types/strapi";
import { getImageUrl as coreGetImageUrl } from "@/lib/strapi";
import type { AxiosResponse } from "axios";
import slugify from "slugify";


const RAW_BASE_URL =
  (import.meta as any).env?.VITE_STRAPI_URL || "http://localhost:1337";

const buildProductPayload = (product: Partial<Product>): { data: Record<string, unknown> } => {
  const rawSource =
    product && typeof product === "object" && "attributes" in product
      ? (product.attributes as unknown)
      : (product as unknown);

  const source = (rawSource ?? {}) as Record<string, unknown>;

  const data: Record<string, unknown> = { ...source };
  delete data.id;

  if (!data.slug && typeof data.name === "string") {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }

  if (data.category && typeof data.category === "object") {
    const categoryObj = data.category as { id?: number | string };
    if (categoryObj?.id) {
      data.category = categoryObj.id;
    }
  }

  if (data.product_images === undefined) {
    delete data.product_images;
  }

  return { data };
};

const extractProduct = (response: AxiosResponse<any>): Product => {
  const raw = response?.data?.data;
  return normalizeProduct(raw);
};

export const adminProductsApi = {
  async create(product: Partial<Product>): Promise<Product> {
    const payload = buildProductPayload(product);
    console.log("Creating product:", product);
    const response = await axiosInstance.post("/products?populate=*", payload);
    console.log("Created product:", response);
    return extractProduct(response);
  },

  async update(slug: string, product: Partial<Product>): Promise<Product> {
    const payload = buildProductPayload(product);
    if (!payload.data.slug && typeof slug === "string" && slug.trim()) {
      payload.data.slug = slug;
    }

    const existingProduct = await fetchProductBySlug(slug);

    if (!existingProduct) {
      throw new Error(`Product with slug "${slug}" was not found`);
    }

    const targetId = (existingProduct as any)?.documentId ?? existingProduct.id;

    if (!targetId) {
      throw new Error("Unable to resolve product identifier for update");
    }

    console.log("Updating product:", existingProduct);
    const response = await axiosInstance.put(`/products/${targetId}?populate=*`, payload);
    return extractProduct(response);
  },

  async delete(slug: string): Promise<void> {
    console.log("Deleting product:", slug);
    const response = await fetchProductBySlug(slug);
    console.log("Product to delete:", response.documentId);
    await axiosInstance.delete(`/products/${response.documentId}`);
  },

  async uploadImage(file: File): Promise<{ id: number; url: string }> {
    const form = new FormData();
    form.append("files", file);
    const url = RAW_BASE_URL.replace(/\/$/, "") + "/upload";
    const { data } = await axiosInstance.post(url, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const uploaded = Array.isArray(data) ? data[0] : data;
    return { id: uploaded?.id, url: uploaded?.url };
  },
};

export const getImageUrl = coreGetImageUrl;