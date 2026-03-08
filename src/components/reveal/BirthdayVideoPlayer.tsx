import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Maximize,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

interface BirthdayVideoPlayerProps {
  videoURL?: string;
  wishCount: number;
  countryCount: number;
  receiverName: string;
  onDonate: () => void;
}

export const BirthdayVideoPlayer = ({
  videoURL,
  wishCount,
  countryCount,
  receiverName,
  onDonate,
}: BirthdayVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const hasVideo = !!videoURL;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const handleSeek = useCallback(
    (val: number[]) => {
      if (!videoRef.current || !duration) return;
      const time = (val[0] / 100) * duration;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setProgress(val[0]);
    },
    [duration]
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setCurrentTime(v.currentTime);
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    };
    const onLoad = () => setDuration(v.duration);
    const onEnd = () => setIsPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoad);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoad);
      v.removeEventListener("ended", onEnd);
    };
  }, [hasVideo]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const handleDownload = () => {
    onDonate();
  };

  const handleShare = async () => {
    const text = `I was celebrated by ${wishCount} people from ${countryCount} countries on BirthdayCORE. Everybody deserves this.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${receiverName}'s Birthday`, text, url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      toast({ title: "Copied!", description: "Share link copied to clipboard." });
    }
  };

  // Compiling / no-video state
  if (!hasVideo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
          <div className="w-full aspect-video bg-gradient-midnight flex flex-col items-center justify-center gap-4 relative">
            {/* Animated stars */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/20 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Lock className="w-9 h-9 text-primary" />
            </div>
            <p className="text-foreground font-medium">Your birthday video is being compiled…</p>
            <p className="text-xs text-muted-foreground">This may take a few minutes</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground/60 italic">
            Recognized by {wishCount} {wishCount === 1 ? "person" : "people"} on BirthdayCORE
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Player container */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden bg-card border border-border group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={videoURL}
          className="w-full aspect-video bg-background cursor-pointer"
          onClick={togglePlay}
          playsInline
        />

        {/* Watermark */}
        <div className="absolute bottom-14 right-4 text-[10px] text-white/40 italic pointer-events-none select-none">
          Recognized by {wishCount} {wishCount === 1 ? "person" : "people"} on BirthdayCORE
        </div>

        {/* Center play overlay */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center shadow-glow-gold backdrop-blur-sm">
              <Play className="w-9 h-9 text-primary-foreground ml-1" />
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent px-4 pb-3 pt-8 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress */}
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="mb-3 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-primary"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:text-primary"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:text-primary"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground hover:text-primary"
              onClick={toggleFullscreen}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Below player */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
        <p className="font-display text-lg text-foreground">
          Celebrated by{" "}
          <span className="text-primary font-bold">{wishCount}</span> people from{" "}
          <span className="text-celebration-cyan font-bold">{countryCount}</span> countries.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-foreground border-border"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-1" /> Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-foreground border-border"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-1" /> Share
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
