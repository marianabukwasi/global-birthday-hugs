import { useRef, useEffect, useCallback } from "react";
import { COUNTRY_COORDS, latLngToXY, findCountryByName, type CountryCoord } from "./countryData";

interface WishMarker {
  country: string;
  senderName: string;
  imageUrl?: string;
  message?: string;
}

interface GlobeMapCanvasProps {
  width: number;
  height: number;
  wishes: WishMarker[];
  running: boolean;
  onWishHighlight?: (index: number) => void;
  onComplete?: () => void;
  msPerWish?: number;
}

// Simplified continent outlines as polylines (very rough shapes)
const CONTINENT_PATHS: { points: [number, number][] }[] = [
  // North America (rough)
  { points: [[-130,50],[-125,60],[-100,65],[-80,60],[-65,45],[-80,30],[-100,20],[-105,25],[-115,30],[-125,45],[-130,50]] },
  // South America
  { points: [[-80,10],[-70,5],[-60,-5],[-50,-10],[-45,-20],[-50,-30],[-55,-35],[-65,-50],[-70,-45],[-75,-20],[-80,-5],[-80,10]] },
  // Europe
  { points: [[-10,35],[0,40],[5,45],[10,55],[20,60],[30,70],[40,65],[35,50],[25,40],[15,37],[5,37],[-10,35]] },
  // Africa
  { points: [[-15,35],[-15,15],[-5,5],[5,5],[10,0],[15,-5],[25,-15],[35,-30],[30,-35],[20,-35],[15,-25],[10,-10],[5,5],[-5,5],[-15,15],[-15,35]] },
  // Asia
  { points: [[30,35],[40,40],[50,40],[60,45],[70,50],[80,60],[100,65],[120,60],[130,55],[140,45],[145,35],[130,25],[120,20],[110,10],[100,15],[90,20],[80,25],[70,30],[60,35],[50,35],[40,35],[30,35]] },
  // Australia
  { points: [[115,-12],[130,-12],[150,-15],[155,-25],[150,-35],[140,-37],[130,-32],[115,-22],[115,-12]] },
];

export const GlobeMapCanvas = ({
  width,
  height,
  wishes,
  running,
  onWishHighlight,
  onComplete,
  msPerWish = 2500,
}: GlobeMapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastIndexRef = useRef<number>(-1);
  const highlightedRef = useRef<Set<number>>(new Set());

  const drawMap = useCallback(
    (ctx: CanvasRenderingContext2D, activeIndex: number) => {
      // Background
      ctx.fillStyle = "rgb(10, 10, 20)";
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = "rgba(100, 120, 180, 0.08)";
      ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 80; lat += 20) {
        const { y } = latLngToXY(lat, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let lng = -180; lng <= 180; lng += 30) {
        const { x } = latLngToXY(0, lng, width, height);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw continent outlines
      ctx.strokeStyle = "rgba(100, 140, 200, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.fillStyle = "rgba(100, 140, 200, 0.06)";
      for (const continent of CONTINENT_PATHS) {
        ctx.beginPath();
        continent.points.forEach(([lng, lat], i) => {
          const { x, y } = latLngToXY(lat, lng, width, height);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Draw all country dots
      COUNTRY_COORDS.forEach((c) => {
        const { x, y } = latLngToXY(c.lat, c.lng, width, height);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100, 140, 200, 0.2)";
        ctx.fill();
      });

      // Draw highlighted countries (previously shown)
      highlightedRef.current.forEach((idx) => {
        if (idx >= wishes.length) return;
        const wish = wishes[idx];
        const country = findCountryByName(wish.country);
        if (!country) return;
        const { x, y } = latLngToXY(country.lat, country.lng, width, height);

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(45, 95%, 58%, 0.5)";
        ctx.fill();
      });

      // Draw active highlight
      if (activeIndex >= 0 && activeIndex < wishes.length) {
        const wish = wishes[activeIndex];
        const country = findCountryByName(wish.country);
        if (country) {
          const { x, y } = latLngToXY(country.lat, country.lng, width, height);

          // Pulse ring
          const pulseSize = 8 + Math.sin(Date.now() * 0.005) * 4;
          ctx.beginPath();
          ctx.arc(x, y, pulseSize + 10, 0, Math.PI * 2);
          ctx.strokeStyle = "hsla(330, 85%, 60%, 0.3)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = "hsl(330, 85%, 60%)";
          ctx.fill();

          // Glow
          ctx.shadowColor = "hsl(330, 85%, 60%)";
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.shadowBlur = 0;

          // Connection line from center
          ctx.beginPath();
          ctx.moveTo(width / 2, height / 2);
          ctx.lineTo(x, y);
          ctx.strokeStyle = "hsla(330, 85%, 60%, 0.15)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Country label
          ctx.font = `bold ${Math.floor(width * 0.022)}px 'Space Grotesk', sans-serif`;
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText(wish.country, x, y - pulseSize - 8);

          // Sender name
          ctx.font = `${Math.floor(width * 0.018)}px 'Space Grotesk', sans-serif`;
          ctx.fillStyle = "hsla(0, 0%, 100%, 0.7)";
          ctx.fillText(wish.senderName, x, y - pulseSize - 24);
        }
      }
    },
    [width, height, wishes]
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (!running) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      const totalDuration = wishes.length * msPerWish + 500;
      const currentIndex = Math.min(
        Math.floor(elapsed / msPerWish),
        wishes.length - 1
      );

      if (currentIndex !== lastIndexRef.current && currentIndex < wishes.length) {
        lastIndexRef.current = currentIndex;
        highlightedRef.current.add(currentIndex);
        onWishHighlight?.(currentIndex);
      }

      drawMap(ctx, currentIndex);

      if (elapsed >= totalDuration) {
        onComplete?.();
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [running, wishes, msPerWish, drawMap, onWishHighlight, onComplete]
  );

  useEffect(() => {
    if (running) {
      startTimeRef.current = 0;
      lastIndexRef.current = -1;
      highlightedRef.current.clear();
      animRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [running, animate]);

  return <canvas ref={canvasRef} width={width} height={height} className="block rounded-xl" />;
};
