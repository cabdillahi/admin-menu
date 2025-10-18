import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getAllCategories,
  getCategoriesPublic,
} from "../controllers/category.controller";
import { decodeToken } from "../middleware/VerifyToken";

const router = Router();

router.post("/", decodeToken, createCategory);
router.patch("/", decodeToken, updateCategory);
router.delete("/:id", decodeToken, deleteCategory);
router.get("/", getCategories);
router.get("/all", getAllCategories);
router.get("/:tenantName", getCategoriesPublic);

export default router;
