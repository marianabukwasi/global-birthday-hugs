import { useState, useRef, useCallback, useEffect } from "react";
import { FireworksCanvas } from "./FireworksCanvas";
import { Globe3D, type GlobeWish } from "./Globe3D";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Download, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export type { GlobeWish as BirthdayWish };

interface BirthdayVideoPlayerProps {
  name: string;
  age: number;
  wishes: GlobeWish[];
  msPerWish?: number;
}

type Scene = "idle" | "fireworks" | "globe" | "outro";

export const BirthdayVideoPlayer = ({
  name,
  age,
  wishes,
  msPerWish = 2500,
}: BirthdayVideoPlayerProps) => {
  const [scene, setScene] = useState<Scene>("idle");
  const [currentWishIndex, setCurrentWishIndex] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const outroTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const WIDTH = 720;
  const HEIGHT = 405;

  const uniqueCountries = [...new Set(wishes.map((w) => w.country))];

  const handlePlay = useCallback(() => {
    setScene("fireworks");
    setCurrentWishIndex(-1);
  }, []);

  const handleFireworksComplete = useCallback(() => {
    setScene("globe");
    setCurrentWishIndex(0);

    // Step through wishes
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= wishes.length) {
        clearInterval(intervalRef.current);
        // Show outro after last wish
        outroTimerRef.current = setTimeout(() => {
          setScene("outro");
        }, msPerWish);
        return;
      }
      setCurrentWishIndex(idx);
    }, msPerWish);
  }, [wishes.length, msPerWish]);

  const handleReset = useCallback(() => {
    setScene("idle");
    setCurrentWishIndex(-1);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (outroTimerRef.current) clearTimeout(outroTimerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (outroTimerRef.current) clearTimeout(outroTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Video viewport */}
      <div
        className="relative rounded-2xl overflow-hidden border border-border shadow-card"
        style={{ maxWidth: "100%" }}
      >
        {/* Idle state */}
        {scene === "idle" && (
          <div className="flex flex-col items-center justify-center bg-card py-16 px-8">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="font-display text-xl font-bold text-foreground mb-1">
              {name}'s Birthday Video
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {wishes.length} wishes from {uniqueCountries.length} countries
            </p>
            <p className="text-xs text-muted-foreground">
              Fireworks → 3D Globe with photos & quotes → Outro
            </p>
          </div>
        )}

        {/* Fireworks Scene */}
        {scene === "fireworks" && (
          <FireworksCanvas
            width={WIDTH}
            height={HEIGHT}
            name={name}
            age={age}
            running={true}
            onComplete={handleFireworksComplete}
            duration={5000}
          />
        )}

        {/* 3D Globe Scene — wishes shown ON the globe */}
        {scene === "globe" && (
          <Globe3D
            wishes={wishes}
            running={true}
            currentIndex={currentWishIndex}
          />
        )}

        {/* Outro Scene */}
        {scene === "outro" && (
          <div className="flex flex-col items-center justify-center bg-card py-16 px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Celebrated by{" "}
                <span className="text-gradient-gold">{wishes.length} people</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                from{" "}
                <span className="text-gradient-gold font-semibold">
                  {uniqueCountries.length} countries
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-4 opacity-60">
                BirthdayCORE — Celebrating life, globally
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        {scene === "idle" ? (
          <Button
            onClick={handlePlay}
            className="bg-gradient-champagne text-primary-foreground border-0 hover:opacity-90"
          >
            <Play className="w-4 h-4 mr-2" /> Play Birthday Video
          </Button>
        ) : (
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        )}
      </div>
    </div>
  );
};
