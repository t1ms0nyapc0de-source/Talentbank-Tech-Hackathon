export type Role = "candidate" | "employer";

export type JobType = "internship" | "full-time" | "part-time" | "contract";
export type RemoteType = "remote" | "hybrid" | "onsite";
export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "interview"
  | "rejected"
  | "offer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: string;
  avatarUrl?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Resume {
  headline: string;
  summary: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  location: string;
  phone: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  remote: RemoteType;
  tags: string[];
  description: string;
  requirements: string[];
  salary?: string;
  postedAt: string;
  employerId: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  status: ApplicationStatus;
  appliedAt: string;
  note?: string;
  rejectionReason?: "timing" | "salary" | "location" | "role_fit";
  alumniOptIn?: boolean;
  alumniPreferences?: {
    roleType: string;
    timeline: string;
    location: string;
    expectedSalary: string;
  };
  trajectoryMetrics?: {
    growthRate: number;
    predictedNextStep: string;
    growthSignals: string[];
    skillsMatchScore: number;
    trajectoryMatchScore: number;
  };
}

export interface JobMatch {
  job: Job;
  score: number;
  matchedSkills: string[];
  matchedKeywords: string[];
}

export interface JobFilters {
  query: string;
  location: string;
  type: JobType | "all";
  remote: RemoteType | "all";
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  internship: "Internship",
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
};

export const REMOTE_TYPE_LABELS: Record<RemoteType, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};
