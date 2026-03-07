import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContributorPhoto {
  id: string;
  name: string;
  country: string;
  photoUrl: string;
  message: string;
}

interface PhotoSlideshowProps {
  photos: ContributorPhoto[];
  birthdayName: string;
  autoPlayInterval?: number;
}

export const PhotoSlideshow = ({
  photos,
  birthdayName,
  autoPlayInterval = 4000,
}: PhotoSlideshowProps) => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!playing || photos.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [playing, next, autoPlayInterval, photos.length]);

  if (photos.length === 0) return null;

  const photo = photos[current];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            🎞️ Birthday Slideshow
          </h3>
          <p className="text-xs text-muted-foreground">
            {current + 1} of {photos.length} celebrations for {birthdayName}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative aspect-[16/9] bg-muted">
        <AnimatePresence mode="wait">
          <motion.img
            key={photo.id}
            src={photo.photoUrl}
            alt={`From ${photo.name}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Message overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-6 pt-16">
          <div className="flex items-start gap-2 mb-2">
            <Quote className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-background text-sm italic leading-relaxed line-clamp-2">
              {photo.message}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-background/90 text-xs font-medium">
              — {photo.name}, {photo.country}
            </p>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="p-3 flex justify-center gap-1.5">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
