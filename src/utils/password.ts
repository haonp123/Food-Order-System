import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { APP_SECRET } from "../config";
import { AuthPayload } from "../dto/auth.dto";
import { UserAuthRequest } from "../types";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const encryptPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await encryptPassword(enteredPassword, salt)) === savedPassword;
};

export const generateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, {
    expiresIn: "1d",
  });
};

export const validateSignature = async (req: UserAuthRequest) => {
  const signature = req.get("Authorization");

  if (signature) {
    try {
      const payload = (await jwt.verify(signature.split(" ")[1], APP_SECRET)) as AuthPayload;

      req.user = payload;

      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
};
