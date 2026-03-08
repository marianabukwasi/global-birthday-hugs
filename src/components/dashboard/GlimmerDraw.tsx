import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, Gift, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlimmerDrawProps {
  daysUntilBirthday: number | null;
}

const SAMPLE_PRIZES = [
  { name: "Free Coffee at Brew & Co", description: "One free drink of your choice at any Brew & Co location", partner: "Brew & Co" },
  { name: "20% Off at Wanderlust Travel", description: "20% discount on any booking made within 30 days", partner: "Wanderlust Travel" },
  { name: "$10 Gift Card — Bloom Wellness", description: "Redeemable at any Bloom Wellness spa", partner: "Bloom Wellness" },
];

const GlimmerDraw = ({ daysUntilBirthday }: GlimmerDrawProps) => {
  const isUnlocked = daysUntilBirthday !== null && daysUntilBirthday <= 7;
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<typeof SAMPLE_PRIZES[0] | null>(null);

  const handleSpin = () => {
    setSpinning(true);
    setPrize(null);
    setTimeout(() => {
      const randomPrize = SAMPLE_PRIZES[Math.floor(Math.random() * SAMPLE_PRIZES.length)];
      setPrize(randomPrize);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="glass-strong rounded-2xl p-6 text-center">
      <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" /> Glimmer Draw
      </h3>

      {/* Spin button */}
      <div className="mb-6">
        <motion.button
          whileHover={isUnlocked ? { scale: 1.05 } : {}}
          whileTap={isUnlocked ? { scale: 0.95 } : {}}
          onClick={isUnlocked && !spinning ? handleSpin : undefined}
          disabled={!isUnlocked || spinning}
          className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center border-4 transition-all ${
            isUnlocked
              ? "bg-gradient-gold border-primary shadow-glow-gold cursor-pointer"
              : "bg-muted/30 border-border/50 cursor-not-allowed"
          } ${spinning ? "animate-spin-slow" : ""}`}
        >
          {isUnlocked ? (
            spinning ? (
              <Sparkles className="w-10 h-10 text-primary-foreground animate-pulse" />
            ) : (
              <Gift className="w-10 h-10 text-primary-foreground" />
            )
          ) : (
            <Lock className="w-8 h-8 text-muted-foreground/40" />
          )}
        </motion.button>
      </div>

      {!isUnlocked && (
        <p className="text-sm text-muted-foreground">
          Your Glimmer Draw opens <span className="text-primary font-medium">7 days</span> before your birthday.
          {daysUntilBirthday !== null && (
            <span className="block text-xs mt-1 text-muted-foreground/70">
              {daysUntilBirthday} days to go
            </span>
          )}
        </p>
      )}

      {isUnlocked && !prize && !spinning && (
        <p className="text-sm text-muted-foreground">
          Tap the button to spin! One winner per day across the platform.
        </p>
      )}

      {/* Prize reveal */}
      <AnimatePresence>
        {prize && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-6 rounded-xl border border-primary/30 p-5"
            style={{ background: "hsl(var(--primary) / 0.08)" }}
          >
            <PartyPopper className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-display text-lg font-bold text-foreground mb-1">{prize.name}</h4>
            <p className="text-sm text-muted-foreground mb-1">{prize.description}</p>
            <p className="text-xs text-muted-foreground/60 mb-4">from {prize.partner}</p>
            <Button className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
              Claim Prize
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlimmerDraw;
