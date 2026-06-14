"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobFilters } from "@/lib/types";
import { JOB_TYPE_LABELS, REMOTE_TYPE_LABELS } from "@/lib/types";

interface JobSearchFiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  resultCount: number;
}

export function JobSearchFilters({ filters, onChange, resultCount }: JobSearchFiltersProps) {
  const hasFilters =
    filters.query || filters.location || filters.type !== "all" || filters.remote !== "all";

  const clearFilters = () =>
    onChange({ query: "", location: "", type: "all", remote: "all" });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, company, or keyword..."
            className="pl-9"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
          />
        </div>
        <Input
          placeholder="Location"
          className="sm:w-48"
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.type}
          onValueChange={(v) => onChange({ ...filters, type: v as JobFilters["type"] })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.remote}
          onValueChange={(v) => onChange({ ...filters, remote: v as JobFilters["remote"] })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Work style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All styles</SelectItem>
            {Object.entries(REMOTE_TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
        <span className="ml-auto text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "job" : "jobs"} found
        </span>
      </div>
    </div>
  );
}
