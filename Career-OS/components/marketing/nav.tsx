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
        {/* Left Links - 1/3 width to align things properly */}
        <nav className="hidden items-center gap-8 md:flex md:w-1/3">
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
        
        {/* Mobile space layout helper */}
        <div className="md:hidden flex-1"></div>

        {/* Logo and title of the website at the mid top of the webpage */}
        <div className="flex justify-center md:w-1/3">
          <Logo />
        </div>

        {/* Right buttons - 1/3 width */}
        <div className="flex items-center justify-end gap-3 md:w-1/3 flex-1 md:flex-initial">
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
