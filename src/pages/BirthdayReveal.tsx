import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BirthdayGlobe } from "@/components/reveal/BirthdayGlobe";
import { PhotoMosaic } from "@/components/reveal/PhotoMosaic";
import { BirthdayCertificate } from "@/components/reveal/BirthdayCertificate";
import { VideoReveal } from "@/components/reveal/VideoReveal";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

type RevealPhase = "intro" | "globe" | "mosaic" | "certificate" | "video";

const BirthdayReveal = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [wishes, setWishes] = useState<any[]>([]);
  const [phase, setPhase] = useState<RevealPhase>("intro");
  const [isOwner, setIsOwner] = useState(false);
  const [hasContributed, setHasContributed] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!userId) return;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setIsOwner(user?.id === userId);

      // Get profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single();
      setProfile(profileData);

      // Get wishes with sender profiles for country data
      const { data: wishData } = await supabase
        .from("wishes")
        .select("*")
        .eq("recipient_id", userId)
        .order("created_at", { ascending: true });

      if (wishData && wishData.length > 0) {
        const senderIds = [...new Set(wishData.map(w => w.sender_id))];
        const { data: senderProfiles } = await supabase
          .from("profiles")
          .select("id, full_name, country")
          .in("id", senderIds);

        const profileMap = new Map(senderProfiles?.map(p => [p.id, p]) || []);
        const enriched = wishData.map(w => ({
          ...w,
          country: profileMap.get(w.sender_id)?.country || "Unknown",
          senderName: profileMap.get(w.sender_id)?.full_name || "Anonymous",
        }));
        setWishes(enriched);
      }

      // Check if user has contributed
      if (user) {
        const { count } = await supabase
          .from("contributions")
          .select("*", { count: "exact", head: true })
          .eq("sender_id", user.id)
          .eq("recipient_id", userId);
        setHasContributed((count || 0) > 0);
      }

      setLoading(false);
    };
    init();
  }, [userId]);

  const isUnlocked = isOwner || hasContributed;

  const calculateAge = () => {
    if (!profile?.birthday_month || !profile?.birthday_day) return 0;
    const now = new Date();
    const birthYear = profile.birth_year || (now.getFullYear() - 25);
    let age = now.getFullYear() - birthYear;
    const birthdayThisYear = new Date(now.getFullYear(), profile.birthday_month - 1, profile.birthday_day);
    if (now < birthdayThisYear) age--;
    return age;
  };

  const age = calculateAge();
  const displayName = profile?.preferred_name || profile?.full_name || "Celebrant";
  const uniqueCountries = new Set(wishes.map(w => w.country).filter(Boolean));
  const birthdayDate = profile?.birthday_month && profile?.birthday_day
    ? new Date(new Date().getFullYear(), profile.birthday_month - 1, profile.birthday_day).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  const onGlobeComplete = useCallback(() => {
    // Auto-advance after a delay
    setTimeout(() => setPhase("mosaic"), 2000);
  }, []);

  const handleDonate = async () => {
    toast({
      title: "Thank you! 🎉",
      description: `Your $${donationAmount} contribution unlocks the full birthday experience.`,
    });
    setHasContributed(true);
    setShowDonation(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Celebrant Not Found</h1>
          <p className="text-muted-foreground mb-6">This birthday page doesn't exist.</p>
          <Button onClick={() => navigate("/")} className="bg-gradient-gold text-primary-foreground border-0">
            Go Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* PHASE: Intro */}
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow-gold"
              >
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4"
              >
                Happy Birthday,{" "}
                <span className="text-gradient-gold">{displayName}</span>!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-muted-foreground mb-4"
              >
                The world came together to celebrate you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center gap-6 mb-10"
              >
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-primary">{wishes.length}</p>
                  <p className="text-sm text-muted-foreground">Wishes</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-celebration-cyan">{uniqueCountries.size}</p>
                  <p className="text-sm text-muted-foreground">Countries</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  onClick={() => setPhase("globe")}
                  size="lg"
                  className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 shadow-glow-gold text-lg px-10"
                >
                  Begin the Reveal <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-12 animate-float"
              >
                <ChevronDown className="w-6 h-6 text-muted-foreground mx-auto" />
              </motion.div>
            </motion.div>
          )}

          {/* PHASE: Globe */}
          {phase === "globe" && (
            <motion.div
              key="globe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4"
            >
              <div className="text-center mb-6">
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  Wishes from Around the World
                </h2>
                <p className="text-muted-foreground">Watch as each wish finds its place on the globe</p>
              </div>
              <BirthdayGlobe wishes={wishes} onPingComplete={onGlobeComplete} />
              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setPhase("mosaic")}
                  className="text-muted-foreground"
                >
                  Skip to Mosaic →
                </Button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Mosaic */}
          {phase === "mosaic" && (
            <motion.div
              key="mosaic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-10"
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  Your Age in Wishes
                </h2>
                <p className="text-muted-foreground">
                  {wishes.length} photos form the number {age}
                </p>
              </div>
              <PhotoMosaic
                tiles={wishes.map(w => ({
                  imageUrl: w.image_url || "",
                  country: w.country,
                  senderName: w.senderName,
                }))}
                age={age}
                watermarkCount={wishes.length}
                isTeaser={!isUnlocked}
              />
              <div className="text-center mt-8 flex items-center justify-center gap-4">
                <Button variant="ghost" onClick={() => setPhase("globe")} className="text-muted-foreground">
                  ← Globe
                </Button>
                <Button
                  onClick={() => setPhase("certificate")}
                  className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
                >
                  View Certificate →
                </Button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Certificate */}
          {phase === "certificate" && (
            <motion.div
              key="certificate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-10"
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  Your Birthday Certificate
                </h2>
                <p className="text-muted-foreground">A record of your celebration, forever</p>
              </div>
              <BirthdayCertificate
                name={displayName}
                age={age}
                wishCount={wishes.length}
                countryCount={uniqueCountries.size}
                date={birthdayDate}
                watermarkCount={wishes.length}
                isTeaser={!isUnlocked}
              />
              <div className="text-center mt-8 flex items-center justify-center gap-4">
                <Button variant="ghost" onClick={() => setPhase("mosaic")} className="text-muted-foreground">
                  ← Mosaic
                </Button>
                <Button
                  onClick={() => setPhase("video")}
                  className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
                >
                  Watch Video →
                </Button>
              </div>
            </motion.div>
          )}

          {/* PHASE: Video */}
          {phase === "video" && (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-10"
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  Your Birthday Video
                </h2>
                <p className="text-muted-foreground">Every wish, compiled into one beautiful film</p>
              </div>
              <VideoReveal
                watermarkCount={wishes.length}
                isTeaser={!isUnlocked}
                onUnlock={() => setShowDonation(true)}
              />
              <div className="text-center mt-8">
                <Button variant="ghost" onClick={() => setPhase("certificate")} className="text-muted-foreground">
                  ← Certificate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Donation unlock modal */}
        {showDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDonation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border p-8"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Gift className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Unlock the Full Experience
                </h3>
                <p className="text-sm text-muted-foreground">
                  Make an optional donation to download the full birthday video, mosaic, and certificate.
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-display text-2xl font-bold text-primary">${donationAmount}</span>
                </div>
                <Slider
                  value={[donationAmount]}
                  onValueChange={([v]) => setDonationAmount(v)}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">$1</span>
                  <span className="text-xs text-muted-foreground">$100</span>
                </div>
              </div>

              <Button
                onClick={handleDonate}
                className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
              >
                Contribute ${donationAmount}
              </Button>
              <button
                onClick={() => setShowDonation(false)}
                className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BirthdayReveal;
