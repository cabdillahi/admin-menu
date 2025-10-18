import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { generateTokens } from "../../helpers/generate-token";
import prisma from "../../prisma";
import { hashPassword } from "../../utils/hash";
import { customuserRequest } from "../../middleware/VerifyToken";

export const login = async (req: Request, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        isSuccess: false,
        message: "Please provide email and password",
      });
    }

    const user = await prisma.user.findFirst({
      where: { email, isActive: true },
      include: {
        tenant: true,
      },
    });

    if (!user || !user?.tenant.isActive) {
      return res.status(404).json({
        isSuccess: false,
        message: "user not found or inactive",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid email or password",
      });
    }

    const userData: any = {
      email: user.email,
      role: user.role,
      id: user.id,
      tenantId: user.tenantId,
    };

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(userData, res);

    return res.status(200).json({
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isSuccess: false,
      message: "Something went wrong. Please try again.",
      error: (error as Error).message,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, tenantId } = req.body;
    if (!email || !password || !name || !tenantId)
      return res
        .status(400)
        .json({ message: "Email,password,name and tenant are required" });

    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, tenantId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req: customuserRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      data: [...users],
    });
  } catch (error) {
    error;
  }
};
