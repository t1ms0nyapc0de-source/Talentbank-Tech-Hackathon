import { MarketingNav } from "@/components/marketing/nav";
import { Hero, Features, Audiences, Impact, CTA, Footer } from "@/components/marketing/sections";

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main>
        <Hero />
        <Features />
        <Audiences />
        <Impact />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
