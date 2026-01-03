import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  userId: string;
  companyName: string;
  position: string;
  jobUrl?: string;
  jobDescription?: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  appliedDate: Date;
  salary?: string;
  location?: string;
  contactInfo?: {
    hrName?: string;
    hrEmail?: string;
    hrPhone?: string;
  };
  interviews?: {
    date: Date;
    type: string;
    notes?: string;
    feedback?: string;
  }[];
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  companyName: { type: String, required: true },
  position: { type: String, required: true },
  jobUrl: { type: String },
  jobDescription: { type: String },
  status: { 
    type: String, 
    enum: ["applied", "interviewing", "offer", "rejected"],
    default: "applied" 
  },
  appliedDate: { type: Date, default: Date.now },
  salary: { type: String },
  location: { type: String },
  contactInfo: {
    hrName: { type: String },
    hrEmail: { type: String },
    hrPhone: { type: String }
  },
  interviews: [{
    date: { type: Date, required: true },
    type: { type: String, required: true },
    notes: { type: String },
    feedback: { type: String }
  }],
  notes: { type: String },
  tags: [{ type: String }],
}, {
  timestamps: true
});

export default mongoose.model<IJob>('Job', JobSchema);
