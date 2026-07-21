"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "@/lib/types";
import { findDemoUser } from "@/lib/mock/users";

interface AuthState {
  user: User | null;
  registeredUsers: User[];
  isHydrated: boolean;
  login: (email: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    email: string;
    role: Role;
    company?: string;
    avatarUrl?: string;
  }) => { success: boolean; error?: string };
  socialAuth: (data: User) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [],
      isHydrated: false,

      login: (email) => {
        // 1. Check demo users first
        const demo = findDemoUser(email);
        if (demo) {
          set({ user: demo });
          return { success: true };
        }
        // 2. Check registered users list
        const registered = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (registered) {
          set({ user: registered });
          return { success: true };
        }
        return {
          success: false,
          error: "No account found with this email. Try a demo account or register a new one.",
        };
      },

      register: (data) => {
        const emailLower = data.email.toLowerCase();
        const demoExisting = findDemoUser(emailLower);
        const registeredExisting = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === emailLower
        );
        if (demoExisting || registeredExisting) {
          return { success: false, error: "An account with this email already exists." };
        }
        const user: User = {
          id: `user-${data.role}-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          company: data.company,
          avatarUrl: data.avatarUrl,
        };
        set({
          user,
          registeredUsers: [...get().registeredUsers, user],
        });
        return { success: true };
      },

      socialAuth: (userData) => {
        const emailLower = userData.email.toLowerCase();
        // Check if user already exists
        const demoExisting = findDemoUser(emailLower);
        if (demoExisting) {
          set({ user: demoExisting });
          return;
        }

        const registeredExisting = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === emailLower
        );

        if (registeredExisting) {
          // Update user information if details changed, or just set it
          const updatedUser = { ...registeredExisting, ...userData };
          set({
            user: updatedUser,
            registeredUsers: get().registeredUsers.map((u) =>
              u.email.toLowerCase() === emailLower ? updatedUser : u
            ),
          });
        } else {
          // Register user for first time
          set({
            user: userData,
            registeredUsers: [...get().registeredUsers, userData],
          });
        }
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
