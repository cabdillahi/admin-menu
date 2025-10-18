import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth/auth-api";
import { customerApi } from "./customer/customer-api";
import { bookingApi } from "./booking/booking-api";
import { paymentApi } from "./payment/payment.api";
import { accountApi } from "./accounts/account-api";
import { balanceApi } from "./balance/balance-api";
import { paidBalanceApi } from "./paid-balance/paid-balance-api";
import { reportApi } from "./reports/report-api";
import { categoryApi } from "./category/category-api";
import { foodApi } from "./food/food-api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [foodApi.reducerPath]: foodApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [balanceApi.reducerPath]: balanceApi.reducer,
    [paidBalanceApi.reducerPath]: paidBalanceApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
  },
  // devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(categoryApi.middleware)
      .concat(customerApi.middleware)
      .concat(foodApi.middleware)
      .concat(bookingApi.middleware)
      .concat(paymentApi.middleware)
      .concat(accountApi.middleware)
      .concat(balanceApi.middleware)
      .concat(paidBalanceApi.middleware)
      .concat(reportApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
