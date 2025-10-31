import type { Category, CategorySummary } from "@/types/strapi";
import axiosInstance from "@/lib/api/client";

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
  const { data } = await axiosInstance.get<StrapiResponse<Category[]>>("/categories", {
    params: {
      populate: "*",
    },
  });

  return Array.isArray(data?.data) ? data.data.map(normalizeCategory) : [];
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await axiosInstance.get<StrapiResponse<Category[]>>("/categories", {
    params: {
      "filters[slug][$eq]": slug,
    },
  });

  if (!Array.isArray(data?.data) || data.data.length === 0) {
    return null;
  }

  return normalizeCategory(data.data[0]);
}

export type CategoriesApiError = unknown;
export type CategoryLight = CategorySummary;
