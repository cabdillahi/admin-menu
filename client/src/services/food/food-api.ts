import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "../url";
import type { FoodInput, GetAllFoodsResponse } from "../types/foodtype";

export const foodApi = createApi({
  reducerPath: "foodApi",
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
  tagTypes: ["food"],
  endpoints: (builder) => ({
    createFood: builder.mutation<void, FoodInput>({
      query: (body) => ({
        url: "/food",
        method: "POST",
        body,
      }),
      invalidatesTags: ["food"],
    }),

    updateFood: builder.mutation<
      void,
      {
        id: string;
        name: string;
        price: number;
        category: string;
        status: string;
      }
    >({
      query: (body) => ({
        url: "/food",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["food"],
    }),

    deleteFood: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/food/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["food"],
    }),

    getFoods: builder.query<
      GetAllFoodsResponse,
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
          url: `/food?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["food"],
    }),
  }),
});

export const {
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  useGetFoodsQuery,
} = foodApi;
