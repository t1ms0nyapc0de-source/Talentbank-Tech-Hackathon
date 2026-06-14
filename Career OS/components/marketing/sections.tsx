import Link from "next/link";
import { ArrowRight, BarChart3, Briefcase, Search, Sparkles, Target, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: User,
    title: "Sign Up & Register",
    description: "One unified login for students, advisors, alumni, and employers across your career ecosystem.",
  },
  {
    icon: Briefcase,
    title: "Profile & Resume Builder",
    description: "Structured profiles with live resume preview that power personalized guidance at every step.",
  },
  {
    icon: Search,
    title: "Job Listings & Search",
    description: "Keyword search and smart filters across internships, co-ops, and full-time opportunities.",
  },
  {
    icon: Target,
    title: "Job Applications",
    description: "Streamlined apply flows with status tracking from first click to final offer.",
  },
  {
    icon: Sparkles,
    title: "Job Matching",
    description: "AI-informed matching scores connect students to roles that fit their skills and goals.",
  },
  {
    icon: BarChart3,
    title: "Candidate Dashboard",
    description: "Personalized command center for applications, matches, and career progress.",
  },
  {
    icon: Users,
    title: "Employer Dashboard",
    description: "Post jobs, review applicants, and measure hiring pipeline health in one place.",
  },
  {
    icon: BarChart3,
    title: "Board-Ready Reporting",
    description: "Prove your impact with engagement metrics and outcomes your leadership team needs.",
  },
];

export function Hero() {
  return (
    <section className="hero-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            The modern OS for university career centers
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Manage, personalize, and measure every step of the{" "}
            <span className="text-gradient">student career journey</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            CareerOS brings your entire career ecosystem—students, advisors, alumni, and employers—into one platform that saves time, boosts engagement, and proves your impact.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="accent" asChild>
              <Link href="/register">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">View Demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · Demo accounts available
          </p>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your career center needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            Unify your careers tech with one login, higher adoption, and tools that actually help students land jobs they love.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Audiences() {
  const audiences = [
    {
      title: "Students",
      description: "Get structure, guidance, and tools to land jobs you love—with personalized matching and a resume that stands out.",
      color: "bg-blue-50 border-blue-100",
    },
    {
      title: "Advisors",
      description: "See every student's journey in one place. Spend less time on admin and more time on meaningful career conversations.",
      color: "bg-teal-50 border-teal-100",
    },
    {
      title: "Alumni",
      description: "Stay connected to your university network. Mentor students, share opportunities, and give back to the community.",
      color: "bg-purple-50 border-purple-100",
    },
    {
      title: "Employers",
      description: "Reach qualified candidates directly through your partner university. Post jobs, review applicants, and build your pipeline.",
      color: "bg-amber-50 border-amber-100",
    },
  ];

  return (
    <section id="audiences" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for your entire ecosystem
          </h2>
          <p className="mt-4 text-muted-foreground">
            One platform that connects every stakeholder in the career journey.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.title} className={`rounded-xl border p-8 ${a.color}`}>
              <h3 className="text-xl font-semibold">{a.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Impact() {
  const stats = [
    { value: "3x", label: "Higher student engagement" },
    { value: "40%", label: "Less advisor admin time" },
    { value: "85%", label: "Employer satisfaction rate" },
    { value: "1", label: "Login for everything" },
  ];

  return (
    <section id="impact" className="py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Prove your impact
          </h2>
          <p className="mt-4 text-primary-foreground/70">
            Board-ready reporting that shows engagement, outcomes, and ROI—so you can advocate for the resources your students deserve.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-accent">{stat.value}</div>
              <div className="mt-2 text-sm text-primary-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-accent/5 p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to transform your career center?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join universities using CareerOS to deliver personalized, data-driven career journeys for every student.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="accent" asChild>
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In to Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              C
            </div>
            Career<span className="text-accent">OS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareerOS. The modern operating system for university career centers.
          </p>
        </div>
      </div>
    </footer>
  );
}
