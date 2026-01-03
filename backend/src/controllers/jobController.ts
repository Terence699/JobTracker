import { Request, Response } from 'express';
import Job from '../models/Job';

// Helper to get userId from request (Clerk attaches it)
// Note: In strict mode, we need to cast or define types properly
// The middleware attaches 'auth' to the request
interface AuthRequest extends Request {
  auth: {
    userId: string;
    sessionId: string;
  };
}

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as unknown as AuthRequest).auth;
    const jobs = await Job.find({ userId }).sort({ updatedAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as unknown as AuthRequest).auth;
    const job = new Job({
      ...req.body,
      userId
    });
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as unknown as AuthRequest).auth;
    const { id } = req.params;
    const { status } = req.body;

    const job = await Job.findOneAndUpdate(
      { _id: id, userId },
      { status },
      { new: true }
    );

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as unknown as AuthRequest).auth;
        const { id } = req.params;

        const job = await Job.findOneAndDelete({ _id: id, userId });

        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const updateJob = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as unknown as AuthRequest).auth;
        const { id } = req.params;
        const job = await Job.findOneAndUpdate(
            { _id: id, userId },
            req.body,
            { new: true }
        );
        if (!job) {
             res.status(404).json({ message: 'Job not found' });
             return;
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const addInterview = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as unknown as AuthRequest).auth;
        const { id } = req.params;
        const interview = req.body;
        
        const job = await Job.findOne({ _id: id, userId });
        if (!job) {
             res.status(404).json({ message: 'Job not found' });
             return;
        }
        
        if (!job.interviews) job.interviews = [];
        job.interviews.push(interview);
        await job.save();
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}
