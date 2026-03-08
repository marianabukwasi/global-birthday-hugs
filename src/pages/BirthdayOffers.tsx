import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Gift, MapPin, Calendar, Sparkles, ExternalLink, Copy, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const CATEGORIES = ["All", "Food", "Travel", "Wellness", "Shopping", "Entertainment"];

interface Offer {
  id: string;
  business: string;
  headline: string;
  description: string;
  category: string;
  validFrom: string;
  validTo: string;
  country: string;
  city: string;
  redemptionType: "code" | "url";
  redemptionDetails: string;
  logoPlaceholder: string;
}

// Placeholder offers for demo
const PLACEHOLDER_OFFERS: Offer[] = [];

const BirthdayOffers = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [userCountry, setUserCountry] = useState("United States");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [offers] = useState<Offer[]>(PLACEHOLDER_OFFERS);
  const [claimedOffer, setClaimedOffer] = useState<Offer | null>(null);

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

  const handleClaim = (offer: Offer) => {
    if (offer.redemptionType === "url") {
      window.open(offer.redemptionDetails, "_blank");
    } else {
      setClaimedOffer(offer);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            {t("offers.title")} <span className="text-gradient-gold">{t("offers.nearYou")}</span>
          </h1>
          <p className="text-muted-foreground">{t("offers.subtitle")}</p>
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
          <div className="flex gap-2 flex-wrap">
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

        {/* Offers */}
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Gift className="w-7 h-7 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{offer.category}</p>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{offer.headline}</h3>
                    <p className="text-sm text-muted-foreground">{offer.business}</p>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 mb-4">{offer.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {offer.city}, {offer.country}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t("offers.validDates")}: {offer.validFrom} — {offer.validTo}</span>
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  <span className="font-medium">{t("offers.redemption")}:</span>{" "}
                  {offer.redemptionType === "code" ? "Use discount code at checkout" : "Visit partner website"}
                </div>

                <Button
                  onClick={() => handleClaim(offer)}
                  className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 gap-2"
                >
                  {offer.redemptionType === "url" ? <ExternalLink className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                  {t("offers.claim")}
                </Button>
              </motion.div>
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
            <h3 className="font-display text-xl font-bold text-foreground mb-2">{t("offers.comingSoon")}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{t("offers.comingSoonText")}</p>
          </motion.div>
        )}

        {/* Code reveal modal */}
        {claimedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setClaimedOffer(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-card border border-border p-8 text-center"
            >
              <Tag className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{claimedOffer.headline}</h3>
              <p className="text-sm text-muted-foreground mb-4">{claimedOffer.business}</p>
              <div className="rounded-lg bg-secondary/50 border border-border p-4 mb-4">
                <p className="font-mono text-xl font-bold text-primary tracking-widest">{claimedOffer.redemptionDetails}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-border text-foreground gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(claimedOffer.redemptionDetails);
                  toast({ title: "Code copied!" });
                }}
              >
                <Copy className="w-4 h-4" /> Copy Code
              </Button>
            </motion.div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BirthdayOffers;
