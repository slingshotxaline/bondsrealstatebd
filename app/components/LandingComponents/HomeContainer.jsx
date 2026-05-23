import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import HeroSection from "./HeroSection";
import OurConcerns from "./OurConcerns";
import ProjectsSection from "./ProjectSection";
import ServicesSection from "./ServiceSection";

const HomeContainer = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <OurConcerns />
      <ContactSection />
    </div>
  );
};

export default HomeContainer;
