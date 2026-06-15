"use client";

import React, { useState } from "react";
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
import type { ApplicationStatus, Application } from "@/lib/types";
import { APPLICATION_STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { SmartMatching } from "@/components/dashboard/smart-matching";
import { AlumniNudgeModal } from "@/components/dashboard/alumni-nudge-modal";
import { 
  Zap, 
  Compass, 
  Activity, 
  Clock, 
  DollarSign, 
  MapPin, 
  Users
} from "lucide-react";

interface AlumniCandidate {
  id: string;
  name: string;
  email: string;
  roleType: string;
  rejectionReason: string;
  timeline: string;
  location: string;
  expectedSalary: string;
}

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

  // Tabs: "active" | "alumni"
  const [activeTab, setActiveTab] = useState<"active" | "alumni">("active");
  const [filterJob, setFilterJob] = useState<string>("all");

  // Rejection reason popover selector for application IDs
  const [showReasonSelect, setShowReasonSelect] = useState<string | null>(null);

  // Re-engagement modal state
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniCandidate | null>(null);
  const [isNudgeOpen, setIsNudgeOpen] = useState<boolean>(false);

  // Trajectory view toggles per application ID
  const [expandedTrajectories, setExpandedTrajectories] = useState<Record<string, boolean>>({});

  const toggleTrajectory = (appId: string) => {
    setExpandedTrajectories(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    if (status === "rejected") {
      // Trigger reason tagging step
      setShowReasonSelect(id);
    } else {
      updateApplicationStatus(id, status);
      toast.success(`Status updated to ${APPLICATION_STATUS_LABELS[status]}`);
    }
  };

  const handleRejectionSubmit = (id: string, reason: "timing" | "salary" | "location" | "role_fit") => {
    updateApplicationStatus(id, "rejected", reason);
    setShowReasonSelect(null);
    toast.success(`Candidate trajectory rejected. Tagged reason: ${reason.toUpperCase()}`);
  };

  const handleSendNudge = (candidateId: string) => {
    toast.success("Talent re-engagement outreach sent successfully. Touchpoint logged!");
  };

  const getReengagementTrigger = (app: Application) => {
    switch (app.rejectionReason) {
      case "salary":
        return {
          title: "Budget Band Realignment",
          description: "Matched: Expected salary within standard range.",
          type: "success"
        };
      case "timing":
        return {
          title: "Cooling Period Expired",
          description: "3 months have passed since original application.",
          type: "warning"
        };
      case "location":
        return {
          title: "Remote Policy Shift",
          description: "Candidate is active for remote positions.",
          type: "info"
        };
      case "role_fit":
        return {
          title: "Trajectory Shift Alert",
          description: "Candidate has added new credentials since original review.",
          type: "success"
        };
      default:
        return {
          title: "Milestone Reconnect",
          description: "Keep contact warm with value-first company briefs.",
          type: "secondary"
        };
    }
  };

  const getTrajectoryData = (app: Application) => {
    // Generate or fetch trajectory details
    return app.trajectoryMetrics || {
      growthRate: 85,
      predictedNextStep: "Senior Architect",
      growthSignals: ["Acquired 3 major skills in 6 months", "Strong progression velocity"],
      skillsMatchScore: 60,
      trajectoryMatchScore: 92
    };
  };

  // Filtering
  const activeApplicants = applications.filter(a => a.status !== "rejected");
  const alumniApplicants = applications.filter(a => a.status === "rejected" && a.alumniOptIn);

  const filtered = activeTab === "active"
    ? (filterJob === "all" ? activeApplicants : activeApplicants.filter((a) => a.jobId === filterJob))
    : (filterJob === "all" ? alumniApplicants : alumniApplicants.filter((a) => a.jobId === filterJob));

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
          <h1 className="text-2xl font-bold tracking-tight text-primary">Applicants</h1>
          <p className="text-sm text-slate-500">
            Assess raw skills and steep trajectories, and keep outstanding alumni pipelines warm.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {ownedJobs.length > 0 && (
            <Select value={filterJob} onValueChange={setFilterJob}>
              <SelectTrigger className="w-52 h-9 text-xs bg-white">
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

          {/* Navigation Tabs */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 h-9 items-center">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "active"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Activity className="h-3 w-3" />
              Active Candidates ({activeApplicants.length})
            </button>
            <button
              onClick={() => setActiveTab("alumni")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "alumni"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="h-3 w-3" />
              Talent Alumni ({alumniApplicants.length})
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={activeTab === "active" ? "No active applicants" : "No alumni connections yet"}
          description={
            activeTab === "active"
              ? "No active candidates are currently matching this query."
              : "Candidates will appear here after they opt-in from their rejections page."
          }
          action={
            <Button variant="accent" asChild className="cursor-pointer">
              <Link href="/employer/jobs">Manage Jobs</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const job = ownedJobs.find((j) => j.id === app.jobId);
            const isTrajectoryExpanded = expandedTrajectories[app.id];
            const trajectoryData = getTrajectoryData(app);
            const triggerInfo = getReengagementTrigger(app);

            return (
              <Card key={app.id} className="border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all bg-white">
                <CardContent className="p-0">
                  {/* Basic Row */}
                  <div className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-primary">{app.candidateName}</h3>
                        <Badge variant={statusVariant(app.status)}>
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </Badge>
                        {app.alumniOptIn && (
                          <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700 text-[9px] uppercase font-bold tracking-wide">Alumni Opt-In</Badge>
                        )}
                        {trajectoryData.trajectoryMatchScore > 85 && (
                          <Badge className="bg-teal-500 text-white border-transparent text-[9px] uppercase tracking-wide font-bold">
                            High Velocity Vector
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {app.candidateEmail} · Applied to <span className="font-semibold">{job?.title}</span> on {formatDate(app.appliedAt)}
                      </p>
                      {app.note && (
                        <p className="mt-2 text-xs text-slate-600 italic border-l border-slate-200 pl-2.5">
                          &ldquo;{app.note}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Actions and status selectors */}
                    <div className="flex flex-wrap items-center gap-3">
                      {activeTab === "active" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleTrajectory(app.id)}
                          className="text-xs h-9 cursor-pointer"
                        >
                          <Zap className="h-3.5 w-3.5 mr-1 text-teal-600" />
                          {isTrajectoryExpanded ? "Hide Trajectory" : "Analyze Trajectory"}
                        </Button>
                      )}

                      {activeTab === "active" ? (
                        <Select
                          value={app.status}
                          onValueChange={(v) => handleStatusChange(app.id, v as ApplicationStatus)}
                        >
                          <SelectTrigger className="w-40 h-9 text-xs bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        /* Alumni Action Outreach */
                        <Button
                          variant="accent"
                          size="sm"
                          className="text-xs h-9 cursor-pointer flex items-center gap-1.5 shadow-sm"
                          onClick={() => {
                            setSelectedAlumni({
                              id: app.id,
                              name: app.candidateName,
                              email: app.candidateEmail,
                              roleType: app.alumniPreferences?.roleType || job?.title || "Engineer",
                              rejectionReason: app.rejectionReason || "salary",
                              timeline: app.alumniPreferences?.timeline || "Ready in 3 months",
                              location: app.alumniPreferences?.location || "Remote",
                              expectedSalary: app.alumniPreferences?.expectedSalary || "$120,000"
                            });
                            setIsNudgeOpen(true);
                          }}
                        >
                          <Compass className="h-3.5 w-3.5 fill-white" />
                          Re-Engage Candidate
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Inline Rejection Reason Selector */}
                  {showReasonSelect === app.id && (
                    <div className="p-4 bg-red-50/50 border-t border-red-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-red-800">Assign Trajectory Stalling Reason</span>
                        <p className="text-slate-500 text-[10px]">Select why this trajectory is being paused to configure re-engagement triggers.</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="xs" variant="outline" onClick={() => handleRejectionSubmit(app.id, "salary")}>Salary Mismatch</Button>
                        <Button size="xs" variant="outline" onClick={() => handleRejectionSubmit(app.id, "timing")}>Timing Mismatch</Button>
                        <Button size="xs" variant="outline" onClick={() => handleRejectionSubmit(app.id, "location")}>Location Mismatch</Button>
                        <Button size="xs" variant="outline" onClick={() => handleRejectionSubmit(app.id, "role_fit")}>Skill Delta (Fit)</Button>
                        <Button size="xs" variant="ghost" onClick={() => setShowReasonSelect(null)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {/* Trajectory Detailed Panel */}
                  {activeTab === "active" && isTrajectoryExpanded && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                      <SmartMatching metrics={trajectoryData} />
                    </div>
                  )}

                  {/* Alumni Re-Engagement triggers display */}
                  {activeTab === "alumni" && (
                    <div className="p-4 bg-teal-500/[0.02] border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs flex-1">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Target Role</span>
                          <span className="text-slate-700 font-semibold">{app.alumniPreferences?.roleType}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Timeline</span>
                          <span className="text-slate-700 font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3 text-accent" />
                            {app.alumniPreferences?.timeline}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Location</span>
                          <span className="text-slate-700 font-semibold flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-accent" />
                            {app.alumniPreferences?.location}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Min Target Salary</span>
                          <span className="text-teal-700 font-extrabold flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-teal-600" />
                            {app.alumniPreferences?.expectedSalary}
                          </span>
                        </div>
                      </div>

                      {/* Trigger Alert Badges */}
                      <div className="shrink-0 flex flex-col justify-center items-end bg-white border border-teal-500/10 p-2.5 rounded-lg max-w-xs shadow-sm">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-teal-800">
                          <span className="relative flex h-1.5 w-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-600"></span>
                          </span>
                          <span>{triggerInfo.title}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-0.5 text-right font-medium">
                          {triggerInfo.description}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Trigger Re-Engagement Modal */}
      <AlumniNudgeModal
        isOpen={isNudgeOpen}
        onClose={() => {
          setIsNudgeOpen(false);
          setSelectedAlumni(null);
        }}
        candidate={selectedAlumni}
        onSend={handleSendNudge}
      />
    </div>
  );
}
