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

  const mockInterviews = resume.mockInterviews || [];

  const getEloGrade = (elo: number) => {
    if (elo >= 1800) return "S";
    if (elo >= 1600) return "A+";
    if (elo >= 1450) return "A";
    if (elo >= 1300) return "B+";
    if (elo >= 1200) return "B";
    if (elo >= 1100) return "C+";
    return "C";
  };

  const getEloThreshold = (g: string) => {
    switch (g) {
      case "C": return 1100;
      case "C+": return 1200;
      case "B": return 1300;
      case "B+": return 1450;
      case "A": return 1600;
      case "A+": return 1800;
      default: return 2000;
    }
  };

  const getPrevThreshold = (g: string) => {
    switch (g) {
      case "S": return 1800;
      case "A+": return 1600;
      case "A": return 1450;
      case "B+": return 1300;
      case "B": return 1200;
      case "C+": return 1100;
      default: return 1000;
    }
  };

  // ELO Calculations
  const baseElo = 1000;
  const completionElo = completion * 2;
  const appElo = applications.reduce((acc, app) => {
    if (app.status === "applied") return acc + 10;
    if (app.status === "under_review") return acc + 25;
    if (app.status === "interview") return acc + 60;
    if (app.status === "offer") return acc + 150;
    if (app.status === "rejected") return acc - 15;
    return acc;
  }, 0);
  const interviewElo = mockInterviews.length * 40;
  
  const totalElo = Math.max(1000, baseElo + completionElo + appElo + interviewElo);
  const grade = getEloGrade(totalElo);
  const nextThreshold = getEloThreshold(grade);
  const prevThreshold = getPrevThreshold(grade);
  const progressPercent = grade === "S" 
    ? 100 
    : Math.min(100, Math.max(0, ((totalElo - prevThreshold) / (nextThreshold - prevThreshold)) * 100));

  // Build ledger
  const ledger: { event: string; points: number; date: string }[] = [];
  ledger.push({ event: "Base Career Rating Initialized", points: 1000, date: "System Entry" });
  if (completionElo > 0) {
    ledger.push({ event: `Profile Setup Completed (${completion}%)`, points: completionElo, date: "Telemetry update" });
  }
  applications.forEach(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const title = job ? job.title : "Role";
    const company = job ? job.company : "Company";
    if (app.status === "applied") {
      ledger.push({ event: `Applied: ${title} (${company})`, points: 10, date: formatDate(app.appliedAt) });
    } else if (app.status === "under_review") {
      ledger.push({ event: `Shortlisted: ${title} (${company})`, points: 25, date: formatDate(app.appliedAt) });
    } else if (app.status === "interview") {
      ledger.push({ event: `Interview Invite: ${title} (${company})`, points: 60, date: formatDate(app.appliedAt) });
    } else if (app.status === "offer") {
      ledger.push({ event: `Job Offer Received: ${title} (${company})`, points: 150, date: formatDate(app.appliedAt) });
    } else if (app.status === "rejected") {
      ledger.push({ event: `Rejection/Stalled: ${title} (${company})`, points: -15, date: formatDate(app.appliedAt) });
    }
  });
  mockInterviews.forEach(mock => {
    ledger.push({ event: `Mock Interview: ${mock.jobTitle} (Score: ${mock.score}%)`, points: 40, date: formatDate(mock.date) });
  });

  // Sort ledger by date/time (reversed to show latest first)
  const sortedLedger = [...ledger].reverse();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground">Here&apos;s your career journey at a glance.</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-accent/5 to-primary/5 px-4 py-2 rounded-xl border">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dashboard ELO:</span>
          <span className="text-sm font-black text-slate-800">{totalElo} Rating</span>
          <Badge className="bg-accent text-white font-bold">{grade} Grade</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Applications" value={applications.length} icon={ClipboardList} description="Total submitted" />
        <StatCard title="Top Matches" value={matches.length} icon={Sparkles} description="Based on your profile" />
        <StatCard title="Open Jobs" value={jobs.length} icon={Briefcase} description="Available now" />
        <StatCard title="Profile" value={`${completion}%`} icon={FileText} description="Completion score" />
      </div>

      {/* ELO Reputation Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* ELO Dashboard card */}
        <Card className="md:col-span-2 border shadow-sm bg-gradient-to-br from-white via-white to-slate-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <div>
                <CardTitle className="text-base font-bold">Career ELO & Skill Reputation</CardTitle>
                <CardDescription className="text-[11px]">Dynamic progression vector calculated from active career achievements.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Elo visual */}
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Career Scorecard</span>
                <div className="flex items-baseline justify-center sm:justify-start gap-1">
                  <span className="text-4xl font-black text-slate-800 tracking-tight">{totalElo}</span>
                  <span className="text-xs text-slate-500 font-medium">Rating</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="text-xs text-slate-500">Reputation Grade:</span>
                  <Badge className="bg-accent/10 hover:bg-accent/10 text-accent font-black border-transparent text-xs py-0.5 px-2">
                    GRADE {grade}
                  </Badge>
                </div>
              </div>

              {/* Progress bar to next grade */}
              <div className="flex-1 w-full max-w-sm space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Current Tier</span>
                  <span>
                    {grade === "S" ? "Max Tier Reached" : `${totalElo} / ${nextThreshold} ELO for Grade ${getEloGrade(nextThreshold)}`}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <p className="text-[9.5px] text-slate-400 font-normal leading-normal">
                  *Accumulate points by completing mock interviews (+40), submitting job apps (+10), securing shortlisted updates (+25), and landing offers (+150).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ELO Ledger history */}
        <Card className="border shadow-sm flex flex-col h-[200px] md:h-auto max-h-[220px] bg-white">
          <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              Reputation Ledger
            </CardTitle>
            <Badge variant="outline" className="text-[9px] font-bold py-0.5">{ledger.length} events</Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1 divide-y divide-slate-100">
            {sortedLedger.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 text-xs">
                <div className="space-y-0.5 max-w-[70%]">
                  <p className="font-semibold text-slate-700 truncate text-[11px]">{item.event}</p>
                  <p className="text-[9px] text-slate-400 font-normal">{item.date}</p>
                </div>
                <span className={`font-black text-[11px] shrink-0 ${
                  item.points === 1000 
                    ? "text-slate-500" 
                    : item.points > 0 
                      ? "text-emerald-600" 
                      : "text-red-500"
                }`}>
                  {item.points === 1000 
                    ? "INIT" 
                    : item.points > 0 
                      ? `+${item.points}` 
                      : `${item.points}`}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
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
