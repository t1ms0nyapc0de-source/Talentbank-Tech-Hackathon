import type { User } from "@/lib/types";

export const demoUsers: User[] = [
  {
    id: "user-candidate-1",
    name: "Alex Rivera",
    email: "alex.rivera@university.edu",
    role: "candidate",
    avatarUrl: undefined,
  },
  {
    id: "user-candidate-2",
    name: "Jordan Kim",
    email: "jordan.kim@university.edu",
    role: "candidate",
  },
  {
    id: "user-employer-1",
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    role: "employer",
    company: "TechCorp Solutions",
  },
  {
    id: "user-employer-2",
    name: "Marcus Webb",
    email: "marcus.webb@greenfield.io",
    role: "employer",
    company: "Greenfield Analytics",
  },
];

export function findDemoUser(email: string): User | undefined {
  return demoUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}
