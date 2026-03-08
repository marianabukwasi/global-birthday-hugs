import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TIERS = [
  { name: "Unranked", min: 0, max: 100, color: "hsl(var(--muted-foreground))" },
  { name: "Bronze", min: 100, max: 1000, color: "#CD7F32" },
  { name: "Silver", min: 1000, max: 10000, color: "#C0C0C0" },
  { name: "Gold", min: 10000, max: 100000, color: "hsl(var(--primary))" },
  { name: "Diamond", min: 100000, max: 1000000, color: "#B9F2FF" },
  { name: "Legend", min: 1000000, max: Infinity, color: "#FFD700" },
];

function getTier(amount: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (amount >= TIERS[i].min) return TIERS[i];
  }
  return TIERS[0];
}

function getProgress(amount: number, tier: typeof TIERS[0]) {
  if (tier.max === Infinity) return 1;
  return Math.min((amount - tier.min) / (tier.max - tier.min), 1);
}

function getStars(amount: number, tier: typeof TIERS[0]) {
  if (tier.name === "Unranked") return { filled: 0, total: 5 };
  const range = tier.max - tier.min;
  const progress = (amount - tier.min) / range;
  const filled = Math.floor(progress * 5);
  return { filled, total: 5 };
}

function getNextMilestone(amount: number, tier: typeof TIERS[0]) {
  if (tier.max === Infinity) return null;
  const tierIndex = TIERS.indexOf(tier);
  const stars = getStars(amount, tier);
  const starStep = (tier.max - tier.min) / 5;
  const nextStarAmount = tier.min + (stars.filled + 1) * starStep;
  const remaining = Math.ceil(nextStarAmount - amount);
  if (stars.filled < 4) {
    return `$${remaining.toLocaleString()} more to reach ${tier.name} Star ${stars.filled + 2}`;
  }
  const nextTier = TIERS[tierIndex + 1];
  if (nextTier) {
    return `$${Math.ceil(nextTier.min - amount).toLocaleString()} more to reach ${nextTier.name}`;
  }
  return null;
}

interface CylinderProps {
  label: string;
  amount: number;
}

const Cylinder = ({ label, amount }: CylinderProps) => {
  const tier = getTier(amount);
  const progress = getProgress(amount, tier);
  const stars = getStars(amount, tier);

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: tier.color }}>
        {tier.name}
      </span>
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: stars.total }).map((_, i) => (
          <Star
            key={i}
            className="w-3.5 h-3.5"
            fill={i < stars.filled ? tier.color : "transparent"}
            stroke={tier.color}
            strokeWidth={1.5}
          />
        ))}
      </div>

      {/* Cylinder */}
      <div className="relative w-20 h-40 rounded-full border border-border/50 overflow-hidden bg-muted/20">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${progress * 100}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute bottom-0 w-full rounded-t-full"
          style={{
            background: `linear-gradient(180deg, ${tier.color}80, ${tier.color})`,
            boxShadow: `0 0 20px ${tier.color}40`,
          }}
        />
        {/* Glass highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-transparent rounded-full pointer-events-none" />
      </div>

      <p className="text-xs text-muted-foreground mt-3">{label}</p>
      <p className="text-lg font-display font-bold text-foreground">${amount.toLocaleString()}</p>
    </div>
  );
};

interface GivingRecognitionProps {
  totalGiven: number;
  totalReceived: number;
}

const GivingRecognition = ({ totalGiven, totalReceived }: GivingRecognitionProps) => {
  const givenTier = getTier(totalGiven);
  const milestone = getNextMilestone(totalGiven, givenTier) || getNextMilestone(totalReceived, getTier(totalReceived));

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h3 className="font-display text-lg font-bold text-foreground text-center mb-6">Recognition</h3>

      <div className="flex justify-center gap-12 mb-6">
        <Cylinder label="Total Given" amount={totalGiven} />
        <Cylinder label="Total Received" amount={totalReceived} />
      </div>

      {milestone && (
        <p className="text-center text-sm text-muted-foreground border-t border-border pt-4">
          {milestone}
        </p>
      )}
    </div>
  );
};

export default GivingRecognition;
