import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Confetti } from "./Confetti";
import { Heart, Users, Globe } from "lucide-react";
import heroImage from "@/assets/hero-celebration.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <Confetti />

      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="People celebrating birthday together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-8"
          >
            <span className="text-2xl">✨</span>
            <span className="text-sm font-medium text-muted-foreground">
              Everybody Deserves to Be Celebrated
            </span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-foreground">
            Every Person Deserves{" "}
            <span className="text-gradient-gold">To Be Celebrated</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-sans">
            Join a global community where the world comes together to celebrate your birthday 
            with wishes, gifts, and heartfelt messages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 text-lg px-8 py-6 rounded-full shadow-glow-gold animate-pulse-glow"
            >
              🎉 Join BirthdayCORE — Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full border-border hover:bg-secondary"
            >
              Discover Birthdays
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { icon: Users, value: "50K+", label: "Celebrators" },
              { icon: Globe, value: "120+", label: "Countries" },
              { icon: Heart, value: "$2M+", label: "Given" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
