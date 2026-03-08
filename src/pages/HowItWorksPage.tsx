import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [
    { step: "01", title: "Sign Up as a Giver", desc: "Create your free account in under 60 seconds. Just your name, country, birthday, and email.", icon: "✨", color: "text-primary" },
    { step: "02", title: "Discover Birthdays", desc: "Browse the global community and find someone to celebrate. Or share your link to receive wishes.", icon: "🔍", color: "text-celebration-cyan" },
    { step: "03", title: "Send a Wish", desc: "Upload a photo or 30-second video, respond to their wish prompt, and optionally contribute to their birthday pot.", icon: "💌", color: "text-celebration-pink" },
    { step: "04", title: "Become a Receiver", desc: "Activate your birthday page for $10/year. Set your color palette, wish prompt, and pot target.", icon: "👑", color: "text-primary" },
    { step: "05", title: "Share Your Link", desc: "Share your unique birthday link with friends, family, and even strangers around the world.", icon: "🔗", color: "text-celebration-purple" },
    { step: "06", title: "Watch the Waiting Room", desc: "See wishes arrive in real time. Track how many countries are represented. Feel the anticipation.", icon: "⏳", color: "text-celebration-cyan" },
    { step: "07", title: "The Birthday Reveal", desc: "At midnight in your timezone: a 3D globe animation, photo mosaic of your age, certificate, and compiled video.", icon: "🌍", color: "text-celebration-emerald" },
    { step: "08", title: "Cash Out & Archive", desc: "Withdraw your birthday pot via Stripe. Your birthday is archived as a capsule forever.", icon: "🎁", color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How <span className="text-gradient-gold">BirthdayCORE</span> Works
          </h1>
          <p className="text-muted-foreground text-lg">From sign-up to celebration in eight steps</p>
        </motion.div>

        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 flex items-start gap-5"
            >
              <div className="text-4xl shrink-0">{s.icon}</div>
              <div>
                <div className={`text-xs font-mono ${s.color} mb-1`}>{s.step}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
