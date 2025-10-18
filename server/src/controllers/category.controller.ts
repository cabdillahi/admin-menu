import { Request, Response } from "express";
import Joi from "joi";
import { customuserRequest } from "../middleware/VerifyToken";
import prisma from "../prisma";

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null, ""),
  imageUrl: Joi.string().optional().allow(null, ""),
});

// ✅ Create Category
export const createCategory = async (req: customuserRequest, res: Response) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if category already exists for this tenant
    const categoryExist = await prisma.category.findFirst({
      where: {
        tenantId: req.user?.tenantId,
        name: value.name,
      },
    });

    if (categoryExist) {
      return res.status(400).json({
        message: "Category name already exists!",
      });
    }

    const category = await prisma.category.create({
      data: {
        name: value.name,
        description: value.description,
        imageUrl: value.imageUrl,
        tenantId: req.user?.tenantId!,
      },
    });

    return res.json({
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    console.error("Create Category Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Category
export const updateCategory = async (req: customuserRequest, res: Response) => {
  try {
    const { id, name, description, imageUrl } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Select category to update." });
    }

    await prisma.category.update({
      where: { id: +id, tenantId: req.user?.tenantId },
      data: {
        name,
        description,
        imageUrl,
      },
    });

    return res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("Update Category Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Category
export const deleteCategory = async (req: customuserRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Select category to delete." });

    await prisma.category.delete({
      where: { id: +id, tenantId: req.user?.tenantId },
    });

    return res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete Category Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Categories (with pagination + search)
export const getCategories = async (req: customuserRequest, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
    const order = req.query.order === "desc" ? "desc" : "asc";

    const where: any = { tenantId: req.user?.tenantId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.category.count({ where });

    const categories = await prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        Tenant: true,
        product: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return res.json({
      meta: { total, page, limit, totalPages },
      data: categories,
    });
  } catch (err) {
    console.error("Get Categories Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all categories (no pagination)
export const getAllCategories = async (
  req: customuserRequest,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      where: { tenantId: req.user?.tenantId },
    });

    return res.json({ data: categories });
  } catch (err) {
    console.error("Get All Categories Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCategoriesPublic = async (req: Request, res: Response) => {
  try {
    const { tenantName } = req.params;

    if (!tenantName) {
      return res.status(400).json({ message: "Tenant name is required" });
    }

    // Find tenant by name or slug
    const tenant = await prisma.tenant.findFirst({
      where: { subdomain: tenantName },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const categories = await prisma.category.findMany({
      where: { tenantId: tenant.id },
      include: {
        product: true,
      },
      orderBy: { createAt: "desc" },
    });

    return res.json({
      tenant: { name: tenant.name, id: tenant.id },
      data: categories,
    });
  } catch (err) {
    console.error("Public Categories Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
