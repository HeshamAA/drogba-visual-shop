import { useEffect, useMemo, useCallback } from "react";
import { Category } from "@/types/strapi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchCategories,
  fetchCategoryBySlug,
  selectCategoriesList,
  selectCategoriesLoading,
  selectCategoriesError,
  selectCategoryBySlug,
  selectCategoryDetailLoading,
  selectCategoryDetailError,
} from "@/features/categories/store/categoriesSlice";

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
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategoriesList);
  const loading = useAppSelector(selectCategoriesLoading);
  const error = useAppSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const memoizedCategories = useMemo(() => categories ?? [], [categories]);

  return {
    categories: memoizedCategories as Category[],
    loading,
    error,
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
  const dispatch = useAppDispatch();
  const category = useAppSelector((state) => selectCategoryBySlug(state, slug));
  const loading = useAppSelector(selectCategoryDetailLoading);
  const error = useAppSelector(selectCategoryDetailError);

  const fetchCategory = useCallback(async () => {
    if (!slug) return;
    await dispatch(fetchCategoryBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (slug) {
      fetchCategory();
    }
  }, [fetchCategory, slug]);

  return {
    category: category ?? null,
    loading,
    error,
    refetch: () => {
      if (!slug) return;
      void fetchCategory();
    },
  };
};
