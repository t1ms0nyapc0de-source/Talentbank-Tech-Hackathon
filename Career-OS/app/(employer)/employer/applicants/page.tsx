"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import { mockJobs } from "@/lib/mock/jobs";
import type { ApplicationStatus } from "@/lib/types";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ApplicantsPage() {
  const user = useAuthStore((s) => s.user)!;
  const getEmployerApplications = useApplicationStore((s) => s.getEmployerApplications);
  const updateApplicationStatus = useApplicationStore((s) => s.updateApplicationStatus);
  const employerJobs = useApplicationStore((s) => s.employerJobs);

  const ownedJobs = [
    ...mockJobs.filter((j) => j.employerId === user.id),
    ...employerJobs.filter((j) => j.employerId === user.id),
  ];
  const applications = getEmployerApplications(user.id);

  const [filterJob, setFilterJob] = useState<string>("all");

  const filtered = filterJob === "all"
    ? applications
    : applications.filter((a) => a.jobId === filterJob);

  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    updateApplicationStatus(id, status);
    toast.success(`Status updated to ${APPLICATION_STATUS_LABELS[status]}`);
  };

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applicants</h1>
          <p className="text-muted-foreground">
            Review and manage candidates who applied to your jobs.
          </p>
        </div>
        {ownedJobs.length > 0 && (
          <Select value={filterJob} onValueChange={setFilterJob}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jobs</SelectItem>
              {ownedJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          description="Once candidates apply to your job postings, they'll appear here for review."
          action={
            <Button variant="accent" asChild>
              <Link href="/employer/jobs">Manage Jobs</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const job = ownedJobs.find((j) => j.id === app.jobId);
            return (
              <Card key={app.id}>
                <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{app.candidateName}</h3>
                      <Badge variant={statusVariant(app.status)}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {app.candidateEmail} · Applied to <span className="font-medium">{job?.title}</span> on {formatDate(app.appliedAt)}
                    </p>
                    {app.note && (
                      <p className="mt-2 text-sm text-muted-foreground italic border-l-2 border-accent/30 pl-3">
                        &ldquo;{app.note}&rdquo;
                      </p>
                    )}
                  </div>
                  <Select
                    value={app.status}
                    onValueChange={(v) => handleStatusChange(app.id, v as ApplicationStatus)}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
