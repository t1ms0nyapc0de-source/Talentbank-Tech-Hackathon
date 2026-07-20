"use client";

import React, { useState, useMemo } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useProfileStore } from "@/lib/stores/profile-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  Brain, 
  Sparkles, 
  Send, 
  Play, 
  CheckCircle2, 
  FileSearch,
  MessageSquare,
  BookmarkPlus,
  Briefcase,
  AlertTriangle,
  Flame,
  ArrowRight
} from "lucide-react";
import { MBTI_ANIMALS } from "@/components/resume/mbti-quiz";
import Link from "next/link";
import { toast } from "sonner";

interface Message {
  sender: "bot" | "user";
  text: string;
  feedback?: string;
  score?: number;
}

export default function AIAssistantPage() {
  const user = useAuthStore((s) => s.user)!;
  const resume = useProfileStore((s) => s.getResume(user.id));
  const updateResume = useProfileStore((s) => s.updateResume);
  const getAllJobs = useApplicationStore((s) => s.getAllJobs);
  const jobs = getAllJobs();

  // --- JOB ANALYZER STATE ---
  const [selectedJobId, setSelectedJobId] = useState<string>("custom");
  const [customJobDesc, setCustomJobDesc] = useState<string>("");
  const [analyzerResults, setAnalyzerResults] = useState<{
    score: number;
    matched: string[];
    missing: string[];
    rationale: string;
    suggestions: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- MOCK INTERVIEW STATE ---
  const [interviewJobId, setInterviewJobId] = useState<string>("");
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewStep, setInterviewStep] = useState(0); // 0: not started, 1: Q1, 2: Q2, 3: Q3, 4: Finished
  const [interviewMessages, setInterviewMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  // --- MBTI MATCH STATE ---
  const mbti = resume.mbti;
  const animal = mbti ? MBTI_ANIMALS[mbti] : null;

  // --- JOB ANALYZER ACTION ---
  const handleAnalyze = () => {
    let desc = "";
    let title = "Custom Role";
    let requiredSkills: string[] = ["React", "TypeScript", "Node.js", "Git", "REST APIs"];

    if (selectedJobId !== "custom") {
      const selectedJob = jobs.find(j => j.id === selectedJobId);
      if (selectedJob) {
        desc = selectedJob.description + "\nRequirements:\n" + selectedJob.requirements.join("\n");
        title = selectedJob.title;
        requiredSkills = selectedJob.tags;
      }
    } else {
      desc = customJobDesc;
      // Extract keywords from desc as custom skills
      const detected = ["React", "TypeScript", "Python", "SQL", "Java", "Docker", "Figma", "AWS"]
        .filter(s => desc.toLowerCase().includes(s.toLowerCase()));
      if (detected.length > 0) requiredSkills = detected;
    }

    if (!desc.trim()) {
      toast.error("Please enter a job description or select an existing job.");
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      // Calculate intersection
      const candidateSkills = resume.skills.map(s => s.toLowerCase());
      const matched = requiredSkills.filter(s => candidateSkills.includes(s.toLowerCase()));
      const missing = requiredSkills.filter(s => !candidateSkills.includes(s.toLowerCase()));
      
      const score = requiredSkills.length > 0 
        ? Math.round((matched.length / requiredSkills.length) * 100) 
        : 60;

      const suggestions = [
        `Under your resume summary, add a short sentence highlighting experience with: ${missing.slice(0, 2).join(", ")}.`,
        `Add project experience detailing how you applied ${matched[0] || "core technical capabilities"} to solve real-world problems.`,
        missing.includes("TypeScript") ? "Consider earning a certification or completing a showcase project in TypeScript to bridge this gap." : "Create a portfolio section featuring complete implementations of your stack."
      ];

      setAnalyzerResults({
        score,
        matched,
        missing,
        rationale: `Based on your resume, you possess strong alignment in ${matched.slice(0, 3).join(", ") || "fundamental engineering skills"}. However, to stand out for this ${title} role, we recommend tailoring your experience sections to emphasize ${missing.slice(0, 2).join(", ") || "modern industry standard practices"}.`,
        suggestions
      });
      setIsAnalyzing(false);
      toast.success("AI Analysis Completed!");
    }, 1000);
  };

  // --- MOCK INTERVIEW ACTIONS ---
  const startInterview = () => {
    if (!interviewJobId) {
      toast.error("Please select a role to practice interviewing for.");
      return;
    }
    const targetJob = jobs.find(j => j.id === interviewJobId);
    const jobTitle = targetJob ? targetJob.title : "Software Engineer";

    setInterviewActive(true);
    setInterviewStep(1);
    setIsBotTyping(true);

    setTimeout(() => {
      setInterviewMessages([
        {
          sender: "bot",
          text: `Hello ${user.name.split(" ")[0]}! Welcome to your mock interview for the ${jobTitle} role. I will ask you 3 questions and grade your answers. Let's begin!\n\nQuestion 1: Can you describe a challenging technical project you worked on recently? What went well and how did you solve any obstacles?`
        }
      ]);
      setIsBotTyping(false);
    }, 800);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userText = currentInput;
    setInterviewMessages(prev => [...prev, { sender: "user", text: userText }]);
    setCurrentInput("");
    setIsBotTyping(true);

    setTimeout(() => {
      const currentStep = interviewStep;
      let score = Math.round(75 + Math.random() * 20); // 75 - 95
      let feedback = "";
      let nextQuestion = "";

      if (currentStep === 1) {
        feedback = "Excellent technical detail! You did a great job explaining the problem. Tip: Use the STAR method (Situation, Task, Action, Result) to more clearly quantify your business or system outcomes.";
        nextQuestion = "Question 2: How do you handle team disagreements or conflicting technical opinions during a planning phase?";
        setInterviewStep(2);
        setInterviewMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: nextQuestion,
            score,
            feedback
          }
        ]);
      } else if (currentStep === 2) {
        feedback = "Very mature answer. Emphasizing data-driven discussions and constructive compromise is excellent leadership modeling.";
        nextQuestion = "Question 3: Finally, why are you interested in this position, and how do your technical skills fit our company's mission?";
        setInterviewStep(3);
        setInterviewMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: nextQuestion,
            score,
            feedback
          }
        ]);
      } else if (currentStep === 3) {
        feedback = "Clear alignment! Showing familiarity with the role requirements and matching them to your project history makes you a compelling candidate.";
        
        // Finalize interview
        const prevScores = interviewMessages.map(m => m.score).filter((s): s is number => typeof s === "number");
        const finalScore = Math.round((prevScores.reduce((a, b) => a + b, 0) + score) / 3);
        
        setOverallScore(finalScore);
        setInterviewStep(4);

        // Save to Profile Store (persisted resume)
        const updatedInterviews = resume.mockInterviews || [];
        const selectedJob = jobs.find(j => j.id === interviewJobId);
        const jobTitle = selectedJob ? selectedJob.title : "Software Engineer";
        
        updateResume(user.id, {
          mockInterviews: [
            ...updatedInterviews,
            {
              jobTitle,
              score: finalScore,
              date: new Date().toISOString().split("T")[0]
            }
          ]
        });

        setInterviewMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: `Wonderful job! We have completed the mock interview. Your overall interview preparation rating is ${finalScore}/100. This milestone has been successfully saved to your CareerOS profile!`,
            score,
            feedback
          }
        ]);
        
        toast.success(`Mock Interview Finished! Score: ${finalScore}. ELO points earned!`);
      }

      setIsBotTyping(false);
    }, 1200);
  };

  // --- MBTI CAREER RECOMMENDATIONS ---
  const mbtiCareers = useMemo(() => {
    if (!mbti) return [];
    switch (mbti) {
      case "INTJ": return ["Systems Architect", "Machine Learning Researcher", "Strategic Consultant", "Backend Engineer"];
      case "INTP": return ["Research Scientist", "Full Stack Developer", "Security Analyst", "Data Analyst"];
      case "ENTJ": return ["Product Manager", "Tech Founder / CEO", "Engineering Director", "Solutions Architect"];
      case "ENTP": return ["Innovation Lead", "Product Designer", "Developer Advocate", "Growth Hacker"];
      case "INFJ": return ["User Experience Researcher", "Academic Advisor", "HR Strategy Director", "Ethics Officer"];
      case "INFP": return ["Technical Writer", "UI Designer", "Instructional Designer", "Creative Consultant"];
      case "ENFJ": return ["Agile Coach", "Customer Success Lead", "Talent Acquisition Manager", "Scrum Master"];
      case "ENFP": return ["Frontend Developer", "Product Evangelist", "Creative Director", "Growth Marketing Lead"];
      case "ISTJ": return ["Project Manager", "QA Engineer", "Database Administrator", "Financial Systems Analyst"];
      case "ISFJ": return ["IT Support Lead", "Operations Coordinator", "Technical Support Specialist", "System Admin"];
      case "ESTJ": return ["DevOps Manager", "Operations Manager", "Business Analyst", "Network Administrator"];
      case "ESFJ": return ["HR Coordinator", "Event Planner", "Office Manager", "Client Relations Manager"];
      case "ISTP": return ["Embedded Systems Engineer", "Hardware Specialist", "Security Tester", "Systems Engineer"];
      case "ISFP": return ["Graphic Designer", "Web Designer", "Video Editor", "UX/UI Prototyper"];
      case "ESTP": return ["Technical Sales Executive", "Field Support Engineer", "Operations Specialist", "Product Specialist"];
      case "ESFP": return ["Client Lead", "Public Relations Specialist", "Community Host", "Training Coordinator"];
      default: return [];
    }
  }, [mbti]);

  // Filter actual jobs in system matching their resume skills + MBTI careers
  const suggestedJobsList = useMemo(() => {
    if (!mbti) return [];
    
    return jobs.map(job => {
      let score = 50;
      const candidateSkills = resume.skills.map(s => s.toLowerCase());
      const jobTags = job.tags.map(t => t.toLowerCase());
      
      // Match skills
      const matched = jobTags.filter(t => candidateSkills.includes(t));
      score += matched.length * 10;

      // Match MBTI suggested roles
      const isRoleMatch = mbtiCareers.some(role => 
        job.title.toLowerCase().includes(role.toLowerCase()) || 
        role.toLowerCase().includes(job.title.toLowerCase())
      );
      if (isRoleMatch) score += 20;

      if (score > 100) score = 98;
      
      return {
        job,
        score,
        matched
      };
    }).sort((a, b) => b.score - a.score).slice(0, 3);
  }, [jobs, resume.skills, mbti, mbtiCareers]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Bot className="h-6 w-6 text-accent" />
          AI Career Assistant
        </h1>
        <p className="text-sm text-slate-500">
          Analyze job postings, conduct structured mock interviews, and receive persona-informed career suggestions.
        </p>
      </div>

      <Tabs defaultValue="analyzer" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-lg">
          <TabsTrigger value="analyzer" className="flex items-center gap-1">
            <FileSearch className="h-4 w-4" />
            Job Analyzer
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Mock Interview
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Job Suggester
          </TabsTrigger>
        </TabsList>

        {/* --- TABS CONTENT: JOB ANALYZER --- */}
        <TabsContent value="analyzer" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Input card */}
            <Card className="md:col-span-2 bg-white">
              <CardHeader>
                <CardTitle className="text-md">Job Description Analyzer</CardTitle>
                <CardDescription>Analyze your resume alignment against any specific job requirements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 block">Select Position to Prefill:</span>
                  <select 
                    value={selectedJobId} 
                    onChange={(e) => {
                      setSelectedJobId(e.target.value);
                      if (e.target.value !== "custom") {
                        const job = jobs.find(j => j.id === e.target.value);
                        if (job) {
                          setCustomJobDesc(job.description + "\n\nRequirements:\n- " + job.requirements.join("\n- "));
                        }
                      } else {
                        setCustomJobDesc("");
                      }
                    }}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none"
                  >
                    <option value="custom">-- Paste Custom Job Description --</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.company} - {j.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 block">Job Description & Requirements:</span>
                  <Textarea
                    value={customJobDesc}
                    onChange={(e) => setCustomJobDesc(e.target.value)}
                    placeholder="Paste the full job posting, duties, and qualifications here..."
                    rows={10}
                    className="text-xs font-mono"
                  />
                </div>

                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing} 
                  className="w-full cursor-pointer"
                  variant="accent"
                >
                  {isAnalyzing ? "Analyzing Resume Vector..." : "Run AI Resume Analysis"}
                </Button>
              </CardContent>
            </Card>

            {/* Results Sidebar */}
            <Card className="bg-gradient-to-b from-white to-slate-50 border">
              <CardHeader>
                <CardTitle className="text-sm">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!analyzerResults ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400 space-y-2">
                    <FileSearch className="h-8 w-8 text-slate-300 animate-pulse" />
                    <p className="text-xs leading-normal">Submit a job description to see your AI matching vector, keyword alignment, and formatting recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Match Score */}
                    <div className="text-center space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Match Score</span>
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle cx="40" cy="40" r="34" className="stroke-slate-200 fill-none" strokeWidth="6" />
                          <circle cx="40" cy="40" r="34" className="stroke-accent fill-none transition-all" strokeWidth="6" strokeDasharray={213} strokeDashoffset={213 - (213 * analyzerResults.score) / 100} />
                        </svg>
                        <span className="absolute text-lg font-black text-slate-800">{analyzerResults.score}%</span>
                      </div>
                    </div>

                    {/* Rationale */}
                    <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs leading-relaxed text-slate-600 font-normal">
                      <span className="font-bold text-slate-800 block mb-1">Alignment Summary</span>
                      {analyzerResults.rationale}
                    </div>

                    {/* Skill chips */}
                    <div className="space-y-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Matched Keywords ({analyzerResults.matched.length})</span>
                        <div className="flex flex-wrap gap-1">
                          {analyzerResults.matched.length === 0 ? <span className="text-xs text-slate-400">None</span> :
                            analyzerResults.matched.map(s => (
                              <Badge key={s} className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-[10px]">{s}</Badge>
                            ))
                          }
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Missing Requirements ({analyzerResults.missing.length})</span>
                        <div className="flex flex-wrap gap-1">
                          {analyzerResults.missing.length === 0 ? <span className="text-xs text-slate-400">None</span> :
                            analyzerResults.missing.map(s => (
                              <Badge key={s} className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 text-[10px]">{s}</Badge>
                            ))
                          }
                        </div>
                      </div>
                    </div>

                    {/* Actions list */}
                    <div className="space-y-2 border-t pt-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Suggested Fixes:</span>
                      <ul className="space-y-2 text-[11px] text-slate-600 leading-normal font-normal">
                        {analyzerResults.suggestions.map((s, idx) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="h-4 w-4 shrink-0 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[9px] mt-0.5">{idx + 1}</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TABS CONTENT: MOCK INTERVIEW --- */}
        <TabsContent value="interview" className="space-y-4">
          {!interviewActive ? (
            <Card className="max-w-2xl mx-auto bg-white border">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-2">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle>AI Mock Interview Practice</CardTitle>
                <CardDescription>
                  Simulate standard behavioral and core technical interviews. Get graded, receive real-time answer suggestions, and earn ELO reputation points.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 block">Practice for Target Role:</span>
                  <select 
                    value={interviewJobId} 
                    onChange={(e) => setInterviewJobId(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none"
                  >
                    <option value="">-- Choose Job Listing --</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.company} - {j.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-xs space-y-2.5 font-normal leading-relaxed text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
                    <span>Hiring Preparation Vector Incentives</span>
                  </div>
                  <p>Completing a full mock interview session automatically updates your resume telemetry and grants: </p>
                  <ul className="list-disc list-inside space-y-1 font-semibold text-slate-700">
                    <li>+40 permanent Career ELO reputation points.</li>
                    <li>Tailored feedback logs saved to your dashboard ledger.</li>
                  </ul>
                </div>

                <Button 
                  onClick={startInterview} 
                  className="w-full cursor-pointer flex items-center justify-center gap-1.5"
                  variant="accent"
                >
                  <Play className="h-4 w-4 fill-white" /> Start Simulation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white">
              <CardHeader className="border-b py-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Bot className="h-4 w-4 text-accent" />
                    Interview for {jobs.find(j => j.id === interviewJobId)?.title}
                  </CardTitle>
                  <CardDescription className="text-[10px]">AI Evaluator Model V1.2</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setInterviewActive(false);
                    setInterviewMessages([]);
                    setInterviewStep(0);
                    setOverallScore(null);
                  }}
                  className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Exit Interview
                </Button>
              </CardHeader>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {interviewMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-1`}>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {msg.sender === "bot" ? "AI Interviewer" : user.name}
                      </span>
                    </div>
                    
                    <div className={`p-3.5 rounded-2xl max-w-xl text-xs leading-relaxed font-normal ${
                      msg.sender === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-white border text-slate-700 rounded-tl-none shadow-sm"
                    }`}>
                      {msg.text}
                    </div>

                    {/* Display score & feedback if available */}
                    {msg.sender === "bot" && (msg.score !== undefined || msg.feedback) && (
                      <div className="bg-emerald-500/[0.04] border border-emerald-100 rounded-xl p-3 max-w-xl mt-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Response Feedback
                          </span>
                          {msg.score !== undefined && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-transparent text-[10px] font-bold">
                              Answer Score: {msg.score}/100
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-600 leading-normal font-normal">
                          {msg.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {isBotTyping && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                    AI is reviewing your telemetry...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t bg-white flex gap-2">
                {interviewStep === 4 ? (
                  <div className="w-full flex flex-col items-center py-2 space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Overall Simulation Performance</span>
                      <div className="text-2xl font-black text-slate-800">{overallScore}/100</div>
                    </div>
                    <Button 
                      onClick={() => {
                        setInterviewActive(false);
                        setInterviewMessages([]);
                        setInterviewStep(0);
                        setOverallScore(null);
                      }}
                      variant="accent" 
                      className="cursor-pointer text-xs"
                    >
                      Return to Assistant
                    </Button>
                  </div>
                ) : (
                  <>
                    <input 
                      type="text" 
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !isBotTyping) handleSendMessage(); }}
                      placeholder="Type your interview answer..."
                      className="flex-1 rounded-md border border-slate-200 px-3 text-xs bg-white focus:outline-none focus:border-accent"
                      disabled={isBotTyping}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isBotTyping || !currentInput.trim()}
                      variant="accent"
                      size="icon"
                      className="cursor-pointer"
                    >
                      <Send className="h-4 w-4 text-white" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* --- TABS CONTENT: JOB SUGGESTIONS --- */}
        <TabsContent value="suggestions" className="space-y-6">
          {!mbti ? (
            <Card className="max-w-md mx-auto text-center p-6 border">
              <CardHeader className="pb-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <CardTitle className="text-md">Profile MBTI Required</CardTitle>
                <CardDescription>
                  You must complete your MBTI personality quiz first to unlock animal personality matching and tailored career pathways.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="accent" className="cursor-pointer mt-2 w-full">
                  <Link href="/candidate/profile">Go to Profile Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            animal && (
              <div className="space-y-6">
                {/* Animal Guide summary */}
                <Card className="border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${animal.color.split(" bg-")[0]} text-white text-4xl shadow-md h-16 w-16 flex items-center justify-center shrink-0`}>
                        {animal.emoji}
                      </div>
                      <div className="space-y-2 flex-1 text-center sm:text-left">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
                            <h3 className="text-lg font-bold">{animal.animal} — {animal.title}</h3>
                            <Badge className="bg-accent/15 text-accent hover:bg-accent/15 border-transparent text-[10px] w-fit mx-auto sm:mx-0 font-bold uppercase">{mbti}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">{animal.description}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Career Paths:</span>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                            {mbtiCareers.map((c, i) => (
                              <Badge key={i} variant="outline" className="text-xs py-0.5 font-medium">{c}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job recommendations */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-md font-bold tracking-tight">AI Tailored Jobs Match</h3>
                    <p className="text-xs text-slate-500">
                      Real listings matching your resume skills and MBTI personality type.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {suggestedJobsList.map(({ job, score, matched }) => (
                      <Card key={job.id} className="border flex flex-col justify-between hover:shadow-md transition-shadow bg-white">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-bold text-sm leading-tight text-slate-800">{job.title}</h4>
                              <span className="text-xs text-slate-400 mt-0.5 block">{job.company}</span>
                            </div>
                            <Badge className="bg-teal-500 text-white text-[10px] font-bold shrink-0">{score}% match</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                          <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed font-normal">
                            {job.description}
                          </p>

                          <div className="space-y-2 border-t pt-2 mt-auto">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Matched Keywords:</span>
                              <div className="flex flex-wrap gap-0.5">
                                {matched.length === 0 ? <span className="text-[10px] text-slate-400">None</span> :
                                  matched.map(t => (
                                    <Badge key={t} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[9px] font-medium border-transparent py-0 px-1.5">{t}</Badge>
                                  ))
                                }
                              </div>
                            </div>

                            <Button asChild size="sm" variant="accent" className="w-full cursor-pointer text-xs h-8">
                              <Link href={`/candidate/jobs/${job.id}`}>
                                View Details & Apply
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
