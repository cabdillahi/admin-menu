"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { Account } from "@/services/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateAccountMutation } from "@/services/accounts/account-api";
import { toast } from "sonner";

interface UpdateAccountDialogProps {
  account: Account;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateAccountDialog({
  account,
  open,
  onOpenChange,
}: UpdateAccountDialogProps) {
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<
    "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
  >(account.type);
  const [code, setCode] = useState(account.code?.toString() || "");
  const [balance, setBalance] = useState(account.balance.toString());

  const [updateAccount, { isLoading }] = useUpdateAccountMutation();

  useEffect(() => {
    setName(account.name);
    setType(account.type);
    setCode(account.code?.toString() || "");
    setBalance(account.balance.toString());
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Account name is required");
      return;
    }

    try {
      await updateAccount({
        id: account.id,
        name: name.trim(),
        type,
        code: code ? Number(code) : undefined,
        balance: Number(balance),
      }).unwrap();

      toast.success("Account updated successfully");

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update account");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Account</DialogTitle>
            <DialogDescription>
              Modify the account details below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Cash, Accounts Receivable"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Account Type</Label>
              <Select
                value={type}
                onValueChange={(value) =>
                  setType(
                    value as
                      | "ASSET"
                      | "LIABILITY"
                      | "EQUITY"
                      | "REVENUE"
                      | "EXPENSE"
                  )
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSET">Asset</SelectItem>
                  <SelectItem value="LIABILITY">Liability</SelectItem>
                  <SelectItem value="EQUITY">Equity</SelectItem>
                  <SelectItem value="REVENUE">Revenue</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Account Code (Optional)</Label>
              <Input
                id="code"
                type="number"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., 1000"
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
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button className="dark:bg-secondary" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
