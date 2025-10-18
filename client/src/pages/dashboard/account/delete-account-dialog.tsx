"use client";

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
import { useDeleteAccountMutation } from "@/services/accounts/account-api";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
  account: Account;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAccountDialog({
  account,
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const handleDelete = async () => {
    try {
      await deleteAccount({ id: account.id }).unwrap();

      toast.success("Account deleted successfully");

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this account? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium">{account.name}</p>
            <p className="text-sm text-muted-foreground">
              Type: {account.type} | Balance: ${account.balance.toFixed(2)}
            </p>
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
