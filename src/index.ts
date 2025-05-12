import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';

import { Request, Response } from 'express';

import dbInfoRouter from './routes/dbInfo.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import wordRoutes from './routes/wordRoutes.js';
import speakingRoutes from './routes/speakingRoutes.js';

dotenv.config({ path: path.resolve('.env') });

// Get the current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.BACKEND_PORT;

// Configure CORS to allow requests from any origin
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Setup file upload middleware
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    createParentPath: true,
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, '../tmp/')
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req: Request, res: Response) => {
    res.send('Pronity Service is running!');
});
app.use('/dbInfo', dbInfoRouter);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/interest', interestRoutes);
app.use('/topic', topicRoutes);
app.use('/word', wordRoutes);
app.use('/speaking', speakingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});