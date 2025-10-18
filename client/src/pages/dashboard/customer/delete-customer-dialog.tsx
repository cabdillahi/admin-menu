"use client";

import { Loader2, Trash2 } from "lucide-react";
import * as React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDeletecustomerMutation } from "@/services/customer/customer-api";
import type { Tenant } from "@/services/types/types";

interface DeleteCustomerDialogProps {
  children?: React.ReactNode;
  customer: Tenant;
}

export function DeleteCustomerDialog({
  children,
  customer,
}: DeleteCustomerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [confirmationText, setConfirmationText] = React.useState("");
  const [deleteCustomer, { isLoading }] = useDeletecustomerMutation();
  const handleDelete = async () => {
    try {
      const id = String(customer.id);
      await deleteCustomer({ id: id }).unwrap();

      toast.success("Customer deleted successfully.", {
        style: {
          background: "green",
          color: "white",
        },
      });

      setOpen(false);
      setConfirmationText("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setConfirmationText("");
    }
  };

  const customerDisplayName = customer.name;
  const isConfirmationValid = confirmationText === "DELETE";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="destructive" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{customerDisplayName}"? This action
            cannot be undone and will remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              To confirm deletion, type{" "}
              <span className="font-bold text-destructive">DELETE</span> below:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full"
              disabled={isLoading}
            />
          </div>
        </div>

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
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading || !isConfirmationValid}
            className="gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
