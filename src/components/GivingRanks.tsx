import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ranks = [
  { level: 1, name: "Warm Heart", amount: "$10", stars: 1, color: "bg-muted" },
  { level: 2, name: "Kind Soul", amount: "$100", stars: 2, color: "bg-muted" },
  { level: 3, name: "Generous Spirit", amount: "$150", stars: 3, color: "bg-secondary/20" },
  { level: 4, name: "Birthday Champion", amount: "$200", stars: 4, color: "bg-secondary/30" },
  { level: 5, name: "Celebration Hero", amount: "$500", stars: 5, color: "bg-primary/10" },
  { level: 6, name: "Joy Bringer", amount: "$1,000", stars: 6, color: "bg-primary/15" },
  { level: 7, name: "Legendary Giver", amount: "$5,000", stars: 7, color: "bg-primary/20" },
  { level: 8, name: "World Celebrator", amount: "$10,000", stars: 8, color: "bg-accent/20" },
  { level: 9, name: "Diamond Heart", amount: "$100,000", stars: 9, color: "bg-accent/30" },
  { level: 10, name: "Golden Giver ✨", amount: "$1,000,000", stars: 10, color: "bg-gradient-gold" },
];

export const GivingRanks = () => {
  return (
    <section className="py-24" id="ranks">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-4xl mb-4 block">⭐</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Giving Ranks
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The more you give, the higher you rise. Every dollar celebrates someone's existence.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {ranks.map((rank, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`${rank.color} rounded-2xl p-5 text-center border border-border hover:shadow-warm transition-all hover:-translate-y-1`}
            >
              <div className="flex justify-center gap-0.5 mb-3">
                {Array.from({ length: rank.stars }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${i >= 8 ? "text-accent fill-accent" : "text-primary fill-primary"}`}
                  />
                ))}
              </div>
              <div className="font-display text-sm font-semibold text-foreground mb-1">{rank.name}</div>
              <div className="text-xs text-muted-foreground">{rank.amount}+ given</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
