import Link from "next/link";
import { MapPin, Clock, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/types";
import { JOB_TYPE_LABELS, REMOTE_TYPE_LABELS } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

export function JobCard({ job, matchScore }: { job: Job; matchScore?: number }) {
  return (
    <Link href={`/candidate/jobs/${job.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold leading-tight">{job.title}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {job.company}
              </div>
            </div>
            {matchScore !== undefined && (
              <Badge variant="accent">{matchScore}% match</Badge>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeDate(job.postedAt)}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{JOB_TYPE_LABELS[job.type]}</Badge>
            <Badge variant="outline">{REMOTE_TYPE_LABELS[job.remote]}</Badge>
            {job.salary && <Badge variant="outline">{job.salary}</Badge>}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {job.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="accent" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
