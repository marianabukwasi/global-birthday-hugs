import { motion } from "framer-motion";
import { Heart, PartyPopper, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface WishConfirmationProps {
  recipientName: string;
  accentColor: string;
  senderCountry?: string;
}

const WishConfirmation = ({ recipientName, accentColor, senderCountry }: WishConfirmationProps) => {
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
        transition={{ delay: 0.5 }}
        className="text-white/60 text-lg max-w-md mx-auto mb-4"
      >
        It will be revealed to {recipientName} on their birthday.
      </motion.p>

      {senderCountry && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/40 text-sm flex items-center justify-center gap-1.5 mb-8"
        >
          <Globe className="w-3.5 h-3.5" />
          Your wish from {senderCountry} will light up on their globe.
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-2 text-sm text-white/40 mb-10"
      >
        <Heart className="w-4 h-4" style={{ color: accentColor }} />
        <span>You're part of something beautiful</span>
        <Heart className="w-4 h-4" style={{ color: accentColor }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="p-4 rounded-xl border border-white/10 max-w-sm mx-auto"
        style={{ background: `${accentColor}08` }}
      >
        <p className="text-sm text-white/50 mb-2">Have your own birthday coming up?</p>
        <Link
          to="/setup"
          className="text-sm font-medium hover:underline"
          style={{ color: accentColor }}
        >
          Set up your birthday page →
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default WishConfirmation;
