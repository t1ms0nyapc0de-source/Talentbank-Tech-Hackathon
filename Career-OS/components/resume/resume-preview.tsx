import type { Resume } from "@/lib/types";

export function ResumePreview({ resume, name }: { resume: Resume; name: string }) {
  return (
    <div className="rounded-xl border bg-white p-8 text-sm shadow-sm print:shadow-none">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">{name}</h2>
        {resume.headline && (
          <p className="mt-1 text-accent font-medium">{resume.headline}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {resume.location && <span>{resume.location}</span>}
          {resume.phone && <span>{resume.phone}</span>}
        </div>
      </div>

      {resume.summary && (
        <section className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Summary</h3>
          <p className="text-muted-foreground leading-relaxed">{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s) => (
              <span key={s} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Experience</h3>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold">{exp.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.startDate} – {exp.endDate}
                  </p>
                </div>
                <p className="text-sm text-accent">{exp.company}</p>
                <p className="mt-1 text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Education</h3>
          <div className="space-y-2">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <p className="font-semibold">{edu.school}</p>
                <p className="text-muted-foreground">
                  {edu.degree} in {edu.field} · {edu.startYear}–{edu.endYear}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!resume.headline && !resume.summary && resume.skills.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground italic">
          Start filling out your profile to see your resume preview.
        </p>
      )}
    </div>
  );
}
