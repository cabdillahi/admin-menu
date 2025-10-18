import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

export interface userData {
  email: string;
  id: string;
  role?: string;
  tenantId?: string;
}

const accessTokenExpiresIn = "3d";
const refreshTokenExpiresIn = "7d";

// Updated to accept Express Response object
export const generateTokens = async (user: userData, res: Response) => {
  const payload = { ...user };

  // Generate Access Token
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_TOKEN!, {
    expiresIn: accessTokenExpiresIn,
  });

  // Generate Refresh Token
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: refreshTokenExpiresIn,
  });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Store refresh token in DB
  await prisma.refreshToken.upsert({
    where: { userId: user.id },
    update: { token: refreshToken, expiresAt },
    create: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};
