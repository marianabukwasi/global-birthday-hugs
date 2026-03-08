import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const countries = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada",
  "Chile","China","Colombia","Congo","Croatia","Cuba","Czech Republic","Denmark","Egypt","Ethiopia",
  "Finland","France","Germany","Ghana","Greece","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Jamaica","Japan","Jordan","Kenya","South Korea","Lebanon","Malaysia","Mexico",
  "Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Peru","Philippines","Poland","Portugal",
  "Romania","Russia","Saudi Arabia","Senegal","Singapore","South Africa","Spain","Sri Lanka","Sweden","Switzerland",
  "Thailand","Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Venezuela","Vietnam",
  "Zimbabwe"
];

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const GiverSignup = () => {
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("invite"); // The receiver's page to redirect to
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country || !birthdayMonth || !birthdayDay) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            country,
            birthday_day: parseInt(birthdayDay),
            birthday_month: months.indexOf(birthdayMonth) + 1,
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;

      toast({
        title: "Welcome to BirthdayCORE! 🎉",
        description: "Check your email to verify your account.",
      });

      // If invited, redirect to the inviter's birthday page
      if (inviteId) {
        navigate(`/celebrate/${inviteId}`);
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-celebration-purple/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-twinkle"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow-gold">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Join the Celebration</h1>
          <p className="text-muted-foreground">Takes less than 60 seconds — forever free</p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                className="bg-muted/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Birthday</Label>
              <div className="grid grid-cols-2 gap-3">
                <Select value={birthdayMonth} onValueChange={setBirthdayMonth}>
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={birthdayDay} onValueChange={setBirthdayDay}>
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-muted/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-muted/50 border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 h-12 text-base font-semibold"
            >
              {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : "Join BirthdayCORE — Free"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Already have an account? <span className="text-primary font-medium">Sign in</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GiverSignup;
