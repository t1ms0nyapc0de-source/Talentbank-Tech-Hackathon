import Link from "next/link";
import { MapPin, Clock, Building2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/types";
import { JOB_TYPE_LABELS, REMOTE_TYPE_LABELS } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

export function JobCard({ job, matchScore }: { job: Job; matchScore?: number }) {
  return (
    <Link href={`/candidate/jobs/${job.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md cursor-pointer border border-slate-200 hover:border-slate-300">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 leading-tight text-sm hover:text-accent transition-colors">{job.title}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {job.company}
                </div>
              </div>
              {matchScore !== undefined && (
                <Badge className="bg-teal-500 text-white text-[10px] shrink-0">{matchScore}% match</Badge>
              )}
            </div>

            {/* Industry and Size badges */}
            {job.companyDetails && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-400 font-semibold">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                  {job.companyDetails.industry}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {job.companyDetails.size}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-normal">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelativeDate(job.postedAt)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-[10px]">{JOB_TYPE_LABELS[job.type]}</Badge>
              <Badge variant="outline" className="text-[10px]">{REMOTE_TYPE_LABELS[job.remote]}</Badge>
              {job.salary && <Badge variant="accent" className="text-[10px]">{job.salary}</Badge>}
            </div>

            {/* Tags display */}
            <div className="flex flex-wrap gap-1 pt-1">
              {job.tags.map((tag) => (
                <Badge key={tag} className="bg-accent/10 hover:bg-accent/10 text-accent border-transparent text-[9px] font-bold py-0 px-1.5">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
