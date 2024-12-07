import express from "express";
import {
  getFoodAvailability,
  getTopRestaurants,
  searchFoods,
  getRestaurantById,
} from "../controllers";

const router = express.Router();

// Food Availability
router.get("/:pinCode", getFoodAvailability);

// Top Restaurants
router.get("/top-restaurants/:pinCode", getTopRestaurants);

// Search Foods
router.get("/search/:pinCode", searchFoods);

// Find Restaurant By ID
router.get("/restaurant/:id", getRestaurantById);

export { router as ShoppingRoute };
