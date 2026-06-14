@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --font-sans: var(--font-dm-sans);
  --font-heading: var(--font-plus-jakarta);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: #f8fafc;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --popover: #ffffff;
  --popover-foreground: #0f172a;
  --primary: #0f2b4a;
  --primary-foreground: #f8fafc;
  --secondary: #e2e8f0;
  --secondary-foreground: #1e293b;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #0d9488;
  --accent-foreground: #ffffff;
  --destructive: #ef4444;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #0d9488;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading), system-ui, sans-serif;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
  }
  .hero-grid {
    background-image:
      linear-gradient(rgba(15, 43, 74, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(15, 43, 74, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }
}
