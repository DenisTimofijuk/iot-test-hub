import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import mongoRouter from './routes/mongoRoutes';

const app = express();
app.use(express.json());

// Routes
app.use('/api/mongo', mongoRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;