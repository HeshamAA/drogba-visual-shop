import { useState, useEffect } from "react";
import { Category } from "@/types/strapi";
import { categoriesApi } from "@/api/strapi";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
      console.error("Error in useCategories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  
  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
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
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getBySlug(slug);
      setCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch category");
      console.error("Error in useCategoryBySlug:", err);
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
