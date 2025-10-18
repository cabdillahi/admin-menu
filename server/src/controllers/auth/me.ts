import type { Request, Response } from "express";
import prisma from "../../prisma";
import { customuserRequest } from "../../middleware/VerifyToken";

export const me = async (req: customuserRequest, res: Response) => {
  try {
    const userId = req.user?.id!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        role: true,
        tenantId: true,
        tenant: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: any) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json({ message: "Logged out" });
};
