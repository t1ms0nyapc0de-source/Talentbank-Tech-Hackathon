"use client";

import { useState, useMemo } from "react";
import { JobCard } from "@/components/jobs/job-card";
import { JobSearchFilters } from "@/components/jobs/job-filters";
import { EmptyState } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { useApplicationStore } from "@/lib/stores/application-store";
import { filterJobs } from "@/lib/matching";
import type { JobFilters } from "@/lib/types";

export default function JobsPage() {
  const getAllJobs = useApplicationStore((s) => s.getAllJobs);
  const jobs = getAllJobs();

  const [filters, setFilters] = useState<JobFilters>({
    query: "",
    location: "",
    type: "all",
    remote: "all",
  });

  const filtered = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <p className="text-muted-foreground">
          Search and filter opportunities from campus partners and employers.
        </p>
      </div>

      <JobSearchFilters
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Try adjusting your search terms or filters to find more opportunities."
          action={
            <Button variant="outline" onClick={() => setFilters({ query: "", location: "", type: "all", remote: "all" })}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
