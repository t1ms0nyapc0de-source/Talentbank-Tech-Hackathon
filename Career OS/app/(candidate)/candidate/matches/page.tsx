"use client";

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

export default function MatchesPage() {
  const user = useAuthStore((s) => s.user)!;
  const resume = useProfileStore((s) => s.getResume(user.id));
  const getAllJobs = useApplicationStore((s) => s.getAllJobs);
  const matches = getJobMatches(resume, getAllJobs());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Matching</h1>
        <p className="text-muted-foreground">
          Personalized match scores based on your skills, experience, and career profile.
        </p>
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
            <Card key={match.job.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{match.job.title}</h3>
                      <Badge variant="accent">{match.score}% match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{match.job.company} · {match.job.location}</p>
                    <div className="mt-3 max-w-xs">
                      <Progress value={match.score} />
                    </div>
                    {(match.matchedSkills.length > 0 || match.matchedKeywords.length > 0) && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Why you matched</p>
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
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/candidate/jobs/${match.job.id}`}>View Job</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
