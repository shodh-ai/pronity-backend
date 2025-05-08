import { PrismaClient } from "@prisma/client";
import UserDTO from "../models/UserDTO.js";
import ReportPayload from "../types/ReportPayload.js";
import ReportDTO from "../models/ReportDTO.js";

export const addReport = async (user: UserDTO, reportData: ReportPayload) => {
  const prisma = new PrismaClient();
  try {
    const report = await prisma.report.create({
      data: {
        type: reportData.type,
        userText: reportData.user_text,
        topicId: reportData.topicId,
        comments: {
          create: reportData.comments.map((comment) => ({
            startIndex: comment.start,
            endIndex: comment.end,
            wrongText: reportData.user_text.slice(comment.start, comment.end),
            rightText: comment.rightText,
            info: comment.info,
          })),
        },
        userId: user.id,
      },
    });
    return report;
  } catch (error) {
    console.error("Error adding report:", error);
    throw new Error("Database error");
  }
};

export const getReports = async (user: UserDTO): Promise<ReportDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const reports = await prisma.report.findMany({
            where: {
                userId: user.id,
            },
            include: {
                comments: true,
            },
        });
        return reports as ReportDTO[];
    } catch (error) {
        console.error("Error getting reports:", error);
        throw new Error("Database error");
    }
}

export const getReportById = async (user: UserDTO, reportId: string): Promise<ReportDTO> => {
    const prisma = new PrismaClient();
    if (!reportId) {
        throw new Error("Report id is required");
    }
    if (!user.id) {
        throw new Error("User id is required");
    }
    try {
        const report = await prisma.report.findUnique({
            where: {
                id: reportId,
                userId: user.id,
            },
            include: {
                comments: true,
            },
        });
        if (!report) {
            throw new Error("Report not found");
        }
        return report as ReportDTO;
    } catch (error) {
        console.error("Error getting report by id:", error);
        throw new Error("Database error");
    }
}

