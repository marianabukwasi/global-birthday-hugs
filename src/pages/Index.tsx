import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GivingRanks } from "@/components/GivingRanks";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { BirthdayCard } from "@/components/BirthdayCard";
import { mockUsers } from "@/data/mockUsers";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />

      {/* Featured Birthdays */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-4xl mb-4 block">🎁</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Celebrate Someone Today
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These amazing people have birthdays coming up. Send them $1 and a message!
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {mockUsers.slice(0, 4).map((user) => (
              <BirthdayCard key={user.id} {...user} />
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />
      <GivingRanks />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
