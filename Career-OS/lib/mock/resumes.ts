import type { Resume } from "@/lib/types";

export const seedResumes: Record<string, Resume> = {
  "user-candidate-1": {
    headline: "Computer Science Student · Aspiring Software Engineer",
    summary:
      "Junior CS major with hands-on experience in full-stack web development. Passionate about building accessible, user-centered applications and contributing to open-source projects.",
    skills: ["React", "TypeScript", "Node.js", "Python", "Git", "SQL", "JavaScript"],
    location: "Boston, MA",
    phone: "(617) 555-0142",
    education: [
      {
        id: "edu-1",
        school: "State University",
        degree: "B.S.",
        field: "Computer Science",
        startYear: "2023",
        endYear: "2027",
      },
    ],
    experience: [
      {
        id: "exp-1",
        company: "Campus IT Services",
        title: "Student Developer",
        startDate: "Sep 2024",
        endDate: "Present",
        description:
          "Built internal tools using React and Node.js. Maintained student portal features used by 5,000+ users.",
      },
    ],
  },
  "user-candidate-2": {
    headline: "Business Analytics Major · Data-Driven Problem Solver",
    summary:
      "Senior business student with strong analytical skills and experience in data visualization, market research, and client presentations.",
    skills: ["Python", "SQL", "Tableau", "Excel", "Machine Learning", "Sales", "Communication"],
    location: "Chicago, IL",
    phone: "(312) 555-0198",
    education: [
      {
        id: "edu-2",
        school: "Midwest University",
        degree: "B.B.A.",
        field: "Business Analytics",
        startYear: "2022",
        endYear: "2026",
      },
    ],
    experience: [
      {
        id: "exp-2",
        company: "Retail Insights Co.",
        title: "Analytics Intern",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        description:
          "Analyzed sales data for 200+ SKUs. Built Tableau dashboards that informed pricing strategy decisions.",
      },
    ],
  },
};
