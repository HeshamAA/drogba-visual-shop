import type { Product } from "@/types/strapi";
import { apiRequest, type ApiError } from "@/lib/api/client";

interface StrapiResponse<T> {
  data: any;
}

function normalizeProduct(raw: any): Product {
  if (!raw) {
    throw new Error("Product payload is empty");
  }

  const attributes = raw.attributes ?? raw;

  return {
    id: raw.id ?? attributes?.id,
    ...attributes,
    attributes,
  } as Product;
}

export async function fetchProducts(): Promise<Product[]> {
  const query: Record<string, unknown> = {
    populate: "*",
  };

  const response = await apiRequest<StrapiResponse<Product[]>>({
    url: "/products",
    method: "GET",
    params: query,
  });

  return Array.isArray(response?.data)
    ? response.data.map(normalizeProduct)
    : [];
}

export async function fetchProductById(
  id: string | number
): Promise<Product | null> {
  const response = await apiRequest<StrapiResponse<Product>>({
    url: `/products/${id}`,
    method: "GET",
    params: { populate: "*" },
  });

  if (!response?.data) {
    return null;
  }

  return normalizeProduct(response.data);
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  const response = await apiRequest<StrapiResponse<Product[]>>({
    url: "/products",
    method: "GET",
    params: {
      populate: "*",
      "filters[slug][$eq]": slug,
    },
  });

  if (!Array.isArray(response?.data) || response.data.length === 0) {
    return null;
  }

  return normalizeProduct(response.data[0]);
}

export type ProductsApiError = ApiError;
