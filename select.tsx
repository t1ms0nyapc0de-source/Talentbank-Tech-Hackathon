"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Role, User } from "@/lib/types";
import { findDemoUser } from "@/lib/mock/users";
import { cn } from "@/lib/utils";
import { Shield, ArrowRight, User as UserIcon } from "lucide-react";

type Provider = "google" | "github" | "linkedin";

export function SocialAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState<Provider>("google");
  const [step, setStep] = useState<"choose-account" | "custom-form" | "select-role">("choose-account");

  // User input details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("candidate");
  const [company, setCompany] = useState("");

  const socialAuth = useAuthStore((s) => s.socialAuth);
  const registeredUsers = useAuthStore((s) => s.registeredUsers);
  const router = useRouter();

  const handleOpenOAuth = (selectedProvider: Provider) => {
    setProvider(selectedProvider);
    setStep("choose-account");
    setName("");
    setEmail("");
    setRole("candidate");
    setCompany("");
    setIsOpen(true);
  };

  const handleSelectMockAccount = (mockEmail: string, mockName: string, mockAvatar: string) => {
    // Check if account already registered or is demo user
    const demoExisting = findDemoUser(mockEmail);
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === mockEmail.toLowerCase()
    ) || demoExisting;

    if (existingUser) {
      // Existing user: sign in directly
      socialAuth(existingUser);
      toast.success(`Welcome back, ${existingUser.name}!`);
      setIsOpen(false);
      router.push(existingUser.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } else {
      // First-time signup for this email
      setEmail(mockEmail);
      setName(mockName);
      setStep("select-role");
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Please enter both email and name");
      return;
    }

    const demoExisting = findDemoUser(email);
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    ) || demoExisting;

    if (existingUser) {
      socialAuth(existingUser);
      toast.success(`Welcome back, ${existingUser.name}!`);
      setIsOpen(false);
      router.push(existingUser.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } else {
      setStep("select-role");
    }
  };

  const handleCompleteRegistration = () => {
    if (role === "employer" && !company.trim()) {
      toast.error("Please enter your company name");
      return;
    }

    const avatarUrl =
      provider === "google"
        ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
        : provider === "github"
        ? `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const newUser: User = {
      id: `user-${role}-${Date.now()}`,
      name,
      email,
      role,
      company: role === "employer" ? company : undefined,
      avatarUrl,
    };

    socialAuth(newUser);
    toast.success("Account created and signed in with " + provider.charAt(0).toUpperCase() + provider.slice(1));
    setIsOpen(false);
    router.push(role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
  };

  const providerNames = {
    google: "Google",
    github: "GitHub",
    linkedin: "LinkedIn",
  };

  const providerColors = {
    google: "bg-[#4285F4] text-white hover:bg-[#357AE8]",
    github: "bg-[#24292F] text-white hover:bg-[#1A1F24]",
    linkedin: "bg-[#0A66C2] text-white hover:bg-[#004182]",
  };

  return (
    <div className="space-y-3">
      <div className="relative my-4 flex items-center justify-center text-xs uppercase">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <span className="relative bg-card px-2 text-muted-foreground font-medium">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer hover:border-[#4285F4]/50 hover:bg-[#4285F4]/5 transition-all"
          onClick={() => handleOpenOAuth("google")}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.7 0 3.23.69 4.36 1.81l3.25-3.25C19.23 2.38 15.96 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.784 0 10.741-4.14 10.741-11.24 0-.69-.06-1.396-.19-1.955H12.24z"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer hover:border-[#24292F]/50 hover:bg-[#24292F]/5 transition-all"
          onClick={() => handleOpenOAuth("github")}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/5 transition-all"
          onClick={() => handleOpenOAuth("linkedin")}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          LinkedIn
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md border-0 bg-background/95 backdrop-blur-md shadow-2xl p-0 overflow-hidden sm:rounded-2xl">
          {/* Header styling depending on provider */}
          <div className="p-6 border-b flex flex-col items-center justify-center text-center">
            {provider === "google" && (
              <div className="flex flex-col items-center space-y-2">
                <svg className="h-10 w-10 mb-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.7 0 3.23.69 4.36 1.81l3.25-3.25C19.23 2.38 15.96 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.784 0 10.741-4.14 10.741-11.24 0-.69-.06-1.396-.19-1.955H12.24z"
                  />
                </svg>
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Sign in with Google
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  to continue to CareerOS
                </DialogDescription>
              </div>
            )}

            {provider === "github" && (
              <div className="flex flex-col items-center space-y-2">
                <svg className="h-10 w-10 mb-2 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Authorize CareerOS
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Secure OAuth authentication using GitHub
                </DialogDescription>
              </div>
            )}

            {provider === "linkedin" && (
              <div className="flex flex-col items-center space-y-2">
                <svg className="h-10 w-10 mb-2 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Sign in with LinkedIn
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Share your LinkedIn profile details with CareerOS
                </DialogDescription>
              </div>
            )}
          </div>

          <div className="p-6">
            {step === "choose-account" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Select a mock account
                  </p>
                  <button
                    onClick={() =>
                      handleSelectMockAccount(
                        "alex.rivera@university.edu",
                        "Alex Rivera",
                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-muted/40 hover:border-accent/40 text-left transition-all cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-full bg-accent/15 flex items-center justify-center font-bold text-accent">
                      AR
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Alex Rivera</p>
                      <p className="text-xs text-muted-foreground">alex.rivera@university.edu</p>
                    </div>
                    <span className="ml-auto text-xs text-accent font-medium">Candidate</span>
                  </button>

                  <button
                    onClick={() =>
                      handleSelectMockAccount(
                        "sarah.chen@techcorp.com",
                        "Sarah Chen",
                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah"
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg border p-3 hover:bg-muted/40 hover:border-accent/40 text-left transition-all cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-full bg-accent/15 flex items-center justify-center font-bold text-accent">
                      SC
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">sarah.chen@techcorp.com</p>
                    </div>
                    <span className="ml-auto text-xs text-accent font-medium">Employer</span>
                  </button>
                </div>

                <div className="flex items-center my-4">
                  <span className="w-full border-t" />
                  <span className="px-2 text-[10px] text-muted-foreground uppercase font-semibold whitespace-nowrap">
                    Or use another email
                  </span>
                  <span className="w-full border-t" />
                </div>

                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => setStep("custom-form")}
                >
                  Use a different account
                </Button>
              </div>
            )}

            {step === "custom-form" && (
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social-name">Full Name</Label>
                  <Input
                    id="social-name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social-email">Email Address</Label>
                  <Input
                    id="social-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("choose-account")}
                    className="w-1/3 cursor-pointer"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="w-2/3 cursor-pointer" variant="accent">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === "select-role" && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <h3 className="font-semibold text-md text-foreground">Setup Your Profile</h3>
                  <p className="text-xs text-muted-foreground">
                    Choose how you want to use CareerOS
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("candidate")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer",
                      role === "candidate"
                        ? "border-accent bg-accent/5 text-accent"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="text-xs font-semibold">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer",
                      role === "employer"
                        ? "border-accent bg-accent/5 text-accent"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Shield className="h-6 w-6" />
                    <span className="text-xs font-semibold">Employer</span>
                  </button>
                </div>

                {role === "employer" && (
                  <div className="space-y-2 animate-in fade-in-50 duration-200">
                    <Label htmlFor="social-company">Company Name</Label>
                    <Input
                      id="social-company"
                      placeholder="e.g. Acme Corp"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                )}

                <Button
                  onClick={handleCompleteRegistration}
                  className="w-full mt-4 cursor-pointer"
                  variant="accent"
                >
                  Complete Setup
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
