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
  const clientLiveKitWsUrl =
    process.env.LIVEKIT_WS_URL ||
    "need to implement url in webrtc-token-service";
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
      participant_name: `Student ${userId.substring(0, 5)}`, // Example name
    };
    const tokenServiceResponse = await axios.post(
      tokenServiceURL,
      tokenServiceRequestPayload,
      axiosConfig
    );
    const studentLiveKitToken = tokenServiceResponse.data.token;
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
  //   if (!authenticatedUserId) {
  //     console.error(
  //       "[generateToken] User not authenticated or user ID missing from token payload"
  //     );
  //     res.status(401).json({ success: false, message: "User not authenticated" });
  //     return;
  //   }
  //   if (!userToken) {
  //     console.warn(
  //       "[generateToken] User token not found in req.user. Authorization header to webrtc-token-service will be empty or not sent."
  //     );
  //   }
  //   const livekitHost = process.env.LIVEKIT_URL;
  //   const livekitApiKey = process.env.LIVEKIT_API_KEY;
  //   const livekitApiSecret = process.env.LIVEKIT_API_SECRET;
  //   const tokenServiceUrl =
  //     process.env.WEBRTC_TOKEN_SERVICE_URL || "http://localhost:3002/api/token";
  //   if (!livekitHost || !livekitApiKey || !livekitApiSecret) {
  //     console.error(
  //       "[generateToken] LiveKit environment variables (LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET) not fully configured in pronity-backend."
  //     );
  //     res.status(500).json({
  //       success: false,
  //       message: "Server misconfiguration: LiveKit credentials missing.",
  //     });
  //     return;
  //   }
  //   if (!process.env.WEBRTC_TOKEN_SERVICE_URL) {
  //     console.warn(
  //       `[generateToken] WEBRTC_TOKEN_SERVICE_URL not set in .env, defaulting to ${tokenServiceUrl}. Ensure this is correct for your environment.`
  //     );
  //   }
  //   try {
  //     const roomName = `rox-session-${authenticatedUserId}-${uuidv4().substring(
  //       0,
  //       8
  //     )}`;
  //     const participantIdentity = `student-${authenticatedUserId}`;
  //     const roomServiceClient = new RoomServiceClient(
  //       livekitHost,
  //       livekitApiKey,
  //       livekitApiSecret
  //     );
  //     const roomOptions: CreateOptions = {
  //       name: roomName,
  //       emptyTimeout: 300, // 5 minutes in seconds
  //       maxParticipants: 2,
  //       metadata: JSON.stringify({
  //         user_id: authenticatedUserId,
  //         // agent_dispatch_criteria: "rox_tutor_session", // Example metadata for agent framework
  //       }),
  //     };
  //     console.log(
  //       `[startAiSessionController] Creating LiveKit room: ${roomName} with metadata: ${roomOptions.metadata}`
  //     );
  //     const room = await roomServiceClient.createRoom(roomOptions);
  //     console.log(
  //       `[startAiSessionController] LiveKit room ${room.name} created successfully.`
  //     );
  //     console.log(
  //       `[startAiSessionController] Requesting token from webrtc-token-service (${tokenServiceUrl}) for room: ${roomName}, identity: ${participantIdentity}`
  //     );
  //     const tokenServiceRequestPayload = {
  //       room_name: roomName,
  //       participant_identity: participantIdentity,
  //       User_id: authenticatedUserId,
  //       participant_name: `Student ${authenticatedUserId.substring(0, 5)}`, // Example name
  //     };
  //     const axiosConfig = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         ...(userToken && { Authorization: `Bearer ${userToken}` }),
  //       },
  //     };
  //     const tokenServiceResponse = await axios.post(
  //       tokenServiceUrl,
  //       tokenServiceRequestPayload,
  //       axiosConfig
  //     );
  //     const studentLiveKitToken = tokenServiceResponse.data.token;
  //     const clientLiveKitWsUrl = process.env.LIVEKIT_WS_URL || livekitHost;
  //     if (!studentLiveKitToken) {
  //       console.error(
  //         "[startAiSessionController] Failed to get student token from webrtc-token-service. Response:",
  //         tokenServiceResponse.data
  //       );
  //       res.status(500).json({
  //         success: false,
  //         message: "Failed to retrieve student LiveKit token.",
  //       });
  //     }
  //     console.log(
  //       `[startAiSessionController] Student LiveKit token received for room ${roomName}.`
  //     );
  //     res.status(200).json({
  //       success: true,
  //       roomName: roomName,
  //       studentToken: studentLiveKitToken,
  //       livekitUrl: clientLiveKitWsUrl,
  //     });
  //   } catch (error: any) {
  //     console.error(
  //       `[startAiSessionController] Error starting AI session for user ${authenticatedUserId}: ${error.message}`
  //     );
  //     if (axios.isAxiosError(error)) {
  //       console.error("[startAiSessionController] Axios error details:", {
  //         url: error.config?.url,
  //         method: error.config?.method,
  //         status: error.response?.status,
  //         data: error.response?.data,
  //       });
  //       res.status(error.response?.status || 500).json({
  //         success: false,
  //         message: "Failed to communicate with token service.",
  //         details: error.response?.data || error.message,
  //       });
  //       return;
  //     }
  //     if (
  //       error.message &&
  //       (error.message.toLowerCase().includes("livekit") ||
  //         error.constructor?.name?.toLowerCase().includes("livekit"))
  //     ) {
  //       console.error("[startAiSessionController] LiveKit SDK error:", error);
  //       res.status(500).json({
  //         success: false,
  //         message: "LiveKit operation failed.",
  //         details: error.message,
  //       });
  //       return;
  //     }
  //     res.status(500).json({
  //       success: false,
  //       message: "Internal server error while starting AI session.",
  //       details: error.message,
  //     });
  //     return;
  //   }
};
