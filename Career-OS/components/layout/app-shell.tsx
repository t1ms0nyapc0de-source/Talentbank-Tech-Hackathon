"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Logo } from "@/components/marketing/nav";
import { cn } from "@/lib/utils";

const candidateNav = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidate/profile", label: "Profile & Resume", icon: FileText },
  { href: "/candidate/jobs", label: "Job Listings", icon: Briefcase },
  { href: "/candidate/applications", label: "Applications", icon: ClipboardList },
  { href: "/candidate/matches", label: "Job Matching", icon: Sparkles },
];

const employerNav = [
  { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employer/jobs", label: "Manage Jobs", icon: Briefcase },
  { href: "/employer/applicants", label: "Applicants", icon: ClipboardList },
];

export function AppShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "candidate" | "employer";
}) {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = role === "candidate" ? candidateNav : employerNav;

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace("/login");
    } else if (isHydrated && user && user.role !== role) {
      router.replace(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    }
  }, [isHydrated, user, role, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <div className="border-b bg-card p-4 lg:hidden">
            <nav className="space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    pathname === item.href
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button variant="ghost" size="sm" className="mt-4 w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
