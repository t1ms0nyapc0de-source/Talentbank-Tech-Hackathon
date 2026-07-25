"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Resume, Education, Experience } from "@/lib/types";
import { seedResumes } from "@/lib/mock/resumes";

const defaultResume: Resume = {
  headline: "",
  summary: "",
  skills: [],
  education: [],
  experience: [],
  location: "",
  phone: "",
};

interface ProfileState {
  resumes: Record<string, Resume>;
  getResume: (userId: string) => Resume;
  updateResume: (userId: string, data: Partial<Resume>) => void;
  addEducation: (userId: string, edu: Education) => void;
  removeEducation: (userId: string, id: string) => void;
  addExperience: (userId: string, exp: Experience) => void;
  removeExperience: (userId: string, id: string) => void;
  addSkill: (userId: string, skill: string) => void;
  removeSkill: (userId: string, skill: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      resumes: {},

      getResume: (userId) => {
        return get().resumes[userId] ?? seedResumes[userId] ?? { ...defaultResume };
      },

      updateResume: (userId, data) =>
        set((state) => ({
          resumes: {
            ...state.resumes,
            [userId]: { ...defaultResume, ...state.resumes[userId], ...data },
          },
        })),

      addEducation: (userId, edu) =>
        set((state) => {
          const current = state.resumes[userId] ?? { ...defaultResume };
          return {
            resumes: {
              ...state.resumes,
              [userId]: {
                ...current,
                education: [...current.education, edu],
              },
            },
          };
        }),

      removeEducation: (userId, id) =>
        set((state) => {
          const current = state.resumes[userId] ?? { ...defaultResume };
          return {
            resumes: {
              ...state.resumes,
              [userId]: {
                ...current,
                education: current.education.filter((e) => e.id !== id),
              },
            },
          };
        }),

      addExperience: (userId, exp) =>
        set((state) => {
          const current = state.resumes[userId] ?? { ...defaultResume };
          return {
            resumes: {
              ...state.resumes,
              [userId]: {
                ...current,
                experience: [...current.experience, exp],
              },
            },
          };
        }),

      removeExperience: (userId, id) =>
        set((state) => {
          const current = state.resumes[userId] ?? { ...defaultResume };
          return {
            resumes: {
              ...state.resumes,
              [userId]: {
                ...current,
                experience: current.experience.filter((e) => e.id !== id),
              },
            },
          };
        }),

      addSkill: (userId, skill) =>
        set((state) => {
          const current = state.resumes[userId] ?? { ...defaultResume };
          if (current.skills.includes(skill)) return state;
          return {
            resumes: {
              ...state.resumes,
              [userId]: {
                ...current,
                skills: [...current.skills, skill],
              },
            },
          };
        }),

      removeSkill: (userId, skill) =>
        set((state) => {
          const current = state.resumes[userId] ?? { ...defaultResume };
          return {
            resumes: {
              ...state.resumes,
              [userId]: {
                ...current,
                skills: current.skills.filter((s) => s !== skill),
              },
            },
          };
        }),
    }),
    { name: "careeros-profiles" }
  )
);
