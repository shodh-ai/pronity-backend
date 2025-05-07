import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';

import { Request, Response } from 'express';

import dbInfoRouter from './routes/dbInfo.js';

dotenv.config({ path: path.resolve('.env') });

const app = express();
const PORT = process.env.BACKEND_PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Pronity Service is running!');
});
app.use('/dbInfo', dbInfoRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});