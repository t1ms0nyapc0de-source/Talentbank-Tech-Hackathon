"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Application, ApplicationStatus, Job } from "@/lib/types";
import { seedApplications } from "@/lib/mock/applications";
import { mockJobs } from "@/lib/mock/jobs";

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
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  addEmployerJob: (job: Job) => void;
  updateEmployerJob: (id: string, data: Partial<Job>) => void;
  deleteEmployerJob: (id: string) => void;
  getAllJobs: () => Job[];
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: seedApplications,
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

      updateApplicationStatus: (id, status) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status } : a
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

      getAllJobs: () => [...mockJobs, ...get().employerJobs],
    }),
    { name: "careeros-applications" }
  )
);
