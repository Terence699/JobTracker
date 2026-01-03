import { Request, Response } from 'express';
import Job from '../models/Job';

interface AuthRequest extends Request {
  auth: {
    userId: string;
    sessionId: string;
  };
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as unknown as AuthRequest).auth;
        
        const jobs = await Job.find({ userId });
        
        const total = jobs.length;
        const statusCounts = jobs.reduce((acc, job) => {
            acc[job.status] = (acc[job.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        // Simple conversion rate: Offer / Interviewing
        // Or strictly: Offers / (Interviewing + Offers + Rejections after interview)
        // Let's use simple: Offers / Total Interviews (approx)
        const interviews = statusCounts['interviewing'] || 0;
        const offers = statusCounts['offer'] || 0;
        
        // Response rate: (Interviewing + Offer + Rejected) / Total
        const responded = (statusCounts['interviewing'] || 0) + (statusCounts['offer'] || 0) + (statusCounts['rejected'] || 0);
        const responseRate = total > 0 ? (responded / total) * 100 : 0;

        res.json({
            total,
            statusCounts,
            offers,
            responseRate
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}
