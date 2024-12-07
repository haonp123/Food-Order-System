import { Request, Response, NextFunction } from "express";

import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { encryptPassword, generateSalt } from "../utils";

export const findVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email });
  } else {
    return await Vandor.findById(id);
  }
};

export const createVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { name, address, pinCode, foodType, email, password, ownerName, phone } = <
    CreateVandorInput
  >req.body;

  const existingVandor = await findVandor("", email);

  if (existingVandor) {
    return res.status(400).json({ message: "A vandor is exist with this email" });
  }

  const salt = await generateSalt();
  const newPassword = await encryptPassword(password, salt);

  const createdVandor = await Vandor.create({
    name,
    address,
    pinCode,
    foodType,
    email,
    password: newPassword,
    salt,
    ownerName,
    phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  return res.status(201).json(createdVandor);
};

export const getVandors = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const vandors = await Vandor.find();

  return res.status(200).json(vandors);
};

export const getVandorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.params;
  const vandor = await findVandor(id);

  if (vandor) {
    return res.status(200).json(vandor);
  }

  return res.status(400).json({ message: "No vandor with this id" });
};
