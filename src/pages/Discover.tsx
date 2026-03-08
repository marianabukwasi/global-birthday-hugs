import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Globe, Users, Sparkles, Heart, Filter } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Discover = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showTwins, setShowTwins] = useState(false);
  const [myBirthday, setMyBirthday] = useState<{ day: number; month: number } | null>(null);
  const [wishCounts, setWishCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: myProfile } = await supabase.from("profiles").select("birthday_day, birthday_month").eq("id", user.id).single();
        if (myProfile?.birthday_day && myProfile?.birthday_month) {
          setMyBirthday({ day: myProfile.birthday_day, month: myProfile.birthday_month });
        }
      }

      const { data } = await supabase.from("profiles").select("id, full_name, preferred_name, country, avatar_url, is_name_public, is_country_public, birthday_day, birthday_month, is_receiver_active, pot_target_cents");
      if (data) setProfiles(data);

      // Get wish counts
      const { data: wishes } = await supabase.from("wishes").select("recipient_id");
      if (wishes) {
        const counts: Record<string, number> = {};
        wishes.forEach(w => { counts[w.recipient_id] = (counts[w.recipient_id] || 0) + 1; });
        setWishCounts(counts);
      }
    };
    load();
  }, []);

  const filtered = profiles.filter((p) => {
    if (!p.is_receiver_active) return false;
    if (showTwins && myBirthday) {
      if (p.birthday_day !== myBirthday.day || p.birthday_month !== myBirthday.month) return false;
    }
    const name = (p.is_name_public ? (p.preferred_name || p.full_name) : "").toLowerCase();
    const country = (p.is_country_public ? p.country : "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || country.includes(q);
  });

  const handleSurprise = () => {
    const active = profiles.filter(p => p.is_receiver_active);
    if (active.length === 0) return;
    const random = active[Math.floor(Math.random() * active.length)];
    navigate(`/celebrate/${random.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("discover.title")} <span className="text-gradient-gold">{t("discover.birthdays")}</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-6">{t("discover.subtitle")}</p>
          <div className="max-w-md mx-auto relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("discover.search")}
              className="pl-10 bg-muted/50 border-border"
            />
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {myBirthday && (
              <Button
                variant={showTwins ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTwins(!showTwins)}
                className={showTwins ? "bg-primary text-primary-foreground" : "border-border text-foreground"}
              >
                <Filter className="w-4 h-4 mr-1" /> {t("discover.twins")}
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSurprise}
              className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 shadow-glow-gold"
            >
              <Sparkles className="w-4 h-4 mr-1" /> {t("discover.surprise")}
            </Button>
          </div>
        </motion.div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="glass rounded-xl p-5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : "🎂"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {p.is_name_public ? (p.preferred_name || p.full_name) : "A Celebrant"}
                      </h3>
                      {p.is_country_public && p.country && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Globe className="w-3.5 h-3.5" /> {p.country}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{wishCounts[p.id] || 0} {t("discover.wishes")}</span>
                    {p.pot_target_cents > 0 && (
                      <span>{t("discover.potTarget")}: ${(p.pot_target_cents / 100).toFixed(0)}</span>
                    )}
                  </div>
                  <Link to={`/celebrate/${p.id}`}>
                    <Button size="sm" className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 gap-1">
                      <Heart className="w-3.5 h-3.5" /> {t("discover.sendWish")}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("discover.noResults")}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
