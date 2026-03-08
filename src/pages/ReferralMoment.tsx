import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Copy, X, MessageCircle, Instagram, Link } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ReferralMoment = () => {
  const navigate = useNavigate();
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setReferralLink(`${window.location.origin}/setup?ref=${user.id.slice(0, 8)}`);
    };
    load();
  }, [navigate]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Link copied! 🔗", description: "Share it with someone who deserves a celebration." });
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Give someone a birthday to remember: ${referralLink}`)}`, "_blank");
  };

  const shareInstagram = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Link copied!", description: "Paste it in your Instagram story or DM." });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="w-full max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          Know someone who deserves this?
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Give them a birthday to remember.
        </p>

        <div className="rounded-xl bg-card border border-border p-4 mb-8 flex items-center gap-3">
          <code className="flex-1 text-sm text-primary truncate text-left">{referralLink}</code>
          <Button size="sm" variant="ghost" onClick={copyLink} className="shrink-0 text-muted-foreground hover:text-foreground">
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            onClick={shareWhatsApp}
            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0 gap-2"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </Button>
          <Button
            onClick={shareInstagram}
            className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0 gap-2"
          >
            <Instagram className="w-5 h-5" /> Instagram
          </Button>
          <Button
            onClick={copyLink}
            variant="outline"
            className="border-border text-foreground gap-2"
          >
            <Link className="w-5 h-5" /> Copy Link
          </Button>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4 inline mr-1" /> Dismiss
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ReferralMoment;
