import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Product } from "@/types/strapi";
import {
  fetchProducts as fetchProductsApi,
  fetchProductById as fetchProductByIdApi,
  fetchProductBySlug as fetchProductBySlugApi,
  type ProductsApiError,
} from "../api/productsApi";

export interface ProductsState {
  list: Product[];
  entities: Record<string | number, Product>;
  entitiesBySlug: Record<string, Product>;
  listLoading: boolean;
  listError: string | null;
  detailLoading: boolean;
  detailError: string | null;
  featured: Product[];
  featuredLoading: boolean;
  featuredError: string | null;
  selectedProductId: string | number | null;
}

const initialState: ProductsState = {
  list: [],
  entities: {},
  entitiesBySlug: {},
  listLoading: false,
  listError: null,
  detailLoading: false,
  detailError: null,
  featured: [],
  featuredLoading: false,
  featuredError: null,
  selectedProductId: null,
};

const toErrorMessage = (error: unknown): string => {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message ?? "Unknown error");
  }
  return "Unknown error";
};

const storeProduct = (
  state: ProductsState,
  product: Product | null | undefined
) => {
  if (!product) return;
  state.entities[product.id] = product;
  const slug =
    (product as any)?.slug ??
    (product.attributes && (product.attributes as any).slug);
  if (typeof slug === "string" && slug.trim()) {
    state.entitiesBySlug[slug] = product;
  }
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: ProductsApiError }
>("products/fetchList", async (_, { rejectWithValue }) => {
  try {
    return await fetchProductsApi();
  } catch (error) {
    return rejectWithValue(error as ProductsApiError);
  }
});

export const fetchFeaturedProducts = createAsyncThunk<
  Product[],
  number | undefined,
  { rejectValue: ProductsApiError }
>("products/fetchFeatured", async (limit = 4, { rejectWithValue }) => {
  try {
    const allProducts = await fetchProductsApi();
    return allProducts.slice(0, limit);
  } catch (error) {
    return rejectWithValue(error as ProductsApiError);
  }
});

export const fetchProductById = createAsyncThunk<
  Product | null,
  string | number,
  { rejectValue: ProductsApiError }
>("products/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await fetchProductByIdApi(id);
  } catch (error) {
    return rejectWithValue(error as ProductsApiError);
  }
});

export const fetchProductBySlug = createAsyncThunk<
  Product | null,
  string,
  { rejectValue: ProductsApiError }
>("products/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    return await fetchProductBySlugApi(slug);
  } catch (error) {
    return rejectWithValue(error as ProductsApiError);
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProductId(state, action: PayloadAction<string | number | null>) {
      state.selectedProductId = action.payload;
    },
    clearProductsError(state) {
      state.listError = null;
      state.detailError = null;
      state.featuredError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.listError = null;
        const products = Array.isArray(action.payload) ? action.payload : [];
        state.list = products;
        products.forEach((product) => storeProduct(state, product));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = toErrorMessage(action.payload ?? action.error?.message);
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailError = null;
        if (action.payload) {
          storeProduct(state, action.payload);
          state.selectedProductId = action.payload.id;
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = toErrorMessage(action.payload ?? action.error?.message);
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailError = null;
        if (action.payload) {
          storeProduct(state, action.payload);
          state.selectedProductId = action.payload.id;
        } else {
          state.selectedProductId = null;
        }
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = toErrorMessage(action.payload ?? action.error?.message);
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = null;
        const featuredProducts = Array.isArray(action.payload) ? action.payload : [];
        state.featured = featuredProducts;
        featuredProducts.forEach((product) => {
          storeProduct(state, product);
        });
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = toErrorMessage(action.payload ?? action.error?.message);
      });
  },
});

export const { setSelectedProductId, clearProductsError } = productsSlice.actions;

export default productsSlice.reducer;

export const selectProductsState = (state: RootState) => state.products;
export const selectProductsList = (state: RootState): Product[] =>
  state.products.list as Product[];
export const selectProductsLoading = (state: RootState) => state.products.listLoading;
export const selectProductsError = (state: RootState) => state.products.listError;
export const selectProductDetailLoading = (state: RootState) =>
  state.products.detailLoading;
export const selectProductDetailError = (state: RootState) =>
  state.products.detailError;
export const selectFeaturedProducts = (state: RootState): Product[] =>
  state.products.featured as Product[];
export const selectFeaturedProductsLoading = (state: RootState) =>
  state.products.featuredLoading;
export const selectFeaturedProductsError = (state: RootState) =>
  state.products.featuredError;
export const selectProductById = (
  state: RootState,
  id?: string | number | null
): Product | null => {
  if (!id) return null;
  return (state.products.entities[id] as Product | undefined) ?? null;
};
export const selectProductBySlug = (
  state: RootState,
  slug?: string | null
): Product | null => {
  if (!slug) return null;
  return (state.products.entitiesBySlug[slug] as Product | undefined) ?? null;
};
export const selectSelectedProduct = (state: RootState): Product | null =>
  selectProductById(state, state.products.selectedProductId);
