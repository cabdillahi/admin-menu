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
import { useCreatecustomerMutation } from "@/services/customer/customer-api";
import type { TenantInput } from "@/services/types/tenant-type";
import { toast } from "sonner";

const customerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  subdomain: z.string().min(1, "Subdomain is required"),
  city: z.string().min(1, "City is required"),
  currency: z.string().min(1, "Currency is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
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

interface CreateCustomerDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateCustomerDialog({
  children,
  onSuccess,
}: CreateCustomerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [createCustomer, { isLoading, error, isError }] =
    useCreatecustomerMutation();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      subdomain: "",
      city: "",
      currency: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      logo: "",
    },
  });

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      const tenantInput: TenantInput = {
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

      await createCustomer(tenantInput).unwrap();

      toast.success("Customer created successfully.", {
        style: {
          background: "green",
          color: "white",
        },
      });

      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (isError) {
      //@ts-ignore
      toast.error(error.data?.message || "Failed to create customer", {
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
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
          <DialogDescription>
            Add a new customer to the system. Fill in the required information
            below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter customer's full name"
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
                  <FormLabel>
                    Currency <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="SHL">SHL</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="customer@example.com"
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Customer's contact phone number
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
                      placeholder="123 Main St, City, State"
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
                className="gap-2 dark:bg-secondary"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Customer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
