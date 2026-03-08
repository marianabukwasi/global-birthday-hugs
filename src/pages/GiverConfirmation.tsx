import { Link } from "react-router-dom";
import { Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";

const GiverConfirmation = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-celebration-purple/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md relative"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow-gold mx-auto mb-6">
        <Mail className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">You're in. Now send your wish.</h1>
      <p className="text-muted-foreground mb-8">
        Check your email for a magic link to complete your signup. Once you click it, you'll be ready to celebrate.
      </p>
      <Link
        to="/"
        className="text-sm text-primary hover:underline"
      >
        Back to home
      </Link>
    </motion.div>
  </div>
);

export default GiverConfirmation;
