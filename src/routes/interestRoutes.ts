import { Router } from "express";
import { RequestHandler } from "express";

import { getAllInterests, getUserInterests, addInterest, deleteInterest } from "../controllers/interestController.js";

const router = Router();

// Admin route to get all interests in the system
router.get('/all', getAllInterests as RequestHandler);

// User-specific interests routes
router.get('/user', getUserInterests as RequestHandler);
router.post('/add', addInterest as RequestHandler);
router.delete('/delete', deleteInterest as RequestHandler);

export default router;
