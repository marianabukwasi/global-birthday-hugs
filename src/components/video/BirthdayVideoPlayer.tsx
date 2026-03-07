import { useState, useRef, useCallback, useEffect } from "react";
import { FireworksCanvas } from "./FireworksCanvas";
import { GlobeMapCanvas } from "./GlobeMapCanvas";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface BirthdayWish {
  id: string;
  senderName: string;
  country: string;
  message: string;
  imageUrl?: string;
}

interface BirthdayVideoPlayerProps {
  name: string;
  age: number;
  wishes: BirthdayWish[];
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
  const [recording, setRecording] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const outroTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const WIDTH = 720;
  const HEIGHT = 405; // 16:9

  const uniqueCountries = [...new Set(wishes.map((w) => w.country))];

  const handlePlay = useCallback(() => {
    setScene("fireworks");
    setCurrentWishIndex(-1);
  }, []);

  const handleFireworksComplete = useCallback(() => {
    setScene("globe");
  }, []);

  const handleWishHighlight = useCallback((index: number) => {
    setCurrentWishIndex(index);
  }, []);

  const handleGlobeComplete = useCallback(() => {
    setScene("outro");
    // Auto-stop recording after outro displays for 4s
    outroTimerRef.current = setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }, 4000);
  }, []);

  const handleReset = useCallback(() => {
    setScene("idle");
    setCurrentWishIndex(-1);
    if (outroTimerRef.current) clearTimeout(outroTimerRef.current);
  }, []);

  // MP4 Recording via canvas capture
  const handleRecord = useCallback(async () => {
    if (!containerRef.current) return;
    setDownloading(true);
    chunksRef.current = [];

    // Find the active canvas
    const startRecording = () => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (!canvas) {
        toast({ title: "Error", description: "No canvas found to record", variant: "destructive" });
        setDownloading(false);
        return;
      }

      try {
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9",
        });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `birthday-${name.replace(/\s+/g, "-").toLowerCase()}-${age}.webm`;
          a.click();
          URL.revokeObjectURL(url);
          setDownloading(false);
          setRecording(false);
          toast({ title: "Video downloaded! 🎬", description: "Your birthday video has been saved." });
        };

        mediaRecorderRef.current = recorder;
        recorder.start(100);
        setRecording(true);
      } catch (err) {
        // Fallback if webm not supported
        toast({
          title: "Recording not supported",
          description: "Your browser doesn't support video recording. Try Chrome or Firefox.",
          variant: "destructive",
        });
        setDownloading(false);
      }
    };

    // Start playback, then start recording
    handlePlay();
    // Small delay to ensure canvas is mounted
    setTimeout(startRecording, 100);
  }, [name, age, handlePlay]);

  useEffect(() => {
    return () => {
      if (outroTimerRef.current) clearTimeout(outroTimerRef.current);
    };
  }, []);

  const currentWish = currentWishIndex >= 0 && currentWishIndex < wishes.length ? wishes[currentWishIndex] : null;

  return (
    <div className="space-y-4">
      {/* Video viewport */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border border-border shadow-card"
        style={{ width: WIDTH, maxWidth: "100%", aspectRatio: "16/9" }}
      >
        {/* Idle state */}
        {scene === "idle" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "rgb(10, 10, 20)" }}
          >
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="font-display text-xl font-bold text-foreground mb-1">
              {name}'s Birthday Video
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {wishes.length} wishes from {uniqueCountries.length} countries
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

        {/* Globe Scene */}
        {scene === "globe" && (
          <div className="relative">
            <GlobeMapCanvas
              width={WIDTH}
              height={HEIGHT}
              wishes={wishes}
              running={true}
              onWishHighlight={handleWishHighlight}
              onComplete={handleGlobeComplete}
              msPerWish={msPerWish}
            />
          </div>
        )}

        {/* Outro Scene */}
        {scene === "outro" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "rgb(10, 10, 20)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Celebrated by{" "}
                <span className="text-gradient-celebration">{wishes.length} people</span>
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

        {/* Recording indicator */}
        {recording && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/90 text-destructive-foreground text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            REC
          </div>
        )}
      </div>

      {/* Wish panel — shows current wish image/message alongside the globe */}
      <AnimatePresence mode="wait">
        {scene === "globe" && currentWish && (
          <motion.div
            key={currentWishIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-xl p-4 flex gap-4 items-center"
            style={{ maxWidth: WIDTH }}
          >
            {currentWish.imageUrl && (
              <img
                src={currentWish.imageUrl}
                alt={`Wish from ${currentWish.senderName}`}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {currentWish.senderName}{" "}
                <span className="text-muted-foreground font-normal">
                  from {currentWish.country}
                </span>
              </p>
              {currentWish.message && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  "{currentWish.message}"
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap" style={{ maxWidth: WIDTH }}>
        {scene === "idle" ? (
          <>
            <Button
              onClick={handlePlay}
              className="bg-gradient-celebration text-primary-foreground border-0 hover:opacity-90"
            >
              <Play className="w-4 h-4 mr-2" /> Play Video
            </Button>
            <Button
              onClick={handleRecord}
              variant="outline"
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Record & Download
            </Button>
          </>
        ) : (
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        )}
      </div>
    </div>
  );
};
