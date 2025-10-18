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
import { useCreateBalanceMutation } from "@/services/balance/balance-api";
import * as React from "react";
import { toast } from "sonner";

interface CreateBalanceDialogProps {
  children: React.ReactNode;
}

export function CreateBalanceDialog({ children }: CreateBalanceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [customerId, setCustomerId] = React.useState("");
  const [totalDebit, setTotalDebit] = React.useState("");
  const [totalCredit, setTotalCredit] = React.useState("");
  const [balance, setBalance] = React.useState("");

  const [createBalance, { isLoading }] = useCreateBalanceMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId.trim()) {
      toast.success("Customer ID is required");
      return;
    }

    try {
      await createBalance({
        customerId: customerId.trim(),
        totalDebit: totalDebit ? Number.parseFloat(totalDebit) : 0,
        totalCredit: totalCredit ? Number.parseFloat(totalCredit) : 0,
        balance: balance ? Number.parseFloat(balance) : 0,
      }).unwrap();

      toast.success("Balance created successfully");

      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to create balance");
    }
  };

  const resetForm = () => {
    setCustomerId("");
    setTotalDebit("");
    setTotalCredit("");
    setBalance("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Balance</DialogTitle>
            <DialogDescription>
              Add a new balance record. Fill in the customer ID and balance
              details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customerId">Customer ID *</Label>
              <Input
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter customer ID"
                required
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
                placeholder="0.00"
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
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
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
              {isLoading ? "Creating..." : "Create Balance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
