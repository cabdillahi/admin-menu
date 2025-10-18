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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateBalanceMutation } from "@/services/balance/balance-api";
import type { Balance } from "@/services/types/types";
import * as React from "react";
import { toast } from "sonner";

interface UpdateBalanceDialogProps {
  balance: Balance;
  children: React.ReactNode;
}

export function UpdateBalanceDialog({
  balance,
  children,
}: UpdateBalanceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [totalDebit, setTotalDebit] = React.useState(
    balance.totalDebit.toString()
  );
  const [totalCredit, setTotalCredit] = React.useState(
    balance.totalCredit.toString()
  );
  const [balanceAmount, setBalanceAmount] = React.useState(
    balance.balance.toString()
  );

  const [updateBalance, { isLoading }] = useUpdateBalanceMutation();

  React.useEffect(() => {
    if (open) {
      setTotalDebit(balance.totalDebit.toString());
      setTotalCredit(balance.totalCredit.toString());
      setBalanceAmount(balance.balance.toString());
    }
  }, [open, balance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBalance({
        id: balance.id,
        totalDebit: Number.parseFloat(totalDebit),
        totalCredit: Number.parseFloat(totalCredit),
        balance: Number.parseFloat(balanceAmount),
      }).unwrap();

      toast.success("Balance updated successfully");

      setOpen(false);
    } catch (error) {
      toast.error("Failed to update balance");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Balance</DialogTitle>
            <DialogDescription>
              Update balance details for customer{" "}
              {balance.customer?.name || balance.customerId}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                value={balance.customerId}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalDebit">Total Debit</Label>
              <Input
                id="totalDebit"
                type="number"
                step="0.01"
                value={totalDebit}
                onChange={(e) => setTotalDebit(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalCredit">Total Credit</Label>
              <Input
                id="totalCredit"
                type="number"
                step="0.01"
                value={totalCredit}
                onChange={(e) => setTotalCredit(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                required
              />
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Balance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
