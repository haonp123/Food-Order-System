import express from "express";
import {
  customerLogin,
  customerSignup,
  customerVerify,
  getCustomerProfile,
  requestOTP,
  updateCustomerProfile,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

// signup, create customer
router.post("/signup", customerSignup);

// Login
router.post("/login", customerLogin);

// authentication
router.use(authenticate);

// Verify Customer Account
router.put("/verify", customerVerify);

// Authenticate

// OTP - Requesting OTP
router.get("/otp", requestOTP);

// Profile
router.get("/profile", getCustomerProfile);
router.put("/profile", updateCustomerProfile);

// Cart

// Order

// Payment

export { router as CustomerRoute };
