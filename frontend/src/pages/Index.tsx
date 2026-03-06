import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ContactDock from "@/components/ContactDock";
import CommandPalette from "@/components/CommandPalette";
import IntroOverlay from "@/components/IntroOverlay";

/* Lazy load heavier sections for performance */
const FakeDemo = lazy(() => import("@/components/FakeDemo"));
const ServiceConfigurator = lazy(() => import("@/components/ServiceConfigurator"));
const RoiCalculator = lazy(() => import("@/components/RoiCalculator"));
const ProcessPipeline = lazy(() => import("@/components/ProcessPipeline"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const DifferentialsSection = lazy(() => import("@/components/DifferentialsSection"));
const TechStackSLA = lazy(() => import("@/components/TechStackSLA"));

/* Section skeleton loader */
const SectionSkeleton = () => (
  <div className="section-padding">
    <div className="container mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="h-3 w-24 rounded-full bg-white/[0.04] animate-pulse" />
        <div className="h-8 w-72 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-white/[0.03] animate-pulse" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-white/[0.02] animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <IntroOverlay />
      <Header />
      <CommandPalette />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionSkeleton />}>
          <FakeDemo />
        </Suspense>
        <AboutSection />
        <Suspense fallback={<SectionSkeleton />}>
          <ServiceConfigurator />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <RoiCalculator />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProcessPipeline />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <DifferentialsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <TechStackSLA />
        </Suspense>
        <ContactSection />
      </main>
      <Footer />
      <ContactDock />
    </div>
  );
};

export default Index;
