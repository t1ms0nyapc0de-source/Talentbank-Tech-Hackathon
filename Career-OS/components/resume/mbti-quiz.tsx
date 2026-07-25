"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowLeft, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

export interface MBTITypeInfo {
  type: string;
  animal: string;
  emoji: string;
  title: string;
  description: string;
  strengths: string[];
  color: string;
}

export const MBTI_ANIMALS: Record<string, MBTITypeInfo> = {
  INTJ: {
    type: "INTJ",
    animal: "Owl",
    emoji: "🦉",
    title: "The Strategic Mastermind",
    description: "Highly analytical, logical, and creative. Owls excel at developing long-term strategies and solving complex systems problems.",
    strengths: ["Strategic vision", "Innovative problem solving", "Highly independent", "Determined"],
    color: "from-indigo-500 to-purple-600 bg-indigo-50/50 border-indigo-200 text-indigo-700"
  },
  INTP: {
    type: "INTP",
    animal: "Octopus",
    emoji: "🐙",
    title: "The Analytical Thinker",
    description: "Quiet, flexible, and brilliant problem-solvers. Octopuses love theorizing, finding patterns, and examining the root cause of issues.",
    strengths: ["Logical analysis", "Unbiased objectivity", "Adaptable explorer", "Highly imaginative"],
    color: "from-blue-500 to-cyan-600 bg-blue-50/50 border-blue-200 text-blue-700"
  },
  ENTJ: {
    type: "ENTJ",
    animal: "Lion",
    emoji: "🦁",
    title: "The Decisive Leader",
    description: "Bold, imaginative, and strong-willed leaders. Lions are natural executives who excel at organizing teams and driving strategies forward.",
    strengths: ["Natural leadership", "Strategic planning", "Charismatic builder", "Efficient executive"],
    color: "from-amber-500 to-orange-600 bg-amber-50/50 border-amber-200 text-amber-700"
  },
  ENTP: {
    type: "ENTP",
    animal: "Fox",
    emoji: "🦊",
    title: "The Curious Innovator",
    description: "Smart, curious, and quick-witted. Foxes love intellectual play, generating novel concepts, and debating ideas to find creative solutions.",
    strengths: ["Out-of-the-box thinking", "Highly adaptable", "Quick learner", "Enthusiastic brainstorming"],
    color: "from-orange-400 to-red-500 bg-orange-50/50 border-orange-200 text-orange-700"
  },
  INFJ: {
    type: "INFJ",
    animal: "Panda",
    emoji: "🐼",
    title: "The Insightful Advocate",
    description: "Mystical, deep, and quiet helpers. Pandas are values-driven visionaries dedicated to helping others and making a positive impact.",
    strengths: ["Deep empathy", "Values-driven", "Insightful counselor", "Strong moral compass"],
    color: "from-emerald-500 to-teal-600 bg-emerald-50/50 border-emerald-200 text-emerald-700"
  },
  INFP: {
    type: "INFP",
    animal: "Koala",
    emoji: "🐨",
    title: "The Gentle Idealist",
    description: "Idealistic, loyal, and creative. Koalas are warm, gentle spirits who seek inner harmony and are eager to express their core values.",
    strengths: ["Creative expression", "Deep compassion", "Open-mindedness", "Dedicated advocate"],
    color: "from-violet-400 to-purple-500 bg-violet-50/50 border-violet-200 text-violet-700"
  },
  ENFJ: {
    type: "ENFJ",
    animal: "Dolphin",
    emoji: "🐬",
    title: "The Inspiring Guide",
    description: "Charismatic, empathetic, and inspiring. Dolphins are social guides who nurture community connection and lift up everyone around them.",
    strengths: ["Inspiring communicator", "Inclusive leader", "Highly empathetic", "Community builder"],
    color: "from-cyan-400 to-blue-500 bg-cyan-50/50 border-cyan-200 text-cyan-700"
  },
  ENFP: {
    type: "ENFP",
    animal: "Otter",
    emoji: "🦦",
    title: "The Creative Explorer",
    description: "Enthusiastic, creative, and highly social. Otters are free spirits who see possibilities everywhere and spread positive energy.",
    strengths: ["Boundless enthusiasm", "Creative visionary", "Excellent communicator", "People-focused builder"],
    color: "from-pink-400 to-rose-500 bg-pink-50/50 border-pink-200 text-pink-700"
  },
  ISTJ: {
    type: "ISTJ",
    animal: "Beaver",
    emoji: "🦫",
    title: "The Responsible Planner",
    description: "Practical, fact-minded, and highly reliable. Beavers thrive on order, structure, and detail-oriented planning.",
    strengths: ["Reliability", "Detail-oriented", "Practical executor", "Organized administrator"],
    color: "from-slate-600 to-slate-800 bg-slate-50/50 border-slate-200 text-slate-700"
  },
  ISFJ: {
    type: "ISFJ",
    animal: "Elephant",
    emoji: "🐘",
    title: "The Dedicated Protector",
    description: "Warm, responsible, and devoted protectors. Elephants are quiet supporters who remember details and care deeply about others.",
    strengths: ["Loyal supporter", "Highly organized", "Methodical worker", "Deeply caring"],
    color: "from-sky-400 to-blue-500 bg-sky-50/50 border-sky-200 text-sky-700"
  },
  ESTJ: {
    type: "ESTJ",
    animal: "Wolf",
    emoji: "🐺",
    title: "The System Organizer",
    description: "Organized, traditional, and direct managers. Wolves excel at managing tasks, setting clear expectations, and leading order.",
    strengths: ["Direct communicator", "Highly organized", "Loyal team lead", "Action-oriented planner"],
    color: "from-stone-500 to-stone-700 bg-stone-50/50 border-stone-200 text-stone-700"
  },
  ESFJ: {
    type: "ESFJ",
    animal: "Swan",
    emoji: "🦢",
    title: "The Social Caregiver",
    description: "Warm, popular, and conscientious. Swans are social contributors who seek harmony, build relationships, and support coworkers.",
    strengths: ["Conscientious worker", "Warm relationship builder", "Helpful team member", "Detail-oriented"],
    color: "from-emerald-400 to-teal-500 bg-emerald-50/50 border-emerald-200 text-emerald-700"
  },
  ISTP: {
    type: "ISTP",
    animal: "Tiger",
    emoji: "🐯",
    title: "The Crafty Virtuoso",
    description: "Tolerant, flexible, and quiet observers. Tigers are action-oriented builders who love understanding how things work and mastering tools.",
    strengths: ["Tool mastery", "Excellent in crises", "Logical analyst", "Highly pragmatic"],
    color: "from-amber-600 to-orange-700 bg-amber-50/50 border-amber-200 text-amber-800"
  },
  ISFP: {
    type: "ISFP",
    animal: "Deer",
    emoji: "🦌",
    title: "The Sensitive Artist",
    description: "Gentle, friendly, and sensitive. Deer enjoy the present moment and seek to bring harmony and beauty to their workspace.",
    strengths: ["Artistic eye", "Quiet helper", "Open-minded colleague", "Deeply loyal"],
    color: "from-teal-400 to-emerald-500 bg-teal-50/50 border-teal-200 text-teal-700"
  },
  ESTP: {
    type: "ESTP",
    animal: "Cheetah",
    emoji: "🐆",
    title: "The Active Dynamo",
    description: "Energetic, action-oriented, and bold. Cheetahs live in the here-and-now, solving problems immediately and taking calculated risks.",
    strengths: ["Action-oriented", "Highly adaptable", "Direct problem solver", "Charismatic risk-taker"],
    color: "from-yellow-500 to-amber-600 bg-yellow-50/50 border-yellow-200 text-yellow-700"
  },
  ESFP: {
    type: "ESFP",
    animal: "Peacock",
    emoji: "🦚",
    title: "The Playful Entertainer",
    description: "Outgoing, friendly, and spontaneous. Peacocks make work fun, adapt quickly to new people, and love working with teams.",
    strengths: ["Outgoing team builder", "Highly optimistic", "Spontaneous adaptor", "Excellent presenter"],
    color: "from-fuchsia-500 to-pink-600 bg-fuchsia-50/50 border-fuchsia-200 text-fuchsia-700"
  }
};

const QUESTIONS = [
  {
    id: 1,
    dimension: "EI",
    question: "When you need to recharge your energy, you prefer to:",
    options: [
      { text: "Hang out with a group of friends or go to social events", value: "E" },
      { text: "Spend time alone reading, gaming, or reflecting in a quiet space", value: "I" }
    ]
  },
  {
    id: 2,
    dimension: "EI",
    question: "In a collaborative project, your style is to:",
    options: [
      { text: "Initiate conversations, brainstorm out loud, and lead discussions", value: "E" },
      { text: "Listen closely first, refine thoughts internally, and share when ready", value: "I" }
    ]
  },
  {
    id: 3,
    dimension: "SN",
    question: "When working on a problem, you tend to focus on:",
    options: [
      { text: "Concrete facts, current details, and proven practical methods", value: "S" },
      { text: "Future patterns, abstract theories, and creative possibilities", value: "N" }
    ]
  },
  {
    id: 4,
    dimension: "SN",
    question: "Which type of descriptions do you enjoy more?",
    options: [
      { text: "Literal, clear, and direct step-by-step instructions", value: "S" },
      { text: "Metaphorical, conceptual, and open-ended ideas", value: "N" }
    ]
  },
  {
    id: 5,
    dimension: "TF",
    question: "When resolving a team conflict, you prioritize:",
    options: [
      { text: "Objective logic, fairness, and consistent rules", value: "T" },
      { text: "Empathy, harmony, and individual feelings", value: "F" }
    ]
  },
  {
    id: 6,
    dimension: "TF",
    question: "You would rather be described as:",
    options: [
      { text: "Highly analytical and rational", value: "T" },
      { text: "Warm, compassionate, and understanding", value: "F" }
    ]
  },
  {
    id: 7,
    dimension: "JP",
    question: "Your ideal approach to a career task is to:",
    options: [
      { text: "Plan ahead, make checklists, and execute step-by-step", value: "J" },
      { text: "Keep options open, work in spontaneous bursts, and adapt on the fly", value: "P" }
    ]
  },
  {
    id: 8,
    dimension: "JP",
    question: "How do you feel about strict deadlines and rigid workflows?",
    options: [
      { text: "Reassured by clear guidelines, meeting them early makes me feel productive", value: "J" },
      { text: "Stifled by strict rules, I prefer flexibility and working closer to deadlines", value: "P" }
    ]
  }
];

interface MBTIQuizProps {
  onSave: (mbti: string) => void;
  trigger?: React.ReactNode;
}

export function MBTIQuiz({ onSave, trigger }: MBTIQuizProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1-8: Questions, 9: Result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [calculatedType, setCalculatedType] = useState<string | null>(null);

  const handleSelectOption = (val: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: val }));
    setTimeout(() => {
      if (currentStep < QUESTIONS.length) {
        setCurrentStep(prev => prev + 1);
      } else {
        calculateResult();
      }
    }, 250);
  };

  const calculateResult = () => {
    let E = 0, I = 0;
    let S = 0, N = 0;
    let T = 0, F = 0;
    let J = 0, P = 0;

    // Accumulate answer types
    QUESTIONS.forEach((q) => {
      const ans = answers[q.id];
      if (q.dimension === "EI") {
        if (ans === "E") E++;
        else I++;
      } else if (q.dimension === "SN") {
        if (ans === "S") S++;
        else N++;
      } else if (q.dimension === "TF") {
        if (ans === "T") T++;
        else F++;
      } else if (q.dimension === "JP") {
        if (ans === "J") J++;
        else P++;
      }
    });

    const mbtiResult = [
      E >= I ? "E" : "I",
      S >= N ? "S" : "N",
      T >= F ? "T" : "F",
      J >= P ? "J" : "P"
    ].join("");

    setCalculatedType(mbtiResult);
    setCurrentStep(QUESTIONS.length + 1);
  };

  const handleSaveResult = () => {
    if (calculatedType) {
      onSave(calculatedType);
      setOpen(false);
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setCalculatedType(null);
  };

  const progressPercentage = currentStep > 0 && currentStep <= QUESTIONS.length
    ? (currentStep / QUESTIONS.length) * 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) resetQuiz(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="accent" className="cursor-pointer gap-2">
            <Brain className="h-4 w-4" />
            Take MBTI Quiz
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] p-6 bg-card border shadow-xl transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Brain className="h-5 w-5 text-accent animate-pulse" />
            MBTI Personality Quiz
          </DialogTitle>
          <DialogDescription>
            {currentStep <= QUESTIONS.length 
              ? "Discover your work personality type and get customized career tips & suggestions."
              : "Here is your career character matches!"}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 0: START PAGE */}
        {currentStep === 0 && (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center text-accent text-3xl">
              🦁
            </div>
            <h3 className="font-bold text-lg">Uncover Your Career Persona Animal</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed font-normal">
              Answer 8 brief questions about how you collaborate, manage deadlines, and process information. We will map you to one of the 16 MBTI animals to unlock AI Job Suggestions and career strategies!
            </p>
            <Button onClick={() => setCurrentStep(1)} className="w-full mt-2 cursor-pointer" variant="accent">
              Start Quiz
            </Button>
          </div>
        )}

        {/* STEPS 1-8: QUESTIONS */}
        {currentStep > 0 && currentStep <= QUESTIONS.length && (
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                <span>Question {currentStep} of {QUESTIONS.length}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-1.5" />
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-800 leading-snug">
                {QUESTIONS[currentStep - 1].question}
              </h3>
              
              <div className="space-y-2.5">
                {QUESTIONS[currentStep - 1].options.map((opt, idx) => {
                  const isSelected = answers[currentStep] === opt.value;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.value)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? "bg-accent/10 border-accent text-accent shadow-sm"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-accent shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
              <div className="text-xs text-muted-foreground">
                Answers auto-advance
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: RESULT SHOWCASE */}
        {currentStep === QUESTIONS.length + 1 && calculatedType && (
          <div className="py-4 space-y-6 text-center">
            {(() => {
              const animalInfo = MBTI_ANIMALS[calculatedType];
              if (!animalInfo) return null;
              return (
                <div className="space-y-5 flex flex-col items-center">
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${animalInfo.color.split(" bg-")[0]} text-white text-5xl shadow-xl flex items-center justify-center h-24 w-24 relative animate-bounce-slow`}>
                    {animalInfo.emoji}
                  </div>
                  
                  <div>
                    <span className="text-xs font-bold text-accent tracking-widest uppercase">{calculatedType}</span>
                    <h3 className="text-xl font-extrabold text-slate-800">{animalInfo.animal} — {animalInfo.title}</h3>
                  </div>

                  <p className="text-sm text-slate-600 max-w-sm leading-relaxed px-2 font-normal">
                    {animalInfo.description}
                  </p>

                  <div className="w-full text-left space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Key Professional Strengths:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {animalInfo.strengths.map((str, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full pt-2">
                    <Button onClick={resetQuiz} variant="outline" className="flex-1 cursor-pointer">
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retake
                    </Button>
                    <Button onClick={handleSaveResult} variant="accent" className="flex-1 cursor-pointer">
                      Save to Profile
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
