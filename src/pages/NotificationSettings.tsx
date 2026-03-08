import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Bell, Mail, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface NotifSetting {
  key: string;
  label: string;
  email: boolean;
  push: boolean;
  emailOnly?: boolean;
  pushOnly?: boolean;
}

const DEFAULT_SETTINGS: NotifSetting[] = [
  { key: "wish_received", label: "Wish received", email: true, push: true },
  { key: "birthday_countdown", label: "Birthday countdown reminders", email: true, push: true },
  { key: "identity_verification", label: "Identity verification reminders", email: true, push: true },
  { key: "glimmer_draw", label: "Glimmer Draw unlock", email: false, push: true, pushOnly: true },
  { key: "thank_you", label: "Thank you received", email: true, push: true },
  { key: "birthday_nudge", label: "Birthday nudge — \"Your birthday is coming up, set up your page\"", email: true, push: false, emailOnly: true },
];

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotifSetting[]>(DEFAULT_SETTINGS);

  const toggle = (key: string, channel: "email" | "push") => {
    setSettings(prev =>
      prev.map(s => s.key === key ? { ...s, [channel]: !s[channel] } : s)
    );
  };

  const handleSave = () => {
    toast({ title: "Settings saved ✓", description: "Your notification preferences have been updated." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Notification Settings</h1>
            <p className="text-muted-foreground">Choose how you want to stay in the loop</p>
          </motion.div>

          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 border-b border-border text-sm text-muted-foreground">
              <span />
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</span>
              <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Push</span>
            </div>
            {settings.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-4 border-b border-border last:border-b-0"
              >
                <span className="text-sm text-foreground">{s.label}</span>
                <div className="flex justify-center">
                  {s.pushOnly ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : (
                    <Switch checked={s.email} onCheckedChange={() => toggle(s.key, "email")} />
                  )}
                </div>
                <div className="flex justify-center">
                  {s.emailOnly ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : (
                    <Switch checked={s.push} onCheckedChange={() => toggle(s.key, "push")} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button onClick={handleSave} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 px-10">
              Save Preferences
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationSettings;
