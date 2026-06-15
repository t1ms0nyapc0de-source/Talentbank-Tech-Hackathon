"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "@/lib/types";
import { findDemoUser } from "@/lib/mock/users";

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  login: (email: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    email: string;
    role: Role;
    company?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,

      login: (email) => {
        const demo = findDemoUser(email);
        if (demo) {
          set({ user: demo });
          return { success: true };
        }
        return {
          success: false,
          error: "No demo account found. Try a demo email or register a new account.",
        };
      },

      register: (data) => {
        const existing = findDemoUser(data.email);
        if (existing) {
          return { success: false, error: "An account with this email already exists." };
        }
        const user: User = {
          id: `user-${data.role}-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          company: data.company,
        };
        set({ user });
        return { success: true };
      },

      logout: () => set({ user: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "careeros-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
