"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Edit } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUpdateCategoryMutation } from "@/services/category/category-api";
import type { Category } from "@/services/types/categorytype";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface UpdateCategoryDialogProps {
  children?: React.ReactNode;
  category: Category;
}

export function UpdateCategoryDialog({
  children,
  category,
}: UpdateCategoryDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [updateCategory, { isLoading, error, isError }] =
    useUpdateCategoryMutation();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      await updateCategory({
        id: category.id,
        name: values.name,
        description: values.description || undefined,
        imageUrl: values.imageUrl || undefined,
      }).unwrap();

      toast.success("Category updated successfully.", {
        style: {
          background: "green",
          color: "white",
        },
      });

      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (isError) {
      //@ts-ignore
      toast.error(error?.data?.message || "Failed to update category", {
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  }, [error, isError]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset({
        name: category.name,
        description: category.description || "",
        imageUrl: category.imageUrl || "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Update the category information. Modify the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Electronics, Clothing, Food"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a unique name for the category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description..."
                      {...field}
                      className="w-full min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description for the category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional image URL for the category
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
                className="dark:bg-secondary gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
