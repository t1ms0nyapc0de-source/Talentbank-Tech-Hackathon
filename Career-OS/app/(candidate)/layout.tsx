import { AppShell } from "@/components/layout/app-shell";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell role="candidate">{children}</AppShell>;
}
