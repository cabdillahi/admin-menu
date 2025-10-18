export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
  };
}

export interface Tenant {
  id?: string;
  name: string;
}

export interface UserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    role: string;
    tenantId: string;
    tenant: Tenant;
  };
}

// Floor types
export interface FloorInput {
  number: number;
  name?: string;
}

// CustomerInput interface converted from Prisma model
export interface CustomerInput {
  name: string;
  email: string;
  passport?: string;
  document?: string;
  phone?: string;
}
export interface CustomerUpdate {
  id: string;
  name: string;
  email: string;
  passport?: string;
  document?: string;
  phone?: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  status: string;
  price: number;
  isBooked: boolean;
  tenantId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  floorId: number;
  customerId: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  passport: string | null;
  document: string | null;
  phone: string | null;
  createdAt: string;
  tenantId: string;
  userId: string;
  updatedAt: string;
  tenant: Tenant;
  user: UserResponse;
  Room: Room[];
  Booking: Booking[];
}

export interface CustomerResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Customer[];
}

export interface RoomData {
  id: string;
  number: string;
  type: string;
  status: string;
  price: number;
  isBooked: boolean;
  floorId?: number;
  customerId?: string | null;
  tenantId: string;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: RoomData[];
}

export interface RoomInput {
  number: string;
  type: string;
  price: number;
  floorId: number;
}

export interface Booking {
  id: string;
  roomId: string;
  customerId: string;
  tenantId: string;
  checkIn: Date;
  status: string;
  paymentStatus: string;
  checkOut: Date;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
  room: Room;
}

export interface BookingRepose {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Booking[];
}

export interface BookingInput {
  roomId: string;
  customerId: string;
  checkIn: Date;
  checkOut: Date;
}
export interface BookingUpdate {
  id: string;
  roomId: string;
  customerId: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

//payment

export interface PaymentInput {
  bookingId: string;
  amount: number;
  accountId: string;
  method?: "CASH" | "MobileMoney" | "CREDIT_CARD" | "DEBIT_CARD" | "ONLINE";
  status?: "PAID" | "PENDING" | "FAILED";
}

export interface PaymentUpdate {
  id: string;
  amount?: number;
  method?: "CASH" | "MobileMoney" | "CREDIT_CARD" | "DEBIT_CARD" | "ONLINE";
  status?: "PAID" | "PENDING" | "FAILED";
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    room?: { number: string };
    paymentStatus: string;
    customer?: { name: string; email: string };
  };
}

export interface PaymentResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Payment[];
}

//accounts

export interface Account {
  id: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  code?: number | null;
  balance: number;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountInput {
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  code?: number;
}

export interface AccountUpdate {
  id: string;
  name?: string;
  type?: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  code?: number;
  balance?: number;
}

export interface AccountResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Account[];
}

// balance interface

// ✅ Define TypeScript interfaces
export interface Balance {
  id: string;
  customerId: string;
  tenantId: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface BalanceInput {
  customerId: string;
  totalDebit?: number;
  totalCredit?: number;
  balance?: number;
}

export interface BalanceUpdate {
  id: string;
  totalDebit?: number;
  totalCredit?: number;
  balance?: number;
}

export interface BalanceResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Balance[];
}

// paid-balance

// ✅ Types
export interface PaidBalanceInput {
  customerId: string;
  paymentId?: string;
  amount: number;
  remaining?: number;
  type: "PARTIAL" | "FULL";
  description?: string;
}

export interface PaidBalanceResponse {
  id: string;
  customerId: string;
  tenantId: string;
  paymentId?: string;
  amount: number;
  remaining?: number;
  type: string;
  description?: string;
  createdAt: string;
}

export interface PaidBalanceUpdate {
  id: string;
  amount?: number;
  remaining?: number;
  type?: "PARTIAL" | "FULL";
  description?: string;
}

export interface PaidBalanceListResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: PaidBalanceResponse[];
}

// reports types

// types/types.ts

export interface Transaction {
  id: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  description?: string;
  date: string;
  accountId: string;
}

export interface Account {
  id: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  balance: number;
  transactions: Transaction[];
}

export interface ReportSummary {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalBalance: number;
}

export interface ReportResponse {
  period: "daily" | "monthly" | "yearly";
  summary: ReportSummary;
  accounts: Account[];
}
