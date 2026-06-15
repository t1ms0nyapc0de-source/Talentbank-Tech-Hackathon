"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileStore } from "@/lib/stores/profile-store";
import { ResumePreview } from "@/components/resume/resume-preview";

export function ResumeBuilder({ userId, userName }: { userId: string; userName: string }) {
  const resume = useProfileStore((s) => s.getResume(userId));
  const updateResume = useProfileStore((s) => s.updateResume);
  const addSkill = useProfileStore((s) => s.addSkill);
  const removeSkill = useProfileStore((s) => s.removeSkill);
  const addEducation = useProfileStore((s) => s.addEducation);
  const removeEducation = useProfileStore((s) => s.removeEducation);
  const addExperience = useProfileStore((s) => s.addExperience);
  const removeExperience = useProfileStore((s) => s.removeExperience);

  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    addSkill(userId, trimmed);
    setSkillInput("");
    toast.success(`Added skill: ${trimmed}`);
  };

  const handleSave = () => toast.success("Profile saved!");

  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList>
        <TabsTrigger value="edit">Edit Profile</TabsTrigger>
        <TabsTrigger value="preview">Resume Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  placeholder="Aspiring Software Engineer"
                  value={resume.headline}
                  onChange={(e) => updateResume(userId, { headline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Boston, MA"
                  value={resume.location}
                  onChange={(e) => updateResume(userId, { location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={resume.phone}
                onChange={(e) => updateResume(userId, { phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                placeholder="Brief overview of your background and career goals..."
                rows={4}
                value={resume.summary}
                onChange={(e) => updateResume(userId, { summary: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g. React, Python)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              />
              <Button variant="outline" onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent"
                >
                  {skill}
                  <button onClick={() => removeSkill(userId, skill)} className="cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Experience</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addExperience(userId, {
                  id: `exp-${Date.now()}`,
                  company: "",
                  title: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {resume.experience.length === 0 && (
              <p className="text-sm text-muted-foreground">No experience added yet.</p>
            )}
            {resume.experience.map((exp) => (
              <div key={exp.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Position</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeExperience(userId, exp.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Job title"
                    value={exp.title}
                    onChange={(e) => {
                      const updated = resume.experience.map((x) =>
                        x.id === exp.id ? { ...x, title: e.target.value } : x
                      );
                      updateResume(userId, { experience: updated });
                    }}
                  />
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = resume.experience.map((x) =>
                        x.id === exp.id ? { ...x, company: e.target.value } : x
                      );
                      updateResume(userId, { experience: updated });
                    }}
                  />
                  <Input
                    placeholder="Start date"
                    value={exp.startDate}
                    onChange={(e) => {
                      const updated = resume.experience.map((x) =>
                        x.id === exp.id ? { ...x, startDate: e.target.value } : x
                      );
                      updateResume(userId, { experience: updated });
                    }}
                  />
                  <Input
                    placeholder="End date"
                    value={exp.endDate}
                    onChange={(e) => {
                      const updated = resume.experience.map((x) =>
                        x.id === exp.id ? { ...x, endDate: e.target.value } : x
                      );
                      updateResume(userId, { experience: updated });
                    }}
                  />
                </div>
                <Textarea
                  placeholder="Describe your responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => {
                    const updated = resume.experience.map((x) =>
                      x.id === exp.id ? { ...x, description: e.target.value } : x
                    );
                    updateResume(userId, { experience: updated });
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addEducation(userId, {
                  id: `edu-${Date.now()}`,
                  school: "",
                  degree: "",
                  field: "",
                  startYear: "",
                  endYear: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {resume.education.length === 0 && (
              <p className="text-sm text-muted-foreground">No education added yet.</p>
            )}
            {resume.education.map((edu) => (
              <div key={edu.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Institution</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeEducation(userId, edu.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) => {
                      const updated = resume.education.map((x) =>
                        x.id === edu.id ? { ...x, school: e.target.value } : x
                      );
                      updateResume(userId, { education: updated });
                    }}
                  />
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = resume.education.map((x) =>
                        x.id === edu.id ? { ...x, degree: e.target.value } : x
                      );
                      updateResume(userId, { education: updated });
                    }}
                  />
                  <Input
                    placeholder="Field of study"
                    value={edu.field}
                    onChange={(e) => {
                      const updated = resume.education.map((x) =>
                        x.id === edu.id ? { ...x, field: e.target.value } : x
                      );
                      updateResume(userId, { education: updated });
                    }}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Start"
                      value={edu.startYear}
                      onChange={(e) => {
                        const updated = resume.education.map((x) =>
                          x.id === edu.id ? { ...x, startYear: e.target.value } : x
                        );
                        updateResume(userId, { education: updated });
                      }}
                    />
                    <Input
                      placeholder="End"
                      value={edu.endYear}
                      onChange={(e) => {
                        const updated = resume.education.map((x) =>
                          x.id === edu.id ? { ...x, endYear: e.target.value } : x
                        );
                        updateResume(userId, { education: updated });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button variant="accent" onClick={handleSave}>Save Profile</Button>
      </TabsContent>

      <TabsContent value="preview">
        <ResumePreview resume={resume} name={userName} />
      </TabsContent>
    </Tabs>
  );
}
