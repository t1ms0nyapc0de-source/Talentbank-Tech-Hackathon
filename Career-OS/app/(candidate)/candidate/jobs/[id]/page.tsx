"use client";

import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Clock, Globe, Users, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplyButton } from "@/components/jobs/apply-button";
import { useApplicationStore } from "@/lib/stores/application-store";
import { JOB_TYPE_LABELS, REMOTE_TYPE_LABELS } from "@/lib/types";
import { formatDate, formatRelativeDate } from "@/lib/utils";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const getAllJobs = useApplicationStore((s) => s.getAllJobs);
  const job = getAllJobs().find((j) => j.id === id);

  if (!job) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Job not found</h2>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/candidate/jobs">Back to jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/candidate/jobs">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to jobs
        </Link>
      </Button>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border rounded-xl p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              Posted {formatRelativeDate(job.postedAt)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary" className="font-semibold text-xs py-0.5">{JOB_TYPE_LABELS[job.type]}</Badge>
            <Badge variant="outline" className="font-semibold text-xs py-0.5">{REMOTE_TYPE_LABELS[job.remote]}</Badge>
            {job.salary && <Badge variant="accent" className="font-bold text-xs py-0.5">{job.salary}</Badge>}
          </div>
        </div>

        <div className="shrink-0">
          <ApplyButton job={job} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Job Details Card - 2 cols */}
        <Card className="md:col-span-2 bg-white border shadow-sm">
          <CardContent className="p-6 space-y-6">
            <section className="space-y-2">
              <h2 className="font-extrabold text-slate-800 text-base border-b pb-1">Role Description</h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">{job.description}</p>
            </section>
            
            <section className="space-y-2">
              <h2 className="font-extrabold text-slate-800 text-base border-b pb-1">Requirements</h2>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm font-normal">
                {job.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </section>
            
            <section className="space-y-2">
              <h2 className="font-extrabold text-slate-800 text-base border-b pb-1">Skills & Tags</h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.tags.map((tag) => (
                  <Badge key={tag} className="bg-accent/10 hover:bg-accent/10 text-accent border-transparent text-xs font-bold py-1 px-2.5">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </section>
            
            <p className="text-[10px] text-slate-400 font-semibold border-t pt-4">Posted on {formatDate(job.postedAt)}</p>
          </CardContent>
        </Card>

        {/* Company Details Sidebar - 1 col */}
        {job.companyDetails && (
          <Card className="bg-gradient-to-b from-white to-slate-50 border shadow-sm h-fit">
            <CardHeader className="pb-3 border-b bg-white rounded-t-xl">
              <CardTitle className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-accent" />
                About the Company
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-3">
                {job.companyDetails.description && (
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {job.companyDetails.description}
                  </p>
                )}
                
                <div className="space-y-2.5 text-xs pt-3 border-t">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Industry</span>
                    <span className="text-slate-700 font-semibold">{job.companyDetails.industry}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Company Size</span>
                    <span className="text-slate-700 font-semibold flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {job.companyDetails.size}
                    </span>
                  </div>

                  {job.companyDetails.headquarters && (
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Headquarters</span>
                      <span className="text-slate-700 font-semibold flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.companyDetails.headquarters}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Website</span>
                    <a 
                      href={job.companyDetails.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-accent hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <Globe className="h-3.5 w-3.5 text-accent" />
                      Visit site
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
