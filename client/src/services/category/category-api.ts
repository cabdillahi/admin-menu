import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "../url";
import type {
  Category,
  CategoryInput,
  GetAllCategoriesResponse,
} from "../types/categorytype";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    createCategory: builder.mutation<void, CategoryInput>({
      query: (body) => ({
        url: "/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      void,
      { id: number; name: string; description?: string; imageUrl?: string }
    >({
      query: (body) => ({
        url: "/category",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    getCategories: builder.query<
      GetAllCategoriesResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        order?: "asc" | "desc";
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortBy = "name",
        order = "asc",
      } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (sortBy) params.append("sortBy", sortBy);
        if (order) params.append("order", order);

        return {
          url: `/category?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Category"],
    }),

    getCategoriesWithoutPagination: builder.query<Category[], void>({
      query: () => "/category/all",
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoriesWithoutPaginationQuery,
} = categoryApi;
