import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import { generateTokens, userData } from "../helpers/generate-token";

const prisma = new PrismaClient();
const router = express.Router();
router.use(cookieParser());

router.post("/", async (req: Request, res: Response) => {
  // Accept refresh token from cookie OR request body
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }

  try {
    // Check refresh token in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    // If expired or not found, clear it
    if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { token: refreshToken } });
      }
      return res
        .status(403)
        .json({ message: "Session expired. Please log in again." });
    }

    // Verify JWT structure
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as userData & { exp?: number; iat?: number };

    const { exp, iat, ...cleanUser } = decoded;

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      cleanUser,
      res
    );

    // Remove old refresh token
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    // Return new tokens in response (and also set new cookie if you want)
    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("⚠️ Refresh token error:", error);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

export default router;
