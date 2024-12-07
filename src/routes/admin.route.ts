import express from "express";
import { createVandor, getVandorById, getVandors } from "../controllers/admin.controller";

const router = express.Router();

router.get("/vandors", getVandors);
router.get("/vandors/:id", getVandorById);
router.post("/vandors", createVandor);

export { router as AdminRoute };
