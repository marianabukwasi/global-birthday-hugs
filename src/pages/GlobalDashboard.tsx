import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Globe, Users, PartyPopper, Gift, TrendingUp, Cake } from "lucide-react";

const GlobalDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_wishes: 0, total_contributions_cents: 0, total_spins: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const { data } = await supabase.from("global_stats").select("*").eq("id", 1).single();
      if (data) setStats(data);
    };
    loadStats();
  }, []);

  // Mock data for "celebrating today"
  const todayBirthdays = [
    { name: "Maria Santos", country: "Brazil 🇧🇷", age: 28 },
    { name: "Hiroshi Tanaka", country: "Japan 🇯🇵", age: 45 },
    { name: "Amina Diallo", country: "Senegal 🇸🇳", age: 33 },
    { name: "Erik Johansson", country: "Sweden 🇸🇪", age: 51 },
    { name: "Priya Sharma", country: "India 🇮🇳", age: 22 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl font-bold text-foreground mb-3">
              <span className="text-gradient-aurora">Global Celebrations</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Birthdays happening right now across the world
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Celebrants", value: stats.total_users.toLocaleString(), icon: Users, color: "from-celebration-pink to-celebration-purple" },
            { label: "Wishes Sent", value: stats.total_wishes.toLocaleString(), icon: PartyPopper, color: "from-celebration-gold to-celebration-orange" },
            { label: "Total Gifted", value: `$${(stats.total_contributions_cents / 100).toLocaleString()}`, icon: Gift, color: "from-celebration-emerald to-celebration-cyan" },
            { label: "Spins Today", value: stats.total_spins.toLocaleString(), icon: TrendingUp, color: "from-celebration-purple to-celebration-pink" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-2xl p-6 text-center relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <stat.icon className="w-7 h-7 text-foreground mx-auto mb-3 relative" />
              <div className="font-display text-3xl font-bold text-foreground relative">{stat.value}</div>
              <div className="text-sm text-muted-foreground relative">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Today's Birthdays */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Cake className="w-6 h-6 text-celebration-gold" /> Celebrating Today
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayBirthdays.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="glass rounded-xl p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-celebration flex items-center justify-center text-lg font-bold text-primary-foreground">
                    {person.name[0]}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{person.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{person.country}</span>
                      <span>•</span>
                      <span>Turning {person.age}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Oldest celebrating */}
          <div className="mt-8 glass-strong rounded-2xl p-6 text-center">
            <p className="text-muted-foreground text-sm mb-1">🎖 Oldest Celebrant Today</p>
            <h3 className="font-display text-xl font-bold text-foreground">Erik Johansson</h3>
            <p className="text-celebration-gold font-semibold">Turning 51 — Sweden 🇸🇪</p>
          </div>
        </motion.div>

        {/* 2D Globe Placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12">
          <div className="glass rounded-2xl p-12 text-center">
            <Globe className="w-20 h-20 text-celebration-cyan mx-auto mb-4 animate-spin-slow" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Interactive Globe</h3>
            <p className="text-muted-foreground">A 2D world map showing active birthday celebrations will appear here</p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default GlobalDashboard;
