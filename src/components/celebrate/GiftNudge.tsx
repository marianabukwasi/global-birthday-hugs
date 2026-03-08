import { useState } from "react";
import { Gift } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface GiftNudgeProps {
  accentColor: string;
  amount: number;
  onAmountChange: (val: number) => void;
}

const GiftNudge = ({ accentColor, amount, onAmountChange }: GiftNudgeProps) => {
  const [expanded, setExpanded] = useState(false);
  const processingFee = Math.round(amount * 0.029 * 100) / 100 + 0.3;

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full rounded-xl border border-white/10 p-4 text-left hover:border-white/20 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `${accentColor}20` }}
          >
            <Gift className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/90">Add a birthday gift?</p>
            <p className="text-xs text-white/40">100% goes to their birthday pot</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-white/15 p-5 space-y-4" style={{ background: `${accentColor}08` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `${accentColor}20` }}
          >
            <Gift className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <p className="text-sm font-medium text-white/90">Birthday Gift</p>
        </div>
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

      <button
        type="button"
        onClick={() => { setExpanded(false); onAmountChange(0); }}
        className="text-xs text-white/30 hover:text-white/50 transition-colors"
      >
        Skip gift
      </button>
    </div>
  );
};

export default GiftNudge;
