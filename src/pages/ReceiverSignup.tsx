import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Crown, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { COUNTRIES, MONTHS } from "@/lib/constants";

const UNDERAGE_MESSAGE =
  "BirthdayCORE is for people 18 and older. Come back on your 18th birthday — we will celebrate you.";

function calculateAge(day: number, month: number, year: number): number {
  const now = new Date();
  let age = now.getFullYear() - year;
  const monthDiff = now.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < day)) {
    age--;
  }
  return age;
}

const ReceiverSignup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const isUnderage = useMemo(() => {
    if (!birthdayDay || !birthdayMonth || !birthYear) return false;
    const monthIndex = MONTHS.indexOf(birthdayMonth) + 1;
    return calculateAge(parseInt(birthdayDay), monthIndex, parseInt(birthYear)) < 18;
  }, [birthdayDay, birthdayMonth, birthYear]);

  const canSubmit =
    fullName &&
    email &&
    password.length >= 6 &&
    country &&
    birthdayMonth &&
    birthdayDay &&
    birthYear &&
    ageConfirmed &&
    !isUnderage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            country,
            city,
            birthday_day: parseInt(birthdayDay),
            birthday_month: MONTHS.indexOf(birthdayMonth) + 1,
            birth_year: parseInt(birthYear),
            user_type: "receiver",
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;

      toast({
        title: "Account created! 🎂",
        description: "Check your email to verify, then complete payment to activate your page.",
      });

      // TODO: Redirect to Stripe Checkout for $10/year payment
      // For now, redirect to receiver welcome
      navigate("/setup/welcome");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
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
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Set Up My Birthday</h1>
          <p className="text-muted-foreground">Your personal birthday page, celebrated by the world</p>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-4">
          Join <span className="text-primary font-semibold">2,847</span> people celebrating around the world.
        </p>

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

            <div className="space-y-2">
              <Label>Birthday</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={birthdayMonth} onValueChange={setBirthdayMonth}>
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
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
                <Select value={birthYear} onValueChange={setBirthYear}>
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isUnderage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mt-2"
                >
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-destructive">{UNDERAGE_MESSAGE}</p>
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <SearchableSelect
                options={COUNTRIES}
                value={country}
                onValueChange={setCountry}
                placeholder="Search your country..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-muted-foreground text-xs">(optional — you can hide this later)</span>
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your city"
                className="bg-muted/50 border-border"
              />
            </div>

            <div className="flex items-start space-x-3 pt-1">
              <Checkbox
                id="ageConfirm"
                checked={ageConfirmed}
                onCheckedChange={(checked) => setAgeConfirmed(checked === true)}
                className="mt-0.5"
                disabled={isUnderage}
              />
              <Label htmlFor="ageConfirm" className="text-sm font-normal text-muted-foreground leading-snug cursor-pointer">
                I confirm I am 18 years of age or older.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 h-12 text-base font-semibold disabled:opacity-40"
            >
              {loading ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Activate My Birthday Page — $10/year
                </span>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              If an account is found to be underage after creation it will be closed immediately with no refund.
            </p>
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

export default ReceiverSignup;
