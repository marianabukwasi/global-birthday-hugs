import { Navbar } from "@/components/Navbar";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <HowItWorks />
        <FeaturesSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
