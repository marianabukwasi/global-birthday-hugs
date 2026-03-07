import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Film, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContributorVideo {
  id: string;
  name: string;
  country: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  message: string;
}

interface VideoCompilationProps {
  videos: ContributorVideo[];
  birthdayName: string;
  compiledVideoUrl?: string;
}

export const VideoCompilation = ({
  videos,
  birthdayName,
  compiledVideoUrl,
}: VideoCompilationProps) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const totalDuration = videos.reduce((s, v) => s + v.durationSeconds, 0);

  if (videos.length === 0) return null;

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-display text-lg font-semibold text-foreground">
          🎬 Video Compilation
        </h3>
        <p className="text-xs text-muted-foreground">
          {videos.length} video messages • {formatDuration(totalDuration)} total for{" "}
          {birthdayName}
        </p>
      </div>

      {/* Compiled video player */}
      {compiledVideoUrl ? (
        <div className="aspect-video bg-foreground">
          <video
            src={compiledVideoUrl}
            controls
            className="w-full h-full"
            poster={videos[0]?.thumbnailUrl}
          />
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <div className="text-center p-6">
            <Film className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground font-medium mb-1">
              Compilation Processing
            </p>
            <p className="text-xs text-muted-foreground/60">
              Your birthday video will be ready before the big day!
            </p>
            <p className="text-xs text-muted-foreground/40 mt-2">
              Intro & outro coming soon
            </p>
          </div>
        </div>
      )}

      {/* Individual video clips timeline */}
      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Clips Timeline
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${
                playingIndex === i
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:bg-muted/50"
              }`}
              onClick={() => setPlayingIndex(playingIndex === i ? null : i)}
            >
              <div className="relative w-16 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={`Video from ${video.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                  <Play className="w-3 h-3 text-background fill-background" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{video.name}</p>
                <p className="text-xs text-muted-foreground truncate">{video.country}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="w-3 h-3" />
                {formatDuration(video.durationSeconds)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
