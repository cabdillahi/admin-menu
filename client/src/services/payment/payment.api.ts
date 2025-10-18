import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PaymentInput,
  PaymentUpdate,
  PaymentResponse,
  Payment,
} from "../types/types";
import { url } from "../url";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
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
  tagTypes: ["payment"],
  endpoints: (builder) => ({
    // ✅ Create Payment
    createPayment: builder.mutation<Payment, PaymentInput>({
      query: (body) => ({
        url: "/payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payment"],
    }),

    // ✅ Update Payment
    updatePayment: builder.mutation<Payment, PaymentUpdate>({
      query: (body) => ({
        url: "/payment",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["payment"],
    }),

    // ✅ Delete Payment
    deletePayment: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["payment"],
    }),

    // ✅ Get Payments (List)
    getPayments: builder.query<
      PaymentResponse,
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
        sortBy = "createdAt",
        order = "desc",
      } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (sortBy) params.append("sortBy", sortBy);
        if (order) params.append("order", order);

        return {
          url: `/payment?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["payment"],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentsQuery,
} = paymentApi;
