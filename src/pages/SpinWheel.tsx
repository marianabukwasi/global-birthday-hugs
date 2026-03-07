import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Star, Sparkles, RotateCw, Check, X } from "lucide-react";

const prizes = [
  { name: "Free Coffee ☕", description: "Complimentary coffee from BeanBrew", partner: "BeanBrew", type: "free" },
  { name: "20% Off Flowers 💐", description: "Birthday bouquet discount", partner: "BloomBox", type: "discount" },
  { name: "Free Dessert 🍰", description: "Birthday treat on us!", partner: "SweetSpot", type: "free" },
  { name: "10% Off Sneakers 👟", description: "Birthday kicks discount", partner: "StepUp", type: "discount" },
  { name: "Surprise Gift 🎁", description: "A mystery gift just for you", partner: "GiftJoy", type: "free" },
  { name: "Spa Day 30% Off 🧖", description: "Pamper yourself", partner: "ZenSpa", type: "discount" },
];

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<(typeof prizes)[0] | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(3);

  const handleSpin = () => {
    if (spinsLeft <= 0 || spinning) return;
    setSpinning(true);
    setResult(null);

    setTimeout(() => {
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setResult(prize);
      setSpinsLeft((s) => s - 1);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Birthday <span className="text-gradient-gold">Spin</span>
          </h1>
          <p className="text-muted-foreground text-lg">Win prizes, discounts & surprises for your birthday!</p>
          <p className="text-sm text-celebration-gold mt-2 font-medium">{spinsLeft} spins remaining</p>
        </motion.div>

        {/* Spin Area */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <div className="glass-strong rounded-3xl p-10 text-center relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-celebration-gold/5 via-transparent to-celebration-pink/5" />

            <div className="relative">
              {/* Spin visual */}
              <div className={`w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-celebration flex items-center justify-center shadow-glow-pink ${spinning ? "animate-spin" : ""}`}>
                <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center">
                  <Gift className={`w-12 h-12 text-celebration-gold ${spinning ? "animate-pulse" : ""}`} />
                </div>
              </div>

              {/* Result */}
              <AnimatePresence mode="wait">
                {result && !spinning && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6"
                  >
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 bg-celebration-gold/20 text-celebration-gold">
                      {result.type === "free" ? "🎉 FREE GIFT" : "💰 DISCOUNT"}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-1">{result.name}</h3>
                    <p className="text-muted-foreground mb-1">{result.description}</p>
                    <p className="text-xs text-muted-foreground">Sponsored by {result.partner}</p>

                    <div className="flex gap-3 justify-center mt-5">
                      <Button className="bg-gradient-celebration text-primary-foreground border-0 hover:opacity-90">
                        <Check className="w-4 h-4 mr-1" /> Claim Prize
                      </Button>
                      <Button variant="outline" onClick={() => setResult(null)}>
                        <X className="w-4 h-4 mr-1" /> Decline
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!result && !spinning && (
                <p className="text-muted-foreground mb-6">Tap spin to reveal your birthday prize</p>
              )}

              <Button
                onClick={handleSpin}
                disabled={spinsLeft <= 0 || spinning}
                size="lg"
                className="bg-gradient-gold text-accent-foreground border-0 hover:opacity-90 text-lg px-10 h-14 font-bold"
              >
                {spinning ? (
                  <RotateCw className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {spinning ? "Spinning..." : spinsLeft <= 0 ? "No Spins Left" : "SPIN!"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Available Prizes Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-celebration-gold" /> Available Prizes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prizes.map((prize) => (
              <div key={prize.name} className="glass rounded-xl p-4 flex items-center gap-3">
                <Gift className="w-5 h-5 text-celebration-gold shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{prize.name}</p>
                  <p className="text-xs text-muted-foreground">{prize.partner}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SpinWheel;
