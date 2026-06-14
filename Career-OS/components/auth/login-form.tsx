"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { demoUsers } from "@/lib/mock/users";
import { Logo } from "@/components/marketing/nav";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email);
    if (result.success) {
      const user = useAuthStore.getState().user;
      toast.success(`Welcome back, ${user?.name}!`);
      router.push(user?.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    const result = login(demoEmail);
    if (result.success) {
      const user = useAuthStore.getState().user;
      toast.success(`Signed in as ${user?.name}`);
      router.push(user?.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your CareerOS account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" variant="accent">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground mb-3">Try a demo account</p>
            <div className="grid gap-2">
              {demoUsers.map((u) => (
                <Button
                  key={u.id}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => handleDemoLogin(u.email)}
                >
                  <span className="font-medium">{u.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">{u.role}</span>
                </Button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-accent hover:underline font-medium">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
