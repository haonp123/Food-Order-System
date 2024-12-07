"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.get("/vandors", admin_controller_1.getVandors);
router.get("/vandors/:id", admin_controller_1.getVandorById);
router.post("/vandors", admin_controller_1.createVandor);
//# sourceMappingURL=admin.route.js.map