import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold text-xl ${className ?? ""}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
        C
      </div>
      <span className="font-[family-name:var(--font-plus-jakarta)]">
        Career<span className="text-accent">OS</span>
      </span>
    </Link>
  );
}

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#audiences" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Who It&apos;s For
          </a>
          <a href="#impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Impact
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
