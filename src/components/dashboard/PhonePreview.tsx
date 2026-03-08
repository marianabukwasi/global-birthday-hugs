import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PhonePreviewProps {
  profile: any;
}

const PhonePreview = ({ profile }: PhonePreviewProps) => {
  const displayName = profile?.preferred_name || profile?.full_name || "Your Name";
  const coreColor = profile?.core_color || "#F5C842";
  const wishPrompt = profile?.wish_prompt || "Share the best lesson you learned this year";
  const avatarUrl = profile?.avatar_url;
  const essenceUrl = profile?.essence_photo_url;

  return (
    <div className="sticky top-28">
      <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wider">Live Preview</p>
      <div className="mx-auto w-[280px] rounded-[2.5rem] border-[3px] border-border bg-card p-2 shadow-card">
        {/* Notch */}
        <div className="mx-auto w-24 h-5 bg-background rounded-b-xl mb-1" />

        {/* Screen */}
        <div
          className="rounded-[2rem] overflow-hidden min-h-[480px] relative"
          style={{
            background: `linear-gradient(180deg, ${coreColor}15 0%, hsl(225 60% 7%) 50%)`,
          }}
        >
          <div className="p-4 pt-6 text-center">
            {/* Photos */}
            <div className="flex gap-2 justify-center mb-4">
              <div
                className="w-20 h-20 rounded-xl overflow-hidden border border-border/50"
                style={{ boxShadow: `0 0 15px ${coreColor}30` }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                )}
              </div>
              <div
                className="w-20 h-20 rounded-xl overflow-hidden border border-border/50"
                style={{ boxShadow: `0 0 15px ${coreColor}30` }}
              >
                {essenceUrl ? (
                  <img src={essenceUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <h3 className="font-display text-lg font-bold text-foreground mb-1">{displayName}</h3>

            {/* Wish prompt */}
            <p className="text-xs text-muted-foreground italic px-2 mb-4">"{wishPrompt}"</p>

            {/* Stats placeholder */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm font-bold" style={{ color: coreColor }}>12</div>
                <div className="text-[10px] text-muted-foreground">wishes</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold" style={{ color: coreColor }}>7</div>
                <div className="text-[10px] text-muted-foreground">countries</div>
              </div>
            </div>

            {/* CTA */}
            <div
              className="rounded-lg py-2.5 px-4 text-xs font-semibold text-center"
              style={{ backgroundColor: coreColor, color: "#0a0f1e" }}
            >
              <span className="flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Send a Birthday Wish
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
