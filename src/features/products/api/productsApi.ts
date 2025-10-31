import type { Product } from "@/types/strapi";
import axiosInstance from "@/lib/api/client";

interface StrapiListResponse<T> {
  data: any;
}

interface StrapiSingleResponse<T> {
  data: any;
}

export function normalizeProduct(raw: any): Product {
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

  const { data } = await axiosInstance.get<StrapiListResponse<Product[]>>("/products", {
    params: query,
  });
  return Array.isArray(data?.data) ? data.data.map(normalizeProduct) : [];
}

export async function fetchProductBySlug(
  slug: string,
  isBasicGet?: boolean
): Promise<Product | null> {
  return getBySlug(slug,isBasicGet);
}

export async function getBySlug(slug: string,isBasicGet?: boolean): Promise<Product | null> {
  if (!slug) {
    return null;
  }
 
    
  
  try {
    const response = await axiosInstance.get<StrapiListResponse<Product[]>>("/products", {
      params: {
        populate: "*",
        "filters[slug][$eq]": slug,
        "pagination[pageSize]": 1,
      },
    });

    const products = response?.data?.data;

    if (Array.isArray(products) && products.length > 0) {
      return normalizeProduct(products[0]);
    }

    return null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export type ProductsApiError = unknown;
