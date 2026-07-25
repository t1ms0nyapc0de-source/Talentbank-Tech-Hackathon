"use client";

import React, { useState, useMemo } from "react";
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
import { useProfileStore } from "@/lib/stores/profile-store";
import { getProfileCompletion } from "@/lib/matching";
import { MBTI_ANIMALS } from "@/components/resume/mbti-quiz";
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
  Users,
  Sparkles,
  Search,
  X,
  CheckCircle2
} from "lucide-react";

interface AlumniCandidate {
  id: string;
  name: string;
  email: string;
  roleType: string;
  rejectionReason: "timing" | "salary" | "location" | "role_fit";
  timeline: string;
  location: string;
  expectedSalary: string;
}

export default function ApplicantsPage() {
  const user = useAuthStore((s) => s.user)!;
  const getEmployerApplications = useApplicationStore((s) => s.getEmployerApplications);
  const updateApplicationStatus = useApplicationStore((s) => s.updateApplicationStatus);
  const employerJobs = useApplicationStore((s) => s.employerJobs);
  const getAllApplications = () => useApplicationStore.getState().applications;

  const ownedJobs = [
    ...mockJobs.filter((j) => j.employerId === user.id),
    ...employerJobs.filter((j) => j.employerId === user.id),
  ];
  const applications = getEmployerApplications(user.id);

  // Tabs: "active" | "alumni"
  const [activeTab, setActiveTab] = useState<"active" | "alumni">("active");
  const [filterJob, setFilterJob] = useState<string>("all");

  // AI Screener filter states
  const [aiQuery, setAiQuery] = useState("");
  const [activeAiQuery, setActiveAiQuery] = useState("");

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
    return app.trajectoryMetrics || {
      growthRate: 85,
      predictedNextStep: "Senior Architect",
      growthSignals: ["Acquired 3 major skills in 6 months", "Strong progression velocity"],
      skillsMatchScore: 60,
      trajectoryMatchScore: 92
    };
  };

  const getEloGrade = (elo: number) => {
    if (elo >= 1800) return "S";
    if (elo >= 1600) return "A+";
    if (elo >= 1450) return "A";
    if (elo >= 1300) return "B+";
    if (elo >= 1200) return "B";
    if (elo >= 1100) return "C+";
    return "C";
  };

  // Filtering
  const activeApplicants = applications.filter(a => a.status !== "rejected");
  const alumniApplicants = applications.filter(a => a.status === "rejected" && a.alumniOptIn);

  // Apply basic and AI filter criteria
  const filtered = useMemo(() => {
    let list = activeTab === "active"
      ? (filterJob === "all" ? activeApplicants : activeApplicants.filter((a) => a.jobId === filterJob))
      : (filterJob === "all" ? alumniApplicants : alumniApplicants.filter((a) => a.jobId === filterJob));

    if (activeAiQuery.trim()) {
      const q = activeAiQuery.toLowerCase();
      
      const hasReact = q.includes("react");
      const hasPython = q.includes("python");
      const hasGo = q.includes("go") || q.includes("golang");
      const hasTypescript = q.includes("typescript") || q.includes("ts");
      const hasHighElo = q.includes("high elo") || q.includes("elo") || q.includes("grade") || q.includes("rating");
      const hasIntern = q.includes("intern") || q.includes("internship");

      list = list.filter(app => {
        const resume = useProfileStore.getState().getResume(app.candidateId);
        const skills = resume.skills.map(s => s.toLowerCase());

        let isMatch = true;

        if (hasReact && !skills.includes("react")) isMatch = false;
        if (hasPython && !skills.includes("python")) isMatch = false;
        if (hasGo && !skills.includes("go")) isMatch = false;
        if (hasTypescript && !skills.includes("typescript")) isMatch = false;
        
        if (hasHighElo) {
          const comp = getProfileCompletion(resume);
          const mockCount = (resume.mockInterviews || []).length;
          const userApps = getAllApplications().filter(a => a.candidateId === app.candidateId);
          const elo = 1000 + (comp * 2) + (userApps.length * 10) + (mockCount * 40);
          
          if (q.includes("grade b") && elo < 1200) isMatch = false;
          else if (q.includes("grade a") && elo < 1450) isMatch = false;
          else if (q.includes("grade s") && elo < 1800) isMatch = false;
          else if (elo < 1100) isMatch = false; // standard high elo (C+ or higher)
        }

        if (hasIntern) {
          const job = ownedJobs.find(j => j.id === app.jobId);
          if (job && job.type !== "internship") isMatch = false;
        }

        return isMatch;
      });
    }

    return list;
  }, [activeTab, filterJob, activeAiQuery, activeApplicants, alumniApplicants, ownedJobs]);

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

      {/* AI Candidate Screener Panel */}
      <Card className="border border-slate-200 bg-gradient-to-r from-accent/[0.04] via-white to-primary/[0.02] p-4 rounded-xl shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-accent/10 border border-accent/15">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">AI Talent Filter & Screener</h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">Filter lists instantly using natural skill requirements and Career ELO tiers.</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Type screening instruction, e.g. 'React developers with high ELO' or 'Python experts with Grade B'..."
                className="w-full pl-9 pr-8 py-2 rounded-md border border-slate-200 bg-white text-xs shadow-sm focus:outline-none focus:border-accent"
                onKeyDown={(e) => { if(e.key === 'Enter') setActiveAiQuery(aiQuery); }}
              />
              {aiQuery && (
                <button 
                  onClick={() => { setAiQuery(""); setActiveAiQuery(""); }} 
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button 
              onClick={() => setActiveAiQuery(aiQuery)} 
              variant="accent" 
              className="text-xs h-9 cursor-pointer"
            >
              Analyze & Filter
            </Button>
          </div>

          {activeAiQuery && (
            <div className="flex items-center justify-between bg-white border border-accent/20 px-3 py-1.5 rounded-lg text-[11px] text-slate-600 font-semibold shadow-inner">
              <span>Active AI screening filter: &ldquo;{activeAiQuery}&rdquo;</span>
              <button 
                onClick={() => { setAiQuery(""); setActiveAiQuery(""); }} 
                className="text-red-500 hover:text-red-700 underline text-[10px] cursor-pointer"
              >
                Clear AI Filter
              </button>
            </div>
          )}
        </div>
      </Card>

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

            // Fetch candidate's matching information dynamically
            const resume = useProfileStore.getState().getResume(app.candidateId);
            const completion = getProfileCompletion(resume);
            const candidateApps = getAllApplications().filter(a => a.candidateId === app.candidateId);
            const mockInterviews = resume.mockInterviews || [];
            
            const totalElo = 1000 + (completion * 2) + (candidateApps.length * 10) + (mockInterviews.length * 40);
            const grade = getEloGrade(totalElo);
            const aiRecScore = Math.min(98, 60 + Math.round((resume.skills.length * 4) + (totalElo - 1000) / 10));

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
                        <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 text-[9px] uppercase font-extrabold">
                          ELO {totalElo} ({grade})
                        </Badge>
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
                        <p className="mt-2 text-xs text-slate-600 italic border-l border-slate-200 pl-2.5 font-normal">
                          &ldquo;{app.note}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Actions and status selectors */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right shrink-0 mr-2 hidden sm:block">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider leading-none">AI Score</span>
                        <span className="text-md font-black text-slate-700">{aiRecScore}% Match</span>
                      </div>

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
                              rejectionReason: (app.rejectionReason as "timing" | "salary" | "location" | "role_fit") || "salary",
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

                  {/* AI Recommendation Rationale & Suggestions */}
                  <div className="mx-5 mb-5 p-3.5 bg-accent/5 border border-accent/10 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-accent">
                      <Sparkles className="h-4.5 w-4.5 text-accent animate-pulse" />
                      <span>AI Candidate Recommendation Rationale</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
                      <strong>Analysis: </strong> Candidate maintains a Career ELO of {totalElo} (Grade {grade}) with {mockInterviews.length} practice interview modules. 
                      {resume.mbti ? ` Their personality persona is ${MBTI_ANIMALS[resume.mbti]?.emoji} ${MBTI_ANIMALS[resume.mbti]?.animal} (${MBTI_ANIMALS[resume.mbti]?.title}), aligning strongly with strategic ${MBTI_ANIMALS[resume.mbti]?.strengths[0].toLowerCase()} roles.` : ""} 
                      Matched {resume.skills.filter(s => job?.tags.includes(s)).length} profile skills with listing tags.
                    </p>
                    <div className="bg-white p-2 rounded border border-accent/15 flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>
                        {app.status === "applied" && "AI Suggestion: Candidate has high ELO progression. Advance to under review and schedule phone screening."}
                        {app.status === "under_review" && "AI Suggestion: Strong alignment with modern stack. Schedule technical panel."}
                        {app.status === "interview" && "AI Suggestion: Highlight system design capabilities in interview feedback loops."}
                        {app.status === "offer" && "AI Suggestion: Roll out compensation contract based on requested target bracket."}
                        {app.status === "rejected" && `AI Re-Engagement Suggestion: Candidate is active for ${app.alumniPreferences?.roleType || "similar role"}. Reach out once headcount opens.`}
                      </span>
                    </div>
                  </div>

                  {/* Inline Rejection Reason Selector */}
                  {showReasonSelect === app.id && (
                    <div className="p-4 bg-red-50/50 border-t border-red-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-red-800">Assign Trajectory Stalling Reason</span>
                        <p className="text-slate-500 text-[10px] font-normal">Select why this trajectory is being paused to configure re-engagement triggers.</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleRejectionSubmit(app.id, "salary")}>Salary Mismatch</Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectionSubmit(app.id, "timing")}>Timing Mismatch</Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectionSubmit(app.id, "location")}>Location Mismatch</Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectionSubmit(app.id, "role_fit")}>Skill Delta (Fit)</Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowReasonSelect(null)}>Cancel</Button>
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
                          <span className="text-teal-700 font-extrabold flex items-center gap-1 font-mono">
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
