"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, 
  Activity, 
  Search, 
  Filter, 
  UserCheck, 
  MapPin, 
  Zap, 
  Heart, 
  X, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Sparkles, 
  Building2, 
  Send, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Lock,
  Unlock,
  Users,
  Eye,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Define Types
interface Skill {
  name: string;
  value: number;
  type: "hard" | "behavioral";
}

interface LedgerEntry {
  id: string;
  name: string;
  source: string;
  skills: { name: string; percentage: number }[];
  date: string;
  type: "Lab" | "Project" | "Contest" | "Milestone" | "Workshop";
  verifiedBy: string;
  complexity: "Advanced" | "Intermediate" | "Introductory";
}

interface MatchCard {
  id: string;
  title: string;
  company: string;
  industry: string;
  scope: string;
  techStack: string[];
  culture: string[];
  stipend: string;
  duration: string;
  requiredSkills: { name: string; minScore: number }[];
}

export default function StudentHub() {
  // --- STATE ---
  // Skills State for Dynamic Radar Chart & Ledger Integration
  const [skills, setSkills] = useState<Skill[]>([
    { name: "React", value: 85, type: "hard" },
    { name: "C++", value: 70, type: "hard" },
    { name: "Network Subnetting", value: 92, type: "hard" },
    { name: "Database Optimization", value: 80, type: "hard" },
    { name: "Public Speaking", value: 75, type: "behavioral" },
    { name: "Conflict Resolution", value: 88, type: "behavioral" },
  ]);

  // Overall Readiness Score (Elo style)
  const [readinessScore, setReadinessScore] = useState(1420);
  const [skillsHovered, setSkillsHovered] = useState<string | null>(null);

  // Competency Ledger
  const [searchQuery, setSearchQuery] = useState("");
  const [ledgerFilter, setLedgerFilter] = useState<"all" | "hard" | "behavioral">("all");
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([
    {
      id: "ledger-1",
      name: "Advanced Networking Lab #3",
      source: "Faculty of Computer Science",
      skills: [{ name: "Network Subnetting", percentage: 92 }],
      date: "2 weeks ago",
      type: "Lab",
      verifiedBy: "Prof. Ahmad Fadzil",
      complexity: "Advanced",
    },
    {
      id: "ledger-2",
      name: "E-Commerce Frontend Capstone",
      source: "Industry Work-Integrated Learning",
      skills: [{ name: "React", percentage: 85 }],
      date: "1 month ago",
      type: "Project",
      verifiedBy: "System Proof Engine (CareerOS)",
      complexity: "Advanced",
    },
    {
      id: "ledger-3",
      name: "Algorithm Optimization Challenge",
      source: "Competitive Programming Hub",
      skills: [{ name: "C++", percentage: 70 }],
      date: "3 weeks ago",
      type: "Contest",
      verifiedBy: "Automated Sandbox Evaluator",
      complexity: "Intermediate",
    },
    {
      id: "ledger-4",
      name: "Peer Dispute Mediation Simulation",
      source: "Student Affairs - Leadership Academy",
      skills: [{ name: "Conflict Resolution", percentage: 88 }, { name: "Public Speaking", percentage: 75 }],
      date: "2 months ago",
      type: "Workshop",
      verifiedBy: "Advisor Dr. Rachel Wong",
      complexity: "Intermediate",
    },
  ]);

  // Employer Radar Switch
  const [radarActive, setRadarActive] = useState(false);
  const [radarStats, setRadarStats] = useState({ viewers: 0, requests24h: 1 });
  
  // Simulated Radar viewer counts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (radarActive) {
      setRadarStats({ viewers: 4, requests24h: 3 });
      interval = setInterval(() => {
        setRadarStats(prev => ({
          viewers: Math.max(1, prev.viewers + (Math.random() > 0.5 ? 1 : -1)),
          requests24h: prev.requests24h + (Math.random() > 0.85 ? 1 : 0)
        }));
      }, 5000);
    } else {
      setRadarStats({ viewers: 0, requests24h: 1 });
    }
    return () => clearInterval(interval);
  }, [radarActive]);

  // Discovery Cards (Dating App Swipe Stack)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobMatchModal, setJobMatchModal] = useState<{ active: boolean; job: MatchCard | null }>({
    active: false,
    job: null
  });
  const [appliedJobs, setAppliedJobs] = useState<MatchCard[]>([]);
  const [passedJobsCount, setPassedJobsCount] = useState(0);

  const discoveryCards: MatchCard[] = [
    {
      id: "job-1",
      title: "Security Gateway Architect (WIL)",
      company: "AeroSecure Tech (Anonymized)",
      industry: "Fintech Logistics",
      scope: "Configure corporate VLAN segments, deploy secure VPC gateways, and audit internal router configurations for load testing.",
      techStack: ["Network Subnetting", "VPC Security", "Go", "Docker"],
      culture: ["High Autonomy", "Async First", "Written Documentation Core"],
      stipend: "RM 1,800 / month",
      duration: "4 Weeks (Micro-Internship)",
      requiredSkills: [
        { name: "Network Subnetting", minScore: 90 }
      ]
    },
    {
      id: "job-2",
      title: "Full Stack Dashboard Developer",
      company: "EcoLogistics (Anonymized)",
      industry: "Green Tech Analytics",
      scope: "Build a high-performance 3-page carbon footprint tracking dashboard in React, integrating real-time SQL aggregation pipelines.",
      techStack: ["React", "Database Optimization", "Tailwind CSS", "Next.js"],
      culture: ["Mentorship Heavy", "Daily Syncs", "Sustainable Tech Focus"],
      stipend: "RM 1,500 / month",
      duration: "6 Weeks",
      requiredSkills: [
        { name: "React", minScore: 80 }
      ]
    },
    {
      id: "job-3",
      title: "Real-time AI Chat Support Engineer",
      company: "SaaS Conversational (Anonymized)",
      industry: "Enterprise AI Service",
      scope: "Optimize WebSocket frame parsers and C++ concurrency queues for low-latency live chat systems.",
      techStack: ["C++", "Node.js", "WebSockets", "Redis"],
      culture: ["Fast Paced", "Direct Communication", "Hackathon Mentality"],
      stipend: "RM 2,200 / month",
      duration: "8 Weeks",
      requiredSkills: [
        { name: "C++", minScore: 85 } // Our C++ is 70, so this won't trigger Match modal!
      ]
    },
    {
      id: "job-4",
      title: "VLAN Integration Expert",
      company: "ByteRouter Networks (Anonymized)",
      industry: "IT Infrastructure",
      scope: "Integrate multi-tier subnet architecture and define routing tables for remote research facilities.",
      techStack: ["Network Subnetting", "Bash Scripting", "Cisco CLI"],
      culture: ["System Safety First", "Precision Oriented", "Flexible Hours"],
      stipend: "RM 1,600 / month",
      duration: "3 Weeks",
      requiredSkills: [
        { name: "Network Subnetting", minScore: 95 } // Our subnetting is 92, won't trigger Match modal!
      ]
    }
  ];

  // Milestone Tracker State
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "Milestone 1: ERD Design & Schema Optimization",
      status: "completed",
      reward: "+2% Database Optimization",
      dateCompleted: "June 08, 2026",
    },
    {
      id: 2,
      title: "Milestone 2: SQL Indexing & Query Tuning",
      status: "active",
      reward: "+5% Database Optimization & +35 Elo Score",
      description: "Analyze execution plans, add non-clustered indexes on search keys, and rewrite nested joins."
    },
    {
      id: 3,
      title: "Milestone 3: Database Scaling & API Integration",
      status: "locked",
      reward: "+3% React & +25 Elo Score",
      description: "Integrate database pools with the Next.js API route and stress-test under simulated load."
    }
  ]);
  const [submittingMilestone, setSubmittingMilestone] = useState(false);

  // --- ACTIONS ---
  // Handle swipe left (Pass)
  const handlePass = () => {
    setPassedJobsCount(prev => prev + 1);
    setCurrentIndex(prev => prev + 1);
    toast.info("Internship passed. Stack updated.");
  };

  // Handle swipe right (Apply)
  const handleApply = (job: MatchCard) => {
    // Check if user meets the requirements for a simulated "Dating Match"
    const isMatch = job.requiredSkills.every(req => {
      const userSkill = skills.find(s => s.name === req.name);
      return userSkill && userSkill.value >= req.minScore;
    });

    if (isMatch) {
      // Fire Matchmaker Modal
      setJobMatchModal({ active: true, job });
      setAppliedJobs(prev => [...prev, job]);
    } else {
      // Standard application, no match overlay
      toast.success(`Application sent to ${job.company}. (Review Pending)`);
      setAppliedJobs(prev => [...prev, job]);
    }
    setCurrentIndex(prev => prev + 1);
  };

  // Reset Matchmaker
  const resetStack = () => {
    setCurrentIndex(0);
    setPassedJobsCount(0);
    toast.success("Job matchmaker stack reset.");
  };

  // Submit Milestone
  const handleSubmitMilestone = () => {
    setSubmittingMilestone(true);
    
    // Simulate smart ledger review
    setTimeout(() => {
      // 1. Toast Notification
      toast.success("Milestone completed! Your Adaptive Readiness Profile has been automatically credited with +5% in database optimization.");
      
      // 2. Update database skill percentage in state
      setSkills(prevSkills => 
        prevSkills.map(s => 
          s.name === "Database Optimization" ? { ...s, value: Math.min(100, s.value + 5) } : s
        )
      );

      // 3. Update Elo Score
      setReadinessScore(prev => prev + 35);

      // 4. Update Milestone Array status
      setMilestones(prev => 
        prev.map(m => {
          if (m.id === 2) return { ...m, status: "completed", dateCompleted: "Today" };
          if (m.id === 3) return { ...m, status: "active" };
          return m;
        })
      );

      // 5. Append verified ledger entry
      const newEntry: LedgerEntry = {
        id: `ledger-${Date.now()}`,
        name: "Milestone 2: SQL Indexing & Query Tuning",
        source: "Fintech Corp WIL Program",
        skills: [{ name: "Database Optimization", percentage: 85 }],
        date: "Just now",
        type: "Milestone",
        verifiedBy: "Fintech Corp Automator Sign-off",
        complexity: "Advanced"
      };
      setLedgerEntries(prev => [newEntry, ...prev]);

      setSubmittingMilestone(false);
    }, 1800);
  };

  // --- SVG Radar Chart Math Constants ---
  const size = 320;
  const center = size / 2;
  const radius = 100;
  const radarAxesCount = skills.length;

  // Generate radar grid paths
  const getGridPoints = (factor: number) => {
    const points = [];
    for (let i = 0; i < radarAxesCount; i++) {
      const angle = (i * 2 * Math.PI) / radarAxesCount - Math.PI / 2;
      const x = center + radius * factor * Math.cos(angle);
      const y = center + radius * factor * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  // Generate skill polygon points
  const getSkillPolygonPoints = (data: { name: string; value: number }[]) => {
    return data.map((skill, i) => {
      const angle = (i * 2 * Math.PI) / radarAxesCount - Math.PI / 2;
      const valPercentage = skill.value / 100;
      const x = center + radius * valPercentage * Math.cos(angle);
      const y = center + radius * valPercentage * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  };

  // Employer Benchmarks
  const employerBenchmarks = [
    { name: "React", value: 75 },
    { name: "C++", value: 80 },
    { name: "Network Subnetting", value: 90 },
    { name: "Database Optimization", value: 75 },
    { name: "Public Speaking", value: 80 },
    { name: "Conflict Resolution", value: 75 },
  ];

  // Filter entries
  const filteredEntries = ledgerEntries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.source.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (ledgerFilter === "all") return matchesSearch;
    if (ledgerFilter === "hard") {
      return matchesSearch && entry.skills.some(s => {
        const skillObj = skills.find(sk => sk.name === s.name);
        return skillObj && skillObj.type === "hard";
      });
    }
    if (ledgerFilter === "behavioral") {
      return matchesSearch && entry.skills.some(s => {
        const skillObj = skills.find(sk => sk.name === s.name);
        return skillObj && skillObj.type === "behavioral";
      });
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-8 bg-slate-950 p-4 sm:p-6 lg:p-8 rounded-2xl text-slate-100 border border-slate-900 shadow-2xl relative overflow-hidden">
      
      {/* Dynamic Futuristic Style Sheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radar-pulse {
          0% { transform: scale(0.9); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .radar-pulse-ring {
          animation: radar-pulse 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }
        .radar-pulse-ring-delayed {
          animation: radar-pulse 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          animation-delay: 1.5s;
        }
        .cyber-card {
          position: relative;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(51, 65, 85, 0.4);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        .cyber-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(rgba(13, 148, 136, 0.03) 50%, transparent 50%),
                      linear-gradient(90deg, rgba(13, 148, 136, 0.03) 50%, transparent 50%);
          background-size: 16px 16px;
          pointer-events: none;
          opacity: 0.3;
        }
        .glow-border-teal:hover {
          border-color: rgba(13, 148, 136, 0.8);
          box-shadow: 0 0 15px rgba(13, 148, 136, 0.25);
        }
        .glow-border-purple:hover {
          border-color: rgba(168, 85, 247, 0.8);
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.25);
        }
        .glass-gradient-teal {
          background: radial-gradient(circle at top left, rgba(13, 148, 136, 0.15), transparent 60%);
        }
        .glass-gradient-purple {
          background: radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.12), transparent 60%);
        }
      `}} />

      {/* Hero Cyber Header */}
      <div className="relative border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 glass-gradient-teal">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs tracking-wider uppercase">
            <Cpu className="h-4 w-4 animate-spin-slow text-teal-400" />
            Decentralized Competency Framework // Live Sync Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Student & Candidate Hub
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            A verified capabilities portal linking direct workspace proof to tech employers. Maintain proof metrics and secure work-integrated learning in real-time.
          </p>
        </div>

        {/* Tab Selection Header Info */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 flex gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-md bg-teal-950/40 text-teal-300 border border-teal-900/60 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
              Ledger Standard 1.0.3
            </span>
          </div>
        </div>
      </div>

      {/* Grid Dashboard - Top Panel */}
      <div className="grid gap-6 md:grid-cols-12">
        
        {/* ========================================================= */}
        {/* MODULE 1: Radar Chart & Score Overview (7 cols on desktop) */}
        {/* ========================================================= */}
        <div className="md:col-span-7 space-y-6">
          <div className="cyber-card rounded-xl p-6 glow-border-teal transition-all duration-300 relative">
            <div className="absolute top-0 right-0 h-[1px] w-1/3 bg-gradient-to-l from-teal-500 to-transparent" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Award className="h-5 w-5 text-teal-400" />
                  Adaptive Readiness Profile
                </h2>
                <p className="text-xs text-slate-400">Verifiable visual metrics (Hard vs Behavioral)</p>
              </div>

              {/* Overall Circular Readiness Score Widget */}
              <div className="flex items-center gap-3 bg-slate-950/60 px-3 py-2 border border-slate-800 rounded-lg shadow-inner">
                <div className="relative h-12 w-12 flex items-center justify-center">
                  {/* Circle SVG */}
                  <svg className="absolute transform -rotate-90" width="48" height="48">
                    <circle 
                      cx="24" 
                      cy="24" 
                      r="20" 
                      className="stroke-slate-800" 
                      strokeWidth="3.5" 
                      fill="transparent" 
                    />
                    <circle 
                      cx="24" 
                      cy="24" 
                      r="20" 
                      className="stroke-teal-400 transition-all duration-1000 ease-out" 
                      strokeWidth="3.5" 
                      fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - readinessScore / 2000)}`} // out of 2000 max Elo
                    />
                  </svg>
                  <span className="text-xs font-mono font-bold text-teal-300">{readinessScore}</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-teal-400 uppercase">Readiness Elo</div>
                  <div className="text-xs font-semibold text-slate-200">Tier A // Top 4.8%</div>
                </div>
              </div>
            </div>

            {/* Elo Moving Average Warning Badge */}
            <div className="mb-6 flex items-start gap-2 bg-teal-950/20 border border-teal-900/40 rounded-lg p-2.5">
              <Info className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-teal-300 leading-normal">
                <span className="font-semibold">Elo-Weighted Metric:</span> Recent complex projects carry heavier weight than introductory quizzes. Work accuracy & milestone compliance factor directly into your real-time ranking.
              </p>
            </div>

            {/* SVG Radar Chart Representation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {/* Radar Chart SVG Graphic */}
              <div className="relative bg-slate-950/40 border border-slate-900 rounded-lg p-2">
                <svg width={size} height={size} className="overflow-visible">
                  {/* Concentric grid rings */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((factor, idx) => (
                    <polygon
                      key={idx}
                      points={getGridPoints(factor)}
                      fill="none"
                      stroke="rgba(71, 85, 105, 0.25)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Concentric grid label markers */}
                  {[20, 40, 60, 80, 100].map((val, idx) => {
                    const factor = val / 100;
                    const angle = -Math.PI / 2; // First axis (React) pointing up
                    const x = center + radius * factor * Math.cos(angle);
                    const y = center + radius * factor * Math.sin(angle);
                    return (
                      <text 
                        key={idx} 
                        x={x + 5} 
                        y={y + 12} 
                        className="fill-slate-600 font-mono text-[9px] pointer-events-none"
                      >
                        {val}
                      </text>
                    );
                  })}

                  {/* Axes lines and text labels */}
                  {skills.map((skill, i) => {
                    const angle = (i * 2 * Math.PI) / radarAxesCount - Math.PI / 2;
                    const x2 = center + radius * Math.cos(angle);
                    const y2 = center + radius * Math.sin(angle);

                    // Text labels position
                    const labelFactor = 1.25;
                    const labelX = center + radius * labelFactor * Math.cos(angle);
                    const labelY = center + radius * labelFactor * Math.sin(angle);
                    
                    // Center adjustment
                    let anchor = "middle";
                    if (Math.cos(angle) > 0.1) anchor = "start";
                    if (Math.cos(angle) < -0.1) anchor = "end";

                    return (
                      <g key={i}>
                        {/* Ray */}
                        <line
                          x1={center}
                          y1={center}
                          x2={x2}
                          y2={y2}
                          stroke="rgba(71, 85, 105, 0.4)"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                        {/* Interactive Axis Hover Area */}
                        <line
                          x1={center}
                          y1={center}
                          x2={x2}
                          y2={y2}
                          stroke="transparent"
                          strokeWidth="15"
                          className="cursor-pointer"
                          onMouseEnter={() => setSkillsHovered(skill.name)}
                          onMouseLeave={() => setSkillsHovered(null)}
                        />
                        {/* Label Text */}
                        <text
                          x={labelX}
                          y={labelY + 3}
                          textAnchor={anchor}
                          className={`font-mono text-[10px] tracking-tight cursor-help transition-all ${
                            skillsHovered === skill.name ? "fill-teal-300 font-semibold" : "fill-slate-400"
                          }`}
                          onMouseEnter={() => setSkillsHovered(skill.name)}
                          onMouseLeave={() => setSkillsHovered(null)}
                        >
                          {skill.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Employer Benchmark Polygon */}
                  <polygon
                    points={getSkillPolygonPoints(employerBenchmarks)}
                    fill="rgba(168, 85, 247, 0.05)"
                    stroke="rgba(168, 85, 247, 0.45)"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />

                  {/* Student Actual Skill Polygon */}
                  <polygon
                    points={getSkillPolygonPoints(skills)}
                    fill="rgba(13, 148, 136, 0.25)"
                    stroke="rgba(13, 148, 136, 0.95)"
                    strokeWidth="2.5"
                    className="transition-all duration-700"
                  />

                  {/* Student actual point nodes */}
                  {skills.map((skill, i) => {
                    const angle = (i * 2 * Math.PI) / radarAxesCount - Math.PI / 2;
                    const valPercentage = skill.value / 100;
                    const x = center + radius * valPercentage * Math.cos(angle);
                    const y = center + radius * valPercentage * Math.sin(angle);

                    const isHovered = skillsHovered === skill.name;

                    return (
                      <g key={i}>
                        {/* Pulsing ring for hovered nodes */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 8 : 4}
                          className={`${
                            skill.name === "Database Optimization" && submittingMilestone ? "animate-ping" : ""
                          } fill-teal-400/30 stroke-teal-400 stroke transition-all`}
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="3"
                          className="fill-teal-300 stroke-slate-900 stroke-2"
                          onMouseEnter={() => setSkillsHovered(skill.name)}
                          onMouseLeave={() => setSkillsHovered(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Radar Interactive Floating Tooltip */}
                {skillsHovered && (
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 border border-teal-800/80 px-3 py-1.5 rounded text-center text-xs font-mono text-teal-300 shadow-[0_0_10px_rgba(13,148,136,0.2)]">
                    {skillsHovered}: <span className="font-bold text-teal-100">{skills.find(s => s.name === skillsHovered)?.value}%</span> 
                    <span className="text-slate-500 mx-1.5">|</span>
                    Target Standard: <span className="text-purple-400 font-semibold">{employerBenchmarks.find(b => b.name === skillsHovered)?.value}%</span>
                  </div>
                )}
              </div>

              {/* Skill Breakdowns List */}
              <div className="flex-1 space-y-3 w-full">
                <h3 className="text-xs font-semibold text-slate-300 font-mono tracking-wider uppercase border-b border-slate-800/60 pb-1.5">
                  Live Skills Ledger
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {skills.map((skill) => {
                    const benchmark = employerBenchmarks.find(b => b.name === skill.name)?.value || 0;
                    const diff = skill.value - benchmark;
                    const isExceeding = diff >= 0;

                    return (
                      <div 
                        key={skill.name}
                        className={`p-2 rounded border transition-all ${
                          skillsHovered === skill.name 
                            ? "bg-slate-900/80 border-teal-700" 
                            : "bg-slate-950/40 border-slate-900"
                        }`}
                        onMouseEnter={() => setSkillsHovered(skill.name)}
                        onMouseLeave={() => setSkillsHovered(null)}
                      >
                        <div className="flex justify-between items-center text-xs font-mono mb-1">
                          <span className={skill.type === "hard" ? "text-slate-200" : "text-teal-300/90"}>
                            {skill.name} <span className="text-[10px] text-slate-500 font-normal">({skill.type})</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-teal-400">{skill.value}%</span>
                            <span className="text-slate-600">/</span>
                            <span className="text-purple-400 text-[10px]">{benchmark}%</span>
                          </div>
                        </div>
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden relative">
                          {/* Benchmark Tick Indicator */}
                          <div 
                            className="absolute top-0 bottom-0 w-[2px] bg-purple-500/80 z-10" 
                            style={{ left: `${benchmark}%` }}
                            title={`Employer Threshold: ${benchmark}%`}
                          />
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              isExceeding ? "bg-teal-500" : "bg-amber-500/80"
                            }`} 
                            style={{ width: `${skill.value}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODULE 1.3: Employer Radar Simulator Card (5 cols on desktop) */}
        {/* ========================================================= */}
        <div className="md:col-span-5 space-y-6">
          <div className="cyber-card rounded-xl p-6 glow-border-purple transition-all duration-300 relative h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 h-[1px] w-1/3 bg-gradient-to-l from-purple-500 to-transparent" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    Employer Live-Signal
                  </h2>
                  <p className="text-xs text-slate-400">Simulate backend search ping</p>
                </div>
                
                {/* Sonar sweep active state badge */}
                {radarActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 shadow-[0_0_10px_rgba(16,185,129,0.15)] animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    RADAR LIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600"></span>
                    STANDBY
                  </span>
                )}
              </div>

              {/* Radar Simulator Scan Graphic */}
              <div className="relative h-32 bg-slate-950/60 border border-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                {radarActive ? (
                  <>
                    {/* Ripple Rings */}
                    <div className="absolute h-8 w-8 rounded-full border border-teal-500/80 bg-teal-500/5 radar-pulse-ring" />
                    <div className="absolute h-8 w-8 rounded-full border border-teal-500/40 bg-teal-500/5 radar-pulse-ring-delayed" />
                    
                    {/* Scanning Sweeper Line */}
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-500/10 via-transparent to-transparent origin-bottom animate-spin" style={{ animationDuration: '4s' }} />

                    {/* Simulation indicators */}
                    <div className="z-10 text-center font-mono space-y-1">
                      <div className="text-xs font-semibold text-teal-300">Pinging Employer Grid...</div>
                      <div className="text-[10px] text-slate-400">Broadcasting Anonymized Token #CAN-8841</div>
                      <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-center gap-3">
                        <span className="flex items-center gap-1 text-teal-400">
                          <Eye className="h-3 w-3" /> {radarStats.viewers} Active Viewers
                        </span>
                        <span className="text-slate-700">|</span>
                        <span className="flex items-center gap-1 text-purple-400">
                          <Users className="h-3 w-3" /> {radarStats.requests24h} Unlocks
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center font-mono text-xs text-slate-500 p-4">
                    <p>Employer Radar Signal is currently offline.</p>
                    <p className="text-[10px] text-slate-600 mt-1">Activate signal to broadcast your verified skill indexes anonymized.</p>
                  </div>
                )}
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between bg-slate-950/40 border border-slate-900/60 p-3 rounded-lg">
                <span className="text-xs font-mono text-slate-300">Broadcast live verified index</span>
                <button
                  type="button"
                  onClick={() => setRadarActive(!radarActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    radarActive ? "bg-teal-500" : "bg-slate-800"
                  }`}
                >
                  <span className="sr-only">Toggle Radar</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-100 shadow ring-0 transition duration-200 ease-in-out ${
                      radarActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Mini Anonymized Preview Box */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">Employer Search Result Card (Preview)</span>
                
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-mono text-xs relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-purple-500 via-transparent to-transparent" />
                  
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-slate-200 font-bold">Candidate Token #CAN-8841</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> Kampar, Perak (Anonymized)
                      </div>
                    </div>
                    <Badge variant="accent" className="font-mono bg-purple-950/40 border-purple-900 text-purple-300">
                      94% Alignment
                    </Badge>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hard Capabilities Verified:</span>
                      <span className="text-teal-400 text-right">Net Subnetting (92%), React (85%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Behavioral Score Verified:</span>
                      <span className="text-teal-400 text-right">Conflict Resolution (88%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ledger Recency Factor:</span>
                      <span className="text-emerald-400 text-right">High (1.0)</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button disabled className="w-full bg-purple-950/40 border border-purple-900/60 text-purple-300 cursor-not-allowed text-[11px] h-8">
                      <Lock className="h-3 w-3 mr-1.5" /> Request Full Unlock
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900">
              *Full unlocks reveal your name/resume only. Initial lock request costs employer 5 points.
            </div>
          </div>
        </div>
      </div>

      {/* Grid Dashboard - Middle Panel */}
      <div className="grid gap-6 md:grid-cols-12 mt-6">
        
        {/* ========================================================= */}
        {/* MODULE 2: Matchmaker swipe panel (5 cols on desktop) */}
        {/* ========================================================= */}
        <div className="md:col-span-5 space-y-6">
          <div className="cyber-card rounded-xl p-6 glow-border-purple transition-all duration-300 flex flex-col justify-between min-h-[460px]">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Live Matchmaker Portal
              </h2>
              <p className="text-xs text-slate-400 mb-6 font-mono">Dating-App Style Swipe Discovery</p>
              
              {/* Card stack viewport */}
              <div className="relative h-64 flex items-center justify-center">
                {currentIndex < discoveryCards.length ? (
                  // Map active cards
                  discoveryCards.map((job, idx) => {
                    if (idx < currentIndex) return null;
                    const isTop = idx === currentIndex;
                    
                    // Card stacking offsets for nice depth
                    const offset = (idx - currentIndex) * 8;
                    const scale = 1 - (idx - currentIndex) * 0.04;
                    const rotate = (idx - currentIndex) * 1.5;

                    return (
                      <div
                        key={job.id}
                        className={`absolute w-full max-w-[320px] rounded-xl border p-5 font-mono flex flex-col justify-between transition-all duration-300 ${
                          isTop 
                            ? "bg-slate-900 border-teal-500/50 shadow-[0_4px_20px_rgba(13,148,136,0.15)] z-20" 
                            : "bg-slate-950/90 border-slate-800/80 pointer-events-none z-10"
                        }`}
                        style={{
                          transform: `translateY(-${offset}px) scale(${scale}) rotate(${rotate}deg)`,
                          opacity: isTop ? 1 : 0.6,
                        }}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] text-purple-400 uppercase tracking-wider">{job.industry}</span>
                              <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{job.title}</h3>
                              <p className="text-xs text-slate-500">{job.company}</p>
                            </div>
                            <Badge variant="outline" className="text-[9px] bg-slate-950 font-normal">
                              {job.duration}
                            </Badge>
                          </div>

                          <div className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 bg-slate-950/40 p-2 rounded border border-slate-900">
                            {job.scope}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 block">Core Requirements:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {job.techStack.map(tech => {
                                const hasSkill = skills.find(s => s.name === tech);
                                const benchmark = job.requiredSkills.find(r => r.name === tech)?.minScore || 0;
                                const isQualified = hasSkill && hasSkill.value >= benchmark;

                                return (
                                  <span 
                                    key={tech}
                                    className={`text-[9.5px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                                      isQualified 
                                        ? "bg-teal-950/40 border-teal-900 text-teal-300"
                                        : "bg-slate-900 border-slate-800 text-slate-400"
                                    }`}
                                  >
                                    {tech} {benchmark > 0 ? `(Req: ${benchmark}%)` : ""}
                                    {isQualified && <CheckCircle2 className="h-2.5 w-2.5 text-teal-400 inline" />}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 border-t border-slate-800/80 pt-3 text-[10px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Coins className="h-3.5 w-3.5 text-amber-500" /> {job.stipend}
                          </span>
                          <span className="text-teal-400 font-semibold flex items-center gap-1">
                            {job.culture[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center font-mono text-xs text-slate-500 border border-slate-900 rounded-lg p-6 bg-slate-950/40 w-full max-w-[320px]">
                    <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-pulse" />
                    <p className="font-semibold text-slate-300">Stack Cleared!</p>
                    <p className="text-[10px] text-slate-600 mt-1">We processed {discoveryCards.length} potential fits. {appliedJobs.length} applied, {passedJobsCount} passed.</p>
                    <Button variant="outline" size="sm" onClick={resetStack} className="mt-4 border-slate-800 hover:bg-slate-900 font-mono text-xs">
                      Reset Deck
                    </Button>
                  </div>
                )}
              </div>

              {/* Discovery Buttons */}
              {currentIndex < discoveryCards.length && (
                <div className="flex justify-center gap-6 mt-4">
                  <button 
                    onClick={handlePass}
                    className="h-12 w-12 rounded-full border border-red-900 bg-red-950/10 hover:bg-red-950/30 text-red-400 flex items-center justify-center shadow-lg transition-transform active:scale-90 hover:scale-105"
                    title="Pass Job"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={() => handleApply(discoveryCards[currentIndex])}
                    className="h-12 w-12 rounded-full border border-teal-600 bg-teal-950/30 hover:bg-teal-950/50 text-teal-400 flex items-center justify-center shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-transform active:scale-90 hover:scale-105"
                    title="Apply & Express Interest"
                  >
                    <Heart className="h-6 w-6 fill-teal-400/20" />
                  </button>
                </div>
              )}
            </div>

            {/* Display list of simulated matched/applied roles */}
            <div className="mt-6 border-t border-slate-800/80 pt-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Applied Matches Tracker</span>
              {appliedJobs.length === 0 ? (
                <span className="text-[11px] font-mono text-slate-600 block italic">No applications active in this session.</span>
              ) : (
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {appliedJobs.map((job) => (
                    <div key={job.id} className="flex justify-between items-center text-[10px] font-mono bg-slate-950/50 border border-slate-900 px-2.5 py-1 rounded">
                      <span className="text-slate-300 truncate max-w-[180px]">{job.title}</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> Submitted
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODULE 2.2: Micro-Internship Milestone Tracker (7 cols) */}
        {/* ========================================================= */}
        <div className="md:col-span-7 space-y-6">
          <div className="cyber-card rounded-xl p-6 glow-border-teal transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal-400" />
                    Micro-Internship Scope & Smart Sign-off
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">Work-Integrated Learning (Active Assignment)</p>
                </div>
                <Badge variant="accent" className="font-mono bg-teal-950/40 border-teal-900 text-teal-300">
                  Active Project
                </Badge>
              </div>

              {/* Internship Title Details */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs my-4 space-y-2">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Project Name:</span>
                  <span className="text-teal-400">Enterprise Database Migration</span>
                </div>
                <div className="flex justify-between">
                  <span>Host Employer:</span>
                  <span className="text-slate-300">Fintech Corp (Partner)</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Hours:</span>
                  <span className="text-slate-300">30 hrs total // 10 hrs per milestone</span>
                </div>
                <div className="flex justify-between">
                  <span>Stipend Allocation:</span>
                  <span className="text-amber-400">RM 1,200 (Upon ledger verification)</span>
                </div>
                <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 leading-relaxed">
                  Smart Contract Escrow holds stipend. Proof of competency delivery automatically signs off milestone releases.
                </div>
              </div>

              {/* Milestones Vertical Progress Tracker */}
              <div className="space-y-4 relative mt-6">
                {/* Vertical timeline trace line */}
                <div className="absolute left-[13px] top-2 bottom-2 w-[2px] bg-slate-800" />

                {milestones.map((m) => {
                  const isCompleted = m.status === "completed";
                  const isActive = m.status === "active";
                  const isLocked = m.status === "locked";

                  return (
                    <div key={m.id} className="flex gap-4 relative">
                      {/* Node circle indicators */}
                      <div className="relative z-10 mt-1">
                        {isCompleted && (
                          <div className="h-7 w-7 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </div>
                        )}
                        {isActive && (
                          <div className="h-7 w-7 rounded-full bg-teal-950 border border-teal-400 flex items-center justify-center shadow-[0_0_10px_rgba(13,148,136,0.5)] animate-pulse">
                            <div className="h-2 w-2 rounded-full bg-teal-400" />
                          </div>
                        )}
                        {isLocked && (
                          <div className="h-7 w-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                            <Lock className="h-3.5 w-3.5 text-slate-600" />
                          </div>
                        )}
                      </div>

                      {/* Milestone Card text */}
                      <div className={`flex-1 font-mono text-xs rounded-lg p-3 border transition-colors ${
                        isCompleted ? "bg-slate-900/40 border-slate-800/50 text-slate-400" :
                        isActive ? "bg-slate-900 border-teal-900/60 shadow-[0_0_15px_rgba(13,148,136,0.05)] text-slate-200" :
                        "bg-slate-950/20 border-slate-900/60 text-slate-600"
                      }`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold ${isActive ? "text-teal-300" : ""}`}>{m.title}</span>
                          {isCompleted && <span className="text-[10px] text-emerald-500 font-semibold">Done: {m.dateCompleted}</span>}
                          {isActive && <span className="text-[10px] text-teal-400 font-semibold animate-pulse">In Progress</span>}
                        </div>
                        {isActive && m.description && <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{m.description}</p>}
                        {isLocked && m.description && <p className="text-[11px] text-slate-700 leading-relaxed">{m.description}</p>}
                        
                        <div className="flex justify-between items-center mt-2 border-t border-slate-800/40 pt-1.5 text-[10px]">
                          <span className={isCompleted ? "text-slate-500" : isActive ? "text-teal-400" : "text-slate-700"}>
                            Reward: {m.reward}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Action Block */}
            <div className="mt-8 pt-4 border-t border-slate-900">
              {milestones.find(m => m.id === 2)?.status === "active" ? (
                <Button 
                  onClick={handleSubmitMilestone}
                  disabled={submittingMilestone}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-mono text-xs h-10 shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all font-bold"
                >
                  {submittingMilestone ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent animate-spin rounded-full inline-block"></span>
                      Evaluating Proof Metadata & Submitting Ledger...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      Submit Deliverable for Review <Send className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              ) : (
                <div className="text-center font-mono text-xs text-slate-500 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
                  All active internship milestones for this module are completed!
                  <div className="text-[10px] text-slate-600 mt-0.5">Your profile has been credited with +5% in database optimization.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Competency Ledger Section - Bottom Full Width */}
      <div className="mt-8 border-t border-slate-900 pt-8">
        <div className="cyber-card rounded-xl p-6 glow-border-teal transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-teal-400" />
                The Competency Ledger
              </h2>
              <p className="text-xs text-slate-400">Chronological feed of verified capability proofs</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search ledger entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 font-mono text-xs text-slate-300 focus:outline-none focus:border-teal-700"
                />
              </div>

              {/* Type Category selection */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 flex gap-1 font-mono text-[10px]">
                <button
                  onClick={() => setLedgerFilter("all")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    ledgerFilter === "all" ? "bg-teal-950/40 text-teal-300 border border-teal-900/60" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  All Skills
                </button>
                <button
                  onClick={() => setLedgerFilter("hard")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    ledgerFilter === "hard" ? "bg-teal-950/40 text-teal-300 border border-teal-900/60" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Hard Skills
                </button>
                <button
                  onClick={() => setLedgerFilter("behavioral")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    ledgerFilter === "behavioral" ? "bg-teal-950/40 text-teal-300 border border-teal-900/60" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Behavioral
                </button>
              </div>
            </div>
          </div>

          {/* Ledger table/feed list */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center font-mono text-xs text-slate-600 py-10 bg-slate-950/20 border border-slate-900 rounded-lg">
                No verified ledger activities found.
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div 
                  key={entry.id}
                  className="group relative bg-slate-950/40 border border-slate-900/80 hover:border-slate-800/80 rounded-xl p-4 transition-all duration-200"
                >
                  {/* Glowing vertical bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-md" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 text-xs font-bold">{entry.name}</span>
                        <span className="text-[10px] text-slate-500">({entry.date})</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Source: <span className="text-slate-300 font-semibold">{entry.source}</span>
                      </div>
                    </div>

                    {/* Right column: Verification check badge */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Skill Tag */}
                      <div className="flex gap-1.5">
                        {entry.skills.map(s => (
                          <span 
                            key={s.name}
                            className="text-[10px] px-2 py-0.5 rounded-full border border-slate-800 bg-slate-900 text-teal-300 flex items-center gap-1 font-semibold"
                          >
                            {s.name} ({s.percentage}%)
                          </span>
                        ))}
                      </div>

                      {/* Verification badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/30 text-emerald-400 border border-emerald-900/40">
                        <UserCheck className="h-3.5 w-3.5" />
                        Verified: {entry.verifiedBy}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MATCHMAKER IT'S A MATCH SUCCESS OVERLAY MODAL */}
      {/* ========================================================= */}
      {jobMatchModal.active && jobMatchModal.job && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div 
            className="w-full max-w-md bg-slate-900 border border-teal-500 rounded-2xl p-6 shadow-[0_0_30px_rgba(13,148,136,0.3)] text-center font-mono text-slate-100 space-y-6 relative overflow-hidden"
            style={{ animation: 'float-slow 6s ease-in-out infinite' }}
          >
            {/* Background elements */}
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-teal-500/10 blur-xl" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-purple-500/10 blur-xl" />

            <div className="space-y-2 relative">
              <Sparkles className="h-12 w-12 text-teal-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-purple-400 bg-clip-text text-transparent uppercase">
                IT&apos;S A MATCH!
              </h3>
              <p className="text-xs text-slate-400">Two-Sided Skill Threshold Aligned</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
              <div className="flex justify-between items-center text-slate-300">
                <span>Employer:</span>
                <span className="font-bold text-slate-100">{jobMatchModal.job.company}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Project Scope:</span>
                <span className="font-bold text-teal-400">{jobMatchModal.job.title}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 text-left">
                <span className="text-[10px] text-slate-500 block mb-1">Match Alignment Data:</span>
                <div className="space-y-1 text-slate-400">
                  {jobMatchModal.job.requiredSkills.map(req => {
                    const studentSkill = skills.find(s => s.name === req.name)?.value || 0;
                    return (
                      <div key={req.name} className="flex justify-between font-semibold">
                        <span>Your {req.name} verified skill:</span>
                        <span className="text-teal-400">{studentSkill}%</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Employer target threshold:</span>
                    <span>{jobMatchModal.job.requiredSkills[0].minScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your Adaptive Readiness Profile meets the employer&apos;s verified requirements. The employer has been notified and holds priority access to request token unlock.
            </p>

            <div className="flex gap-3 relative pt-2">
              <Button 
                onClick={() => setJobMatchModal({ active: false, job: null })}
                className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold h-10 border-none rounded-lg"
              >
                Close & Keep Swiping
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
