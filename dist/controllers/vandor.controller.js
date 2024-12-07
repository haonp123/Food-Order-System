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
exports.getFoods = exports.addFood = exports.updateVandorService = exports.updateVandorCoverImages = exports.updateVandorProfile = exports.getVandorProfile = exports.vandorLogin = void 0;
const admin_controller_1 = require("./admin.controller");
const utils_1 = require("../utils");
const models_1 = require("../models");
const vandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingVandor = yield (0, admin_controller_1.findVandor)("", email);
        if (existingVandor) {
            const isValidate = yield (0, utils_1.validatePassword)(password, existingVandor.password, existingVandor.salt);
            if (isValidate) {
                const signature = (0, utils_1.generateSignature)({
                    _id: existingVandor.id,
                    email: existingVandor.email,
                    foodTypes: existingVandor.foodType,
                    name: existingVandor.name,
                });
                return res.status(200).json(signature);
            }
            else {
                return res.status(401).json({ message: "Password is not valid" });
            }
        }
        else {
            return res.status(401).json({ message: "Email is not existing" });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.vandorLogin = vandorLogin;
const getVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, admin_controller_1.findVandor)(user._id);
        return res.status(200).json(existingVandor);
    }
    return res.status(400).json({ message: "Vandor Information Not Found" });
});
exports.getVandorProfile = getVandorProfile;
const updateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodTypes } = req.body;
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, admin_controller_1.findVandor)(user._id);
        if (existingVandor) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodType = foodTypes;
            const savedResult = yield existingVandor.save();
            return res.status(200).json(savedResult);
        }
        return res.status(200).json(existingVandor);
    }
    return res.status(400).json({ message: "Vandor Information Not Found" });
});
exports.updateVandorProfile = updateVandorProfile;
const updateVandorCoverImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, admin_controller_1.findVandor)(user._id);
        if (vandor) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vandor.coverImages.push(...images);
            const result = yield vandor.save();
            return res.status(200).json(result);
        }
        return res.status(400).json({ message: "No vandor here" });
    }
    return res.status(400).json({ message: "Something went wrong with update vandor cover images" });
});
exports.updateVandorCoverImages = updateVandorCoverImages;
const updateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, admin_controller_1.findVandor)(user._id);
        if (existingVandor) {
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            const savedResult = yield existingVandor.save();
            return res.status(200).json(savedResult);
        }
        return res.status(200).json(existingVandor);
    }
    return res.status(400).json({ message: "Vandor Information Not Found" });
});
exports.updateVandorService = updateVandorService;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vandor = yield (0, admin_controller_1.findVandor)(user._id);
        if (vandor) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createdFood = yield models_1.Food.create({
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
            const result = yield vandor.save();
            return res.status(201).json(result);
        }
        return res.status(400).json({ message: "No vandor here" });
    }
    return res.status(400).json({ message: "Something went wrong with add food" });
});
exports.addFood = addFood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vandorId: user._id });
        return res.status(200).json(foods);
    }
    return res.status(400).json({ message: "Something went wrong with get foods" });
});
exports.getFoods = getFoods;
//# sourceMappingURL=vandor.controller.js.map