import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Gift, Globe, Users, Sparkles,
  Send, Crown, TrendingUp, Calendar, Copy, Tag
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import WishVault from "@/components/dashboard/WishVault";
import { BirthdayCountdown } from "@/components/dashboard/BirthdayCountdown";
import ProfileSetupSection from "@/components/dashboard/ProfileSetupSection";
import PhonePreview from "@/components/dashboard/PhonePreview";
import GlimmerDraw from "@/components/dashboard/GlimmerDraw";
import GivingRecognition from "@/components/profile/GivingRecognition";
import BirthdayCapsules from "@/components/profile/BirthdayCapsules";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [wishCount, setWishCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [sealedWishes, setSealedWishes] = useState<{ id: string; country: string }[]>([]);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      // Get wish stats
      const { count: wCount } = await supabase.from("wishes").select("*", { count: "exact", head: true }).eq("recipient_id", user.id);
      setWishCount(wCount || 0);

      // Get sealed wishes with sender countries
      const { data: wishes } = await supabase.from("wishes").select("id, sender_id").eq("recipient_id", user.id);
      if (wishes && wishes.length > 0) {
        const senderIds = wishes.map(w => w.sender_id);
        const { data: senderProfiles } = await supabase.from("profiles").select("id, country").in("id", senderIds);
        const countryMap = new Map(senderProfiles?.map(p => [p.id, p.country || "Unknown"]) || []);
        const uniqueCountries = new Set(senderProfiles?.map(p => p.country).filter(Boolean));
        setCountryCount(uniqueCountries.size);
        setSealedWishes(wishes.map(w => ({
          id: w.id,
          country: countryMap.get(w.sender_id) || "Unknown",
        })));
      }

      // Check countdown
      if (profileData?.birthday_month && profileData?.birthday_day) {
        const now = new Date();
        const thisYear = now.getFullYear();
        let bday = new Date(thisYear, profileData.birthday_month - 1, profileData.birthday_day);
        if (bday < now) bday = new Date(thisYear + 1, profileData.birthday_month - 1, profileData.birthday_day);
        const hoursLeft = (bday.getTime() - now.getTime()) / (1000 * 60 * 60);
        setIsCountdownActive(hoursLeft <= 24 && hoursLeft > 0);
      }
    };
    init();
  }, [navigate]);

  const isReceiver = profile?.user_type === "receiver" || profile?.is_receiver_active;
  const displayName = profile?.preferred_name || profile?.full_name || "Celebrant";

  const getDaysUntilBirthday = () => {
    if (!profile?.birthday_month || !profile?.birthday_day) return null;
    const now = new Date();
    const thisYear = now.getFullYear();
    let bday = new Date(thisYear, profile.birthday_month - 1, profile.birthday_day);
    if (bday < now) bday = new Date(thisYear + 1, profile.birthday_month - 1, profile.birthday_day);
    return Math.ceil((bday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysUntil = getDaysUntilBirthday();
  const shareLink = `${window.location.origin}/celebrate/${user?.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({ title: "Link copied! 🔗", description: "Share it with the world." });
  };

  const handleBirthdayReached = () => {
    navigate(`/reveal/${user?.id}`);
  };

  // Use placeholder values when no real data
  const displayWishes = wishCount || 12;
  const displayCountries = countryCount || 7;
  const displayDays = daysUntil ?? 23;
  const displaySealedWishes = sealedWishes.length > 0 ? sealedWishes : [
    { id: "p1", country: "United States" },
    { id: "p2", country: "Japan" },
    { id: "p3", country: "Brazil" },
    { id: "p4", country: "Nigeria" },
    { id: "p5", country: "Germany" },
    { id: "p6", country: "Australia" },
    { id: "p7", country: "India" },
    { id: "p8", country: "France" },
    { id: "p9", country: "South Korea" },
    { id: "p10", country: "Kenya" },
    { id: "p11", country: "Mexico" },
    { id: "p12", country: "United Kingdom" },
  ];

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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

        {/* Receiver Dashboard */}
        {isReceiver ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Waiting Room */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-gradient-gold p-[1px]"
              >
                <div className="rounded-2xl bg-card p-8">
                  <div className="text-center mb-6">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your Waiting Room</h2>
                    <p className="text-muted-foreground">The world is getting ready to celebrate you</p>
                  </div>

                  {/* Countdown or days counter */}
                  {isCountdownActive && profile?.birthday_month && profile?.birthday_day ? (
                    <BirthdayCountdown
                      birthdayMonth={profile.birthday_month}
                      birthdayDay={profile.birthday_day}
                      timezone={profile.timezone}
                      onBirthdayReached={handleBirthdayReached}
                    />
                  ) : (
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="text-center">
                        <div className="font-display text-4xl font-bold text-primary">{displayWishes}</div>
                        <div className="text-sm text-muted-foreground">Wishes Arrived</div>
                      </div>
                      <div className="text-center">
                        <div className="font-display text-4xl font-bold text-celebration-cyan">{displayCountries}</div>
                        <div className="text-sm text-muted-foreground">Countries</div>
                      </div>
                      <div className="text-center">
                        <div className="font-display text-4xl font-bold text-celebration-pink">{displayDays}</div>
                        <div className="text-sm text-muted-foreground">Days Until Birthday</div>
                      </div>
                    </div>
                  )}

                  {/* Share Link + QR */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border mb-4">
                    <div className="flex-1 text-sm text-muted-foreground truncate font-mono">{shareLink}</div>
                    <Button size="sm" variant="ghost" onClick={copyLink} className="shrink-0">
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </Button>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="p-3 bg-foreground rounded-xl">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shareLink)}&bgcolor=FFFFFF&color=0a0f1e`}
                        alt="QR Code"
                        className="w-[120px] h-[120px]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Wish Preview Vault */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Sealed Wishes
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {displaySealedWishes.length} wishes are waiting. They'll be revealed on your birthday.
                </p>
                <WishVault wishes={displaySealedWishes} isCountdownActive={isCountdownActive} />
              </motion.div>

              {/* Profile Setup */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Profile Setup
                </h2>
                <div className="glass-strong rounded-2xl p-6">
                  <ProfileSetupSection
                    profile={profile}
                    userId={user.id}
                    onProfileUpdate={setProfile}
                  />
                </div>
              </motion.div>

              {/* Glimmer Draw */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <GlimmerDraw daysUntilBirthday={daysUntil} />
              </motion.div>

              {/* Giving Recognition */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <GivingRecognition totalGiven={57} totalReceived={230} />
              </motion.div>

              {/* Birthday Capsules */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <BirthdayCapsules capsules={[]} />
              </motion.div>
            </div>

            {/* Right — Phone Preview */}
            <div className="hidden lg:block">
              <PhonePreview profile={profile} />
            </div>
          </div>
        ) : (
          /* Giver Dashboard — simpler */
          <div className="space-y-8">
            {/* Upgrade CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-gradient-gold p-[1px]"
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
                <Link to="/setup">
                  <Button className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 whitespace-nowrap">
                    <Sparkles className="w-4 h-4 mr-2" /> Activate — $10/yr
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Send, label: "Send a Wish", desc: "Celebrate someone's birthday", to: "/discover", color: "bg-celebration-pink/20 text-celebration-pink" },
                { icon: Gift, label: "Glimmer Draw", desc: "Check your birthday prizes", to: "/dashboard", color: "bg-primary/20 text-primary" },
                { icon: Calendar, label: "My Capsules", desc: "View past birthday capsules", to: "/dashboard", color: "bg-celebration-purple/20 text-celebration-purple" },
                { icon: Globe, label: "Global Celebrations", desc: "See who's celebrating today", to: "/global", color: "bg-celebration-cyan/20 text-celebration-cyan" },
              ].map((action, i) => (
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
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
