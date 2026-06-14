"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useApplicationStore } from "@/lib/stores/application-store";
import type { Job } from "@/lib/types";

export function ApplyButton({ job }: { job: Job }) {
  const user = useAuthStore((s) => s.user);
  const apply = useApplicationStore((s) => s.apply);
  const hasApplied = useApplicationStore((s) => s.hasApplied);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const alreadyApplied = hasApplied(job.id, user.id);

  const handleApply = () => {
    const result = apply({
      jobId: job.id,
      candidateId: user.id,
      candidateName: user.name,
      candidateEmail: user.email,
      note: note || undefined,
    });
    if (result.success) {
      toast.success(`Application submitted for ${job.title}!`);
      setOpen(false);
      setNote("");
    } else {
      toast.error(result.error);
    }
  };

  if (alreadyApplied) {
    return (
      <Button disabled variant="secondary" className="w-full sm:w-auto">
        Already Applied
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent" className="w-full sm:w-auto">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to {job.title}</DialogTitle>
          <DialogDescription>
            at {job.company} · Your profile will be shared with the employer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="note">Cover note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Why are you interested in this role?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={handleApply}>
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
