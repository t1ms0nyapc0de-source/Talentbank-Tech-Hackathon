"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Sparkles, 
  TrendingDown, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";

interface TrajectoryMetrics {
  growthRate: number;
  predictedNextStep: string;
  growthSignals: string[];
  skillsMatchScore: number;
  trajectoryMatchScore: number;
}

interface SmartMatchingProps {
  metrics?: TrajectoryMetrics;
}

const DEFAULT_METRICS: TrajectoryMetrics = {
  growthRate: 85,
  predictedNextStep: "Senior Systems Engineer",
  growthSignals: [
    "Acquired 3 major framework competencies in past 6 months",
    "Showed strong cross-discipline system design leadership",
    "Velocity curve suggests transition to Staff level within 18 months"
  ],
  skillsMatchScore: 60,
  trajectoryMatchScore: 94
};

export function SmartMatching({ metrics = DEFAULT_METRICS }: SmartMatchingProps) {
  const isSteep = metrics.trajectoryMatchScore > metrics.skillsMatchScore;
  
  return (
    <div className="border border-teal-100 rounded-xl bg-gradient-to-br from-white to-teal-50/20 p-5 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-teal-50 border border-teal-100">
            <Sparkles className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 tracking-tight">
              AI Trajectory Match Analyzer
            </h4>
            <p className="text-[10px] text-slate-400">
              Evaluates learning acceleration and realignment path vectors.
            </p>
          </div>
        </div>
        <Badge className="bg-teal-50 hover:bg-teal-50 text-teal-700 border-teal-100 text-[10px] uppercase font-bold tracking-wider">
          Propulsion Engine Model V4
        </Badge>
      </div>

      {/* Comparison Meters */}
      <div className="grid grid-cols-2 gap-4">
        {/* Skills Match */}
        <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 text-center relative overflow-hidden">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Static Skills Match
          </span>
          <div className="text-xl font-extrabold text-slate-500 mt-1.5">
            {metrics.skillsMatchScore}%
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">
            Plateaued Checklist
          </span>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-300"></div>
        </div>

        {/* Trajectory Match */}
        <div className="p-3 bg-teal-500/[0.04] rounded-lg border border-teal-500/10 text-center relative overflow-hidden">
          <div className="absolute top-1.5 right-1.5">
            <Zap className="h-3 w-3 text-teal-500 fill-teal-500 animate-pulse" />
          </div>
          <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider block">
            Trajectory Match
          </span>
          <div className="text-xl font-extrabold text-teal-700 mt-1.5 flex items-center justify-center gap-0.5">
            {metrics.trajectoryMatchScore}%
            <ArrowUpRight className="h-4 w-4 text-teal-600" />
          </div>
          <span className="text-[9px] text-teal-600 font-semibold block mt-1 uppercase tracking-widest animate-pulse">
            High Velocity
          </span>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-teal-500"></div>
        </div>
      </div>

      {/* SVG Growth Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 relative h-28 flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "8px 8px"
        }}></div>
        
        <div className="flex justify-between items-start z-10">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            Career Slopes (Skill / Velocity Over Time)
          </span>
          <div className="flex gap-2">
            <span className="text-[8px] font-mono text-slate-400 flex items-center gap-1">
              <span className="h-1 w-2 bg-slate-500 inline-block rounded-full"></span> Static
            </span>
            <span className="text-[8px] font-mono text-teal-400 flex items-center gap-1">
              <span className="h-1 w-2 bg-teal-400 inline-block rounded-full"></span> Trajectory
            </span>
          </div>
        </div>

        {/* SVG Drawing vectors */}
        <svg viewBox="0 0 280 60" className="w-full h-12 overflow-visible z-10 self-center">
          {/* Static Slope (Low velocity) */}
          <path d="M 10 50 Q 140 40, 270 35" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="270" cy="35" r="3" fill="#64748b" />

          {/* Acceleration Slope (Steep velocity) */}
          <path d="M 10 50 Q 140 42, 270 15" fill="none" stroke="#2dd4bf" strokeWidth="2.5" className="drop-shadow-[0_0_3px_rgba(45,212,191,0.5)]" />
          <circle cx="270" cy="15" r="4.5" fill="#2dd4bf" className="animate-pulse" />
          <circle cx="10" cy="50" r="3" fill="#38bdf8" />
        </svg>

        <div className="flex justify-between text-[8px] font-mono text-slate-500 z-10">
          <span>PAST EXP (Realignment)</span>
          <span className="text-teal-400 font-bold">PREDICTED ELEVATION</span>
        </div>
      </div>

      {/* Analysis Readout */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wide">
            Predicted Next Logical Step
          </span>
          <Badge className="bg-slate-900 text-white text-[10px] font-semibold tracking-wide border-transparent hover:bg-slate-900">
            {metrics.predictedNextStep}
          </Badge>
        </div>

        {/* Growth Signals */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            AI Trajectory Signals Detected
          </span>
          <div className="space-y-1">
            {metrics.growthSignals.map((signal, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-1.5 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100 shadow-sm"
              >
                <div className="mt-0.5 rounded-full p-0.5 bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Brand Message Nudge */}
        {isSteep && (
          <div className="bg-teal-500/10 border border-teal-500/10 p-2.5 rounded-lg text-[10px] text-teal-800 leading-relaxed font-medium flex items-start gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong>Propulsion Hireahead Signal:</strong> Candidate possesses a steep growth curve. In 12 months, their velocity coordinates predict they will significantly outperform a candidate with 90% skills today who has plateaued.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
