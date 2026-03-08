import { motion } from "framer-motion";
import { Globe, Heart, Gift, Shield, Sparkles, Users } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Community",
    desc: "Celebrate birthdays across 120+ countries. Discover people by country, month, or interests.",
  },
  {
    icon: Heart,
    title: "Personal Messages",
    desc: "Every contribution comes with a photo and heartfelt message from the giver.",
  },
  {
    icon: Gift,
    title: "Glimmer Draw",
    desc: "Spin the gift wheel for birthday experiences — gift cards, hotel stays, adventures.",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    desc: "ID verification ensures real people. Funds go directly to your bank via Stripe.",
  },
  {
    icon: Sparkles,
    title: "Birthday Video & Mosaic",
    desc: "Receive a cinematic birthday video with a 3D globe and an age-shaped photo mosaic.",
  },
  {
    icon: Users,
    title: "Giving Recognition",
    desc: "Earn Bronze, Silver, Gold, and Diamond stars for your generosity on the platform.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-4xl mb-4 block">🌍</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            More Than Just <span className="text-gradient-gold">Wishes</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A celebration platform built on connection, not transaction.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-glow-gold transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
