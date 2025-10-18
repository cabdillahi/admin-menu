"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Edit } from "lucide-react";
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
import { toast } from "sonner";
import { useUpdatecustomerMutation } from "@/services/customer/customer-api";
import type { Tenant, TenantUpdate } from "@/services/types/tenant-type";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subdomain: z.string().min(1, "Subdomain is required"),
  city: z.string().min(1, "City is required"),
  currency: z.string().min(1, "Currency is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  logo: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface UpdateCustomerDialogProps {
  children?: React.ReactNode;
  customer: Tenant
}

export function UpdateCustomerDialog({
  children,
  customer,
}: UpdateCustomerDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name,
      subdomain: customer.subdomain,
      city: customer.city,
      currency: customer.currency,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      website: customer.website || "",
      logo: customer.logo || "",
    },
  });

  const [updateFloor, { isLoading, error, isError }] =
    useUpdatecustomerMutation();

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      const tenantUpdate: TenantUpdate = {
        id: customer.id,
        name: values.name,
        subdomain: values.subdomain,
        city: values.city,
        currency: values.currency,
        email: values.email || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
        website: values.website || undefined,
        logo: values.logo || undefined,
      };

      await updateFloor(tenantUpdate).unwrap();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Customer updated successfully.", {
        style: {
          background: "green",
          color: "white",
        },
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.log(error);
      //@ts-ignore
      toast.error("server error", {
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  };

  React.useEffect(() => {
    if (isError) {
      //@ts-ignore
      toast.error(error.data?.message, {
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  }, [toast, error, isError]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset({
        name: customer.name,
        subdomain: customer.subdomain,
        city: customer.city,
        currency: customer.currency,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        website: customer.website || "",
        logo: customer.logo || "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Customer</DialogTitle>
          <DialogDescription>
            Update the customer information. Modify the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter customer name"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdomain *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subdomain name"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Customer's email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Customer's phone number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter address"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Customer's address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="USD, EUR, GBP, etc."
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Customer's website URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: URL to customer's logo image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="dark:bg-secondary"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Customer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
