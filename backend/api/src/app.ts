import express from 'express';
import { globalErrorHandler } from './middlewares/errorHandler';
import mongoRouter from './routes/mongoRouter';
import authRouter from './routes/authRouter';

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use('/api/devices', mongoRouter);

// Global error handler (should be after routes)
app.use(globalErrorHandler);

export default app;