import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Globe } from "lucide-react";

// Country flag emoji helper
const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    "United States": "🇺🇸", "United Kingdom": "🇬🇧", "Canada": "🇨🇦", "Australia": "🇦🇺",
    "Germany": "🇩🇪", "France": "🇫🇷", "Japan": "🇯🇵", "Brazil": "🇧🇷", "India": "🇮🇳",
    "Mexico": "🇲🇽", "Nigeria": "🇳🇬", "South Africa": "🇿🇦", "Kenya": "🇰🇪", "Ghana": "🇬🇭",
    "Spain": "🇪🇸", "Italy": "🇮🇹", "Netherlands": "🇳🇱", "Sweden": "🇸🇪", "Norway": "🇳🇴",
    "South Korea": "🇰🇷", "Philippines": "🇵🇭", "Thailand": "🇹🇭", "Argentina": "🇦🇷",
    "Colombia": "🇨🇴", "Egypt": "🇪🇬", "Turkey": "🇹🇷", "Poland": "🇵🇱", "Ireland": "🇮🇪",
    "Switzerland": "🇨🇭", "Singapore": "🇸🇬", "New Zealand": "🇳🇿", "Portugal": "🇵🇹",
    "Belgium": "🇧🇪", "Denmark": "🇩🇰", "Finland": "🇫🇮", "Greece": "🇬🇷", "Chile": "🇨🇱",
    "Peru": "🇵🇪", "Malaysia": "🇲🇾", "Indonesia": "🇮🇩", "Vietnam": "🇻🇳", "Pakistan": "🇵🇰",
    "Bangladesh": "🇧🇩", "Sri Lanka": "🇱🇰", "Jamaica": "🇯🇲", "Uganda": "🇺🇬",
    "United Arab Emirates": "🇦🇪", "Saudi Arabia": "🇸🇦", "Israel": "🇮🇱", "Lebanon": "🇱🇧",
    "Morocco": "🇲🇦", "Tunisia": "🇹🇳", "Algeria": "🇩🇿", "China": "🇨🇳", "Russia": "🇷🇺",
    "Ukraine": "🇺🇦", "Czech Republic": "🇨🇿", "Romania": "🇷🇴", "Croatia": "🇭🇷",
    "Cuba": "🇨🇺", "Venezuela": "🇻🇪", "Zimbabwe": "🇿🇼", "Senegal": "🇸🇳",
    "Jordan": "🇯🇴", "Iran": "🇮🇷", "Iraq": "🇮🇶", "Ethiopia": "🇪🇹", "Afghanistan": "🇦🇫",
    "Albania": "🇦🇱", "Austria": "🇦🇹", "Congo": "🇨🇬",
  };
  return flags[country] || "🌍";
};

interface SealedWish {
  id: string;
  country: string;
}

interface WishVaultProps {
  wishes: SealedWish[];
  isCountdownActive: boolean;
}

const WishVault = ({ wishes, isCountdownActive }: WishVaultProps) => {
  if (wishes.length === 0) {
    return (
      <div className="text-center py-12">
        <Globe className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">No wishes yet. Share your link and they'll start arriving.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {wishes.map((wish, i) => (
        <motion.div
          key={wish.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`relative rounded-xl border border-border overflow-hidden group ${
            isCountdownActive ? "animate-pulse-glow" : ""
          }`}
        >
          {/* Blurred placeholder */}
          <div className="aspect-[4/3] bg-muted/60 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/80" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.3), transparent 70%)`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCountdownActive
                  ? "bg-primary/20 shadow-glow-gold"
                  : "bg-muted/40"
              }`}>
                <Lock className={`w-5 h-5 ${isCountdownActive ? "text-primary" : "text-muted-foreground/50"}`} />
              </div>
            </div>
          </div>

          {/* Info strip */}
          <div className="p-3 bg-card">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getCountryFlag(wish.country)}</span>
              <span className="text-sm text-muted-foreground">{wish.country}</span>
            </div>
            <p className="text-xs text-muted-foreground/70 italic">
              A wish from {wish.country} is waiting for you.
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WishVault;
