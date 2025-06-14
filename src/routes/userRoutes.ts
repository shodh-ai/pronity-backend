import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  fill_details,
  getUserInfo,
  save_flow,
  getFlow,
  getNextFlow,
  show_next_flow,
  addReport,
  getReports,
  getReportById,
  addNote,
  getNotes,
  getUserWords,
  learnNewWord,
} from "../controllers/userController.js";

const router = Router();

router.post("/fill-details", authMiddleware, fill_details);
router.get("/info", authMiddleware, getUserInfo);
router.post("/save-flow", authMiddleware, save_flow);
router.get("/show-next-flow", authMiddleware, show_next_flow);
router.get("/get-flow", authMiddleware, getFlow);
router.get("/get-next-flow", authMiddleware, getNextFlow);
router.post("/add-report", authMiddleware, addReport);
router.get("/get-reports", authMiddleware, getReports);
router.get("/get-report-by-id", authMiddleware, getReportById);
router.post("/add-note", authMiddleware, addNote);
router.get("/get-notes", authMiddleware, getNotes);
router.get("/get-user-words", authMiddleware, getUserWords);
router.get("/learn-new-word", authMiddleware, learnNewWord);

export default router;
