import { Router } from "express";

import { addWord, getAllWords, deleteWord } from "../controllers/wordController.js"

const router = Router();

router.post("/add", addWord);
router.get("/all", getAllWords);
router.delete("/delete", deleteWord);

export default router;
