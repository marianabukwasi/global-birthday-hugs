import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "bdcore_cookie_consent";

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return; // already consented
    // Show for all visitors (EU detection is best-effort via timezone)
    setVisible(true);
  }, []);

  const accept = (level: "all" | "essential") => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ level, ts: Date.now() }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
        >
          <div className="max-w-2xl mx-auto rounded-2xl bg-card border border-border shadow-elegant p-5 pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
              BirthdayCORE uses cookies to make your experience better. We never sell your data.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => accept("essential")}
                className="border-border text-foreground"
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={() => accept("all")}
                className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
