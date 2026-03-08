import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Gift, MapPin, Calendar, Tag, Sparkles } from "lucide-react";

const CATEGORIES = ["All", "Food", "Travel", "Wellness", "Shopping", "Entertainment"];

interface Offer {
  id: string;
  business: string;
  description: string;
  category: string;
  validFrom: string;
  validTo: string;
  location: string;
  country: string;
}

// Placeholder — no real offers yet
const PLACEHOLDER_OFFERS: Offer[] = [];

const BirthdayOffers = () => {
  const navigate = useNavigate();
  const [userCountry, setUserCountry] = useState("United States");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [offers] = useState<Offer[]>(PLACEHOLDER_OFFERS);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data: profile } = await supabase.from("profiles").select("country").eq("id", user.id).single();
      if (profile?.country) setUserCountry(profile.country);
    };
    load();
  }, [navigate]);

  const filteredOffers = offers.filter(
    (o) =>
      o.country === userCountry &&
      (selectedCategory === "All" || o.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Birthday Offers <span className="text-gradient-gold">Near You</span>
          </h1>
          <p className="text-muted-foreground">Special deals from businesses celebrating with you</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {userCountry}
          </div>
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Offers or empty state */}
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="glass rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{offer.business}</h3>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {offer.validFrom} — {offer.validTo}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {offer.location}</span>
                </div>
                <Button size="sm" className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                  Claim Offer
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-2xl p-12 text-center"
          >
            <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Birthday offers in your area are coming soon. We are building partnerships now.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BirthdayOffers;
