import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Globe, Users, Cake, Gift, TrendingUp, Search, Crown } from "lucide-react";

const GlobalDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_wishes: 0, total_contributions_cents: 0, total_spins: 0 });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("global_stats").select("*").eq("id", 1).single();
      if (data) setStats(data);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            <Globe className="w-10 h-10 text-celebration-cyan inline-block mr-3 -mt-1" />
            Global <span className="text-gradient-gold">Celebrations</span>
          </h1>
          <p className="text-muted-foreground text-lg">See what's happening across the world right now</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Celebrants", value: stats.total_users?.toLocaleString() || "0", icon: Users, color: "text-celebration-pink" },
            { label: "Wishes Sent", value: stats.total_wishes?.toLocaleString() || "0", icon: Cake, color: "text-primary" },
            { label: "Gifted", value: `$${((stats.total_contributions_cents || 0) / 100).toLocaleString()}`, icon: Gift, color: "text-celebration-emerald" },
            { label: "Spins", value: stats.total_spins?.toLocaleString() || "0", icon: TrendingUp, color: "text-celebration-purple" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="glass rounded-xl p-5 text-center">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Globe placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-12 text-center mb-12">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Live Global Map</h2>
          <p className="text-muted-foreground">Interactive 3D globe showing active birthday celebrations — coming soon</p>
        </motion.div>

        {/* Celebrating Today */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" /> Celebrating Today
          </h2>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">Birthday celebrants will appear here as the community grows</p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default GlobalDashboard;
