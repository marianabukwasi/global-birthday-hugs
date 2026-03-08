import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Video, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BirthdayCoreGlobe, GlobeWish } from "@/components/reveal/BirthdayCoreGlobe";
import { BirthdayCard, CardPhoto } from "@/components/reveal/BirthdayCard";

const BirthdayRevealPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [wishCount, setWishCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [donationAmount, setDonationAmount] = useState("");
  const [globeWishes, setGlobeWishes] = useState<GlobeWish[]>([]);
  const [cardPhotos, setCardPhotos] = useState<CardPhoto[]>([]);
  const [globeComplete, setGlobeComplete] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      const { data: wishes } = await supabase
        .from("wishes")
        .select("*")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: true });

      setWishCount(wishes?.length || 0);

      if (wishes && wishes.length > 0) {
        const senderIds = [...new Set(wishes.map(w => w.sender_id))];
        const { data: senderProfiles } = await supabase
          .from("profiles")
          .select("id, full_name, country, city")
          .in("id", senderIds);

        const profileMap = new Map(senderProfiles?.map(p => [p.id, p]) || []);
        const countries = new Set(senderProfiles?.map(p => p.country).filter(Boolean));
        setCountryCount(countries.size);

        const mapped: GlobeWish[] = wishes.map(w => {
          const sp = profileMap.get(w.sender_id);
          return {
            countryCode: "",
            countryName: sp?.country || "Unknown",
            city: sp?.city || undefined,
            timestamp: w.created_at,
            contentType: w.video_url ? "video" as const : "photo" as const,
            contentURL: w.video_url || w.image_url || undefined,
            senderName: sp?.full_name || "Anonymous",
            quote: w.message || undefined,
          };
        });
        setGlobeWishes(mapped);
      }
    };
    load();
  }, [navigate]);

  const displayName = profile?.preferred_name || profile?.full_name || "Celebrant";
  const age = (() => {
    if (!profile?.birthday_month || !profile?.birthday_day) return 0;
    const now = new Date();
    const birthYear = profile.birth_year || (now.getFullYear() - 25);
    let a = now.getFullYear() - birthYear;
    const bd = new Date(now.getFullYear(), profile.birthday_month - 1, profile.birthday_day);
    if (now < bd) a--;
    return a;
  })();

  const handleDonate = () => {
    const amt = parseFloat(donationAmount);
    if (!amt || amt < 1) {
      toast({ title: "Enter an amount", description: "Minimum donation is $1." });
      return;
    }
    toast({ title: "Thank you! 🎉", description: `Your $${amt.toFixed(2)} donation unlocks the full experience.` });
    setDonationAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow-gold"
            >
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Happy Birthday, <span className="text-gradient-gold">{displayName}</span>.
            </h1>
            <p className="text-xl text-muted-foreground">The world showed up for you.</p>
          </motion.div>

          {/* Section 1 — Live 3D Globe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border overflow-hidden mb-6"
          >
            <BirthdayCoreGlobe
              wishes={globeWishes}
              receiverName={displayName}
              receiverAge={age}
              onComplete={() => setGlobeComplete(true)}
            />
          </motion.div>

          {/* Section 2 — Birthday Card / Mosaic placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl bg-card border border-border overflow-hidden mb-6"
          >
            <div className="aspect-video bg-gradient-to-b from-secondary to-card flex flex-col items-center justify-center backdrop-blur-sm">
              <Image className="w-20 h-20 text-celebration-cyan/40 mb-4" />
              <p className="text-foreground font-medium mb-1">Your Birthday Card is being assembled...</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                WORLD CARD — Developer component will be inserted here
              </p>
            </div>
          </motion.div>

          {/* Section 3 — Birthday Video placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-card border border-border overflow-hidden mb-10"
          >
            <div className="aspect-video bg-gradient-to-b from-muted to-card flex flex-col items-center justify-center">
              <Video className="w-20 h-20 text-celebration-purple/40 mb-4" />
              <p className="text-foreground font-medium mb-1">Your birthday video is being compiled...</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                BIRTHDAY VIDEO — Developer component will be inserted here
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-center mb-10"
          >
            <p className="font-display text-2xl md:text-3xl text-foreground">
              Celebrated by{" "}
              <span className="text-primary font-bold">{wishCount}</span> people from{" "}
              <span className="text-celebration-cyan font-bold">{countryCount}</span> countries.
            </p>
          </motion.div>

          {/* Donation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl bg-card border border-border p-8 text-center"
          >
            <p className="text-foreground font-medium mb-2">
              Unlock your full Birthday Card and birthday video
            </p>
            <p className="text-sm text-muted-foreground mb-6">Support BirthdayCORE</p>
            <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  min={1}
                  placeholder="5"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="pl-7 bg-secondary/50 border-border text-foreground"
                />
              </div>
              <Button
                onClick={handleDonate}
                className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 px-8"
              >
                Donate
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BirthdayRevealPage;
