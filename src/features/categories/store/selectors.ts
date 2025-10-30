import type { RootState } from "@/app/store";
import type { Category } from "@/types/strapi";

export const selectCategoryBySlug = (
  state: RootState,
  slug?: string
): Category | null => {
  if (!slug) return null;
  return state.categories.entitiesBySlug[slug] ?? null;
};
