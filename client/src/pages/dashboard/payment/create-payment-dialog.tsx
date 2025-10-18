"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccountsQuery } from "@/services/accounts/account-api";
import { useGetBalancesQuery } from "@/services/balance/balance-api";
import { useGetbookingsQuery } from "@/services/booking/booking-api";
import { useCreatePaymentMutation } from "@/services/payment/payment.api";
import type { Payment } from "@/services/types/types";
import { toast } from "sonner";
import { printPaymentReceipt } from "./print-receipt";

const paymentSchema = z.object({
  bookingId: z.string().min(1, "Booking is required"),
  accountId: z.string().min(1, "Account is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  method: z
    .enum(["CASH", "MobileMoney", "CREDIT_CARD", "DEBIT_CARD", "ONLINE"])
    .optional(),
  status: z.enum(["PAID", "PENDING", "FAILED"]).optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface CreatePaymentDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreatePaymentDialog({
  children,
  onSuccess,
}: CreatePaymentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [createdPayment, setCreatedPayment] = React.useState<Payment | null>(
    null
  );
  const [createPayment, { isLoading, error, isError }] =
    useCreatePaymentMutation();

  const { refetch: Getalances } = useGetBalancesQuery({});

  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    refetch,
  } = useGetbookingsQuery({ page: 1, limit: 100 });
  const { data: accountsData, isLoading: isLoadingAccounts } =
    useGetAccountsQuery({ page: 1, limit: 100 });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      bookingId: "",
      accountId: "",
      amount: "",
      method: "CASH",
      status: "PENDING",
    },
  });

  const selectedBookingId = form.watch("bookingId");

  React.useEffect(() => {
    if (selectedBookingId && bookingsData?.data) {
      const selectedBooking = bookingsData.data.find(
        (booking) => booking.id === selectedBookingId
      );
      if (selectedBooking?.room?.price) {
        form.setValue("amount", selectedBooking.room.price.toString());
      }
    }
  }, [selectedBookingId, bookingsData, form]);

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      const result = await createPayment({
        bookingId: values.bookingId,
        amount: Number(values.amount),
        method: values.method,
        status: values.status,
        accountId: values.accountId,
      }).unwrap();

      toast.success("Payment created successfully.", {
        style: {
          background: "green",
          color: "white",
        },
      });

      setCreatedPayment(result);

      refetch();
      Getalances();
      onSuccess?.();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (isError) {
      //@ts-ignore
      toast.error(error.data?.message || "Failed to create payment", {
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  }, [toast, error, isError]);

  const handlePrintReceipt = () => {
    if (!createdPayment) return;

    const selectedBooking = bookingsData?.data.find(
      (booking) => booking.id === createdPayment.bookingId
    );
    const selectedAccount = accountsData?.data.find(
      (account) => account.id === createdPayment.id
    );

    printPaymentReceipt({
      payment: createdPayment,
      bookingInfo: selectedBooking
        ? {
            customerName: selectedBooking.customer.name,
            roomNumber: selectedBooking.room.number,
          }
        : undefined,
      accountInfo: selectedAccount
        ? {
            accountName: selectedAccount.name,
            accountType: selectedAccount.type,
          }
        : undefined,
    });
  };

  console.log(handlePrintReceipt);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setCreatedPayment(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Payment</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {createdPayment
              ? "Payment Created Successfully"
              : "Create New Payment"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {createdPayment
              ? "Your payment has been recorded. You can print a receipt below."
              : "Add a new payment to the system. Fill in the required information below."}
          </DialogDescription>
        </DialogHeader>

        {!createdPayment ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bookingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Booking *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingBookings}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLoadingBookings
                                ? "Loading bookings..."
                                : "Select a booking"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {bookingsData?.data.map((booking) => (
                          <SelectItem
                            key={booking.id}
                            value={booking.id}
                            className="text-sm"
                          >
                            <span className="block truncate">
                              {booking.customer.name} - Room{" "}
                              {booking.room.number} ({booking.status})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Select the booking for this payment
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Account *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingAccounts}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLoadingAccounts
                                ? "Loading accounts..."
                                : "Select an account"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {accountsData?.data.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            className="text-sm"
                          >
                            <span className="block truncate">
                              {account.name} ({account.type})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Select the account for this payment
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Amount *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Payment Method
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="MobileMoney">
                          Mobile Money
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Optional: Select the payment method
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex-col gap-2 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gap-2 dark:bg-secondary sm:w-auto"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Payment
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-6 py-4">
            {/* <div className="rounded-lg border bg-muted/50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Payment ID:
                </span>
                <span className="font-mono text-sm">
                  {createdPayment?.id?.slice(0, 16)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Amount:
                </span>
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Number(createdPayment.amount))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Status:
                </span>
                <span className="text-sm font-semibold">
                  {createdPayment.status}
                </span>
              </div>
            </div> */}

            <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreatedPayment(null);
                  form.reset();
                }}
                className="w-full sm:w-auto  dark:bg-secondary"
              >
                Create Another
              </Button>
              {/* <Button
                type="button"
                onClick={handlePrintReceipt}
                className="w-full gap-2 sm:w-auto dark:bg-secondary"
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button> */}
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto dark:bg-secondary"
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
