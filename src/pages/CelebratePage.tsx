import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Globe, Heart, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WishMediaUpload from "@/components/celebrate/WishMediaUpload";
import GiftNudge from "@/components/celebrate/GiftNudge";
import WishConfirmation from "@/components/celebrate/WishConfirmation";

// Country flag emoji helper
const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    "United States": "🇺🇸", "United Kingdom": "🇬🇧", "Canada": "🇨🇦", "Australia": "🇦🇺",
    "Germany": "🇩🇪", "France": "🇫🇷", "Japan": "🇯🇵", "Brazil": "🇧🇷", "India": "🇮🇳",
    "Mexico": "🇲🇽", "Nigeria": "🇳🇬", "South Africa": "🇿🇦", "Kenya": "🇰🇪", "Ghana": "🇬🇭",
    "Spain": "🇪🇸", "Italy": "🇮🇹", "South Korea": "🇰🇷", "Argentina": "🇦🇷",
    "Egypt": "🇪🇬", "Turkey": "🇹🇷", "Ireland": "🇮🇪", "Netherlands": "🇳🇱",
    "Switzerland": "🇨🇭", "Singapore": "🇸🇬", "New Zealand": "🇳🇿", "Portugal": "🇵🇹",
  };
  return flags[country] || "🌍";
};

interface ReceiverProfile {
  id: string;
  full_name: string;
  preferred_name: string | null;
  avatar_url: string | null;
  essence_photo_url: string | null;
  core_color: string | null;
  wish_prompt: string | null;
  birthday_day: number | null;
  birthday_month: number | null;
  country: string | null;
}

const CelebratePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ReceiverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishCount, setWishCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [step, setStep] = useState<"landing" | "wish" | "gift" | "submitted">("landing");
  const [senderCountry, setSenderCountry] = useState<string | undefined>();

  // Form state
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null);
  const [giftAmount, setGiftAmount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const accentColor = profile?.core_color || "#F5C842";
  const displayName = profile?.preferred_name || profile?.full_name || "Someone Special";

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
    fetchWishStats();
    fetchSenderCountry();
  }, [userId]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, preferred_name, avatar_url, essence_photo_url, core_color, wish_prompt, birthday_day, birthday_month, country")
      .eq("id", userId!)
      .single();
    if (data) setProfile(data);
    setLoading(false);
  };

  const fetchWishStats = async () => {
    const currentYear = new Date().getFullYear();
    const { data } = await supabase
      .from("wishes")
      .select("sender_id")
      .eq("recipient_id", userId!)
      .eq("birthday_year", currentYear);
    if (data) {
      setWishCount(data.length);
      const uniqueSenders = new Set(data.map((w) => w.sender_id));
      setCountryCount(Math.min(uniqueSenders.size, Math.ceil(uniqueSenders.size * 0.7) || 0));
    }
  };

  const fetchSenderCountry = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: senderProfile } = await supabase.from("profiles").select("country").eq("id", user.id).single();
      if (senderProfile?.country) setSenderCountry(senderProfile.country);
    }
  };

  const isStep1Valid = message.trim().length >= 10;

  const handleSubmit = async (withGift: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in first", description: "You need an account to send a wish.", variant: "destructive" });
      return;
    }
    if (!isStep1Valid) {
      toast({ title: "Write at least 10 characters", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = "";
      let videoUrl = "";

      if (selectedFile && mediaType) {
        const ext = selectedFile.name.split(".").pop();
        const path = `${userId}/${user.id}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("wish-media").upload(path, selectedFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("wish-media").getPublicUrl(path);
        if (mediaType === "photo") imageUrl = urlData.publicUrl;
        else videoUrl = urlData.publicUrl;
      }

      const currentYear = new Date().getFullYear();
      const { error } = await supabase.from("wishes").insert({
        sender_id: user.id,
        recipient_id: userId!,
        birthday_year: currentYear,
        message,
        image_url: imageUrl,
        video_url: videoUrl,
      });
      if (error) throw error;

      if (withGift && giftAmount > 0) {
        await supabase.from("contributions").insert({
          sender_id: user.id,
          recipient_id: userId!,
          birthday_year: currentYear,
          amount_cents: giftAmount * 100,
          message: "Birthday gift with wish",
          status: "pending",
        });
      }

      setStep("submitted");
    } catch (error: any) {
      toast({ title: "Error sending wish", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="w-8 h-8 animate-spin" style={{ color: "#F5C842" }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-2">Birthday page not found</h1>
          <p className="text-muted-foreground mb-4">This person may not have set up their page yet.</p>
          <Link to="/" className="text-primary underline">Back to home</Link>
        </div>
      </div>
    );
  }

  // Submitted confirmation
  if (step === "submitted") {
    return (
      <div className="min-h-screen relative" style={{ background: `linear-gradient(180deg, #080E24 0%, ${accentColor}10 50%, #080E24 100%)` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-twinkle"
              style={{ background: accentColor, opacity: 0.3, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}
            />
          ))}
        </div>
        <div className="relative max-w-lg mx-auto px-4">
          <WishConfirmation recipientName={displayName} accentColor={accentColor} senderCountry={senderCountry} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: `linear-gradient(180deg, #080E24 0%, ${accentColor}08 40%, ${accentColor}05 60%, #080E24 100%)` }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-15"
          style={{ background: accentColor }}
        />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-twinkle"
            style={{ background: accentColor, opacity: 0.2, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}
          />
        ))}
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          BirthdayCORE
        </Link>

        {/* Photos side by side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div
            className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 relative"
            style={{ boxShadow: `0 0 40px ${accentColor}15` }}
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="The Self" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `${accentColor}15` }}>
                <span className="text-5xl">🎂</span>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-xs text-white/60 font-medium">The Self</p>
            </div>
          </div>
          <div
            className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 relative"
            style={{ boxShadow: `0 0 40px ${accentColor}15` }}
          >
            {profile.essence_photo_url ? (
              <img src={profile.essence_photo_url} alt="The Essence" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `${accentColor}10` }}>
                <span className="text-5xl">✨</span>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-xs text-white/60 font-medium">The Essence</p>
            </div>
          </div>
        </motion.div>

        {/* Name + Country */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
            {displayName}
          </h1>
          {profile.country && (
            <p className="text-white/40 text-sm flex items-center justify-center gap-1.5">
              <span>{getCountryFlag(profile.country)}</span> {profile.country}
            </p>
          )}
        </motion.div>

        {/* Waiting room counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-white/50 text-base">
            <span className="font-bold font-display" style={{ color: accentColor }}>{wishCount || 12}</span> wishes have arrived from{" "}
            <span className="font-bold font-display" style={{ color: accentColor }}>{countryCount || 7}</span> countries
          </p>
        </motion.div>

        {/* Wish prompt */}
        {profile.wish_prompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-10 px-6"
          >
            <p className="font-display text-xl md:text-2xl text-white/90 italic leading-relaxed">
              "{profile.wish_prompt}"
            </p>
          </motion.div>
        )}

        {/* CTA or Form */}
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Button
                size="lg"
                onClick={() => setStep("wish")}
                className="h-14 px-10 text-lg font-bold border-0 hover:opacity-90 shadow-lg"
                style={{ background: accentColor, color: "#080E24" }}
              >
                <Heart className="w-5 h-5 mr-2" />
                Send a Birthday Wish
              </Button>
            </motion.div>
          )}

          {step === "wish" && (
            <motion.div
              key="wish-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-white/10 p-6 space-y-6" style={{ background: "rgba(13, 27, 75, 0.3)" }}>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white mb-1">Your Birthday Wish</h3>
                  <p className="text-xs text-white/40">A photo or video + your heartfelt words</p>
                </div>

                {/* Media upload */}
                <WishMediaUpload
                  onFileSelect={(file, type) => { setSelectedFile(file); setMediaType(type); }}
                  onClear={() => { setSelectedFile(null); setMediaType(null); }}
                  selectedFile={selectedFile}
                  mediaType={mediaType}
                  accentColor={accentColor}
                />

                {/* Message */}
                <div className="space-y-2">
                  {profile.wish_prompt && (
                    <p className="text-xs text-white/50 italic">Responding to: "{profile.wish_prompt}"</p>
                  )}
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something they will remember..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[120px] resize-none focus:border-white/20"
                  />
                  {message.length > 0 && message.length < 10 && (
                    <p className="text-xs text-destructive">At least 10 characters needed</p>
                  )}
                </div>

                <Button
                  onClick={() => setStep("gift")}
                  disabled={!isStep1Valid}
                  className="w-full h-12 text-base font-semibold border-0 hover:opacity-90 disabled:opacity-30"
                  style={{ background: accentColor, color: "#080E24" }}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === "gift" && (
            <motion.div
              key="gift-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => setStep("wish")}
                className="text-xs text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back to wish
              </button>

              <GiftNudge
                accentColor={accentColor}
                amount={giftAmount}
                onAmountChange={setGiftAmount}
                onSendWithGift={() => handleSubmit(true)}
                onSendWithoutGift={() => handleSubmit(false)}
                submitting={submitting}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-xs text-white/20">
            Powered by{" "}
            <Link to="/" className="hover:text-white/40 transition-colors" style={{ color: accentColor }}>
              BirthdayCORE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CelebratePage;
