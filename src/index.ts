import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";

import { Request, Response } from "express";

import dbInfoRouter from "./routes/dbInfo.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import interestRoutes from "./routes/interestRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import wordRoutes from "./routes/wordRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

dotenv.config({ path: path.resolve(".env") });

const app = express();
const PORT = process.env.BACKEND_PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Pronity Service is running!");
});
app.use("/dbInfo", dbInfoRouter);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/interest", interestRoutes);
app.use("/topic", topicRoutes);
app.use("/word", wordRoutes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
