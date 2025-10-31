import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Category } from "@/types/strapi";
import {
  fetchCategories as fetchCategoriesApi,
  fetchCategoryBySlug as fetchCategoryBySlugApi,
  type CategoriesApiError,
} from "../api/categoriesApi";
import { toErrorMessage } from "@/lib/api/errorHandler";

interface CategoriesState {
  list: Category[];
  entities: Record<string | number, Category>;
  entitiesBySlug: Record<string, Category>;
  listLoading: boolean;
  listError: string | null;
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: CategoriesState = {
  list: [],
  entities: {},
  entitiesBySlug: {},
  listLoading: false,
  listError: null,
  detailLoading: false,
  detailError: null,
};


const storeCategory = (
  state: CategoriesState,
  category: Category | null | undefined
) => {
  if (!category) return;
  state.entities[category.id] = category;
  const slug = category.attributes?.slug;
  if (slug) {
    state.entitiesBySlug[slug] = category;
  }
};

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: CategoriesApiError }
>("categories/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await fetchCategoriesApi();
  } catch (error) {
    return rejectWithValue(error as CategoriesApiError);
  }
});

export const fetchCategoryBySlug = createAsyncThunk<
  Category | null,
  string,
  { rejectValue: CategoriesApiError }
>("categories/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    return await fetchCategoryBySlugApi(slug);
  } catch (error) {
    return rejectWithValue(error as CategoriesApiError);
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoriesError(state) {
      state.listError = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.listLoading = false;
        state.listError = null;
        state.list = action.payload;
        action.payload.forEach((category) => storeCategory(state, category));
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = toErrorMessage(action.payload ?? action.error?.message);
      })
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailError = null;
        storeCategory(state, action.payload ?? undefined);
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = toErrorMessage(action.payload ?? action.error?.message);
      });
  },
});

export const { clearCategoriesError } = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectCategoriesState = (state: RootState) => state.categories;
export const selectCategoriesList = (state: RootState) => state.categories.list;
export const selectCategoriesLoading = (state: RootState) => state.categories.listLoading;
export const selectCategoriesError = (state: RootState) => state.categories.listError;
export const selectCategoryById = (
  state: RootState,
  id?: string | number | null
) => {
  if (!id) return null;
  return state.categories.entities[id] ?? null;
};
export const selectCategoryBySlug = (state: RootState, slug?: string | null) => {
  if (!slug) return null;
  return state.categories.entitiesBySlug[slug] ?? null;
};
export const selectCategoryDetailLoading = (state: RootState) =>
  state.categories.detailLoading;
export const selectCategoryDetailError = (state: RootState) =>
  state.categories.detailError;
