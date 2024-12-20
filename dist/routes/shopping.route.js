"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
// Food Availability
router.get("/:pinCode", controllers_1.getFoodAvailability);
// Top Restaurants
router.get("/top-restaurants/:pinCode", controllers_1.getTopRestaurants);
// Search Foods
router.get("/search/:pinCode", controllers_1.searchFoods);
// Find Restaurant By ID
router.get("/restaurant/:id", controllers_1.getRestaurantById);
//# sourceMappingURL=shopping.route.js.map