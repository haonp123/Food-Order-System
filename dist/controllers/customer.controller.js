"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerProfile = exports.getCustomerProfile = exports.requestOTP = exports.customerVerify = exports.customerLogin = exports.customerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../dto");
const utils_1 = require("../utils");
const models_1 = require("../models");
const utils_2 = require("../utils");
const customerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToInstance)(dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;
    const existEmail = yield models_1.Customer.findOne({ email });
    if (existEmail) {
        return res.status(409).json({ message: "An user exist with the provided email!" });
    }
    const salt = yield (0, utils_1.generateSalt)();
    const userPassword = yield (0, utils_1.encryptPassword)(password, salt);
    const { otp, otp_expiry } = (0, utils_2.generateOTP)();
    const result = yield models_1.Customer.create({
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
        yield (0, utils_1.onRequestOTP)(otp, email);
        // generate the signature
        const signature = (0, utils_1.generateSignature)({
            _id: result.id,
            email: result.email,
            verified: result.verified,
        });
        // send the result to client
        return res.status(201).json({ signature, verified: result.verified, email: result.email });
    }
    return res.status(400).json({ message: "Error with Signup" });
});
exports.customerSignup = customerSignup;
const customerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToInstance)(dto_1.LoginCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email });
    if (customer) {
        const validation = yield (0, utils_1.validatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = (0, utils_1.generateSignature)({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified,
            });
            return res.status(200).json({ signature, verified: customer.verified, email });
        }
        return res.status(400).json({ message: "Password is not correct" });
    }
    return res.status(400).json({ message: "User Not Found" });
});
exports.customerLogin = customerLogin;
const customerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomer = yield profile.save();
                const signature = (0, utils_1.generateSignature)({
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
});
exports.customerVerify = customerVerify;
const requestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield models_1.Customer.findById(user._id);
        if (profile) {
            const { otp, otp_expiry } = (0, utils_2.generateOTP)();
            profile.otp = otp;
            profile.otp_expiry = otp_expiry;
            yield profile.save();
            yield (0, utils_1.onRequestOTP)(otp, profile.email);
            return res.status(200).json({ message: "OTP sent to your email" });
        }
    }
    return res.status(400).json({ message: "User Not Authorization" });
});
exports.requestOTP = requestOTP;
const getCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield models_1.Customer.findById(user._id);
        if (profile)
            return res.status(200).json(profile);
        return res.status(400).json({ message: "User Not Found" });
    }
    return res.status(400).json({ message: "Error with getCustomerProfile" });
});
exports.getCustomerProfile = getCustomerProfile;
const updateCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield models_1.Customer.findById(user._id);
        if (profile) {
            const profileInputs = (0, class_transformer_1.plainToInstance)(dto_1.EditCustomerInputs, req.body);
            const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: true } });
            if (profileErrors.length > 0) {
                return res.status(400).json(profileErrors);
            }
            const { firstName, lastName, address } = profileInputs;
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const updatedProfile = yield profile.save();
            return res.status(200).json(updatedProfile);
        }
        return res.status(400).json({ message: "User Not Found" });
    }
    return res.status(400).json({ message: "User Not Authorization" });
});
exports.updateCustomerProfile = updateCustomerProfile;
//# sourceMappingURL=customer.controller.js.map