"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateFoodMutation } from "@/services/food/food-api";
import { useGetCategoriesWithoutPaginationQuery } from "@/services/category/category-api";
import type { Food } from "@/services/types/foodtype";
import { toast } from "sonner";

const foodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.number().min(1, "Category is required"),
  status: z.string().optional(),
});

type FoodFormData = z.infer<typeof foodSchema>;

interface UpdateFoodDialogProps {
  food: Food;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateFoodDialog({
  food,
  open,
  onOpenChange,
}: UpdateFoodDialogProps) {
  const [updateFood, { isLoading }] = useUpdateFoodMutation();
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesWithoutPaginationQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FoodFormData>({
    resolver: zodResolver(foodSchema),
  });

  useEffect(() => {
    if (food) {
      reset({
        name: food.name,
        description: food.description || "",
        imageUrl: food.imageUrl || "",
        price: food.price,
        categoryId: food.categoryId,
      });
    }
  }, [food, reset]);

  const onSubmit = async (data: FoodFormData) => {
    try {
      //@ts-ignore
      await updateFood({ id: food.id, ...data }).unwrap();
      toast.success("Food item updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update food item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Food Item</DialogTitle>
          <DialogDescription>Edit the food item details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter food name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter food description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("categoryId", Number.parseInt(value))
              }
              defaultValue={food.categoryId.toString()}
              disabled={categoriesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Food"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
