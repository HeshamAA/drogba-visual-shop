import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product, Category, Order } from "@/types/strapi";

const baseUrl =
  (import.meta as any).env?.VITE_STRAPI_URL || "http://localhost:1337";

export const strapiApi = createApi({
  reducerPath: "strapiApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl.replace(/\/$/, "") + "/api",
    prepareHeaders: (headers) => {
      // Add any auth headers if needed
      const token = localStorage.getItem('admin_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products", "Categories", "Orders"],
  keepUnusedDataFor: 300, // Cache for 5 minutes
  refetchOnMountOrArgChange: 60, // Refetch if data is older than 60 seconds
  endpoints: (builder) => ({
    getProducts: builder.query<
      Product[],
      {
        page?: number;
        pageSize?: number;
        filters?: Record<string, any>;
        sort?: string;
      } | undefined
    >({
      query: (args = {}) => {
        const page = args.page ?? 1;
        const pageSize = args.pageSize ?? 10;
        const sort = args.sort ?? "createdAt:desc";
        const params: Record<string, any> = {
          populate: "*",
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          sort,
        };
        if (args.filters) Object.assign(params, args.filters);
        return { url: "/products", params };
      },
      transformResponse: (response: any) =>
        Array.isArray(response?.data)
          ? response.data.map((i: any) => ({ id: i.id, ...i.attributes }))
          : [],
      providesTags: ["Products"],
    }),
    getProductById: builder.query<Product | null, string | number>({
      query: (id) => ({ url: `/products/${id}`, params: { populate: "*" } }),
      transformResponse: (response: any) =>
        response?.data
          ? { id: response.data.id, ...response.data.attributes }
          : null,
      providesTags: ["Products"],
    }),
    getProductBySlug: builder.query<Product | null, string>({
      query: (slug) => ({
        url: `/products`,
        params: {
          populate: "*",
          "filters[slug][$eq]": slug,
          "pagination[pageSize]": 1,
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response?.data)
          ? response.data.map((i: any) => ({ id: i.id, ...i.attributes }))
          : [];
        return list[0] ?? null;
      },
      providesTags: ["Products"],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: "/categories", params: { populate: "*" } }),
      transformResponse: (response: any) =>
        Array.isArray(response?.data)
          ? response.data.map((i: any) => ({ id: i.id, ...i.attributes }))
          : [],
      providesTags: ["Categories"],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: { data: order },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
} = strapiApi;
