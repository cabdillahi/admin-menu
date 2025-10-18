import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userData } from "../helpers/generate-token";

export interface customuserRequest extends Request {
  user?: userData;
}

export const decodeToken = (
  req: customuserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //  Get token from cookie or Authorization header
    const cookieToken = req.cookies?.accessToken;
    const headerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined;

    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    //  Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_TOKEN!
    ) as userData;
    //  Attach user data to request
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or Expired Token", isSuccess: false });
  }
};
