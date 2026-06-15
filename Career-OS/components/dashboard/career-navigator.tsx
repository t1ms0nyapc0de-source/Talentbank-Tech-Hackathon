"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  TrendingUp, 
  Gauge, 
  Compass, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface TargetRole {
  id: string;
  name: string;
  x: number;
  y: number;
  velocity: string;
  elevation: string;
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
}

interface PathDataset {
  title: string;
  description: string;
  roles: TargetRole[];
}

const DATASETS: Record<number, PathDataset> = {
  1: {
    title: "Adjacent Realignment",
    description: "Low-friction, immediate horizontal adjustments targeting adjacent disciplines where your current skill delta is narrow.",
    roles: [
      {
        id: "adj-1",
        name: "Senior Frontend Engineer",
        x: 460,
        y: 50,
        velocity: "+18% YoY Demand",
        elevation: "1.25x Base Leverage",
        matchedSkills: ["React", "TypeScript", "TailwindCSS", "HTML/CSS"],
        missingSkills: ["Next.js App Router", "Advanced Performance Auditing", "Micro-Frontends"],
        description: "Focuses on ownership of client-side architecture, optimization protocols, and design systems integration."
      },
      {
        id: "adj-2",
        name: "Full Stack Developer (L5)",
        x: 480,
        y: 120,
        velocity: "+22% YoY Demand",
        elevation: "1.30x Base Leverage",
        matchedSkills: ["React", "TypeScript", "Node.js", "REST APIs"],
        missingSkills: ["PostgreSQL Optimization", "System Architecture Design", "GraphQL Federation"],
        description: "Bridges the user experience interface with backend systems orchestration, ensuring fluid client-server boundaries."
      },
      {
        id: "adj-3",
        name: "DevOps Engineer",
        x: 460,
        y: 190,
        velocity: "+15% YoY Demand",
        elevation: "1.35x Base Leverage",
        matchedSkills: ["Node.js", "Linux Basics", "Shell Scripting"],
        missingSkills: ["Docker & Kubernetes", "CI/CD Pipeline Orchestration (GitHub Actions)", "AWS CloudFormation"],
        description: "Transforms delivery pipelines, focusing on serverless infrastructure, containerization, and automation latency reduction."
      }
    ]
  },
  2: {
    title: "Growth Trajectories",
    description: "Mid-level shifts designed to trade individual execution for technical influence, system design, or product mapping.",
    roles: [
      {
        id: "gro-1",
        name: "Solutions Architect",
        x: 460,
        y: 50,
        velocity: "+29% YoY Demand",
        elevation: "1.55x Base Leverage",
        matchedSkills: ["Node.js", "React", "System Integration", "API Design"],
        missingSkills: ["Cloud Architecture Frameworks (AWS/GCP)", "Enterprise Security Architectures", "High Availability Systems Design"],
        description: "Translates high-level business objectives into resilient, distributed software systems that scale dynamically."
      },
      {
        id: "gro-2",
        name: "Technical Lead",
        x: 480,
        y: 120,
        velocity: "+24% YoY Demand",
        elevation: "1.50x Base Leverage",
        matchedSkills: ["React", "TypeScript", "Node.js", "Technical Mentorship"],
        missingSkills: ["Agile Development Cycles", "Cross-team Backlog Grooming", "Refactoring & Tech Debt Management"],
        description: "Drives engineering standards, guides technical decision-making, and mentors developers while shipping key products."
      },
      {
        id: "gro-3",
        name: "Technical Product Manager",
        x: 460,
        y: 190,
        velocity: "+26% YoY Demand",
        elevation: "1.60x Base Leverage",
        matchedSkills: ["Technical Foundations", "Communication", "System Design Understanding"],
        missingSkills: ["Product Backlog Strategy", "User Journey Mapping", "A/B Testing & Data Analytics"],
        description: "Controls the product roadmap, bridging developer constraints with market-facing initiatives and customer metrics."
      }
    ]
  },
  3: {
    title: "High-Impact Realignments",
    description: "Long-term, high-pivot elevation paths introducing major structural shifts toward executive leadership or deep domain mastery.",
    roles: [
      {
        id: "hi-1",
        name: "Staff Engineer",
        x: 460,
        y: 50,
        velocity: "+34% YoY Demand",
        elevation: "1.85x Base Leverage",
        matchedSkills: ["React", "TypeScript", "System Integration", "Node.js"],
        missingSkills: ["Cross-Organizational Technical Strategy", "RFC Proposal Authoring", "Global Scale Distributed Systems"],
        description: "Operates as a multiplier across multiple teams, defining the long-term technical roadmap and setting engineering standards."
      },
      {
        id: "hi-2",
        name: "Engineering Manager",
        x: 480,
        y: 120,
        velocity: "+28% YoY Demand",
        elevation: "1.75x Base Leverage",
        matchedSkills: ["Collaboration", "Agile Execution", "Product Knowledge"],
        missingSkills: ["People Management & Career Coaching", "Headcount Budgeting & Resource Allocation", "Conflict Resolution Frameworks"],
        description: "Combines technical vision with organizational leadership, building high-performing teams, and optimizing delivery execution."
      },
      {
        id: "hi-3",
        name: "Chief Technology Officer (CTO)",
        x: 460,
        y: 190,
        velocity: "+42% YoY Demand",
        elevation: "2.40x Base Leverage",
        matchedSkills: ["Software Engineering", "Product Vision", "Team Building"],
        missingSkills: ["Executive Board Management", "IPO / M&A Due Diligence", "Global Technology Risk Strategy"],
        description: "Calculates the macroscopic technology landscape to position the organization for technological leadership and commercial scaling."
      }
    ]
  }
};

export function CareerNavigator() {
  const [pivotIntensity, setPivotIntensity] = useState<number>(2);
  const currentDataset = DATASETS[pivotIntensity];
  const [selectedRoleId, setSelectedRoleId] = useState<string>(currentDataset.roles[1].id);

  // If the selected role is not in the current dataset, select the middle one of the new dataset
  const activeRole = currentDataset.roles.find(r => r.id === selectedRoleId) || currentDataset.roles[1];

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setPivotIntensity(val);
    setSelectedRoleId(DATASETS[val].roles[1].id);
  };

  const handleInitiateRealignment = () => {
    toast.success(`Propulsion vector locked: Initiating realignment pathway toward ${activeRole.name}. Check your telemetry log for custom micro-credentials.`);
  };

  return (
    <Card className="border border-slate-200 shadow-lg overflow-hidden bg-white/70 backdrop-blur-md">
      <style>{`
        @keyframes flow {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
        .animate-flow {
          stroke-dasharray: 6 4;
          animation: flow 1.5s linear infinite;
        }
        .pulse-active {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
      
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-accent" />
              <CardTitle className="text-xl font-bold tracking-tight text-primary">
                Calibrate Your Trajectory
              </CardTitle>
            </div>
            <CardDescription className="text-sm font-medium text-slate-700">
              A data-driven propulsion system designed to lift the weight of uncertainty and unlock your next high-impact realignment.
            </CardDescription>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Propulsion Engine Online</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Brand Explanation */}
        <p className="text-sm leading-relaxed text-slate-600 mb-6 max-w-4xl">
          By synthesizing your professional experience with real-time market dynamics, the Navigator maps out viable, upward-trending career trajectories. It strips away the weight of professional uncertainty, replacing stagnation with active realignment. This is not a predictive crystal ball, but a dynamic propulsion engine engineered to accelerate your velocity toward high-impact elevation.
        </p>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Controls & Coordinate SVG Panel */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            {/* Pivot Intensity Slider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-accent" />
                  Pivot Intensity (Realignment Depth)
                </label>
                <Badge variant="outline" className="bg-white text-xs font-semibold text-primary border-slate-200">
                  {pivotIntensity === 1 && "Adjacent Shifts"}
                  {pivotIntensity === 2 && "Growth Pathways"}
                  {pivotIntensity === 3 && "Transformative Leaps"}
                </Badge>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={pivotIntensity}
                onChange={handleIntensityChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 px-1">
                <span>ADJACENT MOVES</span>
                <span>GROWTH VECTORS</span>
                <span>HIGH-ALTITUDE LEAPS</span>
              </div>
            </div>

            {/* Trajectory Navigation Grid */}
            <div className="relative border border-slate-200 rounded-xl bg-slate-950 p-4 overflow-hidden hero-grid aspect-[5/2] flex items-center justify-center">
              {/* Overlay elements representing axis labels */}
              <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                Y-Axis: Elevation Coefficient (Seniority / Impact)
              </div>
              <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                X-Axis: Realignment Velocity
              </div>

              <svg 
                viewBox="0 0 600 240" 
                className="w-full h-full overflow-visible z-10"
              >
                {/* SVG Coordinate Gridlines */}
                <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="300" y1="0" x2="300" y2="240" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                
                {/* Dynamic Vector Lines linking Origin to Target Roles */}
                {currentDataset.roles.map((role) => {
                  const isSelected = activeRole.id === role.id;
                  
                  // Control point for smooth bezier curves
                  const ctrlX1 = 80 + (role.x - 80) * 0.4;
                  const ctrlY1 = 120;
                  const ctrlX2 = 80 + (role.x - 80) * 0.5;
                  const ctrlY2 = role.y;
                  const pathD = `M 80 120 C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${role.x} ${role.y}`;
                  
                  return (
                    <g key={role.id} className="cursor-pointer" onClick={() => setSelectedRoleId(role.id)}>
                      {/* Interactive hover container path */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="20"
                      />
                      {/* Solid Background Path */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? "rgba(13, 148, 136, 0.4)" : "rgba(255, 255, 255, 0.08)"}
                        strokeWidth={isSelected ? 4 : 2}
                        className="transition-all duration-300"
                      />
                      {/* Animating Dash/Flow Overlay for Active Vectors */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? "#0d9488" : "rgba(13, 148, 136, 0.2)"}
                        strokeWidth={isSelected ? 2 : 1.5}
                        className={isSelected ? "animate-flow" : ""}
                      />
                    </g>
                  );
                })}

                {/* Origin Node: Current Profile */}
                <g transform="translate(80, 120)" className="cursor-default">
                  <circle r="18" fill="rgba(15, 43, 74, 0.8)" stroke="#38bdf8" strokeWidth="2" />
                  <circle r="6" fill="#38bdf8" />
                  <text 
                    y="-24" 
                    textAnchor="middle" 
                    fill="#94a3b8" 
                    className="text-[10px] font-bold uppercase tracking-wider font-mono"
                  >
                    Current Profile
                  </text>
                </g>

                {/* Target Nodes */}
                {currentDataset.roles.map((role) => {
                  const isSelected = activeRole.id === role.id;
                  return (
                    <g 
                      key={role.id} 
                      transform={`translate(${role.x}, ${role.y})`}
                      className="cursor-pointer"
                      onClick={() => setSelectedRoleId(role.id)}
                    >
                      {/* Pulse ring for selected node */}
                      {isSelected && (
                        <circle r="22" fill="none" stroke="#0d9488" strokeWidth="1.5" className="pulse-active" />
                      )}
                      
                      <circle 
                        r="14" 
                        fill={isSelected ? "#0d9488" : "#0f172a"} 
                        stroke={isSelected ? "#2dd4bf" : "rgba(255,255,255,0.25)"} 
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        className="transition-all duration-300 hover:scale-110"
                      />
                      
                      <text 
                        dx="22" 
                        dy="4" 
                        fill={isSelected ? "#2dd4bf" : "#e2e8f0"} 
                        className="text-[10px] font-semibold tracking-wide"
                      >
                        {role.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Telemetry Output Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 flex-1">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Target Vector Readout
                </div>
                <h3 className="text-lg font-bold text-primary mt-1">
                  {activeRole.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {activeRole.description}
                </p>
              </div>

              {/* Vector Key Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-accent" />
                    Velocity Vector
                  </span>
                  <span className="text-xs font-extrabold text-primary mt-1">
                    {activeRole.velocity}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-accent" />
                    Elevation Coefficient
                  </span>
                  <span className="text-xs font-extrabold text-primary mt-1">
                    {activeRole.elevation}
                  </span>
                </div>
              </div>

              {/* Skill Delta Realignment */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-slate-400" />
                  Realignment Delta (Skill Alignment)
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-600 block mb-1">
                      Matched Credentials
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {activeRole.matchedSkills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-[10px] py-0 px-2 flex items-center gap-0.5"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-amber-600 block mb-1">
                      Target Delta (Required Skills)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {activeRole.missingSkills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 text-[10px] py-0 px-2 flex items-center gap-0.5"
                        >
                          <AlertCircle className="h-2.5 w-2.5" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Propulsion Trigger */}
            <Button 
              className="w-full mt-4 bg-primary hover:bg-primary/95 text-white py-5 font-semibold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              onClick={handleInitiateRealignment}
            >
              <Zap className="h-4 w-4 fill-white" />
              Lock Propulsion Vector
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
