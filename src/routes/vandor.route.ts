import express from "express";
import multer from "multer";

import {
  vandorLogin,
  getVandorProfile,
  updateVandorProfile,
  updateVandorService,
  addFood,
  getFoods,
  updateVandorCoverImages,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

// configure multer
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", vandorLogin);

router.use(authenticate);
router.get("/profile", getVandorProfile);
router.put("/profile", updateVandorProfile);
router.put("/service", updateVandorService);
router.put("/cover-images", images, updateVandorCoverImages);

router.post("/foods", images, addFood);
router.get("/foods", getFoods);

export { router as VandorRoute };
