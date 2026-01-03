import express from 'express';
import { getStats } from '../controllers/analyticsController';

const router = express.Router();

router.get('/stats', getStats);

export default router;
