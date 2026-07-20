"use client";

import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/candidate/jobs">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to jobs
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            {job.company}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Posted {formatRelativeDate(job.postedAt)}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{JOB_TYPE_LABELS[job.type]}</Badge>
          <Badge variant="outline">{REMOTE_TYPE_LABELS[job.remote]}</Badge>
          {job.salary && <Badge variant="accent">{job.salary}</Badge>}
        </div>
      </div>

      <ApplyButton job={job} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <section>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </section>
          <section>
            <h2 className="font-semibold mb-2">Requirements</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {job.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-semibold mb-2">Skills & Tags</h2>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="accent">{tag}</Badge>
              ))}
            </div>
          </section>
          <p className="text-xs text-muted-foreground">Posted on {formatDate(job.postedAt)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
