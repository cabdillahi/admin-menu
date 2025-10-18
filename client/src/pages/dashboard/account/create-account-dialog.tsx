"use client";

import type React from "react";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreateAccountMutation } from "@/services/accounts/account-api";
import { toast } from "sonner";

export default function CreateAccountDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<
    "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
  >("ASSET");
  const [code, setCode] = useState("");

  const [createAccount, { isLoading }] = useCreateAccountMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Account name is required");
      return;
    }

    try {
      await createAccount({
        name: name.trim(),
        type,
        code: code ? Number(code) : undefined,
      }).unwrap();

      toast.success("Account created successfully");

      setName("");
      setType("ASSET");
      setCode("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create account");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="dark:bg-secondary">
          <Plus className="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Add a new account to your chart of accounts
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
                <SelectTrigger className="w-full" id="type">
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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button className="dark:bg-secondary" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
