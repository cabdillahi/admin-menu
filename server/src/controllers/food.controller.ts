import { Request, Response } from "express";
import Joi from "joi";
import { customuserRequest } from "../middleware/VerifyToken";
import prisma from "../prisma";

// ✅ Joi Validation Schema
const foodSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().optional().allow(null, ""),
  imageUrl: Joi.string().optional().allow(null, ""),
  categoryId: Joi.number().required(),
});

// ✅ Create Food
export const createFood = async (req: customuserRequest, res: Response) => {
  try {
    const { error, value } = foodSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    if (!req.user?.tenantId) {
      return res.status(400).json({ message: "Tenant is required" });
    }

    // check if food already exists by name
    const exist = await prisma.food.findFirst({
      where: {
        name: value.name,
        tenantId: req.user.tenantId,
      },
    });

    if (exist) {
      return res.status(400).json({
        message: "Food name already exists!",
      });
    }

    const food = await prisma.food.create({
      data: {
        name: value.name,
        price: value.price,
        description: value.description,
        imageUrl: value.imageUrl,
        categoryId: value.categoryId,
        tenantId: req.user.tenantId,
      },
    });

    return res.json({
      message: "Food created successfully",
      data: food,
    });
  } catch (err) {
    console.error("Create Food Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Foods (Paginated + Search)
export const getFoods = async (req: customuserRequest, res: Response) => {
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

    const total = await prisma.food.count({ where });

    const foods = await prisma.food.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        category: true,
        Tenant: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return res.json({
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      data: foods,
    });
  } catch (err) {
    console.error("Get Foods Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Food
export const updateFood = async (req: customuserRequest, res: Response) => {
  try {
    const { id, name, description, imageUrl, categoryId, client } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Select food to update",
      });
    }

    const existing = await prisma.food.findFirst({
      where: {
        id: +id,
        tenantId: req.user?.tenantId,
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Food not found" });
    }

    await prisma.food.update({
      where: { id: +id },
      data: {
        name,
        description,
        imageUrl,
        categoryId,
      },
    });

    return res.json({
      message: "Food updated successfully",
    });
  } catch (err) {
    console.error("Update Food Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Food
export const deleteFood = async (req: customuserRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Select food to delete",
      });
    }

    await prisma.food.delete({
      where: { id: +id, tenantId: req.user?.tenantId },
    });

    return res.json({
      message: "Food deleted successfully",
    });
  } catch (err) {
    console.error("Delete Food Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all foods without pagination
export const getAllFoods = async (req: customuserRequest, res: Response) => {
  try {
    const foods = await prisma.food.findMany({
      where: { tenantId: req.user?.tenantId },
      include: { category: true },
    });

    return res.json({ data: foods });
  } catch (err) {
    console.error("Get All Foods Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFoodsPublic = async (req: Request, res: Response) => {
  try {
    const { tenantName } = req.params; // e.g. /api/public/:tenantName/foods

    if (!tenantName) {
      return res.status(400).json({ message: "Tenant name is required" });
    }

    const tenant = await prisma.tenant.findFirst({
      where: { subdomain: tenantName },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Get all foods for this tenant
    const foods = await prisma.food.findMany({
      where: { tenantId: tenant.id },
      include: {
        category: true,
      },
      orderBy: { createAt: "desc" },
    });

    return res.json({
      tenant: { name: tenant.name, id: tenant.id },
      data: foods,
    });
  } catch (err) {
    console.error("Public Foods Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
