import { Router } from "express";

import { addTopic, getAllTopics, deleteTopic } from "../controllers/topicControllers.js";

const router = Router();

router.post('/add', addTopic)
router.get('/all', getAllTopics)
router.delete('/delete', deleteTopic)

export default router;