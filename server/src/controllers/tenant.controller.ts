import { Request, Response } from "express";
import { tenantCreateSchema } from "../validation/validation";
import prisma from "../prisma";

// Tenant CRUD
export const createTenant = async (req: Request, res: Response) => {
  try {
    const { error, value } = tenantCreateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const tenant = await prisma.tenant.create({ data: value });
    return res.json(tenant);
  } catch (err) {
    console.error("Create Tenant Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTenants = async (_: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany();
    return res.json(tenants);
  } catch (err) {
    console.error("Get Tenants Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTenant = async (req: Request, res: Response) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.params.id },
    });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    return res.json(tenant);
  } catch (err) {
    console.error("Get Tenant Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const { error, value } = tenantCreateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const tenant = await prisma.tenant.update({
      where: { id: req.params.id },
      data: value,
    });
    return res.json(tenant);
  } catch (err) {
    console.error("Update Tenant Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  try {
    await prisma.tenant.delete({ where: { id: req.params.id } });
    return res.json({ message: "Tenant deleted successfully" });
  } catch (err) {
    console.error("Delete Tenant Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
