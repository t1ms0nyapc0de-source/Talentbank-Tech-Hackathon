"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/stat-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Zap, 
  Sparkles, 
  MailCheck, 
  MapPin, 
  Clock, 
  DollarSign 
} from "lucide-react";

export default function ApplicationsPage() {
  const user = useAuthStore((s) => s.user)!;
  const getCandidateApplications = useApplicationStore((s) => s.getCandidateApplications);
  const optInAlumni = useApplicationStore((s) => s.optInAlumni);
  const getAllJobs = useApplicationStore((s) => s.getAllJobs);

  const applications = getCandidateApplications(user.id);
  const jobs = getAllJobs();

  // Form state per application ID
  const [formData, setFormData] = useState<Record<string, {
    roleType: string;
    timeline: string;
    location: string;
    expectedSalary: string;
  }>>({});

  const handleFormChange = (appId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [appId]: {
        ...((prev[appId]) || {
          roleType: "Full-time Software Engineer",
          timeline: "Ready in 3 months",
          location: "Remote",
          expectedSalary: "$120,000"
        }),
        [field]: value
      }
    }));
  };

  const handleOptInSubmit = (appId: string, companyName: string) => {
    const preferences = formData[appId] || {
      roleType: "Full-time Software Engineer",
      timeline: "Ready in 3 months",
      location: "Remote",
      expectedSalary: "$120,000"
    };

    optInAlumni(appId, preferences);
    toast.success(`Welcome to the ${companyName} Talent Alumni Network! Your trajectory is locked.`);
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">My Applications</h1>
        <p className="text-sm text-slate-500">
          Track your application timelines and navigate your re-engagement pipelines.
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
        <div className="space-y-4">
          {applications.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            const companyName = job?.company || "Employer";
            const appForm = formData[app.id] || {
              roleType: job?.title || "Full-time Software Engineer",
              timeline: "Ready in 3 months",
              location: "Remote",
              expectedSalary: "$120,000"
            };

            return (
              <Card key={app.id} className="border border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  {/* Top application card */}
                  <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 bg-white">
                    <div>
                      <h3 className="font-semibold text-primary">{job?.title ?? "Unknown Position"}</h3>
                      <p className="text-xs text-slate-500">
                        {companyName} · Applied {formatDate(app.appliedAt)}
                      </p>
                      {app.note && (
                        <p className="mt-2 text-xs text-slate-600 italic border-l border-slate-200 pl-2">
                          &ldquo;{app.note}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusVariant(app.status)}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </Badge>
                      {job && (
                        <Button variant="outline" size="sm" asChild className="cursor-pointer text-xs">
                          <Link href={`/candidate/jobs/${job.id}`}>View Job</Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Rejected: Alumni Re-Engagement Panel */}
                  {app.status === "rejected" && (
                    <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border-t border-slate-100">
                      {!app.alumniOptIn ? (
                        /* Opt-In Form */
                        <div className="space-y-4">
                          <div className="flex items-start gap-2">
                            <div className="p-1 rounded bg-teal-50 border border-teal-100 mt-0.5">
                              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-700">
                                Keep Your Trajectory Connected with {companyName}
                              </h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                We didn&apos;t align for this specific role, but we want to stay warm for future openings. Join our candidate-controlled Talent Alumni System to automatically trigger re-engagement when roles or bands change.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                Desired Role Type
                              </label>
                              <input
                                type="text"
                                value={appForm.roleType}
                                onChange={(e) => handleFormChange(app.id, "roleType", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                Re-Entry Timeline
                              </label>
                              <select
                                value={appForm.timeline}
                                onChange={(e) => handleFormChange(app.id, "timeline", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
                              >
                                <option>Immediate</option>
                                <option>Ready in 3 months</option>
                                <option>Ready in 6 months</option>
                                <option>Passive monitoring</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                Location Preference
                              </label>
                              <input
                                type="text"
                                value={appForm.location}
                                onChange={(e) => handleFormChange(app.id, "location", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                Expected Salary Band
                              </label>
                              <input
                                type="text"
                                value={appForm.expectedSalary}
                                onChange={(e) => handleFormChange(app.id, "expectedSalary", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-1">
                            <Button 
                              variant="accent" 
                              size="sm"
                              onClick={() => handleOptInSubmit(app.id, companyName)}
                              className="text-xs py-1.5 px-4 cursor-pointer flex items-center gap-1.5"
                            >
                              <Zap className="h-3.5 w-3.5 fill-white" />
                              Opt-In to Talent Alumni Network
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* Already Opted In state */
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                            <MailCheck className="h-4 w-4 text-teal-600 shrink-0" />
                            <span>Connected to the {companyName} Talent Alumni Network</span>
                            <Badge variant="success" className="text-[9px] py-0 px-2 uppercase font-semibold">Warm Lead Status</Badge>
                          </div>
                          
                          <p className="text-[11px] text-slate-500">
                            Your profile is active in {companyName}&apos;s passive tracking pipeline. The system will automatically trigger a relationship outreach notice if their headcount limits, salary caps, or location parameters adjust to match your locked vectors:
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white/70 p-3 rounded-lg border border-slate-100 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                              <span>{app.alumniPreferences?.roleType}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Clock className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                              <span>{app.alumniPreferences?.timeline}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                              <span>{app.alumniPreferences?.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 font-bold text-teal-700">
                              <DollarSign className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                              <span>{app.alumniPreferences?.expectedSalary}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
