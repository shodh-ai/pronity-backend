import { PrismaClient } from "@prisma/client";
import UserDTO from "../models/UserDTO.js";
import ReportPayload from "../types/ReportPayload.js";
import ReportDTO from "../models/ReportDTO.js";

export const addReport = async (user: UserDTO, reportData: ReportPayload) => {
  const prisma = new PrismaClient();
  try {
    const createdReport = await prisma.$transaction(async (tx) => {
      const report = await tx.report.create({
        data: {
          userId: user.id,
          userText: reportData.user_text,
          mainComment: reportData.main_comment,
          flowId: reportData.flowElementId,
          comments: {
            create: reportData.comments.map((comment) => ({
              startIndex: comment.start,
              endIndex: comment.end,
              wrongText: reportData.user_text.slice(comment.start, comment.end),
              rightText: comment.rightText,
              info: comment.info,
            })),
          },
        },
      });

      await tx.flowElement.update({
        where: { id: reportData.flowElementId },
        data: { reportId: report.id },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          currentOrder: {
            increment: 1,
          },
        },
      });

      return report;
    });
    return createdReport;
  } catch (error) {
    console.error("Error adding report:", error);
    throw new Error("Database error");
  } finally {
    await prisma.$disconnect();
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
        flow: true,
      },
    });
    return reports as ReportDTO[];
  } catch (error) {
    console.error("Error getting reports:", error);
    throw new Error("Database error");
  }
};

export const getReportById = async (
  user: UserDTO,
  reportId: string
): Promise<ReportDTO> => {
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
        flow: true,
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
};
