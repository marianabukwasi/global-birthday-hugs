import { motion } from "framer-motion";
import { UserPlus, Gift, CreditCard, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Page",
    desc: "Activate for $10/year. Your birthday page goes live and starts collecting wishes.",
    emoji: "✨",
  },
  {
    icon: Gift,
    title: "Share Your Link",
    desc: "Send your birthday link to friends, family, and the world. Anyone can contribute.",
    emoji: "🎁",
  },
  {
    icon: CreditCard,
    title: "Build Your Pot",
    desc: "Wishes, photos, videos, and gifts pour in from around the globe.",
    emoji: "🏺",
  },
  {
    icon: PartyPopper,
    title: "The Birthday Reveal",
    desc: "At midnight, your 3D globe lights up, your mosaic reveals, and the celebration begins!",
    emoji: "🎉",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-card" id="how-it-works">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-4xl mb-4 block">🎂</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four simple steps to join the world's birthday celebration
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
              )}
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow-gold relative">
                <step.icon className="w-10 h-10 text-primary-foreground" />
                <span className="absolute -top-2 -right-2 text-2xl">{step.emoji}</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
