import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getUserInfo,
  fill_details,
  generate_flow,
  getFlow,
  getNextFlow,
  generateUserTopics,
  getUserTopics,
  getPractiseTopic,
  addReport,
  getReports,
  getReportById,
  addNote,
  getNotes,
  getUserWords,
  learnNewWord,
} from "../controllers/userController.js";

const router = Router();

router.get("/info", authMiddleware, getUserInfo);
router.post("/fill-details", authMiddleware, fill_details);
router.get("/generate-flow", authMiddleware, generate_flow);
router.get("/get-flow", authMiddleware, getFlow);
router.get("/get-next-flow", authMiddleware, getNextFlow);
router.get("/generate-user-topics", authMiddleware, generateUserTopics);
router.get("/get-user-topics", authMiddleware, getUserTopics);
router.get("/get-practise-topic", authMiddleware, getPractiseTopic);
router.post("/add-report", authMiddleware, addReport);
router.get("/get-reports", authMiddleware, getReports);
router.get("/get-report-by-id", authMiddleware, getReportById);
router.post("/add-note", authMiddleware, addNote);
router.get("/get-notes", authMiddleware, getNotes);
router.get("/get-user-words", authMiddleware, getUserWords);
router.get("/learn-new-word", authMiddleware, learnNewWord);

export default router;
