import type { Category, CategorySummary } from "@/types/strapi";
import { apiRequest, type ApiError } from "@/lib/api/client";

interface StrapiResponse<T> {
  data: any;
}

const normalizeCategory = (raw: any): Category => {
  if (!raw) {
    throw new Error("Category payload is empty");
  }

  const attributes = raw.attributes ?? raw;

  return {
    id: raw.id ?? attributes?.id,
    attributes: {
      name: attributes?.name ?? "",
      slug: attributes?.slug ?? "",
      category_image: attributes?.category_image ?? null,
    },
  };
};

export async function fetchCategories(): Promise<Category[]> {
  const response = await apiRequest<StrapiResponse<Category[]>>({
    url: "/categories",
    method: "GET",
    params: {
      populate: "*",
    },
  });

  return Array.isArray(response?.data)
    ? response.data.map(normalizeCategory)
    : [];
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const response = await apiRequest<StrapiResponse<Category[]>>({
    url: "/categories",
    method: "GET",
    params: {
      "filters[slug][$eq]": slug,
    },
  });

  if (!Array.isArray(response?.data) || response.data.length === 0) {
    return null;
  }

  return normalizeCategory(response.data[0]);
}

export type CategoriesApiError = ApiError;
export type CategoryLight = CategorySummary;
