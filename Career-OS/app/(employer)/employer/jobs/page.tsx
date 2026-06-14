"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/dashboard/stat-card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import { mockJobs } from "@/lib/mock/jobs";
import type { Job, JobType, RemoteType } from "@/lib/types";
import { JOB_TYPE_LABELS, REMOTE_TYPE_LABELS } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

const emptyJob = {
  title: "",
  company: "",
  location: "",
  type: "full-time" as JobType,
  remote: "hybrid" as RemoteType,
  tags: "",
  description: "",
  requirements: "",
  salary: "",
};

export default function EmployerJobsPage() {
  const user = useAuthStore((s) => s.user)!;
  const employerJobs = useApplicationStore((s) => s.employerJobs);
  const addEmployerJob = useApplicationStore((s) => s.addEmployerJob);
  const updateEmployerJob = useApplicationStore((s) => s.updateEmployerJob);
  const deleteEmployerJob = useApplicationStore((s) => s.deleteEmployerJob);

  const ownedJobs = [
    ...mockJobs.filter((j) => j.employerId === user.id),
    ...employerJobs.filter((j) => j.employerId === user.id),
  ];

  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const resetForm = () => {
    setForm({ ...emptyJob, company: user.company ?? "" });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.title || !form.company) {
      toast.error("Title and company are required.");
      return;
    }

    const jobData = {
      title: form.title,
      company: form.company,
      location: form.location || "Remote",
      type: form.type,
      remote: form.remote,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      description: form.description,
      requirements: form.requirements.split("\n").map((r) => r.trim()).filter(Boolean),
      salary: form.salary || undefined,
      postedAt: new Date().toISOString().split("T")[0],
      employerId: user.id,
    };

    if (editingId) {
      updateEmployerJob(editingId, jobData);
      toast.success("Job updated!");
    } else {
      addEmployerJob({ id: `job-custom-${Date.now()}`, ...jobData });
      toast.success("Job posted!");
    }

    setOpen(false);
    resetForm();
  };

  const handleEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      remote: job.remote,
      tags: job.tags.join(", "),
      description: job.description,
      requirements: job.requirements.join("\n"),
      salary: job.salary ?? "",
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteEmployerJob(id);
    toast.success("Job removed.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Jobs</h1>
          <p className="text-muted-foreground">Post and manage your job listings.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="accent" onClick={() => { resetForm(); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Job" : "Post a New Job"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Software Engineer" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as JobType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Work Style</Label>
                  <Select value={form.remote} onValueChange={(v) => setForm({ ...form, remote: v as RemoteType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(REMOTE_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Salary (optional)</Label>
                <Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="$60,000–$80,000" />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, TypeScript, Node.js" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Requirements (one per line)</Label>
                <Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
              <Button variant="accent" onClick={handleSubmit}>
                {editingId ? "Save Changes" : "Post Job"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {ownedJobs.length === 0 ? (
        <EmptyState
          title="No job postings yet"
          description="Create your first job listing to start receiving applications from qualified candidates."
          action={
            <Button variant="accent" onClick={() => { resetForm(); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Post Your First Job
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {ownedJobs.map((job) => {
            const isCustom = job.id.startsWith("job-custom-");
            return (
              <Card key={job.id}>
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.location} · Posted {formatRelativeDate(job.postedAt)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{JOB_TYPE_LABELS[job.type]}</Badge>
                      <Badge variant="outline">{REMOTE_TYPE_LABELS[job.remote]}</Badge>
                      {job.salary && <Badge variant="accent">{job.salary}</Badge>}
                    </div>
                  </div>
                  {isCustom && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
