import { Link } from "react-router-dom";
import { Sparkles, Heart, Globe, Users, Gift, Shield, Camera, Cake } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Night sky */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-night-sky">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-foreground/30 rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-celebration-purple/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-2/3 left-1/2 w-60 h-60 bg-celebration-pink/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: "2.5s" }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              Everybody Deserves to Be Celebrated
            </div>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-[1.1]">
              Your Birthday.<br />
              <span className="text-gradient-gold">The World's</span>{" "}
              <span className="text-gradient-celebration">Celebration.</span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              A global platform where wishes, photos, and gifts pour in from every corner of the Earth — because on your birthday, the world should know your name.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 h-14 px-10 text-lg font-bold shadow-glow-gold animate-pulse-glow">
                  Join Free — Start Celebrating
                </Button>
              </Link>
              <Link to="/global">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-border hover:bg-secondary">
                  Explore Celebrations
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
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
                <div className="font-display text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              How It <span className="text-gradient-gold">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Four simple steps to a magical birthday experience</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Create Your Page", desc: "Sign up and activate your birthday page for $10/year.", icon: "🎂" },
              { step: "02", title: "Share Your Link", desc: "Friends and strangers worldwide send photos, videos, and wishes.", icon: "💌" },
              { step: "03", title: "Watch the Magic", desc: "We compile everything into a cinematic birthday video & mosaic.", icon: "🎬" },
              { step: "04", title: "Celebrate!", desc: "At midnight, the world celebrates you with a 3D globe reveal.", icon: "🌍" },
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
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Why <span className="text-gradient-gold">BirthdayCORE</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Every feature exists to make someone feel more celebrated</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Global Wishes", desc: "Receive wishes from every continent. A 3D globe reveals where each wish came from at midnight." },
              { icon: Camera, title: "Photo Mosaic", desc: "All submitted photos form your age number in a stunning mosaic — printable as a poster." },
              { icon: Gift, title: "Birthday Pot", desc: "Friends contribute to your birthday fund. Cashout via Stripe with full transparency." },
              { icon: Shield, title: "Your Privacy", desc: "Control every detail — what's public, what's private. Your celebration, your rules." },
              { icon: Heart, title: "Recognition System", desc: "Earn stars for giving. Bronze, Silver, Gold, Diamond — your generosity is celebrated too." },
              { icon: Cake, title: "Birthday Capsule", desc: "Every year archived as a time capsule — mosaic, video, wishes — forever accessible." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Two User Types */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Two Ways to <span className="text-gradient-gold">Celebrate</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Giver */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8">
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">Giver</h3>
              <div className="text-primary font-bold text-lg mb-4">Free Forever</div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Send wishes with photos & videos</li>
                <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Contribute to birthday pots</li>
                <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Earn giving recognition stars</li>
                <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Access Global Dashboard</li>
              </ul>
              <Link to="/auth?mode=signup" className="block mt-6">
                <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground">Join as Giver</Button>
              </Link>
            </motion.div>

            {/* Receiver */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl p-8 bg-gradient-gold p-[1px]">
              <div className="rounded-2xl bg-card p-8">
                <div className="text-3xl mb-4">👑</div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Receiver</h3>
                <div className="text-primary font-bold text-lg mb-4">$10/year</div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Your own birthday page & link</li>
                  <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Birthday pot with cashout</li>
                  <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Cinematic birthday video & mosaic</li>
                  <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> 3D Globe midnight reveal</li>
                  <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Glimmer Draw & Birthday Offers</li>
                  <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Yearly Birthday Capsule archive</li>
                </ul>
                <Link to="/auth?mode=signup" className="block mt-6">
                  <Button className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 shadow-glow-gold">
                    Activate Your Page — $10/yr
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-gold p-[1px]">
            <div className="rounded-3xl bg-background/95 p-12 sm:p-16 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Ready to Be <span className="text-gradient-gold">Celebrated?</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
                  On your birthday, the world should know your name.
                </p>
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 h-14 px-12 text-lg font-bold shadow-glow-gold">
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
