import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Globe, Users, Cake, Gift, Clock, MapPin, DollarSign } from "lucide-react";

// Simple world map dots — approximate lat/lng positions mapped to percentage
const BIRTHDAY_DOTS = [
  { x: 25, y: 35, country: "USA" }, { x: 48, y: 30, country: "UK" }, { x: 51, y: 28, country: "Germany" },
  { x: 55, y: 55, country: "Nigeria" }, { x: 65, y: 40, country: "India" }, { x: 78, y: 38, country: "Japan" },
  { x: 82, y: 65, country: "Australia" }, { x: 30, y: 60, country: "Brazil" }, { x: 47, y: 33, country: "France" },
  { x: 60, y: 50, country: "Kenya" }, { x: 72, y: 42, country: "Thailand" }, { x: 20, y: 42, country: "Mexico" },
  { x: 53, y: 35, country: "Italy" }, { x: 35, y: 55, country: "Argentina" }, { x: 57, y: 60, country: "South Africa" },
  { x: 68, y: 35, country: "Pakistan" }, { x: 75, y: 45, country: "Philippines" }, { x: 45, y: 25, country: "Sweden" },
];

const stats = [
  { label: "People celebrating today", value: "2,847", icon: Users, color: "text-celebration-pink", sub: "" },
  { label: "Oldest celebrating today", value: "94", icon: Clock, color: "text-primary", sub: "years old — Canada 🇨🇦" },
  { label: "Highest birthday collection", value: "$600", icon: DollarSign, color: "text-celebration-emerald", sub: "" },
  { label: "Highest birthday pot ever", value: "$4,230", icon: Gift, color: "text-celebration-orange", sub: "" },
  { label: "Total wishes since launch", value: "128,440", icon: Globe, color: "text-celebration-cyan", sub: "" },
  { label: "Countries represented", value: "89", icon: MapPin, color: "text-celebration-purple", sub: "" },
];

const GlobalDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-3">
            The World is <span className="text-gradient-gold">Celebrating</span>
          </h1>
          <p className="text-muted-foreground text-lg">Right now, across the globe, birthdays are happening</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className="glass rounded-xl p-6 text-center"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
              <div className="font-display text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              {stat.sub && <div className="text-xs text-muted-foreground/70 mt-1">{stat.sub}</div>}
            </motion.div>
          ))}
        </div>

        {/* World map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">Active Birthdays Today</h2>
          <div className="relative w-full aspect-[2/1] bg-muted/20 rounded-xl overflow-hidden border border-border/50">
            {/* Simplified world outline using a gradient background */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, hsl(var(--celebration-cyan)) 0%, transparent 30%),
                radial-gradient(circle at 50% 35%, hsl(var(--celebration-cyan)) 0%, transparent 25%),
                radial-gradient(circle at 70% 40%, hsl(var(--celebration-cyan)) 0%, transparent 30%),
                radial-gradient(circle at 80% 60%, hsl(var(--celebration-cyan)) 0%, transparent 20%)`
            }} />

            {/* Birthday dots */}
            {BIRTHDAY_DOTS.map((dot, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="absolute"
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              >
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-glow" />
                  <div
                    className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary/40 animate-ping"
                    style={{ animationDuration: `${2 + Math.random() * 2}s` }}
                  />
                </div>
              </motion.div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-muted-foreground bg-card/80 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Active birthday</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default GlobalDashboard;
