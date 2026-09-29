import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import busRoutes from './routes/busRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static build if available
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Smart Bus Complaint & Monitoring System API is healthy.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/complaints', complaintRoutes);

// Fallback route for SPA client-side routing
app.get('*', (req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  }
  return res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).json({
        success: true,
        message: 'Government of Tamil Nadu • Smart Bus Complaint & Monitoring System API',
        documentation: 'https://github.com/Thamizhselvans-tech/busgp',
      });
    }
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
