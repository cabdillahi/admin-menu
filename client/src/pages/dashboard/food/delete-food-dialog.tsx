"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteFoodMutation } from "@/services/food/food-api";
import type { Food } from "@/services/types/foodtype";
import { toast } from "sonner";

interface DeleteFoodDialogProps {
  food: Food;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteFoodDialog({
  food,
  open,
  onOpenChange,
}: DeleteFoodDialogProps) {
  const [deleteFood, { isLoading }] = useDeleteFoodMutation();
  const handleDelete = async () => {
    try {
      const id = food.id;
      await deleteFood({ id: String(id) }).unwrap();
      toast.success("Food item deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast("Failed to delete food item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Food Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{food.name}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
