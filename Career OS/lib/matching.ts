import type { Job, JobFilters, JobMatch, Resume } from "@/lib/types";
import { mockJobs } from "@/lib/mock/jobs";

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[\s,;/]+/)
    .filter((t) => t.length > 1);
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    if (filters.type !== "all" && job.type !== filters.type) return false;
    if (filters.remote !== "all" && job.remote !== filters.remote) return false;

    if (filters.location) {
      const loc = normalize(filters.location);
      if (!normalize(job.location).includes(loc)) return false;
    }

    if (filters.query) {
      const q = normalize(filters.query);
      const searchable = [
        job.title,
        job.company,
        job.description,
        ...job.tags,
        ...job.requirements,
      ]
        .join(" ")
        .toLowerCase();
      const tokens = tokenize(filters.query);
      const matchesAll = tokens.every((t) => searchable.includes(t));
      const matchesPhrase = searchable.includes(q);
      if (!matchesAll && !matchesPhrase) return false;
    }

    return true;
  });
}

export function scoreJobMatch(job: Job, resume: Resume): JobMatch {
  const candidateSkills = resume.skills.map(normalize);
  const candidateTokens = new Set([
    ...candidateSkills,
    ...tokenize(resume.headline),
    ...tokenize(resume.summary),
    ...resume.experience.flatMap((e) => [
      ...tokenize(e.title),
      ...tokenize(e.description),
    ]),
    ...resume.education.flatMap((e) => [
      ...tokenize(e.field),
      ...tokenize(e.degree),
    ]),
  ]);

  const jobTags = job.tags.map(normalize);
  const jobKeywords = [
    ...jobTags,
    ...tokenize(job.title),
    ...tokenize(job.description),
    ...job.requirements.flatMap(tokenize),
  ];

  const matchedSkills = jobTags.filter((tag) =>
    candidateSkills.some(
      (s) => s.includes(tag) || tag.includes(s)
    )
  );

  const matchedKeywords = [...new Set(jobKeywords)].filter((kw) => {
    if (matchedSkills.includes(kw)) return false;
    return [...candidateTokens].some(
      (t) => t.includes(kw) || kw.includes(t)
    );
  }).slice(0, 5);

  const allMatches = new Set([...matchedSkills, ...matchedKeywords]);
  const uniqueJobTerms = new Set(jobKeywords);
  const score =
    uniqueJobTerms.size > 0
      ? Math.round((allMatches.size / Math.min(uniqueJobTerms.size, 10)) * 100)
      : 0;

  return {
    job,
    score: Math.min(score, 100),
    matchedSkills,
    matchedKeywords,
  };
}

export function getJobMatches(resume: Resume, jobs: Job[] = mockJobs): JobMatch[] {
  return jobs
    .map((job) => scoreJobMatch(job, resume))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function getProfileCompletion(resume: Resume): number {
  const fields = [
    resume.headline,
    resume.summary,
    resume.location,
    resume.phone,
    resume.skills.length > 0,
    resume.education.length > 0,
    resume.experience.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
