"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Send, 
  Sparkles, 
  Calendar,
  DollarSign,
  MapPin,
  Clock
} from "lucide-react";

interface CandidateInfo {
  id: string;
  name: string;
  email: string;
  roleType: string;
  rejectionReason: "timing" | "salary" | "location" | "role_fit";
  timeline: string;
  location: string;
  expectedSalary: string;
}

interface AlumniNudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateInfo | null;
  onSend: (candidateId: string) => void;
}

export function AlumniNudgeModal({ isOpen, onClose, candidate, onSend }: AlumniNudgeModalProps) {
  const [templateType, setTemplateType] = useState<"quarterly" | "milestone" | "trigger">("trigger");
  
  if (!isOpen || !candidate) return null;

  const templates = {
    trigger: {
      subject: `Reconnecting: Growth Opportunities at our Technical Division`,
      body: `Hi ${candidate.name},\n\nI hope your career is moving with strong velocity! Since we last spoke regarding the ${candidate.roleType} position, we have adjusted our scope and alignment. Specifically, we've calibrated our resource brackets to better accommodate technical experts of your caliber. Given your steep trajectory and growth since we last connected, I'd love to set up a short 10-minute realignment touchpoint. Let me know if you have some availability this week.\n\nBest regards,\nTalent Acquisition Team`
    },
    quarterly: {
      subject: `Antigravity Engineering Briefing — Q2 Highlights`,
      body: `Hi ${candidate.name},\n\nWe wanted to share a quick update on how our engineering team has been elevating over the past quarter. We've rolled out two major serverless coordinate clusters and unlocked core vector matching pipelines. As part of our commitment to keeping our Talent Alumni warm, we share these highlights value-first before any ask. If you're curious about how our tech stack aligns with your current development vector, let's catch up!\n\nBest,\nAntigravity Tech Team`
    },
    milestone: {
      subject: `Checking in on your career trajectory`,
      body: `Hi ${candidate.name},\n\nIt has been a key milestone since we last synced. We've been tracking market dynamics and noticed that professionals with your skillset are in high demand. We have several new upwards-trending career corridors opening up, and we'd love to see where your trajectory is heading next. Let's schedule a casual catch-up when you have a free window.\n\nWarmly,\nTalent Architect Team`
    }
  };

  const currentTemplate = templates[templateType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-accent/10 border border-accent/20">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="text-md font-bold text-primary">
                Trigger Re-Engagement Nudge
              </h3>
              <p className="text-xs text-slate-400">
                Relationship-first, candidate-controlled outreach.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Candidate Stats Summary */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Candidate</span>
            <div className="font-bold text-primary">{candidate.name}</div>
            <div className="text-slate-500 font-mono text-[10px]">{candidate.email}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Historical Barrier</span>
            <div>
              <Badge variant="danger" className="text-[10px] uppercase font-bold tracking-wider">
                {candidate.rejectionReason === "salary" && "Salary Expectation"}
                {candidate.rejectionReason === "timing" && "Timing Mismatch"}
                {candidate.rejectionReason === "location" && "Location Mismatch"}
                {candidate.rejectionReason === "role_fit" && "Role Fit Calibration"}
              </Badge>
            </div>
          </div>

          <div className="col-span-2 mt-2 pt-2 border-t border-slate-200/50 grid grid-cols-3 gap-1">
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="h-3 w-3 text-accent shrink-0" />
              <span>{candidate.timeline}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <MapPin className="h-3 w-3 text-accent shrink-0" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold text-teal-700">
              <DollarSign className="h-3 w-3 text-teal-600 shrink-0" />
              <span>{candidate.expectedSalary}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 flex-1">
          {/* Template Selectors */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Choose Re-engagement Channel / Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType("trigger")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                  templateType === "trigger"
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Trigger Match
              </button>
              <button
                type="button"
                onClick={() => setTemplateType("quarterly")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                  templateType === "quarterly"
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Value Briefing
              </button>
              <button
                type="button"
                onClick={() => setTemplateType("milestone")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                  templateType === "milestone"
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Milestone Checkin
              </button>
            </div>
          </div>

          {/* Email Preview */}
          <div className="space-y-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject</span>
              <input
                type="text"
                readOnly
                value={currentTemplate.subject}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Message Preview</span>
              <textarea
                readOnly
                rows={7}
                value={currentTemplate.body}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 font-sans leading-relaxed focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="accent" 
            size="sm" 
            className="flex items-center gap-1.5 cursor-pointer shadow-sm"
            onClick={() => {
              onSend(candidate.id);
              onClose();
            }}
          >
            <Send className="h-3.5 w-3.5" />
            Launch Re-Engagement Outreach
          </Button>
        </div>
      </div>
    </div>
  );
}
