import { Request, Response } from "express";

export const logout = async (req: Request, res: any) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json({ message: "Logged out" });
};
