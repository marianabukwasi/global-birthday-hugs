import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MessageCircle, Play, Image, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CapsuleData {
  year: number;
  age: number;
  wishCount: number;
  countries: number;
}

interface BirthdayCapsulesProps {
  capsules: CapsuleData[];
}

const BirthdayCapsules = ({ capsules }: BirthdayCapsulesProps) => {
  if (capsules.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center">
        <Archive className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-foreground mb-2">Your Existence Archive</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your first capsule will be created on your birthday. It will be here forever.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-display text-2xl font-bold text-foreground">Your Existence Archive</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {capsules.map((capsule, i) => (
          <motion.div
            key={capsule.year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl overflow-hidden"
          >
            {/* Thumbnail placeholders */}
            <div className="grid grid-cols-2 gap-px">
              <div className="aspect-video bg-muted/30 flex items-center justify-center">
                <Image className="w-6 h-6 text-muted-foreground/30" />
              </div>
              <div className="aspect-video bg-muted/30 flex items-center justify-center">
                <Play className="w-6 h-6 text-muted-foreground/30" />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="font-display text-lg font-bold text-foreground">{capsule.year}</h4>
                <span className="text-xs text-muted-foreground">Age {capsule.age}</span>
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {capsule.wishCount} wishes
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {capsule.countries} countries
                </span>
              </div>

              <Button size="sm" variant="outline" className="w-full text-xs border-border hover:bg-muted/30">
                View Capsule
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayCapsules;
