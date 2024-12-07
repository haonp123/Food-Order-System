import { Request, NextFunction, Response } from "express";
import { AuthPayload } from "../dto";
import { validateSignature } from "../utils";
import { UserAuthRequest } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const signature = await validateSignature(req);
  if (signature) {
    return next();
  } else {
    return res.json({ message: "User Not Authorized" });
  }
};
