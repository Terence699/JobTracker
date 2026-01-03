import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './lib/db';
import jobRoutes from './routes/jobRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { requireAuth } from './middleware/auth';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Public routes
app.get('/', (req, res) => {
  res.send('Job Application Tracker API');
});

// Protected routes
app.use('/api/jobs', requireAuth, jobRoutes);
app.use('/api/analytics', requireAuth, analyticsRoutes);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
