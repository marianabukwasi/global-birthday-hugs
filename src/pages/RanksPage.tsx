import { Navbar } from "@/components/Navbar";
import { GivingRanks } from "@/components/GivingRanks";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const RanksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <GivingRanks />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default RanksPage;
