"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Role } from "@/lib/types";
import { Logo } from "@/components/marketing/nav";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<Role>("candidate");
  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = register({
      name,
      email,
      role,
      company: role === "employer" ? company : undefined,
    });
    if (result.success) {
      toast.success("Account created successfully!");
      router.push(role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join CareerOS and start your career journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("candidate")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer",
                role === "candidate"
                  ? "border-accent bg-accent/5 text-accent"
                  : "hover:bg-muted"
              )}
            >
              <GraduationCap className="h-6 w-6" />
              <span className="text-sm font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer",
                role === "employer"
                  ? "border-accent bg-accent/5 text-accent"
                  : "hover:bg-muted"
              )}
            >
              <Briefcase className="h-6 w-6" />
              <span className="text-sm font-medium">Employer</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === "candidate" ? "you@university.edu" : "you@company.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {role === "employer" && (
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" variant="accent">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
