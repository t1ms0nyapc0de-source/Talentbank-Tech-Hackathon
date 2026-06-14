"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/stat-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ApplicationsPage() {
  const user = useAuthStore((s) => s.user)!;
  const getCandidateApplications = useApplicationStore((s) => s.getCandidateApplications);
  const getAllJobs = useApplicationStore((s) => s.getAllJobs);

  const applications = getCandidateApplications(user.id);
  const jobs = getAllJobs();

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
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of every job you&apos;ve applied to.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Start exploring job listings and submit your first application."
          action={
            <Button variant="accent" asChild>
              <Link href="/candidate/jobs">Browse Jobs</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            return (
              <Card key={app.id}>
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{job?.title ?? "Unknown Position"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job?.company} · Applied {formatDate(app.appliedAt)}
                    </p>
                    {app.note && (
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        &ldquo;{app.note}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant(app.status)}>
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </Badge>
                    {job && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/candidate/jobs/${job.id}`}>View Job</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
