import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Save, Camera, Eye, EyeOff } from "lucide-react";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    preferred_name: "",
    age: "",
    country: "",
    hobbies: "",
    interests: "",
    favorite_color: "#ec4899",
    bio: "",
    is_name_public: true,
    is_age_public: true,
    is_country_public: true,
    is_hobbies_public: true,
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          preferred_name: data.preferred_name || "",
          age: data.age?.toString() || "",
          country: data.country || "",
          hobbies: (data.hobbies || []).join(", "),
          interests: (data.interests || []).join(", "),
          favorite_color: data.favorite_color || "#ec4899",
          bio: data.bio || "",
          is_name_public: data.is_name_public ?? true,
          is_age_public: data.is_age_public ?? true,
          is_country_public: data.is_country_public ?? true,
          is_hobbies_public: data.is_hobbies_public ?? true,
        });
      }
    };
    loadProfile();
  }, [navigate]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          preferred_name: profile.preferred_name,
          age: profile.age ? parseInt(profile.age) : null,
          country: profile.country,
          hobbies: profile.hobbies.split(",").map((h) => h.trim()).filter(Boolean),
          interests: profile.interests.split(",").map((i) => i.trim()).filter(Boolean),
          favorite_color: profile.favorite_color,
          bio: profile.bio,
          is_name_public: profile.is_name_public,
          is_age_public: profile.is_age_public,
          is_country_public: profile.is_country_public,
          is_hobbies_public: profile.is_hobbies_public,
        })
        .eq("id", user.id);

      if (error) throw error;
      toast({ title: "Profile saved! 🎉" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const PrivacyToggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      title={value ? "Public" : "Private"}
    >
      {value ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {value ? "Public" : "Private"}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Your Profile</h1>
          <p className="text-muted-foreground mb-8">Customize how the world sees you on your birthday</p>

          <div className="space-y-6">
            <div className="glass-strong rounded-2xl p-6 space-y-5">
              <h2 className="font-display text-lg font-semibold text-foreground">Personal Info</h2>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Full Name</Label>
                  <PrivacyToggle label="Name" value={profile.is_name_public} onChange={(v) => setProfile({ ...profile, is_name_public: v })} />
                </div>
                <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="bg-muted/50" />
              </div>

              <div className="space-y-2">
                <Label>Preferred Name</Label>
                <Input value={profile.preferred_name} onChange={(e) => setProfile({ ...profile, preferred_name: e.target.value })} placeholder="What should we call you?" className="bg-muted/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Age</Label>
                    <PrivacyToggle label="Age" value={profile.is_age_public} onChange={(v) => setProfile({ ...profile, is_age_public: v })} />
                  </div>
                  <Input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Country</Label>
                    <PrivacyToggle label="Country" value={profile.is_country_public} onChange={(v) => setProfile({ ...profile, is_country_public: v })} />
                  </div>
                  <Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className="bg-muted/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell the world about yourself..." className="bg-muted/50" rows={3} />
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-6 space-y-5">
              <h2 className="font-display text-lg font-semibold text-foreground">Personality</h2>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Hobbies</Label>
                  <PrivacyToggle label="Hobbies" value={profile.is_hobbies_public} onChange={(v) => setProfile({ ...profile, is_hobbies_public: v })} />
                </div>
                <Input value={profile.hobbies} onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })} placeholder="Dancing, Cooking, Music (comma-separated)" className="bg-muted/50" />
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <Input value={profile.interests} onChange={(e) => setProfile({ ...profile, interests: e.target.value })} placeholder="Art, Technology, Travel (comma-separated)" className="bg-muted/50" />
              </div>

              <div className="space-y-2">
                <Label>Favorite Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={profile.favorite_color}
                    onChange={(e) => setProfile({ ...profile, favorite_color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-sm text-muted-foreground">{profile.favorite_color}</span>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading} className="w-full bg-gradient-celebration text-primary-foreground border-0 hover:opacity-90 h-12 text-base font-semibold">
              <Save className="w-5 h-5 mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSetup;
