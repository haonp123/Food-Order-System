import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { CreateCustomerInputs, EditCustomerInputs, LoginCustomerInputs } from "../dto";
import {
  encryptPassword,
  generateSalt,
  generateSignature,
  onRequestOTP,
  validatePassword,
} from "../utils";
import { Customer } from "../models";
import { generateOTP } from "../utils";
import { UserAuthRequest } from "../types";

export const customerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const customerInputs = plainToInstance(CreateCustomerInputs, req.body);

  const inputErrors = await validate(customerInputs, { validationError: { target: true } });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;

  const existEmail = await Customer.findOne({ email });
  if (existEmail) {
    return res.status(409).json({ message: "An user exist with the provided email!" });
  }

  const salt = await generateSalt();
  const userPassword = await encryptPassword(password, salt);

  const { otp, otp_expiry } = generateOTP();

  const result = await Customer.create({
    email,
    phone,
    salt,
    password: userPassword,
    otp,
    otp_expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {
    // send the OTP to customer
    await onRequestOTP(otp, email);

    // generate the signature
    const signature = generateSignature({
      _id: result.id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to client
    return res.status(201).json({ signature, verified: result.verified, email: result.email });
  }

  return res.status(400).json({ message: "Error with Signup" });
};

export const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const loginInputs = plainToInstance(LoginCustomerInputs, req.body);

  const inputErrors = await validate(loginInputs, { validationError: { target: true } });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email });

  if (customer) {
    const validation = await validatePassword(password, customer.password, customer.salt);

    if (validation) {
      const signature = generateSignature({
        _id: customer.id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(200).json({ signature, verified: customer.verified, email });
    }

    return res.status(400).json({ message: "Password is not correct" });
  }

  return res.status(400).json({ message: "User Not Found" });
};

export const customerVerify = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomer = await profile.save();

        const signature = generateSignature({
          _id: updatedCustomer.id,
          email: updatedCustomer.email,
          verified: updatedCustomer.verified,
        });

        return res
          .status(200)
          .json({ signature, verified: updatedCustomer.verified, email: updatedCustomer.email });
      }
    }

    return res.status(400).json({ message: "Not Authentication" });
  }

  return res.status(400).json({ message: "Error with OTP Validation" });
};

export const requestOTP = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user;
  if (user) {
    const profile = await Customer.findById(user._id);

    if (profile) {
      const { otp, otp_expiry } = generateOTP();
      profile.otp = otp;
      profile.otp_expiry = otp_expiry;

      await profile.save();
      await onRequestOTP(otp, profile.email);

      return res.status(200).json({ message: "OTP sent to your email" });
    }
  }

  return res.status(400).json({ message: "User Not Authorization" });
};

export const getCustomerProfile = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user;

  if (user) {
    const profile = await Customer.findById(user._id);

    if (profile) return res.status(200).json(profile);

    return res.status(400).json({ message: "User Not Found" });
  }

  return res.status(400).json({ message: "Error with getCustomerProfile" });
};

export const updateCustomerProfile = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user;

  if (user) {
    const profile = await Customer.findById(user._id);

    if (profile) {
      const profileInputs = plainToInstance(EditCustomerInputs, req.body);
      const profileErrors = await validate(profileInputs, { validationError: { target: true } });

      if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
      }

      const { firstName, lastName, address } = profileInputs;
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const updatedProfile = await profile.save();

      return res.status(200).json(updatedProfile);
    }

    return res.status(400).json({ message: "User Not Found" });
  }

  return res.status(400).json({ message: "User Not Authorization" });
};
