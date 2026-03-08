import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Globe, Users } from "lucide-react";

const Discover = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, preferred_name, country, avatar_url, is_name_public, is_country_public, birthday_day, birthday_month, is_receiver_active");
      if (data) setProfiles(data);
    };
    load();
  }, []);

  const today = new Date();
  const filtered = profiles.filter((p) => {
    if (!p.is_receiver_active) return false;
    const name = (p.is_name_public ? (p.preferred_name || p.full_name) : "").toLowerCase();
    const country = (p.is_country_public ? p.country : "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || country.includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Discover <span className="text-gradient-gold">Birthdays</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-6">Find someone to celebrate today</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or country..."
              className="pl-10 bg-muted/50 border-border"
            />
          </div>
        </motion.div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/celebrate/${p.id}`} className="block glass rounded-xl p-5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : "🎂"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {p.is_name_public ? (p.preferred_name || p.full_name) : "A Celebrant"}
                      </h3>
                      {p.is_country_public && p.country && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Globe className="w-3.5 h-3.5" /> {p.country}
                        </div>
                      )}
                      {p.birthday_month && p.birthday_day && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Birthday: {p.birthday_month}/{p.birthday_day}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No birthday pages found yet. Be the first!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
