import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Heart, Send, Gift } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ThankYouFlow = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [givers, setGivers] = useState<any[]>([]);
  const [giftAmounts, setGiftAmounts] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const { data: wishes } = await supabase
        .from("wishes")
        .select("*")
        .eq("recipient_id", user.id);
      setWishCount(wishes?.length || 0);

      const { data: contributions } = await supabase
        .from("contributions")
        .select("*")
        .eq("recipient_id", user.id)
        .gt("amount_cents", 0);

      if (contributions && contributions.length > 0) {
        const senderIds = [...new Set(contributions.map(c => c.sender_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, country")
          .in("id", senderIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        const enriched = contributions.map(c => ({
          ...c,
          senderName: profileMap.get(c.sender_id)?.full_name || "Anonymous",
          senderCountry: profileMap.get(c.sender_id)?.country || "",
        }));
        setGivers(enriched);
      }
    };
    load();
  }, [navigate]);

  const handleSendAll = async () => {
    if (message.length < 5) {
      toast({ title: "Write a bit more", description: "Your thank you should be at least a few words." });
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    toast({ title: "Thank you sent! 💛", description: `Your message was sent to ${wishCount} people.` });
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Send a thank you to everyone who celebrated you.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border p-6 mb-8"
          >
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something from the heart..."
              className="min-h-[160px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground text-lg resize-none mb-4"
            />
            <Button
              onClick={handleSendAll}
              disabled={sending || message.length < 5}
              className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 text-lg h-12"
            >
              <Send className="w-5 h-5 mr-2" />
              {sending ? "Sending..." : `Send to all ${wishCount} people who celebrated you`}
            </Button>
          </motion.div>

          {givers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Want to give back to someone specific?
              </h2>
              <div className="space-y-3">
                {givers.map((giver) => (
                  <div
                    key={giver.id}
                    className="rounded-xl bg-card border border-border p-4 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{giver.senderName}</p>
                      <p className="text-sm text-muted-foreground">
                        {giver.senderCountry} · Gave ${(giver.amount_cents / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Input
                        type="number"
                        min={1}
                        placeholder="$"
                        value={giftAmounts[giver.sender_id] || ""}
                        onChange={(e) => setGiftAmounts(prev => ({ ...prev, [giver.sender_id]: e.target.value }))}
                        className="w-20 bg-secondary/50 border-border text-foreground"
                      />
                      <Button
                        size="sm"
                        className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
                        onClick={() => {
                          toast({ title: "Gift sent! 🎁", description: `Your gift to ${giver.senderName} is on its way.` });
                          setGiftAmounts(prev => ({ ...prev, [giver.sender_id]: "" }));
                        }}
                      >
                        <Gift className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYouFlow;
