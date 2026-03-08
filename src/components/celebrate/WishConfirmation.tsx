import { motion } from "framer-motion";
import { Heart, PartyPopper } from "lucide-react";

interface WishConfirmationProps {
  recipientName: string;
  accentColor: string;
}

const WishConfirmation = ({ recipientName, accentColor }: WishConfirmationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center py-16 px-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ background: `${accentColor}20` }}
      >
        <PartyPopper className="w-10 h-10" style={{ color: accentColor }} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-3xl font-bold text-white mb-3"
      >
        Your wish is on its way!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-white/60 text-lg max-w-md mx-auto mb-8"
      >
        It will be revealed to {recipientName} on their birthday — as part of a celebration they'll never forget.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-2 text-sm text-white/40"
      >
        <Heart className="w-4 h-4" style={{ color: accentColor }} />
        <span>You're part of something beautiful</span>
        <Heart className="w-4 h-4" style={{ color: accentColor }} />
      </motion.div>
    </motion.div>
  );
};

export default WishConfirmation;
