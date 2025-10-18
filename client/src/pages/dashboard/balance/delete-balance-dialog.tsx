"use client";

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
import { useDeleteBalanceMutation } from "@/services/balance/balance-api";
import type { Balance } from "@/services/types/types";
import * as React from "react";
import { toast } from "sonner";

interface DeleteBalanceDialogProps {
  balance: Balance;
  children: React.ReactNode;
}

export function DeleteBalanceDialog({
  balance,
  children,
}: DeleteBalanceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [deleteBalance, { isLoading }]: any = useDeleteBalanceMutation();

  const handleDelete = async () => {
    try {
      await deleteBalance(balance.id).unwrap();

      toast("Balance deleted successfully");

      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete balance");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Balance</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this balance record for customer{" "}
            {balance.customer?.name || balance.customerId}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">
                {balance.customer?.name || balance.customerId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Debit:</span>
              <span className="font-medium">
                ${balance.totalDebit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Credit:</span>
              <span className="font-medium">
                ${balance.totalCredit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-medium">${balance.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Balance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
