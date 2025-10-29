import { useEffect, useMemo, useState } from "react";
import { Category } from "@/types/strapi";
import { useGetCategoriesQuery } from "@/lib/api/strapiApi";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch all categories from Strapi CMS
 * Handles loading states and error handling
 */
export const useCategories = (): UseCategoriesReturn => {
  const { data, isLoading, error, refetch } = useGetCategoriesQuery();
  const categories = useMemo(() => data ?? [], [data]);
  return {
    categories: categories as Category[],
    loading: isLoading,
    error: error ? ("status" in error ? String(error.status) : "Error") : null,
    refetch,
  };
};

interface UseCategoryBySlugReturn {
  category: Category | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch a single category by slug from Strapi CMS
 * @param slug - The category slug to fetch
 */
export const useCategoryBySlug = (slug: string): UseCategoryBySlugReturn => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    // Temporary: rely on list query and filter client-side
    setLoading(true);
    try {
      const res = await fetch(
        `${(import.meta as any).env?.VITE_STRAPI_URL || "http://localhost:1337"}/api/categories?filters[slug][$eq]=${encodeURIComponent(
          slug
        )}&populate=*`
      );
      const json = await res.json();
      const list = Array.isArray(json?.data)
        ? json.data.map((i: any) => ({ id: i.id, ...i.attributes }))
        : [];
      setCategory(list[0] ?? null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  };
};
