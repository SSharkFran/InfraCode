import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import IntroOverlay from "@/components/IntroOverlay";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <IntroOverlay />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <DifferentialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
