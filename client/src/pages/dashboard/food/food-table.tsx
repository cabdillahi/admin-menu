import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetFoodsQuery } from "@/services/food/food-api";
import type { Food } from "@/services/types/foodtype";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { TableHeaderUI } from "../table-header";
import { CreateFoodDialog } from "./create-food-dialog";
import { DeleteFoodDialog } from "./delete-food-dialog";
import { FoodSkeleton } from "./food-skeleton";
import { UpdateFoodDialog } from "./upate-food";
import { UploadExcelDialog } from "./upload-excel-dialog";

export function FoodsTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useGetFoodsQuery({
    page,
    limit,
    search,
  });

  if (isLoading) {
    return <FoodSkeleton />;
  }

  const foods = data?.data || [];
  const meta = data?.meta;

  const handleEdit = (food: Food) => {
    setSelectedFood(food);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (food: Food) => {
    setSelectedFood(food);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <TableHeaderUI
        title="Food Items"
        description="Manage your menu items"
        searchPlaceholder="Search foods..."
        searchValue={search}
        onSearchChange={setSearch}
        onRefresh={refetch}
        actions={
          <div className="flex gap-2">
            <UploadExcelDialog />
            <CreateFoodDialog />
          </div>
        }
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foods.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No food items found
                </TableCell>
              </TableRow>
            ) : (
              foods.map((food) => (
                <TableRow key={food.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={food.imageUrl || "/placeholder.svg"}
                        alt={food.name}
                      />
                      <AvatarFallback>
                        {food.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{food.name}</TableCell>
                  <TableCell>{food.category?.name || "N/A"}</TableCell>
                  <TableCell>
                    {food.Tenant?.currency === "USD"
                      ? `$${food.price.toFixed(2)}`
                      : `SHL ${food.price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(food)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(food)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, meta.total)} of {meta.total} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {selectedFood && (
        <>
          <UpdateFoodDialog
            food={selectedFood}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
          />
          <DeleteFoodDialog
            food={selectedFood}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </div>
  );
}
