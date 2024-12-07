"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.VandorRoute = router;
// configure multer
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post("/login", controllers_1.vandorLogin);
router.use(middlewares_1.authenticate);
router.get("/profile", controllers_1.getVandorProfile);
router.put("/profile", controllers_1.updateVandorProfile);
router.put("/service", controllers_1.updateVandorService);
router.put("/cover-images", images, controllers_1.updateVandorCoverImages);
router.post("/foods", images, controllers_1.addFood);
router.get("/foods", controllers_1.getFoods);
//# sourceMappingURL=vandor.route.js.map