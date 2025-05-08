import { Router } from "express";

import { getAllInterests, addInterest, deleteInterest } from "../controllers/interestController.js";

const router = Router();

router.get('/all', getAllInterests);
router.post('/add', addInterest);
router.delete('/delete', deleteInterest);


export default router;
