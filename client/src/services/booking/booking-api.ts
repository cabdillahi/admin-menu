import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "../url";
import type {
  BookingInput,
  BookingRepose,
  BookingUpdate,
} from "../types/types";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
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
  tagTypes: ["booking"],
  endpoints: (builder) => ({
    createbooking: builder.mutation<void, BookingInput>({
      query: (body) => ({
        url: "/booking",
        method: "POST",
        body,
      }),
      invalidatesTags: ["booking"],
    }),
    updatebooking: builder.mutation<void, BookingUpdate>({
      query: (body) => ({
        url: "/booking",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["booking"],
    }),
    deletebooking: builder.mutation<void, { id: string }>({
      query: (id) => ({
        url: `/booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["booking"],
    }),

    getbookings: builder.query<
      BookingRepose,
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
          url: `/booking?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["booking"],
    }),
  }),
});

export const {
  useCreatebookingMutation,
  useGetbookingsQuery,
  useUpdatebookingMutation,
  useDeletebookingMutation,
} = bookingApi;
