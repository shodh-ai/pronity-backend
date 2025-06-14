import { Request, Response } from "express";

import {
  getUserById as getUserByIdService,
  addUserDetails,
} from "../services/userService.js";

import {
  saveFlow as saveFlowService,
  getFlow as getFlowService,
  getNextFlow as getNextFlowService,
  showNextFlow as showNextFlowService,
} from "../services/flowService.js";


import {
  addReport as addReportService,
  getReports as getReportsService,
  getReportById as getReportByIdService,
} from "../services/reportService.js";

import {
  addNote as addNoteService,
  getNotes as getNotesService,
} from "../services/notesService.js";

import {
  getUserWords as getUserWordsService,
  learnNewWord as learnNewWordService,
} from "../services/wordService.js";

export const getUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await getUserByIdService(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json({ message: "User info retrieved successfully", user });
};

export const fill_details = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { name, goal, feeling, confidence } = req.body;
  try {
    const user = await addUserDetails(userId, name, goal, feeling, confidence);
    res.status(200).json({ message: "User details added successfully", user });
  } catch (error) {
    console.error("Error adding user details:", error);
    res
      .status(500)
      .json({ message: "Internal server error during adding user details" });
  }
};

export const save_flow = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { flowElements, analysis } = req.body;
  if (!Array.isArray(flowElements)) {
    res
      .status(400)
      .json({ message: "Invalid request body. Expected an array." });
    return;
  }

  try {
    await saveFlowService(userId, flowElements, analysis);
    res.status(200).json({ message: "Flow saved successfully" });
  } catch (error) {
    console.error("Error saving flow:", error);
    res
      .status(500)
      .json({ message: "Internal server error during saving flow" });
  }
};

export const getFlow = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const flow = await getFlowService(user);
    res.status(200).json({ message: "Flow retrieved successfully", flow });
  } catch (error) {
    console.error("Error getting flow:", error);
    res
      .status(500)
      .json({ message: "Internal server error during getting flow" });
  }
};

export const getNextFlow = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const nextFlow = await getNextFlowService(user);
    res.status(200).json({
      message: "Next flow element retrieved successfully",
      flow: nextFlow,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "End of flow.") {
      res.status(404).json({ message: "End of flow." });
    } else {
      console.error(error);
      res.status(500).json({ message: "Error getting next flow element" });
    }
  }
};

export const show_next_flow = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const nextFlow = await showNextFlowService(user);
    res.status(200).json({
      message: "Next flow element retrieved successfully",
      flow: nextFlow,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "End of flow.") {
      res.status(404).json({ message: "End of flow." });
    } else {
      console.error(error);
      res.status(500).json({ message: "Error getting next flow element" });
    }
  }
};

export const addReport = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const report = await addReportService(user, req.body);
    res.status(200).json({ message: "Report added successfully", report });
  } catch (error) {
    console.error("Error adding report:", error);
    res
      .status(500)
      .json({ message: "Internal server error during adding report" });
  }
};

export const getReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const reports = await getReportsService(user);
    res
      .status(200)
      .json({ message: "Reports retrieved successfully", reports });
  } catch (error) {
    console.error("Error getting reports:", error);
    res
      .status(500)
      .json({ message: "Internal server error during getting reports" });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const reportId = req.query.id as string;

    if (!reportId) {
      res.status(400).json({ message: "Report ID is required" });
      return;
    }

    const user = await getUserByIdService(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const report = await getReportByIdService(user, reportId);
    res.status(200).json({ message: "Report retrieved successfully", report });
  } catch (error) {
    console.error("Error getting report by id:", error);
    res
      .status(500)
      .json({ message: "Internal server error during getting report by id" });
  }
};

export const addNote = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const note = await addNoteService(userId, req.body);
    res.status(200).json({ message: "Note added successfully", note });
  } catch (error) {
    console.error("Error adding note:", error);
    res
      .status(500)
      .json({ message: "Internal server error during adding note" });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const notes = await getNotesService(userId);
    res.status(200).json({ message: "Notes retrieved successfully", notes });
  } catch (error) {
    console.error("Error getting notes:", error);
    res
      .status(500)
      .json({ message: "Internal server error during getting notes" });
  }
};

export const getUserWords = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const words = await getUserWordsService(userId);
    res.status(200).json({ message: "Words retrieved successfully", words });
  } catch (error) {
    console.error("Error getting words:", error);
    res
      .status(500)
      .json({ message: "Internal server error during getting words" });
  }
};

export const learnNewWord = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const word = await learnNewWordService(userId);
    if (!word) {
      res.status(404).json({ message: "No new words available to learn" });
      return;
    }
    res.status(200).json({ message: "Word learned successfully", word });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error during learning word" });
  }
};
