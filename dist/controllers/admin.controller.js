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
exports.getVandorById = exports.getVandors = exports.createVandor = exports.findVandor = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const findVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vandor.findOne({ email });
    }
    else {
        return yield models_1.Vandor.findById(id);
    }
});
exports.findVandor = findVandor;
const createVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pinCode, foodType, email, password, ownerName, phone } = req.body;
    const existingVandor = yield (0, exports.findVandor)("", email);
    if (existingVandor) {
        return res.status(400).json({ message: "A vandor is exist with this email" });
    }
    const salt = yield (0, utils_1.generateSalt)();
    const newPassword = yield (0, utils_1.encryptPassword)(password, salt);
    const createdVandor = yield models_1.Vandor.create({
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
});
exports.createVandor = createVandor;
const getVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield models_1.Vandor.find();
    return res.status(200).json(vandors);
});
exports.getVandors = getVandors;
const getVandorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const vandor = yield (0, exports.findVandor)(id);
    if (vandor) {
        return res.status(200).json(vandor);
    }
    return res.status(400).json({ message: "No vandor with this id" });
});
exports.getVandorById = getVandorById;
//# sourceMappingURL=admin.controller.js.map