import { Request, Response, NextFunction } from "express";

import { CreateFoodInput, CreateVandorInput, UpdateVandorInput } from "../dto";
import { findVandor } from "./admin.controller";
import { validatePassword, generateSignature } from "../utils";
import { UserAuthRequest } from "../types";
import { Food } from "../models";

export const vandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = <CreateVandorInput>req.body;

    const existingVandor = await findVandor("", email);

    if (existingVandor) {
      const isValidate = await validatePassword(
        password,
        existingVandor.password,
        existingVandor.salt
      );
      if (isValidate) {
        const signature = generateSignature({
          _id: existingVandor.id,
          email: existingVandor.email,
          foodTypes: existingVandor.foodType,
          name: existingVandor.name,
        });

        return res.status(200).json(signature);
      } else {
        return res.status(401).json({ message: "Password is not valid" });
      }
    } else {
      return res.status(401).json({ message: "Email is not existing" });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getVandorProfile = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user;
  if (user) {
    const existingVandor = await findVandor(user._id);

    return res.status(200).json(existingVandor);
  }

  return res.status(400).json({ message: "Vandor Information Not Found" });
};

export const updateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { name, address, phone, foodTypes } = <UpdateVandorInput>req.body;

  const user = req.user;
  if (user) {
    const existingVandor = await findVandor(user._id);

    if (existingVandor) {
      existingVandor.name = name;
      existingVandor.address = address;
      existingVandor.phone = phone;
      existingVandor.foodType = foodTypes;

      const savedResult = await existingVandor.save();

      return res.status(200).json(savedResult);
    }

    return res.status(200).json(existingVandor);
  }

  return res.status(400).json({ message: "Vandor Information Not Found" });
};

export const updateVandorCoverImages = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user;

  if (user) {
    const vandor = await findVandor(user._id);

    if (vandor) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vandor.coverImages.push(...images);

      const result = await vandor.save();

      return res.status(200).json(result);
    }

    return res.status(400).json({ message: "No vandor here" });
  }

  return res.status(400).json({ message: "Something went wrong with update vandor cover images" });
};

export const updateVandorService = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user;

  if (user) {
    const existingVandor = await findVandor(user._id);

    if (existingVandor) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;

      const savedResult = await existingVandor.save();

      return res.status(200).json(savedResult);
    }

    return res.status(200).json(existingVandor);
  }

  return res.status(400).json({ message: "Vandor Information Not Found" });
};

export const addFood = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body;

    const vandor = await findVandor(user._id);

    if (vandor) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createdFood = await Food.create({
        vandorId: vandor._id,
        name,
        description,
        category,
        foodType,
        images,
        readyTime,
        price,
        rating: 0,
      });

      vandor.foods.push(createdFood);
      const result = await vandor.save();

      return res.status(201).json(result);
    }

    return res.status(400).json({ message: "No vandor here" });
  }

  return res.status(400).json({ message: "Something went wrong with add food" });
};

export const getFoods = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vandorId: user._id });

    return res.status(200).json(foods);
  }

  return res.status(400).json({ message: "Something went wrong with get foods" });
};
