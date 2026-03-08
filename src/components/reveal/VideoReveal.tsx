import { motion } from "framer-motion";
import { Play, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoRevealProps {
  videoUrl?: string;
  watermarkCount: number;
  isTeaser?: boolean;
  onUnlock?: () => void;
}

export const VideoReveal = ({ videoUrl, watermarkCount, isTeaser = false, onUnlock }: VideoRevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
        {videoUrl && !isTeaser ? (
          <video
            src={videoUrl}
            controls
            className="w-full aspect-video"
            poster=""
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-midnight flex flex-col items-center justify-center gap-4 relative">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/20 animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            {isTeaser ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">Your compiled birthday video</p>
                <p className="text-xs text-muted-foreground">Unlock the full experience with a contribution</p>
                <Button
                  onClick={onUnlock}
                  className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 mt-2"
                >
                  Unlock Full Video
                </Button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
                  <Play className="w-9 h-9 text-primary ml-1" />
                </div>
                <p className="text-muted-foreground text-sm">Your birthday video is being compiled...</p>
                <p className="text-xs text-muted-foreground">This may take a few minutes</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Download + watermark */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-muted-foreground italic">
          Recognized by {watermarkCount} {watermarkCount === 1 ? "person" : "people"} on BirthdayCORE
        </p>
        {videoUrl && !isTeaser && (
          <a href={videoUrl} download>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Download className="w-4 h-4 mr-1" /> Download
            </Button>
          </a>
        )}
      </div>
    </motion.div>
  );
};
