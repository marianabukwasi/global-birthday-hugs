import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BirthdayCardProps {
  id: string;
  name: string;
  country: string;
  birthday: string;
  avatar: string;
  quote: string;
  goal: number;
  raised: number;
  contributors: number;
  rank: number;
}

export const BirthdayCard = ({
  id, name, country, birthday, avatar, quote, goal, raised, contributors, rank,
}: BirthdayCardProps) => {
  const progress = Math.min((raised / goal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl border border-border shadow-card hover:shadow-glow-gold transition-all hover:-translate-y-1 overflow-hidden"
    >
      <div className="h-20 bg-gradient-gold relative">
        <div className="absolute -bottom-8 left-5">
          <div className="w-16 h-16 rounded-full border-4 border-card bg-muted overflow-hidden">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute top-3 right-3 flex gap-0.5">
          {Array.from({ length: Math.min(rank, 10) }).map((_, i) => (
            <Star key={i} className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
          ))}
        </div>
      </div>

      <div className="pt-12 px-5 pb-5">
        <h3 className="font-display text-lg font-semibold text-foreground">{name}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 mb-3">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{country}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{birthday}</span>
        </div>

        <p className="text-sm text-muted-foreground italic mb-4">"{quote}"</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">${raised} raised</span>
            <span className="text-muted-foreground">${goal} goal</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-champagne rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <Heart className="w-3 h-3 inline text-primary" /> {contributors} contributors
          </div>
        </div>

        <Link to={`/profile/${id}`}>
          <Button size="sm" className="w-full bg-gradient-champagne text-primary-foreground border-0 hover:opacity-90 rounded-full">
            🎉 Contribute $1
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
