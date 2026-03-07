import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Search, Send, Heart, Image, Globe, Users, Cake } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SendWish = () => {
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadProfiles = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, preferred_name, country, age, avatar_url, is_name_public, is_age_public, is_country_public")
        .limit(50);
      if (data) setProfiles(data);
    };
    loadProfiles();
  }, []);

  const filtered = profiles.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.preferred_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.country?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendWish = async () => {
    if (!selected || !message.trim()) return;
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in first");

      const { error } = await supabase.from("wishes").insert({
        sender_id: user.id,
        recipient_id: selected.id,
        message: message.trim(),
        birthday_year: new Date().getFullYear(),
      });
      if (error) throw error;
      toast({ title: "Wish sent! 🎉", description: `Your birthday wish was sent to ${selected.preferred_name || selected.full_name}` });
      setMessage("");
      setSelected(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Send a <span className="text-gradient-celebration">Birthday Wish</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">Spread joy to someone celebrating their special day</p>
        </motion.div>

        {!selected ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or country..."
                className="pl-12 h-12 bg-muted/50 border-border text-base"
              />
            </div>

            {/* User grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="glass rounded-xl p-5 text-left hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-celebration flex items-center justify-center text-xl font-bold text-primary-foreground">
                      {(p.preferred_name || p.full_name || "?")[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {p.is_name_public ? (p.preferred_name || p.full_name) : "Anonymous"}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {p.is_country_public && p.country && (
                          <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{p.country}</span>
                        )}
                        {p.is_age_public && p.age && (
                          <span className="flex items-center gap-1"><Cake className="w-3 h-3" />Turning {p.age}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No celebrants found. Be the first to invite friends!</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
            <div className="glass-strong rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-celebration flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {(selected.preferred_name || selected.full_name || "?")[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {selected.preferred_name || selected.full_name}
                  </h2>
                  <p className="text-muted-foreground">{selected.country}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your birthday wish... 🎂"
                  rows={4}
                  className="bg-muted/50 border-border"
                />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Image className="w-4 h-4" />
                  <span>Image upload coming soon</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSendWish}
                    disabled={!message.trim() || sending}
                    className="flex-1 bg-gradient-celebration text-primary-foreground border-0 hover:opacity-90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sending ? "Sending..." : "Send Wish"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SendWish;
