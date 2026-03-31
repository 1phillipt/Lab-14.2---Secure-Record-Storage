import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET as string;
const expiration = "2h";

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  let token =
    req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization && typeof token === "string") {
    token = token.split(" ").pop()?.trim();
  }

  if (!token || typeof token !== "string") {
    return res
      .status(401)
      .json({ message: "You must be logged in to do that." });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & {
      data: AuthUser;
    };

    req.user = decoded.data;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const signToken = (user: AuthUser): string => {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};