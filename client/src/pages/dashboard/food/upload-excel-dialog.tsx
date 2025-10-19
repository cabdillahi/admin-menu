"use client";

import type React from "react";

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
import { useCreateFoodMutation } from "@/services/food/food-api";
import { useGetCategoriesQuery } from "@/services/category/category-api";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ExcelFoodData {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export function UploadExcelDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createFood] = useCreateFoodMutation();
  const { data: categories } = useGetCategoriesQuery({});
  const validateRow = (
    row: any,
    rowIndex: number
  ): { isValid: boolean; errors: ValidationError[]; data?: ExcelFoodData } => {
    const errors: ValidationError[] = [];

    // Validate name
    if (!row.name || typeof row.name !== "string" || row.name.trim() === "") {
      errors.push({
        row: rowIndex,
        field: "name",
        message: "Name is required and must be a string",
      });
    }

    // Validate price
    const price = Number(row.price);
    if (isNaN(price) || price < 0) {
      errors.push({
        row: rowIndex,
        field: "price",
        message: "Price must be a positive number",
      });
    }

    // Validate imageUrl if provided
    if (row.imageUrl && typeof row.imageUrl === "string") {
      try {
        new URL(row.imageUrl);
      } catch {
        errors.push({
          row: rowIndex,
          field: "imageUrl",
          message: "Image URL must be a valid URL",
        });
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      errors: [],
      data: {
        name: row.name.trim(),
        description: row.description?.trim() || "",
        imageUrl: row.imageUrl?.trim() || "",
        price: price,
      },
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid Excel file (.xlsx or .xls)");
        return;
      }
      setFile(selectedFile);
      setValidationErrors([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!categories?.data || categories.data.length === 0) {
      toast.error("Categories not loaded. Please try again.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setValidationErrors([]);

    try {
      // Read the file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast.error("The Excel file is empty");
        setIsProcessing(false);
        return;
      }

      // Validate all rows first
      const allErrors: ValidationError[] = [];
      const validData: ExcelFoodData[] = [];

      jsonData.forEach((row, index) => {
        const validation = validateRow(row, index + 2); 
        if (!validation.isValid) {
          allErrors.push(...validation.errors);
        } else if (validation.data) {
          validData.push(validation.data);
        }
      });

      if (allErrors.length > 0) {
        setValidationErrors(allErrors);
        toast.error(
          `Found ${allErrors.length} validation error(s). Please fix them and try again.`
        );
        setIsProcessing(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < validData.length; i++) {
        try {
          //@ts-ignore
          await createFood({
            ...validData[i],
            categoryId: Number(selectedCategoryId),
          }).unwrap();
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to create food item:`, error);
        }
        setProgress(((i + 1) / validData.length) * 100);
      }

      if (successCount > 0) {
        toast.success(
          `Successfully uploaded ${successCount} food item(s)${
            failCount > 0 ? `. ${failCount} failed.` : ""
          }`
        );
      }

      if (failCount === validData.length) {
        toast.error("Failed to upload any food items");
      }

      // Reset and close
      setFile(null);
      setSelectedCategoryId("");
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (successCount > 0) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error processing Excel file:", error);
      toast.error("Failed to process Excel file");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Example Food Item",
        description: "A delicious food item",
        imageUrl: "https://example.com/image.jpg",
        price: 9.99,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Foods");

    worksheet["!cols"] = [
      { wch: 20 }, // name
      { wch: 30 }, // description
      { wch: 40 }, // imageUrl
      { wch: 10 }, // price
    ];

    XLSX.writeFile(workbook, "food_items_template.xlsx");
    toast.success("Template downloaded successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          Upload Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Food Items from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx or .xls) with food items. Download the
            template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              disabled={isProcessing}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              All items in the Excel file will be assigned to this category
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excel-file">Excel File</Label>
            <div className="flex gap-2">
              <Input
                id="excel-file"
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <Button
                type="button"
                variant="outline"
                onClick={downloadTemplate}
                disabled={isProcessing}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Template
              </Button>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">
                    Found {validationErrors.length} validation error(s):
                  </p>
                  <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                    {validationErrors.slice(0, 10).map((error, index) => (
                      <li key={index} className="text-sm">
                        Row {error.row}, {error.field}: {error.message}
                      </li>
                    ))}
                    {validationErrors.length > 10 && (
                      <li className="text-sm">
                        ... and {validationErrors.length - 10} more errors
                      </li>
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="font-semibold text-sm">Required Columns:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <strong>name</strong> - Food item name (required)
              </li>
              <li>
                <strong>price</strong> - Price as a number (required)
              </li>
              <li>
                <strong>description</strong> - Description (optional)
              </li>
              <li>
                <strong>imageUrl</strong> - Image URL (optional)
              </li>
            </ul>
            {categories?.data && categories.data.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="font-semibold text-sm mb-1">
                  Available Categories:
                </p>
                <p className="text-sm text-muted-foreground">
                  {categories.data.map((cat) => cat.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || !selectedCategoryId || isProcessing}
          >
            {isProcessing ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
