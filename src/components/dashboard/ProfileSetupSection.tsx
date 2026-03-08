import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Camera, Sparkles, Upload, Save } from "lucide-react";
import { motion } from "framer-motion";
import { MONTHS } from "@/lib/constants";

const WISH_PROMPTS = [
  "Share the best lesson you learned this year",
  "Tell me something that will make me smile on my birthday",
  "Give me a quote that changed your life",
  "Tell me one thing you love about life right now",
];

const ZODIAC_SIGNS = [
  { name: "Capricorn", symbol: "♑", start: [1, 1], end: [1, 19] },
  { name: "Aquarius", symbol: "♒", start: [1, 20], end: [2, 18] },
  { name: "Pisces", symbol: "♓", start: [2, 19], end: [3, 20] },
  { name: "Aries", symbol: "♈", start: [3, 21], end: [4, 19] },
  { name: "Taurus", symbol: "♉", start: [4, 20], end: [5, 20] },
  { name: "Gemini", symbol: "♊", start: [5, 21], end: [6, 20] },
  { name: "Cancer", symbol: "♋", start: [6, 21], end: [7, 22] },
  { name: "Leo", symbol: "♌", start: [7, 23], end: [8, 22] },
  { name: "Virgo", symbol: "♍", start: [8, 23], end: [9, 22] },
  { name: "Libra", symbol: "♎", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", symbol: "♏", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", symbol: "♐", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", symbol: "♑", start: [12, 22], end: [12, 31] },
];

function getZodiacSign(month: number, day: number): { name: string; symbol: string } | null {
  if (!month || !day) return null;
  for (const z of ZODIAC_SIGNS) {
    const afterStart = month > z.start[0] || (month === z.start[0] && day >= z.start[1]);
    const beforeEnd = month < z.end[0] || (month === z.end[0] && day <= z.end[1]);
    if (afterStart && beforeEnd) return { name: z.name, symbol: z.symbol };
  }
  return null;
}

const CORE_COLORS = [
  { name: "Gold", value: "#F5C842" },
  { name: "Rose", value: "#D4687A" },
  { name: "Lavender", value: "#9B7EC8" },
  { name: "Ocean", value: "#4A8BA8" },
  { name: "Sage", value: "#7A9E7E" },
  { name: "Amber", value: "#C8943A" },
  { name: "Coral", value: "#E87461" },
  { name: "Midnight", value: "#3A4F7A" },
];

interface ProfileSetupSectionProps {
  profile: any;
  userId: string;
  onProfileUpdate: (updated: any) => void;
}

const ProfileSetupSection = ({ profile, userId, onProfileUpdate }: ProfileSetupSectionProps) => {
  const [preferredName, setPreferredName] = useState(profile?.preferred_name || "");
  const [coreColor, setCoreColor] = useState(profile?.core_color || "#F5C842");
  const [wishPrompt, setWishPrompt] = useState(profile?.wish_prompt || WISH_PROMPTS[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isCustomPrompt, setIsCustomPrompt] = useState(
    profile?.wish_prompt && !WISH_PROMPTS.includes(profile.wish_prompt)
  );
  const [contentPreference, setContentPreference] = useState(profile?.content_preference || "both");
  const [potTarget, setPotTarget] = useState(profile?.pot_target_cents ? profile.pot_target_cents / 100 : 0);
  const [showCity, setShowCity] = useState(profile?.is_country_public ?? false);
  const [showAge, setShowAge] = useState(profile?.is_age_public ?? true);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [essenceUrl, setEssenceUrl] = useState(profile?.essence_photo_url || "");
  const [saving, setSaving] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const essenceInputRef = useRef<HTMLInputElement>(null);

  const zodiac = getZodiacSign(profile?.birthday_month, profile?.birthday_day);

  const handlePhotoUpload = async (file: File, type: "avatar" | "essence") => {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${type}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("wish-media").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from("wish-media").getPublicUrl(path);
    if (type === "avatar") setAvatarUrl(urlData.publicUrl);
    else setEssenceUrl(urlData.publicUrl);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalPrompt = isCustomPrompt ? customPrompt : wishPrompt;
      const { error } = await supabase
        .from("profiles")
        .update({
          preferred_name: preferredName,
          core_color: coreColor,
          wish_prompt: finalPrompt,
          content_preference: contentPreference,
          pot_target_cents: Math.round(potTarget * 100),
          is_country_public: showCity,
          is_age_public: showAge,
          avatar_url: avatarUrl,
          essence_photo_url: essenceUrl,
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Saved! ✨",
        description: "Your birthday page is live. Share your link and watch the world show up.",
      });
      onProfileUpdate({
        ...profile,
        preferred_name: preferredName,
        core_color: coreColor,
        wish_prompt: finalPrompt,
        content_preference: contentPreference,
        pot_target_cents: Math.round(potTarget * 100),
        is_country_public: showCity,
        is_age_public: showAge,
        avatar_url: avatarUrl,
        essence_photo_url: essenceUrl,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preferred name */}
      <div className="space-y-2">
        <Label htmlFor="preferredName">Preferred Name</Label>
        <Input
          id="preferredName"
          value={preferredName}
          onChange={(e) => setPreferredName(e.target.value)}
          placeholder="What should people call you?"
          className="bg-muted/50 border-border"
        />
      </div>

      {/* Photo uploads */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Your Photo</Label>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], "avatar");
          }} />
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="w-full aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-2 overflow-hidden"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Your photo" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload</span>
              </>
            )}
          </button>
        </div>
        <div className="space-y-2">
          <Label>Your Essence</Label>
          <input ref={essenceInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], "essence");
          }} />
          <button
            onClick={() => essenceInputRef.current?.click()}
            className="w-full aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-2 overflow-hidden"
          >
            {essenceUrl ? (
              <img src={essenceUrl} alt="Your essence" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload</span>
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground">Something that represents your world</p>
        </div>
      </div>

      {/* CORE Color Palette */}
      <div className="space-y-2">
        <Label>CORE Color Palette</Label>
        <p className="text-xs text-muted-foreground">This tints the atmosphere of your birthday page</p>
        <div className="flex flex-wrap gap-3 mt-2">
          {CORE_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCoreColor(c.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                coreColor === c.value ? "border-foreground scale-110 shadow-lg" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Wish Prompt */}
      <div className="space-y-2">
        <Label>Wish Prompt</Label>
        <Select
          value={isCustomPrompt ? "custom" : wishPrompt}
          onValueChange={(v) => {
            if (v === "custom") {
              setIsCustomPrompt(true);
            } else {
              setIsCustomPrompt(false);
              setWishPrompt(v);
            }
          }}
        >
          <SelectTrigger className="bg-muted/50 border-border">
            <SelectValue placeholder="Choose a prompt" />
          </SelectTrigger>
          <SelectContent>
            {WISH_PROMPTS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
            <SelectItem value="custom">Write your own...</SelectItem>
          </SelectContent>
        </Select>
        {isCustomPrompt && (
          <Textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Write your own wish prompt..."
            className="bg-muted/50 border-border mt-2"
            rows={2}
          />
        )}
      </div>

      {/* Content Preference */}
      <div className="space-y-2">
        <Label>Content Preference</Label>
        <RadioGroup value={contentPreference} onValueChange={setContentPreference} className="flex gap-4">
          {[
            { value: "photos", label: "Photos only" },
            { value: "videos", label: "Videos only" },
            { value: "both", label: "Both" },
          ].map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={opt.value} />
              <Label htmlFor={opt.value} className="text-sm font-normal cursor-pointer">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Zodiac Sign */}
      {zodiac && (
        <div className="space-y-1">
          <Label>Zodiac Sign</Label>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
            <span className="text-2xl">{zodiac.symbol}</span>
            <span className="text-foreground font-medium">{zodiac.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">Auto-calculated</span>
          </div>
        </div>
      )}

      {/* Birthday Pot Target */}
      <div className="space-y-2">
        <Label htmlFor="potTarget">Birthday Pot Target</Label>
        <p className="text-xs text-muted-foreground">How much would you love to receive for your birthday?</p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="potTarget"
            type="number"
            min={0}
            value={potTarget || ""}
            onChange={(e) => setPotTarget(Number(e.target.value))}
            placeholder="0"
            className="bg-muted/50 border-border pl-7"
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4">
        <Label>Privacy Settings</Label>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
          <span className="text-sm text-foreground">Show my city</span>
          <Switch checked={showCity} onCheckedChange={setShowCity} />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
          <span className="text-sm text-foreground">Show my age</span>
          <Switch checked={showAge} onCheckedChange={setShowAge} />
        </div>
      </div>

      {/* Save */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 h-12 text-base font-semibold"
      >
        {saving ? <Sparkles className="w-5 h-5 animate-spin" /> : (
          <span className="flex items-center gap-2"><Save className="w-5 h-5" /> Save Profile</span>
        )}
      </Button>
    </div>
  );
};

export default ProfileSetupSection;
