import { Router } from "express";
import { getUsers, login, register } from "../controllers/auth/auth";
import { logout, me } from "../controllers/auth/me";
import { decodeToken } from "../middleware/VerifyToken";
const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", decodeToken, me);
router.get("/", getUsers);
router.post("/signout", decodeToken, logout);

export default router;
