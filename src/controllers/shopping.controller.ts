import { Request, Response, NextFunction } from "express";
import { FoodDoc, Vandor } from "../models";

export const getFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { pinCode } = req.params;

  const foods = await Vandor.find({ pinCode, serviceAvailable: true })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (foods.length > 0) {
    return res.status(200).json(foods);
  }

  return res.status(400).json({ message: "Data not found" });
};

export const getTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { pinCode } = req.params;

  const result = await Vandor.find({ pinCode, serviceAvailable: false })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "Data not found" });
};

export const getFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { pinCode } = req.params;

  const result = await Vandor.find({ pinCode, serviceAvailable: false }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vandor) => {
      const foods = vandor.foods as [FoodDoc];

      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });

    return res.status(200).json(foodResult);
  }

  return res.status(400).json({ message: "Data not found" });
};

export const searchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { pinCode } = req.params;

  const result = await Vandor.find({ pinCode, serviceAvailable: false }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vandor) => {
      foodResult.push(...vandor.foods);
    });

    return res.status(200).json(foodResult);
  }

  return res.status(400).json({ message: "Data not found" });
};

export const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.params;

  const result = await Vandor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "Data not found" });
};
