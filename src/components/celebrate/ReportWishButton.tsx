import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const REPORT_REASONS = [
  "Inappropriate content",
  "Spam",
  "Offensive language",
  "Other",
];

interface ReportWishButtonProps {
  wishId: string;
}

const ReportWishButton = ({ wishId }: ReportWishButtonProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in to report", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("wish_reports" as any).insert({
        wish_id: wishId,
        reporter_id: user.id,
        reason,
        details,
      } as any);
      if (error) throw error;
      toast({ title: "Report submitted", description: "We'll review this wish shortly." });
      setOpen(false);
      setReason("");
      setDetails("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-white/20 hover:text-white/40 transition-colors"
        title="Report this wish"
      >
        <Flag className="w-3 h-3" />
        Report
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Why are you reporting this?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <RadioGroup value={reason} onValueChange={setReason}>
              {REPORT_REASONS.map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="text-sm font-normal cursor-pointer">{r}</Label>
                </div>
              ))}
            </RadioGroup>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Any additional details (optional)"
              className="bg-muted/50 border-border"
              rows={3}
            />
            <Button
              onClick={handleSubmit}
              disabled={!reason || submitting}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportWishButton;
