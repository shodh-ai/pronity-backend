import { Router } from "express";
import { generateToken } from "../controllers/apiController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/generate-token", authMiddleware, generateToken);

export default router;
