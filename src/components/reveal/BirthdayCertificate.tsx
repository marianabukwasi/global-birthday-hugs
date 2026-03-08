import { motion } from "framer-motion";
import { Award, Globe, Heart } from "lucide-react";

interface BirthdayCertificateProps {
  name: string;
  age: number;
  wishCount: number;
  countryCount: number;
  date: string;
  watermarkCount: number;
  isTeaser?: boolean;
}

export const BirthdayCertificate = ({
  name,
  age,
  wishCount,
  countryCount,
  date,
  watermarkCount,
  isTeaser = false,
}: BirthdayCertificateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative max-w-xl mx-auto ${isTeaser ? "blur-sm pointer-events-none select-none" : ""}`}
    >
      {/* Certificate frame */}
      <div className="rounded-2xl bg-gradient-gold p-[2px] shadow-glow-gold">
        <div className="rounded-2xl bg-card p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />

          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow-gold">
            <Award className="w-8 h-8 text-primary-foreground" />
          </div>

          {/* Title */}
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">Certificate of Celebration</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-1">{name}</h2>
          <p className="text-muted-foreground mb-6">turns <span className="text-primary font-bold text-xl">{age}</span></p>

          {/* Divider */}
          <div className="w-24 h-[1px] bg-gradient-gold mx-auto mb-6" />

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <Heart className="w-5 h-5 text-celebration-pink mx-auto mb-1" />
              <p className="font-display text-2xl font-bold text-foreground">{wishCount}</p>
              <p className="text-xs text-muted-foreground">Wishes</p>
            </div>
            <div className="text-center">
              <Globe className="w-5 h-5 text-celebration-cyan mx-auto mb-1" />
              <p className="font-display text-2xl font-bold text-foreground">{countryCount}</p>
              <p className="text-xs text-muted-foreground">Countries</p>
            </div>
          </div>

          {/* Date */}
          <p className="text-sm text-muted-foreground mb-4">{date}</p>

          {/* Watermark */}
          <p className="text-xs text-white/40 italic">
            Recognized by {watermarkCount} {watermarkCount === 1 ? "person" : "people"} on BirthdayCORE
          </p>
        </div>
      </div>

      {/* Teaser overlay */}
      {isTeaser && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-2xl">
          <p className="text-sm text-muted-foreground font-medium">🔒 Unlock with a contribution</p>
        </div>
      )}
    </motion.div>
  );
};
