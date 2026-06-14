"use client";

import { Briefcase, ClipboardList, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import { mockJobs } from "@/lib/mock/jobs";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function EmployerDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const getEmployerApplications = useApplicationStore((s) => s.getEmployerApplications);
  const employerJobs = useApplicationStore((s) => s.employerJobs);

  const ownedJobs = [
    ...mockJobs.filter((j) => j.employerId === user.id),
    ...employerJobs.filter((j) => j.employerId === user.id),
  ];
  const applications = getEmployerApplications(user.id);
  const recentApps = applications.slice(0, 5);

  const statusVariant = (status: string) => {
    switch (status) {
      case "interview": return "success" as const;
      case "under_review": return "warning" as const;
      case "rejected": return "danger" as const;
      case "offer": return "accent" as const;
      default: return "secondary" as const;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {user.company ? `${user.company} Dashboard` : "Employer Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          Manage your job postings and review candidate applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Postings" value={ownedJobs.length} icon={Briefcase} description="Live job listings" />
        <StatCard title="Total Applicants" value={applications.length} icon={Users} description="Across all jobs" />
        <StatCard title="Pending Review" value={applications.filter((a) => a.status === "applied" || a.status === "under_review").length} icon={ClipboardList} description="Need attention" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applicants</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employer/applicants">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentApps.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No applications yet.{" "}
                <Link href="/employer/jobs" className="text-accent hover:underline">Post a job</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => {
                  const job = ownedJobs.find((j) => j.id === app.jobId);
                  return (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-sm">{app.candidateName}</p>
                        <p className="text-xs text-muted-foreground">
                          {job?.title} · {formatDate(app.appliedAt)}
                        </p>
                      </div>
                      <Badge variant={statusVariant(app.status)}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Job Postings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employer/jobs">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {ownedJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No jobs posted yet.{" "}
                <Link href="/employer/jobs" className="text-accent hover:underline">Create one</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {ownedJobs.slice(0, 5).map((job) => {
                  const appCount = applications.filter((a) => a.jobId === job.id).length;
                  return (
                    <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.location}</p>
                      </div>
                      <Badge variant="outline">{appCount} applicants</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="accent" asChild>
          <Link href="/employer/jobs">Post a New Job</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/employer/applicants">Review Applicants</Link>
        </Button>
      </div>
    </div>
  );
}
