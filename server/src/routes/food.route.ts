import { Router } from "express";
import {
  createFood,
  getFoods,
  updateFood,
  deleteFood,
  getAllFoods,
  getFoodsPublic,
} from "../controllers/food.controller";
import { decodeToken } from "../middleware/VerifyToken";

const router = Router();

router.post("/", decodeToken, createFood);
router.get("/", decodeToken, getFoods);
router.get("/all", decodeToken, getAllFoods);
router.get("/:tenantName", getFoodsPublic);
router.put("/", decodeToken, updateFood);
router.delete("/:id", decodeToken, deleteFood);

export default router;
