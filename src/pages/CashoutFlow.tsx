import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { DollarSign, ShieldCheck, ShieldAlert, ArrowRight, Gift, Heart, RefreshCw, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CashoutFlow = () => {
  const navigate = useNavigate();
  const [potAmount, setPotAmount] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [showLateOptions, setShowLateOptions] = useState(false);
  const [charityName, setCharityName] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      const { data: contributions } = await supabase
        .from("contributions")
        .select("amount_cents")
        .eq("recipient_id", user.id)
        .eq("status", "completed");

      const total = contributions?.reduce((sum, c) => sum + c.amount_cents, 0) || 0;
      setPotAmount(total);
    };
    load();
  }, [navigate]);

  const platformFee = Math.round(potAmount * 0.05);
  const receiveAmount = potAmount - platformFee;
  const lateFee = Math.round(potAmount * 0.10);

  const cashoutDate = (() => {
    if (!profile?.birthday_month || !profile?.birthday_day) return "—";
    const now = new Date();
    let year = now.getFullYear();
    const bd = new Date(year, profile.birthday_month - 1, profile.birthday_day);
    if (bd < now) year++;
    const target = new Date(year, profile.birthday_month - 1, profile.birthday_day);
    target.setDate(target.getDate() - 1);
    return target.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  })();

  const handleAction = (action: string) => {
    toast({ title: "Request submitted", description: `Your "${action}" request has been recorded.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Birthday Pot Cashout</h1>
            <p className="text-muted-foreground">Manage your birthday contributions</p>
          </motion.div>

          {/* Pot Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-card border border-border p-8 text-center mb-6"
          >
            <p className="text-sm text-muted-foreground mb-2">Your Birthday Pot</p>
            <p className="font-display text-5xl font-bold text-primary mb-4">
              ${(potAmount / 100).toFixed(2)}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Expected cashout: {cashoutDate}</span>
            </div>
          </motion.div>

          {/* Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isVerified ? (
                  <ShieldCheck className="w-6 h-6 text-celebration-emerald" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <p className="font-medium text-foreground">Identity Verification</p>
                  <p className="text-sm text-muted-foreground">
                    {isVerified ? "Verified ✓" : "Not yet verified"}
                  </p>
                </div>
              </div>
              {!isVerified && (
                <Button
                  onClick={() => { setIsVerified(true); toast({ title: "Verified! ✓" }); }}
                  className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
                >
                  Verify Now
                </Button>
              )}
            </div>
          </motion.div>

          {/* Fee Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card border border-border p-6 mb-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Cashout Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total pot</span>
                <span className="text-foreground">${(potAmount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">BirthdayCORE fee (5%)</span>
                <span className="text-destructive">-${(platformFee / 100).toFixed(2)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">You receive</span>
                <span className="text-primary">${(receiveAmount / 100).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Late Cashout Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setShowLateOptions(!showLateOptions)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              {showLateOptions ? "Hide" : "Show"} late cashout options
            </button>

            {showLateOptions && (
              <div className="space-y-3">
                <div className="rounded-xl bg-card border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <RefreshCw className="w-5 h-5 text-celebration-cyan" />
                    <p className="font-medium text-foreground">Roll over to my 2027 birthday pot</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-border text-foreground" onClick={() => handleAction("Roll over")}>
                    Confirm <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="rounded-xl bg-card border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-5 h-5 text-celebration-pink" />
                    <p className="font-medium text-foreground">Donate to BirthdayCORE</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Help make someone else's birthday magical</p>
                  <Button size="sm" variant="outline" className="border-border text-foreground" onClick={() => handleAction("Donate to BirthdayCORE")}>
                    Confirm <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="rounded-xl bg-card border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-5 h-5 text-celebration-emerald" />
                    <p className="font-medium text-foreground">Donate to a charity of my choice</p>
                  </div>
                  <Input
                    placeholder="Charity name"
                    value={charityName}
                    onChange={(e) => setCharityName(e.target.value)}
                    className="bg-secondary/50 border-border text-foreground mb-2"
                  />
                  <Button size="sm" variant="outline" className="border-border text-foreground" onClick={() => handleAction(`Donate to ${charityName}`)}>
                    Confirm <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="rounded-xl bg-card border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <p className="font-medium text-foreground">Cash out now with late fee</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Late fee: ${(lateFee / 100).toFixed(2)} — You receive: ${((receiveAmount - lateFee) / 100).toFixed(2)}
                  </p>
                  <Button size="sm" className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90" onClick={() => handleAction("Late cashout")}>
                    Cash Out <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CashoutFlow;
