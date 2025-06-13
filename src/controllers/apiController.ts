import { Request, Response } from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const generateToken = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const roomName = `rox-session-${uuidv4().substring(0, 8)}`;
  const participantIdentity = `student-${uuidv4().substring(0, 8)}`;
  const tokenServiceURL =
    process.env.WEBRTC_TOKEN_SERVICE_URL || "http://localhost:3002/api/token";
  try {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        ...(userId && { Authorization: `Bearer ${userId}` }),
      },
    };
    const tokenServiceRequestPayload = {
      room_name: roomName,
      participant_identity: participantIdentity,
      User_id: userId,
      participant_name: `Student ${userId.substring(0, 5)}`,
    };
    const tokenServiceResponse = await axios.post(
      tokenServiceURL,
      tokenServiceRequestPayload,
      axiosConfig
    );
    const studentLiveKitToken = tokenServiceResponse.data.token;
    const clientLiveKitWsUrl = tokenServiceResponse.data.wsUrl;
    if (!studentLiveKitToken) {
      console.error(
        "[generateToken] Failed to get student token from webrtc-token-service. Response:",
        tokenServiceResponse.data
      );
      res.status(500).json({
        success: false,
        message: "Failed to retrieve student LiveKit token.",
      });
      return;
    }
    console.log(
      `[generateToken] Student LiveKit token received for room ${roomName}.`
    );

    const livekitServiceURL =
      process.env.LIVEKIT_SERVICE_URL || "http://localhost:5005/run-agent";

    const livekitServiceRequestPayload = {
      room_name: roomName,
      room_url: clientLiveKitWsUrl,
    };

    const livekitServiceResponse = await axios.post(
      livekitServiceURL,
      livekitServiceRequestPayload,
      axiosConfig
    );

    res.status(200).json({
      success: true,
      roomName: roomName,
      studentToken: studentLiveKitToken,
      livekitUrl: clientLiveKitWsUrl,
    });
  } catch (error: any) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error.message === "string") {
      errorMessage = error.message;
    }
    console.error(
      `[generateToken] Error starting AI session for user ${userId}: ${errorMessage}`
    );
    if (axios.isAxiosError(error)) {
      console.error("[generateToken] Axios error details:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
      res.status(error.response?.status || 500).json({
        success: false,
        message: "Failed to communicate with token service.",
        details: error.response?.data || errorMessage,
      });
      return;
    }
    const errorName = error?.constructor?.name;
    if (
      (typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("livekit")) ||
      (typeof errorName === "string" &&
        errorName.toLowerCase().includes("livekit"))
    ) {
      console.error("[generateToken] LiveKit SDK error:", error);
      res.status(500).json({
        success: false,
        message: "LiveKit operation failed.",
        details: errorMessage,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal server error while starting AI session.",
      details: errorMessage,
    });
  }
};
