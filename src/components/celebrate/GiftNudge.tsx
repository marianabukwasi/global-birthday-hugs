import { useState } from "react";
import { Gift } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface GiftNudgeProps {
  accentColor: string;
  amount: number;
  onAmountChange: (val: number) => void;
  onSendWithGift: () => void;
  onSendWithoutGift: () => void;
  submitting: boolean;
}

const GiftNudge = ({ accentColor, amount, onAmountChange, onSendWithGift, onSendWithoutGift, submitting }: GiftNudgeProps) => {
  const processingFee = Math.round(amount * 0.029 * 100) / 100 + 0.3;

  return (
    <div className="rounded-2xl border border-white/10 p-6 space-y-5" style={{ background: `${accentColor}06` }}>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: `${accentColor}20` }}
        >
          <Gift className="w-5 h-5" style={{ color: accentColor }} />
        </div>
        <div>
          <p className="text-sm font-medium text-white/90">Add a birthday gift?</p>
          <p className="text-xs text-white/40">Even $1 from around the world means something.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">Gift amount</span>
        <span className="text-2xl font-bold font-display" style={{ color: accentColor }}>
          ${amount}
        </span>
      </div>

      <Slider
        value={[amount]}
        onValueChange={([val]) => onAmountChange(val)}
        min={1}
        max={100}
        step={1}
        className="py-2"
      />

      <div className="flex justify-between text-xs text-white/30">
        <span>$1</span>
        <span>$100</span>
      </div>

      <div className="text-xs text-white/40 space-y-1 pt-2 border-t border-white/5">
        <div className="flex justify-between">
          <span>Gift amount</span>
          <span>${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Processing fee</span>
          <span>${processingFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium text-white/60 pt-1">
          <span>Total</span>
          <span>${(amount + processingFee).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          onClick={onSendWithGift}
          disabled={submitting}
          className="flex-1 h-12 text-sm font-bold border-0 hover:opacity-90"
          style={{ background: accentColor, color: "#080E24" }}
        >
          {submitting ? "Sending..." : "Send wish with gift"}
        </Button>
        <Button
          onClick={onSendWithoutGift}
          disabled={submitting}
          variant="outline"
          className="flex-1 h-12 text-sm font-medium border-white/15 text-white/70 hover:bg-white/5"
        >
          Send wish only
        </Button>
      </div>
    </div>
  );
};

export default GiftNudge;
