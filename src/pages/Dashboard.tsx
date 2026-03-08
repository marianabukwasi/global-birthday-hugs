import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Cake, Gift, Globe, Users, Sparkles,
  Send, Crown, TrendingUp, Calendar, Copy
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ total_users: 0, total_wishes: 0, total_contributions_cents: 0, total_spins: 0 });
  const [wishCount, setWishCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      const { data: statsData } = await supabase.from("global_stats").select("*").eq("id", 1).single();
      if (statsData) setStats(statsData);

      // Get wish stats for this user
      const { count: wCount } = await supabase.from("wishes").select("*", { count: "exact", head: true }).eq("recipient_id", user.id);
      setWishCount(wCount || 0);

      // Get unique countries from wishes
      const { data: wishes } = await supabase.from("wishes").select("sender_id").eq("recipient_id", user.id);
      if (wishes) {
        const senderIds = wishes.map(w => w.sender_id);
        if (senderIds.length > 0) {
          const { data: senderProfiles } = await supabase.from("profiles").select("country").in("id", senderIds);
          const uniqueCountries = new Set(senderProfiles?.map(p => p.country).filter(Boolean));
          setCountryCount(uniqueCountries.size);
        }
      }
    };
    init();
  }, [navigate]);

  const isReceiver = profile?.is_receiver_active;
  const displayName = profile?.preferred_name || profile?.full_name || "Celebrant";

  // Calculate days until birthday
  const getDaysUntilBirthday = () => {
    if (!profile?.birthday_month || !profile?.birthday_day) return null;
    const now = new Date();
    const thisYear = now.getFullYear();
    let bday = new Date(thisYear, profile.birthday_month - 1, profile.birthday_day);
    if (bday < now) bday = new Date(thisYear + 1, profile.birthday_month - 1, profile.birthday_day);
    const diff = Math.ceil((bday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysUntil = getDaysUntilBirthday();
  const shareLink = `${window.location.origin}/celebrate/${user?.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({ title: "Link copied! 🔗", description: "Share it with the world." });
  };

  const quickActions = [
    { icon: Send, label: "Send a Wish", desc: "Celebrate someone's birthday", to: "/discover", color: "bg-celebration-pink/20 text-celebration-pink" },
    { icon: Gift, label: "Glimmer Draw", desc: "Check your birthday prizes", to: "/glimmer-draw", color: "bg-primary/20 text-primary" },
    { icon: Calendar, label: "My Capsules", desc: "View past birthday capsules", to: "/capsules", color: "bg-celebration-purple/20 text-celebration-purple" },
    { icon: Globe, label: "Global Celebrations", desc: "See who's celebrating today", to: "/global", color: "bg-celebration-cyan/20 text-celebration-cyan" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Welcome, <span className="text-gradient-gold">{displayName}</span>
          </h1>
          <p className="text-muted-foreground text-lg">Your celebration hub awaits</p>
        </motion.div>

        {/* Waiting Room — Receiver Only */}
        {isReceiver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8 rounded-2xl bg-gradient-gold p-[1px]"
          >
            <div className="rounded-2xl bg-card p-8">
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your Waiting Room</h2>
                <p className="text-muted-foreground">The world is getting ready to celebrate you</p>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="font-display text-4xl font-bold text-primary">{wishCount}</div>
                  <div className="text-sm text-muted-foreground">Wishes Arrived</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-4xl font-bold text-celebration-cyan">{countryCount}</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-4xl font-bold text-celebration-pink">
                    {daysUntil !== null ? daysUntil : "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">Days Until Birthday</div>
                </div>
              </div>

              {/* Share Link */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                <div className="flex-1 text-sm text-muted-foreground truncate font-mono">{shareLink}</div>
                <Button size="sm" variant="ghost" onClick={copyLink} className="shrink-0">
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upgrade CTA — Giver Only */}
        {!isReceiver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8 rounded-2xl bg-gradient-gold p-[1px]"
          >
            <div className="rounded-2xl bg-background/95 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow-gold">
                  <Crown className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Become a Receiver</h3>
                  <p className="text-muted-foreground text-sm">Get your own birthday page, pot, video & mosaic — $10/year</p>
                </div>
              </div>
              <Link to="/receiver-setup">
                <Button className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 whitespace-nowrap">
                  <Sparkles className="w-4 h-4 mr-2" /> Activate — $10/yr
                </Button>
              </Link>
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
              { label: "Celebrants", value: stats.total_users?.toLocaleString() || "0", icon: Users, color: "text-celebration-pink" },
              { label: "Wishes Sent", value: stats.total_wishes?.toLocaleString() || "0", icon: Cake, color: "text-primary" },
              { label: "Gifted", value: `$${((stats.total_contributions_cents || 0) / 100).toLocaleString()}`, icon: Gift, color: "text-celebration-emerald" },
              { label: "Spins", value: stats.total_spins?.toLocaleString() || "0", icon: TrendingUp, color: "text-celebration-purple" },
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
