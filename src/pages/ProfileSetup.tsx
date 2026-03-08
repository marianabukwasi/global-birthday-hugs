import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff, Camera } from "lucide-react";

const countries = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada",
  "Chile","China","Colombia","Congo","Croatia","Cuba","Czech Republic","Denmark","Egypt","Ethiopia",
  "Finland","France","Germany","Ghana","Greece","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Jamaica","Japan","Jordan","Kenya","South Korea","Lebanon","Malaysia","Mexico",
  "Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Peru","Philippines","Poland","Portugal",
  "Romania","Russia","Saudi Arabia","Senegal","Singapore","South Africa","Spain","Sri Lanka","Sweden","Switzerland",
  "Thailand","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Venezuela","Vietnam",
  "Zimbabwe"
];

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const wishPromptOptions = [
  "What's your favorite memory of me?",
  "What do you wish for me this year?",
  "Tell me something I don't know about myself.",
  "What's the best advice you'd give me?",
  "Describe me in three words.",
  "Custom prompt...",
];

const coreColors = [
  { name: "Golden Hour", value: "#F5C842" },
  { name: "Sage Green", value: "#8FAE8B" },
  { name: "Burnt Orange", value: "#CC7A3A" },
  { name: "Deep Ocean", value: "#4A7FA5" },
  { name: "Soft Lavender", value: "#9B7EB8" },
  { name: "Rose Pink", value: "#C76B7E" },
  { name: "Warm Amber", value: "#D4963A" },
  { name: "Midnight Blue", value: "#0D1B4B" },
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [profile, setProfile] = useState({
    preferred_name: "",
    birthday_day: "",
    birthday_month: "",
    birth_year: "",
    country: "",
    city: "",
    core_color: "#F5C842",
    wish_prompt: "",
    content_preference: "both",
    pot_target_cents: 5000,
    bio: "",
    is_name_public: true,
    is_age_public: true,
    is_country_public: true,
    is_hobbies_public: true,
  });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile({
          preferred_name: data.preferred_name || "",
          birthday_day: data.birthday_day ? String(data.birthday_day) : "",
          birthday_month: data.birthday_month ? months[data.birthday_month - 1] : "",
          birth_year: data.birth_year ? String(data.birth_year) : "",
          country: data.country || "",
          city: data.city || "",
          core_color: data.core_color || "#F5C842",
          wish_prompt: data.wish_prompt || "",
          content_preference: data.content_preference || "both",
          pot_target_cents: data.pot_target_cents || 5000,
          bio: data.bio || "",
          is_name_public: data.is_name_public ?? true,
          is_age_public: data.is_age_public ?? true,
          is_country_public: data.is_country_public ?? true,
          is_hobbies_public: data.is_hobbies_public ?? true,
        });
        if (data.wish_prompt && !wishPromptOptions.slice(0, -1).includes(data.wish_prompt)) {
          setIsCustomPrompt(true);
        }
      }
    };
    load();
  }, [navigate]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("profiles").update({
        preferred_name: profile.preferred_name,
        birthday_day: profile.birthday_day ? parseInt(profile.birthday_day) : null,
        birthday_month: profile.birthday_month ? months.indexOf(profile.birthday_month) + 1 : null,
        birth_year: profile.birth_year ? parseInt(profile.birth_year) : null,
        country: profile.country,
        city: profile.city,
        core_color: profile.core_color,
        wish_prompt: profile.wish_prompt,
        content_preference: profile.content_preference,
        pot_target_cents: profile.pot_target_cents,
        bio: profile.bio,
        is_name_public: profile.is_name_public,
        is_age_public: profile.is_age_public,
        is_country_public: profile.is_country_public,
        is_hobbies_public: profile.is_hobbies_public,
      }).eq("id", user.id);

      if (error) throw error;
      toast({ title: "Profile saved! ✨" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const PrivacyToggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        {label}
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Your Profile</h1>
          <p className="text-muted-foreground mb-8">Set up your celebration experience</p>

          <div className="space-y-8">
            {/* Identity */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Identity</h2>

              <div className="space-y-2">
                <Label>Preferred Name</Label>
                <Input
                  value={profile.preferred_name}
                  onChange={(e) => setProfile({ ...profile, preferred_name: e.target.value })}
                  placeholder="How should people call you?"
                  className="bg-muted/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Birthday</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Select value={profile.birthday_month} onValueChange={(v) => setProfile({ ...profile, birthday_month: v })}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Month" /></SelectTrigger>
                    <SelectContent>{months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={profile.birthday_day} onValueChange={(v) => setProfile({ ...profile, birthday_day: v })}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Day" /></SelectTrigger>
                    <SelectContent>{Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input
                    value={profile.birth_year}
                    onChange={(e) => setProfile({ ...profile, birth_year: e.target.value })}
                    placeholder="Year (optional)"
                    type="number"
                    className="bg-muted/50 border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select value={profile.country} onValueChange={(v) => setProfile({ ...profile, country: v })}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Country" /></SelectTrigger>
                    <SelectContent>{countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City (optional)</Label>
                  <Input
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="Your city"
                    className="bg-muted/50 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell the world a little about yourself..."
                  className="bg-muted/50 border-border resize-none"
                  rows={3}
                />
              </div>
            </section>

            {/* Photos */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Photos</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">The Self</span>
                  <span className="text-xs text-muted-foreground/60">Your portrait</span>
                </div>
                <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">The Essence</span>
                  <span className="text-xs text-muted-foreground/60">Your atmosphere</span>
                </div>
              </div>
            </section>

            {/* CORE Color */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">CORE Color Palette</h2>
              <p className="text-sm text-muted-foreground">Choose the color atmosphere for your birthday page</p>
              <div className="grid grid-cols-4 gap-3">
                {coreColors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setProfile({ ...profile, core_color: c.value })}
                    className={`aspect-square rounded-xl border-2 transition-all ${
                      profile.core_color === c.value ? "border-foreground scale-105 shadow-lg" : "border-transparent hover:border-border"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </section>

            {/* Wish Prompt */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Wish Prompt</h2>
              <p className="text-sm text-muted-foreground">What should people respond to when wishing you?</p>
              <Select
                value={isCustomPrompt ? "Custom prompt..." : profile.wish_prompt}
                onValueChange={(v) => {
                  if (v === "Custom prompt...") {
                    setIsCustomPrompt(true);
                    setProfile({ ...profile, wish_prompt: "" });
                  } else {
                    setIsCustomPrompt(false);
                    setProfile({ ...profile, wish_prompt: v });
                  }
                }}
              >
                <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Select a prompt" /></SelectTrigger>
                <SelectContent>
                  {wishPromptOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {isCustomPrompt && (
                <Input
                  value={profile.wish_prompt}
                  onChange={(e) => setProfile({ ...profile, wish_prompt: e.target.value })}
                  placeholder="Write your custom wish prompt..."
                  className="bg-muted/50 border-border"
                />
              )}
            </section>

            {/* Content Preference */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Content Preference</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "photos", label: "📸 Photos" },
                  { value: "videos", label: "🎬 Videos" },
                  { value: "both", label: "🎉 Both" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setProfile({ ...profile, content_preference: opt.value })}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      profile.content_preference === opt.value
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "glass hover:border-primary/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Birthday Pot Target */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Birthday Pot Target</h2>
              <div className="space-y-2">
                <Label>Target Amount ($)</Label>
                <Input
                  type="number"
                  value={profile.pot_target_cents / 100}
                  onChange={(e) => setProfile({ ...profile, pot_target_cents: Math.round(parseFloat(e.target.value || "0") * 100) })}
                  min={0}
                  className="bg-muted/50 border-border"
                />
              </div>
            </section>

            {/* Privacy */}
            <section className="glass rounded-2xl p-6 space-y-2">
              <h2 className="font-display text-lg font-bold text-foreground mb-2">Privacy</h2>
              <PrivacyToggle label="Name visible" value={profile.is_name_public} onChange={(v) => setProfile({ ...profile, is_name_public: v })} />
              <PrivacyToggle label="Age visible" value={profile.is_age_public} onChange={(v) => setProfile({ ...profile, is_age_public: v })} />
              <PrivacyToggle label="Country visible" value={profile.is_country_public} onChange={(v) => setProfile({ ...profile, is_country_public: v })} />
              <PrivacyToggle label="Hobbies visible" value={profile.is_hobbies_public} onChange={(v) => setProfile({ ...profile, is_hobbies_public: v })} />
            </section>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 h-12 text-base font-semibold"
            >
              {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : "Save Profile"}
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSetup;
