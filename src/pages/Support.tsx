import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Flag } from "lucide-react";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [reportRef, setReportRef] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSending, setReportSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject || !message.trim()) {
      toast({ title: "Please fill in all fields" });
      return;
    }
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("support_tickets" as any).insert({
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 255),
      subject,
      message: message.trim().slice(0, 5000),
      user_id: user?.id || null,
    } as any);
    setSending(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later." });
      return;
    }
    toast({ title: "Message sent! ✉️", description: "We'll get back to you within 48 hours." });
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportRef.trim() || !reportDesc.trim()) {
      toast({ title: "Please fill in all fields" });
      return;
    }
    setReportSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("support_tickets" as any).insert({
      name: "Content Report",
      email: user?.email || "anonymous",
      subject: "report",
      message: reportDesc.trim().slice(0, 5000),
      report_wish_id: reportRef.trim().slice(0, 500),
      report_description: reportDesc.trim().slice(0, 5000),
      user_id: user?.id || null,
    } as any);
    setReportSending(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later." });
      return;
    }
    toast({ title: "Report submitted", description: "We'll review this within 48 hours." });
    setReportRef(""); setReportDesc("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Contact & <span className="text-gradient-gold">Support</span>
          </h1>
          <p className="text-muted-foreground mb-8">We're here to help.</p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-border p-6 mb-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="bg-secondary/50 border-border"
              />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="bg-secondary/50 border-border"
              />
            </div>

            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Question</SelectItem>
                <SelectItem value="payment">Payment Issue</SelectItem>
                <SelectItem value="technical">Technical Problem</SelectItem>
                <SelectItem value="report_user">Report a User</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={5000}
              rows={5}
              className="bg-secondary/50 border-border resize-none"
            />

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">We aim to respond within 48 hours.</p>
              <Button
                type="submit"
                disabled={sending}
                className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
              >
                <Send className="w-4 h-4 mr-1" />
                {sending ? "Sending…" : "Send"}
              </Button>
            </div>
          </form>

          {/* Report Section */}
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flag className="w-5 h-5 text-destructive" />
              <h2 className="font-display text-xl font-semibold text-foreground">Report Inappropriate Content</h2>
            </div>
            <form onSubmit={handleReport} className="space-y-4">
              <Input
                placeholder="Wish ID or profile link"
                value={reportRef}
                onChange={(e) => setReportRef(e.target.value)}
                maxLength={500}
                className="bg-secondary/50 border-border"
              />
              <Textarea
                placeholder="Describe the issue"
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                maxLength={5000}
                rows={3}
                className="bg-secondary/50 border-border resize-none"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={reportSending}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                {reportSending ? "Submitting…" : "Submit Report"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
