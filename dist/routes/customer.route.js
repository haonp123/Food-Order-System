"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
// signup, create customer
router.post("/signup", controllers_1.customerSignup);
// Login
router.post("/login", controllers_1.customerLogin);
// authentication
router.use(middlewares_1.authenticate);
// Verify Customer Account
router.put("/verify", controllers_1.customerVerify);
// Authenticate
// OTP - Requesting OTP
router.get("/otp", controllers_1.requestOTP);
// Profile
router.get("/profile", controllers_1.getCustomerProfile);
router.put("/profile", controllers_1.updateCustomerProfile);
//# sourceMappingURL=customer.route.js.map