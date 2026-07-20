"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { ResumeBuilder } from "@/components/resume/resume-builder";
import { Progress } from "@/components/ui/progress";
import { getProfileCompletion } from "@/lib/matching";
import { useProfileStore } from "@/lib/stores/profile-store";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)!;
  const resume = useProfileStore((s) => s.getResume(user.id));
  const completion = getProfileCompletion(resume);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile & Resume Builder</h1>
          <p className="text-muted-foreground">
            Build your profile and preview your resume in real time.
          </p>
        </div>
        <div className="flex items-center gap-3 min-w-[200px]">
          <Progress value={completion} className="flex-1" />
          <span className="text-sm font-medium whitespace-nowrap">{completion}%</span>
        </div>
      </div>
      <ResumeBuilder userId={user.id} userName={user.name} />
    </div>
  );
}
