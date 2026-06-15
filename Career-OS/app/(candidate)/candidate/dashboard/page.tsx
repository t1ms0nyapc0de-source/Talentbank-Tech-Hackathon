"use client";

import Link from "next/link";
import { Briefcase, ClipboardList, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { JobCard } from "@/components/jobs/job-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useProfileStore } from "@/lib/stores/profile-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import { getProfileCompletion, getJobMatches } from "@/lib/matching";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CareerNavigator } from "@/components/dashboard/career-navigator";

export default function CandidateDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const resume = useProfileStore((s) => s.getResume(user.id));
  const getCandidateApplications = useApplicationStore((s) => s.getCandidateApplications);
  const getAllJobs = useApplicationStore((s) => s.getAllJobs);

  const completion = getProfileCompletion(resume);
  const applications = getCandidateApplications(user.id);
  const jobs = getAllJobs();
  const matches = getJobMatches(resume, jobs).slice(0, 3);
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
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Here&apos;s your career journey at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Applications" value={applications.length} icon={ClipboardList} description="Total submitted" />
        <StatCard title="Top Matches" value={matches.length} icon={Sparkles} description="Based on your profile" />
        <StatCard title="Open Jobs" value={jobs.length} icon={Briefcase} description="Available now" />
        <StatCard title="Profile" value={`${completion}%`} icon={FileText} description="Completion score" />
      </div>

      {completion < 100 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">Complete your profile</p>
                <p className="text-sm text-muted-foreground">
                  A complete profile improves your job matches by up to 40%.
                </p>
              </div>
              <Button variant="accent" size="sm" asChild>
                <Link href="/candidate/profile">Complete Profile</Link>
              </Button>
            </div>
            <Progress value={completion} />
          </CardContent>
        </Card>
      )}

      <CareerNavigator />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/candidate/applications">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentApps.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No applications yet.{" "}
                <Link href="/candidate/jobs" className="text-accent hover:underline">Browse jobs</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId);
                  return (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-sm">{job?.title ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{job?.company} · {formatDate(app.appliedAt)}</p>
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
            <CardTitle>Top Job Matches</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/candidate/matches">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {matches.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Add skills to your profile to see matches.{" "}
                <Link href="/candidate/profile" className="text-accent hover:underline">Edit profile</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {matches.map((m) => (
                  <div key={m.job.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm">{m.job.title}</p>
                      <p className="text-xs text-muted-foreground">{m.job.company}</p>
                    </div>
                    <Badge variant="accent">{m.score}%</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recommended Jobs</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/candidate/jobs">Browse all jobs</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
