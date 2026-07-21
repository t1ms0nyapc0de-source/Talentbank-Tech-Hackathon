"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Application, ApplicationStatus, Job } from "@/lib/types";
import { mockJobs } from "@/lib/mock/jobs";

const getJobWithDetails = (job: Job): Job => {
  if (job.companyDetails) return job;

  // Define fallback details based on company name
  const fallbacks: Record<string, NonNullable<Job["companyDetails"]>> = {
    "TechCorp Solutions": {
      industry: "Enterprise Software & Cloud Services",
      size: "1,200 employees",
      website: "https://techcorp.example.com",
      headquarters: "San Francisco, CA",
      description: "TechCorp Solutions is a global leader in providing next-generation software architectures, scalable cloud infrastructure, and developer tooling integrations."
    },
    "Greenfield Analytics": {
      industry: "Data Intelligence & ML Analytics",
      size: "450 employees",
      website: "https://greenfield.example.com",
      headquarters: "Boston, MA",
      description: "Greenfield Analytics transforms enterprise operational datasets into predictive wisdom engines using custom LLMs and advanced statistical methodologies."
    },
    "Pixel & Co": {
      industry: "Digital Experience & Creative Studio",
      size: "150 employees",
      website: "https://pixelco.example.com",
      headquarters: "New York, NY",
      description: "Pixel & Co is an award-winning design agency building future-proof branding systems, mobile application UI, and engaging browser interfaces."
    },
    "Campus Connect": {
      industry: "Higher EdTech & Engagement",
      size: "80 employees",
      website: "https://campusconnect.example.com",
      headquarters: "Chicago, IL",
      description: "Campus Connect builds unified communications tools and community hubs designed to link universities, alumni channels, and student boards."
    },
    "Meridian Capital": {
      industry: "Investment Banking & Wealth Tech",
      size: "2,500 employees",
      website: "https://meridian.example.com",
      headquarters: "New York, NY",
      description: "Meridian Capital is a premier financial management firm offering structured investment advisory, trading desks, and asset portfolios."
    },
    "LaunchPad Inc": {
      industry: "Incubation Systems & Startup Studio",
      size: "110 employees",
      website: "https://launchpad.example.com",
      headquarters: "Austin, TX",
      description: "LaunchPad Inc accelerates seed-stage ventures by supplying product consulting, funding rounds, and technical recruiting services."
    },
    "ShieldNet Security": {
      industry: "Defense, Cybersecurity & SIEM Solutions",
      size: "300 employees",
      website: "https://shieldnet.example.com",
      headquarters: "Washington, DC",
      description: "ShieldNet Security operates state-of-the-art security operation centers (SOC) guarding federal data frameworks and corporate endpoints."
    }
  };

  const defaultDetails: NonNullable<Job["companyDetails"]> = {
    industry: "Information Technology & Services",
    size: "250-500 employees",
    website: `https://${job.company.toLowerCase().replace(/[^a-z0-9]/g, "") || "company"}.example.com`,
    headquarters: job.location,
    description: `${job.company} is an innovative organization pioneering solutions and hiring exceptional student talent inside the local ecosystems.`
  };

  return {
    ...job,
    companyDetails: fallbacks[job.company] || defaultDetails
  };
};

interface ApplicationState {
  applications: Application[];
  employerJobs: Job[];
  apply: (data: {
    jobId: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    note?: string;
  }) => { success: boolean; error?: string };
  hasApplied: (jobId: string, candidateId: string) => boolean;
  getCandidateApplications: (candidateId: string) => Application[];
  getEmployerApplications: (employerId: string) => Application[];
  updateApplicationStatus: (
    id: string, 
    status: ApplicationStatus, 
    rejectionReason?: "timing" | "salary" | "location" | "role_fit"
  ) => void;
  optInAlumni: (
    id: string, 
    preferences: NonNullable<Application["alumniPreferences"]>
  ) => void;
  addEmployerJob: (job: Job) => void;
  updateEmployerJob: (id: string, data: Partial<Job>) => void;
  deleteEmployerJob: (id: string) => void;
  getAllJobs: () => Job[];
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: [
        {
          id: "app-1",
          jobId: "job-1",
          candidateId: "user-candidate-1",
          candidateName: "Alex Rivera",
          candidateEmail: "alex.rivera@university.edu",
          status: "interview",
          appliedAt: "2026-05-30",
          note: "Excited about the engineering team culture and mentorship program.",
          trajectoryMetrics: {
            growthRate: 88,
            predictedNextStep: "Staff Frontend Engineer",
            growthSignals: ["Acquired 4 advanced frontend frameworks in 12 months", "Promoted twice in previous company"],
            skillsMatchScore: 70,
            trajectoryMatchScore: 92
          }
        },
        {
          id: "app-2",
          jobId: "job-2",
          candidateId: "user-candidate-1",
          candidateName: "Alex Rivera",
          candidateEmail: "alex.rivera@university.edu",
          status: "under_review",
          appliedAt: "2026-06-01",
          trajectoryMetrics: {
            growthRate: 88,
            predictedNextStep: "Senior Frontend Developer",
            growthSignals: ["High open-source contribution velocity", "Strong UI performance optimization record"],
            skillsMatchScore: 65,
            trajectoryMatchScore: 86
          }
        },
        {
          id: "app-3",
          jobId: "job-10",
          candidateId: "user-candidate-2",
          candidateName: "Jordan Kim",
          candidateEmail: "jordan.kim@university.edu",
          status: "applied",
          appliedAt: "2026-06-08",
          note: "Full-stack experience with React and Node.js from personal projects.",
          trajectoryMetrics: {
            growthRate: 94,
            predictedNextStep: "Cloud Solutions Architect",
            growthSignals: ["Learned Go and Kubernetes in 3 months", "Built custom distributed API server from scratch"],
            skillsMatchScore: 60,
            trajectoryMatchScore: 95
          }
        },
        {
          id: "app-4",
          jobId: "job-1",
          candidateId: "user-candidate-2",
          candidateName: "Jordan Kim",
          candidateEmail: "jordan.kim@university.edu",
          status: "rejected",
          appliedAt: "2026-05-25",
          rejectionReason: "salary",
          alumniOptIn: true,
          alumniPreferences: {
            roleType: "Full-time Software Engineer",
            timeline: "Ready in 3 months",
            location: "Remote",
            expectedSalary: "$120,000"
          },
          trajectoryMetrics: {
            growthRate: 78,
            predictedNextStep: "Senior Backend Developer",
            growthSignals: ["Consistent system design progress", "Acquired full stack skills"],
            skillsMatchScore: 75,
            trajectoryMatchScore: 80
          }
        },
        {
          id: "app-5",
          jobId: "job-6",
          candidateId: "user-candidate-1",
          candidateName: "Alex Rivera",
          candidateEmail: "alex.rivera@university.edu",
          status: "applied",
          appliedAt: "2026-06-06",
          trajectoryMetrics: {
            growthRate: 60,
            predictedNextStep: "Technical Lead",
            growthSignals: ["Stable backend history", "Solid standard tooling skills"],
            skillsMatchScore: 80,
            trajectoryMatchScore: 74
          }
        },
        {
          id: "app-6",
          jobId: "job-13",
          candidateId: "user-candidate-2",
          candidateName: "Jordan Kim",
          candidateEmail: "jordan.kim@university.edu",
          status: "under_review",
          appliedAt: "2026-06-04",
          trajectoryMetrics: {
            growthRate: 92,
            predictedNextStep: "DevOps Lead",
            growthSignals: ["Accelerated cloud certification roadmap", "Implemented automated blue-green deployments"],
            skillsMatchScore: 62,
            trajectoryMatchScore: 90
          }
        }
      ],
      employerJobs: [],

      apply: (data) => {
        const existing = get().applications.find(
          (a) => a.jobId === data.jobId && a.candidateId === data.candidateId
        );
        if (existing) {
          return { success: false, error: "You have already applied to this job." };
        }
        const application: Application = {
          id: `app-${Date.now()}`,
          jobId: data.jobId,
          candidateId: data.candidateId,
          candidateName: data.candidateName,
          candidateEmail: data.candidateEmail,
          status: "applied",
          appliedAt: new Date().toISOString().split("T")[0],
          note: data.note,
          trajectoryMetrics: {
            growthRate: 85,
            predictedNextStep: "Software Engineer",
            growthSignals: ["Acquired 2 new technical modules in 6 months", "Maintained stable system execution"],
            skillsMatchScore: 60,
            trajectoryMatchScore: 80
          }
        };
        set((state) => ({
          applications: [application, ...state.applications],
        }));
        return { success: true };
      },

      hasApplied: (jobId, candidateId) =>
        get().applications.some(
          (a) => a.jobId === jobId && a.candidateId === candidateId
        ),

      getCandidateApplications: (candidateId) =>
        get().applications.filter((a) => a.candidateId === candidateId),

      getEmployerApplications: (employerId) => {
        const allJobs = get().getAllJobs();
        const employerJobIds = allJobs
          .filter((j) => j.employerId === employerId)
          .map((j) => j.id);
        return get().applications.filter((a) =>
          employerJobIds.includes(a.jobId)
        );
      },

      updateApplicationStatus: (id, status, rejectionReason) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id 
              ? { 
                  ...a, 
                  status, 
                  ...(rejectionReason ? { rejectionReason } : {})
                } 
              : a
          ),
        })),

      optInAlumni: (id, preferences) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id 
              ? { 
                  ...a, 
                  alumniOptIn: true, 
                  alumniPreferences: preferences 
                } 
              : a
          ),
        })),

      addEmployerJob: (job) =>
        set((state) => ({
          employerJobs: [job, ...state.employerJobs],
        })),

      updateEmployerJob: (id, data) =>
        set((state) => ({
          employerJobs: state.employerJobs.map((j) =>
            j.id === id ? { ...j, ...data } : j
          ),
        })),

      deleteEmployerJob: (id) =>
        set((state) => ({
          employerJobs: state.employerJobs.filter((j) => j.id !== id),
        })),

      getAllJobs: () => [...mockJobs, ...get().employerJobs].map(getJobWithDetails),
    }),
    { name: "careeros-applications-v2" }
  )
);
