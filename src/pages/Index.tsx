import { Link } from "react-router-dom";
import { PartyPopper, Heart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/Confetti";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Confetti />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-6">
              <PartyPopper className="w-4 h-4 text-celebration-gold" />
              The World's Birthday Celebration Platform
            </div>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
              Celebrate Every<br />
              <span className="text-gradient-celebration">Birthday</span>{" "}
              <span className="text-gradient-gold">Globally</span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Send wishes, share moments, and connect with people worldwide through the magic of birthdays.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-celebration text-primary-foreground border-0 hover:opacity-90 h-14 px-10 text-lg font-bold shadow-glow-pink">
                  Join Free — Start Celebrating
                </Button>
              </Link>
              <Link to="/global">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg">
                  Explore Celebrations
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: "50K+", label: "Celebrants" },
              { value: "120+", label: "Countries" },
              { value: "1M+", label: "Wishes Sent" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              How It <span className="text-gradient-aurora">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Four simple steps to a magical birthday experience</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Create Your Page", desc: "Sign up and set up your birthday profile. Customize your page for $10/year.", icon: "🎂" },
              { step: "02", title: "Receive Wishes", desc: "Friends and strangers worldwide send images, quotes, and video wishes.", icon: "💌" },
              { step: "03", title: "Auto-Generated Video", desc: "We compile everything into a stunning birthday video with a global mosaic.", icon: "🎬" },
              { step: "04", title: "Spin & Win", desc: "Birthday spins unlock gifts and discounts from partner brands.", icon: "🎰" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-mono text-primary mb-2">{item.step}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-celebration p-[1px]">
            <div className="rounded-3xl bg-background/95 p-12 sm:p-16 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Ready to Celebrate?
                </h2>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
                  Join thousands of people making birthdays magical across the globe.
                </p>
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-celebration text-primary-foreground border-0 hover:opacity-90 h-14 px-12 text-lg font-bold shadow-glow-pink">
                    Get Started — It's Free
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
