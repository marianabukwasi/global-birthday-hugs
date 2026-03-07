import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Cake, Gift, Globe, Users, Sparkles, PartyPopper,
  Send, Crown, TrendingUp, Calendar
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ total_users: 0, total_wishes: 0, total_contributions_cents: 0, total_spins: 0 });
  const [hasBirthdayPage, setHasBirthdayPage] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      const { data: pageData } = await supabase.from("birthday_pages").select("id").eq("user_id", user.id).maybeSingle();
      setHasBirthdayPage(!!pageData);

      const { data: statsData } = await supabase.from("global_stats").select("*").eq("id", 1).single();
      if (statsData) setStats(statsData);
    };
    init();
  }, [navigate]);

  const handleCreateBirthdayPage = async () => {
    if (!user) return;
    // Mock payment — in real app this would go through Stripe
    const { error } = await supabase.from("birthday_pages").insert({
      user_id: user.id,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
    if (!error) {
      setHasBirthdayPage(true);
      // toast success
    }
  };

  const quickActions = [
    { icon: Send, label: "Send a Wish", desc: "Celebrate someone's birthday", to: "/discover", color: "bg-celebration-pink/20 text-celebration-pink" },
    { icon: Gift, label: "Spin & Win", desc: "Check your birthday prizes", to: "/spins", color: "bg-celebration-gold/20 text-celebration-gold" },
    { icon: Calendar, label: "My Timeline", desc: "View past birthday capsules", to: "/timeline", color: "bg-celebration-purple/20 text-celebration-purple" },
    { icon: Globe, label: "Global Celebrations", desc: "See who's celebrating today", to: "/global", color: "bg-celebration-cyan/20 text-celebration-cyan" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Welcome, <span className="text-gradient-celebration">{profile?.preferred_name || profile?.full_name || "Celebrant"}</span>
          </h1>
          <p className="text-muted-foreground text-lg">Your celebration hub awaits</p>
        </motion.div>

        {/* Birthday Page CTA */}
        {!hasBirthdayPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8 rounded-2xl bg-gradient-celebration p-[1px]"
          >
            <div className="rounded-2xl bg-background/95 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-celebration flex items-center justify-center shadow-glow-pink">
                  <Crown className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Create Your Birthday Page</h3>
                  <p className="text-muted-foreground text-sm">Receive wishes, videos & gifts from around the world — $10/year</p>
                </div>
              </div>
              <Button onClick={handleCreateBirthdayPage} className="bg-gradient-celebration text-primary-foreground border-0 hover:opacity-90 whitespace-nowrap">
                <Sparkles className="w-4 h-4 mr-2" />
                Activate — $10/yr
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
              <Link to={action.to} className="block glass rounded-xl p-5 hover:border-primary/30 transition-all group">
                <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{action.label}</h3>
                <p className="text-sm text-muted-foreground">{action.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Global Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-celebration-cyan" /> Global Pulse
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Celebrants", value: stats.total_users.toLocaleString(), icon: Users, color: "text-celebration-pink" },
              { label: "Wishes Sent", value: stats.total_wishes.toLocaleString(), icon: PartyPopper, color: "text-celebration-gold" },
              { label: "Gifted", value: `$${(stats.total_contributions_cents / 100).toLocaleString()}`, icon: Gift, color: "text-celebration-emerald" },
              { label: "Spins", value: stats.total_spins.toLocaleString(), icon: TrendingUp, color: "text-celebration-purple" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-5 text-center">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
