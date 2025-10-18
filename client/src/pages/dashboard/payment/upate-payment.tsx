"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Edit } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Payment } from "@/services/types/types"
import { useUpdatePaymentMutation } from "@/services/payment/payment.api"

const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  method: z.enum(["CASH", "MobileMoney", "CREDIT_CARD", "DEBIT_CARD", "ONLINE"]),
  status: z.enum(["PAID", "PENDING", "FAILED"]),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface UpdatePaymentDialogProps {
  children?: React.ReactNode
  payment: Payment
}

export function UpdatePaymentDialog({ children, payment }: UpdatePaymentDialogProps) {
  const [open, setOpen] = React.useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: payment.amount.toString(),
      method: payment.method as any,
      status: payment.status as any,
    },
  })

  const [updatePayment, { isLoading, error, isError }] = useUpdatePaymentMutation()

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      await updatePayment({
        id: payment.id,
        amount: Number(values.amount),
        method: values.method,
        status: values.status,
      }).unwrap()

      toast.success("Payment updated successfully.", {
        style: {
          background: "green",
          color: "white",
        },
      })

      form.reset()
      setOpen(false)
    } catch (error) {
      console.log(error)
      //@ts-ignore
      toast.error("Server error", {
        style: {
          background: "red",
          color: "white",
        },
      })
    }
  }

  React.useEffect(() => {
    if (isError) {
      //@ts-ignore
      toast.error(error.data?.message || "Failed to update payment", {
        style: {
          background: "red",
          color: "white",
        },
      })
    }
  }, [toast, error, isError])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      form.reset({
        amount: payment.amount.toString(),
        method: payment.method as any,
        status: payment.status as any,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Payment</DialogTitle>
          <DialogDescription>Update the payment information. Modify the details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="MobileMoney">Mobile Money</SelectItem>
                      <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                      <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                      <SelectItem value="ONLINE">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
