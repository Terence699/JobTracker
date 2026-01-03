import express from 'express';
import { getJobs, createJob, updateJobStatus, deleteJob, updateJob, addInterview } from '../controllers/jobController';

const router = express.Router();

router.get('/', getJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.patch('/:id/status', updateJobStatus);
router.post('/:id/interview', addInterview);
router.delete('/:id', deleteJob);

export default router;
