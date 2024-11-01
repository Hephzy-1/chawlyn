import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import authRouter from './routes/auth';
import asyncHandler from './middleware/async';
import errorHandler from './middleware/error';

const app: Application = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json({ messgae: "Welcome"})
}));

app.use('/api/v1', authRouter);

// Error Handler
app.use(errorHandler)

export default app;