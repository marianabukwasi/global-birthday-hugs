import { Link } from "react-router-dom";
import { Globe, Users, Film } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const featureCards = [
  {
    icon: Globe,
    title: "The Globe",
    description:
      "Watch wishes arrive from around the world. A 3D globe lights up as messages pour in from every continent — each ping a person who cares.",
    gradient: "from-celebration-cyan/20 to-celebration-emerald/10",
    iconColor: "text-celebration-cyan",
    delay: 0,
  },
  {
    icon: Users,
    title: "The World Card",
    description:
      "Your age, formed from the faces of every person who celebrated you. A living mosaic — hoverable, printable, unforgettable.",
    gradient: "from-celebration-pink/20 to-celebration-purple/10",
    iconColor: "text-celebration-pink",
    delay: 0.15,
  },
  {
    icon: Film,
    title: "The Birthday Video",
    description:
      "Every wish compiled into a cinematic film. Photos, videos, and messages woven together — your year in celebration.",
    gradient: "from-primary/20 to-atmosphere-amber/10",
    iconColor: "text-primary",
    delay: 0.3,
  },
];

const Index = () => {
  const [count, setCount] = useState(4_217);

  // Simulate a live counter ticking up
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Section 1: Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Night-sky background */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-night-sky">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-foreground/30 rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-celebration-purple/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground leading-[1.08] mb-6">
              Everybody deserves{" "}
              <span className="text-gradient-gold">to be celebrated.</span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              The one thing every human shares — a birthday. We make sure nobody
              spends theirs alone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/join">
                <Button
                  size="lg"
                  className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 h-14 px-10 text-lg font-bold shadow-glow-gold animate-pulse-glow"
                >
                  Celebrate Someone
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg border-border hover:bg-secondary"
                >
                  Set Up My Birthday
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Section 2: Animated Feature Cards ─── */}
      <section className="py-28 bg-card/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Your birthday, <span className="text-gradient-gold">amplified.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three experiences that turn a day into a legacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featureCards.map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: card.delay, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="glass rounded-2xl p-8 flex flex-col items-start hover:border-primary/30 transition-colors group"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 3: Live Counter + Footer ─── */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground text-lg mb-2">Right now</p>
            <h2 className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-2">
              <span className="text-gradient-gold">
                {count.toLocaleString()}
              </span>{" "}
              people
            </h2>
            <p className="text-muted-foreground text-xl">
              are celebrating their birthday today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Simple footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-sm text-foreground">
            Birthday<span className="text-gradient-gold">CORE</span>
          </span>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BirthdayCORE. Everybody deserves to be celebrated.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
