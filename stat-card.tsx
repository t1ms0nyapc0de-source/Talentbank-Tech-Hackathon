"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { ResumeBuilder } from "@/components/resume/resume-builder";
import { Progress } from "@/components/ui/progress";
import { getProfileCompletion } from "@/lib/matching";
import { useProfileStore } from "@/lib/stores/profile-store";
import { MBTIQuiz, MBTI_ANIMALS } from "@/components/resume/mbti-quiz";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, HelpCircle, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)!;
  const resume = useProfileStore((s) => s.getResume(user.id));
  const updateResume = useProfileStore((s) => s.updateResume);
  const completion = getProfileCompletion(resume);

  const mbtiType = resume.mbti;
  const animalInfo = mbtiType ? MBTI_ANIMALS[mbtiType] : null;

  const handleSaveMBTI = (mbti: string) => {
    updateResume(user.id, { mbti });
  };

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

      {/* MBTI SECTION */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              <div>
                <CardTitle className="text-lg">MBTI Personality Profile</CardTitle>
                <CardDescription className="text-xs">Understand your work style and career tendencies</CardDescription>
              </div>
            </div>
            {mbtiType && (
              <MBTIQuiz 
                onSave={handleSaveMBTI}
                trigger={
                  <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                    Retake Quiz
                  </Button>
                }
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!mbtiType ? (
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Brain className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Discover Your Career Personality & Animal Guide</h4>
                <p className="text-xs text-muted-foreground max-w-md font-normal leading-relaxed">
                  Take the CareerOS MBTI quiz to discover your learning styles, professional strengths, and get personalized job recommendations based on your persona.
                </p>
              </div>
              <MBTIQuiz onSave={handleSaveMBTI} />
            </div>
          ) : (
            animalInfo && (
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-2">
                <div className={`p-5 rounded-2xl bg-gradient-to-br ${animalInfo.color.split(" bg-")[0]} text-white text-5xl shadow-md flex items-center justify-center h-20 w-20 shrink-0`}>
                  {animalInfo.emoji}
                </div>
                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div>
                    <div className="flex flex-col md:flex-row items-center gap-2 justify-center md:justify-start">
                      <h4 className="font-bold text-lg text-slate-800">
                        {animalInfo.animal} — {animalInfo.title}
                      </h4>
                      <Badge className="bg-accent/10 text-accent hover:bg-accent/10 border-transparent text-xs font-semibold">
                        {mbtiType}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed max-w-2xl">
                      {animalInfo.description}
                    </p>
                  </div>
                  
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Strengths:</span>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {animalInfo.strengths.map((str, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs py-1 px-2.5 font-medium">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                          {str}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>

      <ResumeBuilder userId={user.id} userName={user.name} />
    </div>
  );
}
