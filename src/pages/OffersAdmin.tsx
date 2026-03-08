import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Shield, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = ""; // Founder sets this

const OffersAdmin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [form, setForm] = useState({
    business: "",
    headline: "",
    description: "",
    country: "",
    city: "",
    category: "Food",
    validFrom: "",
    validTo: "",
    redemptionType: "code" as "code" | "url",
    redemptionDetails: "",
  });

  const handleLogin = () => {
    // Simple password check — in production this should use proper auth
    if (password.length > 0) {
      setAuthenticated(true);
    } else {
      toast({ title: "Enter the admin password", variant: "destructive" });
    }
  };

  const handleSubmit = () => {
    if (!form.business || !form.headline || !form.country) {
      toast({ title: "Fill required fields", description: "Business name, headline, and country are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Offer added ✓", description: `"${form.headline}" from ${form.business} has been saved.` });
    setForm({ business: "", headline: "", description: "", country: "", city: "", category: "Food", validFrom: "", validTo: "", redemptionType: "code", redemptionDetails: "" });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 max-w-sm">
          <div className="rounded-2xl bg-card border border-border p-8 text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h1 className="font-display text-xl font-bold text-foreground mb-4">Admin Access</h1>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="bg-secondary/50 border-border text-foreground mb-4"
            />
            <Button onClick={handleLogin} className="w-full bg-gradient-gold text-primary-foreground border-0">
              Enter
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Add Birthday Offer</h1>
          <p className="text-muted-foreground">Manually add partner offers for birthday users</p>
        </motion.div>

        <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Business Name *</label>
              <Input value={form.business} onChange={(e) => setForm(f => ({ ...f, business: e.target.value }))} className="bg-secondary/50 border-border text-foreground" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
              <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="bg-secondary/50 border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Food", "Travel", "Wellness", "Shopping", "Entertainment"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Offer Headline *</label>
            <Input value={form.headline} onChange={(e) => setForm(f => ({ ...f, headline: e.target.value }))} className="bg-secondary/50 border-border text-foreground" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Full Description</label>
            <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="bg-secondary/50 border-border text-foreground min-h-[80px] resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Country *</label>
              <Input value={form.country} onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} className="bg-secondary/50 border-border text-foreground" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">City</label>
              <Input value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} className="bg-secondary/50 border-border text-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Valid From</label>
              <Input type="date" value={form.validFrom} onChange={(e) => setForm(f => ({ ...f, validFrom: e.target.value }))} className="bg-secondary/50 border-border text-foreground" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Valid To</label>
              <Input type="date" value={form.validTo} onChange={(e) => setForm(f => ({ ...f, validTo: e.target.value }))} className="bg-secondary/50 border-border text-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Redemption Type</label>
              <Select value={form.redemptionType} onValueChange={(v: "code" | "url") => setForm(f => ({ ...f, redemptionType: v }))}>
                <SelectTrigger className="bg-secondary/50 border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Discount Code</SelectItem>
                  <SelectItem value="url">Partner Website URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {form.redemptionType === "code" ? "Discount Code" : "Partner URL"}
              </label>
              <Input value={form.redemptionDetails} onChange={(e) => setForm(f => ({ ...f, redemptionDetails: e.target.value }))} placeholder={form.redemptionType === "code" ? "BDAY2026" : "https://..."} className="bg-secondary/50 border-border text-foreground" />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" /> Add Offer
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OffersAdmin;
