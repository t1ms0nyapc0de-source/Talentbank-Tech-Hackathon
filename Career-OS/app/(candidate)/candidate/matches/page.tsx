"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/dashboard/stat-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useProfileStore } from "@/lib/stores/profile-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import { getJobMatches } from "@/lib/matching";
import { SmartMatching } from "@/components/dashboard/smart-matching";
import { Zap, Activity } from "lucide-react";

export default function MatchesPage() {
  const user = useAuthStore((s) => s.user)!;
  const resume = useProfileStore((s) => s.getResume(user.id));
  const getAllJobs = useApplicationStore((s) => s.getAllJobs);
  const matches = getJobMatches(resume, getAllJobs());
  
  const [matchMode, setMatchMode] = useState<"skills" | "trajectory">("trajectory");

  const getTrajectoryMetrics = (match: typeof matches[0]) => {
    // Simulate trajectory scores showcasing that high velocity compensates for current skill gaps
    const skillsScore = Math.max(match.score, 50);
    const trajectoryScore = Math.min(skillsScore + 28, 97);
    
    let predictedNextStep = "Senior Systems Engineer";
    if (match.job.title.toLowerCase().includes("product")) {
      predictedNextStep = "Director of Product Management";
    } else if (match.job.title.toLowerCase().includes("design") || match.job.title.toLowerCase().includes("frontend")) {
      predictedNextStep = "Principal UI Architect";
    } else if (match.job.title.toLowerCase().includes("data") || match.job.title.toLowerCase().includes("cloud")) {
      predictedNextStep = "Chief Cloud Operations Officer";
    }

    return {
      growthRate: Math.min(skillsScore + 18, 95),
      predictedNextStep,
      growthSignals: [
        `Acquired ${Math.floor(skillsScore / 15)} core modules and tools in past 12 months`,
        `Trajectory alignment maps directly with ${match.job.company}'s roadmap goals`,
        `Demonstrated technical pivots showing steep learning velocity curves`
      ],
      skillsMatchScore: skillsScore,
      trajectoryMatchScore: trajectoryScore
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Job Matching</h1>
          <p className="text-sm text-slate-500">
            Trajectory calibration matches you with jobs based on where your career is heading, not just where it has been.
          </p>
        </div>
        {/* Toggle Mode */}
        {resume.skills.length > 0 && matches.length > 0 && (
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setMatchMode("skills")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                matchMode === "skills"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              Skills Match
            </button>
            <button
              onClick={() => setMatchMode("trajectory")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                matchMode === "trajectory"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-teal-500 fill-teal-500" />
              Trajectory Match
            </button>
          </div>
        )}
      </div>

      {resume.skills.length === 0 ? (
        <EmptyState
          title="Add skills to see matches"
          description="Your job matches are powered by your profile. Add skills and experience to get personalized recommendations."
          action={
            <Button variant="accent" asChild>
              <Link href="/candidate/profile">Build Your Profile</Link>
            </Button>
          }
        />
      ) : matches.length === 0 ? (
        <EmptyState
          title="No matches found"
          description="We couldn't find matching jobs with your current profile. Try adding more skills or broadening your experience."
          action={
            <Button variant="outline" asChild>
              <Link href="/candidate/profile">Update Profile</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.job.id} className="border border-slate-200 overflow-hidden shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-primary">{match.job.title}</h3>
                        <Badge variant={matchMode === "trajectory" ? "success" : "accent"}>
                          {matchMode === "trajectory" 
                            ? `${getTrajectoryMetrics(match).trajectoryMatchScore}% trajectory match` 
                            : `${match.score}% skills match`
                          }
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{match.job.company} · {match.job.location}</p>
                    </div>

                    {matchMode === "skills" ? (
                      /* Standard Skills Match View */
                      <div className="space-y-4">
                        <div className="max-w-xs">
                          <Progress value={match.score} />
                        </div>
                        {(match.matchedSkills.length > 0 || match.matchedKeywords.length > 0) && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1.5">Why you matched</p>
                            <div className="flex flex-wrap gap-1.5">
                              {match.matchedSkills.map((s) => (
                                <Badge key={s} variant="success" className="text-[10px]">{s}</Badge>
                              ))}
                              {match.matchedKeywords.map((k) => (
                                <Badge key={k} variant="outline" className="text-[10px]">{k}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Smart Trajectory Match View */
                      <SmartMatching metrics={getTrajectoryMetrics(match)} />
                    )}
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-end">
                    <Button variant="outline" size="sm" asChild className="cursor-pointer">
                      <Link href={`/candidate/jobs/${match.job.id}`}>View Job</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
