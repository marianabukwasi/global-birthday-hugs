import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Confetti } from "./Confetti";

export const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-champagne opacity-90" />
      <Confetti />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-5xl mb-6 block">🎂</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Your Birthday. The World's Celebration.
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-10 text-lg">
            Join for just $2. Your first dollar celebrates someone else. 
            Then the world celebrates you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6 rounded-full shadow-champagne"
            >
              🎉 Create My Birthday Page
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-full"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
