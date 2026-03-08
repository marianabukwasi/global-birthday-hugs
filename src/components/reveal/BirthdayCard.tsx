import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CardPhoto {
  imageURL: string;
  country: string;
  city?: string;
  senderName: string;
  quote?: string;
}

interface BirthdayCardProps {
  photos: CardPhoto[];
  age: number;
  colorPalette: string;
  onComplete?: () => void;
}

// ─── Font mask: render age digits onto an offscreen canvas, read pixel grid ───

function buildAgeMask(age: number, cols: number, rows: number): boolean[][] {
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, cols, rows);

  const text = String(age);
  // Scale font to fill the canvas
  const fontSize = Math.floor(rows * 0.85);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFF";
  ctx.fillText(text, cols / 2, rows / 2);

  const data = ctx.getImageData(0, 0, cols, rows).data;
  const grid: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const idx = (r * cols + c) * 4;
      grid[r][c] = data[idx] > 80; // threshold
    }
  }
  return grid;
}

// ─── Compute active cells and assign photos ───

interface CellData {
  row: number;
  col: number;
  photo: CardPhoto;
  fromX: number;
  fromY: number;
}

function computeCells(
  mask: boolean[][],
  photos: CardPhoto[],
  rows: number,
  cols: number
): CellData[] {
  const active: { row: number; col: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mask[r][c]) active.push({ row: r, col: c });
    }
  }
  if (active.length === 0 || photos.length === 0) return [];

  return active.map((cell, i) => ({
    ...cell,
    photo: photos[i % photos.length],
    fromX: (Math.random() - 0.5) * 800,
    fromY: (Math.random() - 0.5) * 600,
  }));
}

// ─── Main component ───

export const BirthdayCard = ({ photos, age, colorPalette, onComplete }: BirthdayCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cells, setCells] = useState<CellData[]>([]);
  const [animComplete, setAnimComplete] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ w: 800, h: 500 });
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map());

  // Grid dimensions — adapt based on photo count
  const gridCols = useMemo(() => {
    const total = photos.length;
    if (total <= 20) return 16;
    if (total <= 50) return 22;
    if (total <= 100) return 28;
    return 34;
  }, [photos.length]);

  const gridRows = useMemo(() => Math.round(gridCols * 0.6), [gridCols]);

  // Build mask + cells
  useEffect(() => {
    const mask = buildAgeMask(age, gridCols, gridRows);
    const computed = computeCells(mask, photos, gridRows, gridCols);
    setCells(computed);
  }, [age, photos, gridCols, gridRows]);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ w: rect.width, h: rect.width * 0.6 });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Preload images
  useEffect(() => {
    const urls = [...new Set(photos.map(p => p.imageURL).filter(Boolean))];
    const cache = new Map<string, HTMLImageElement>();
    let loaded = 0;
    urls.forEach(url => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        cache.set(url, img);
        loaded++;
        if (loaded === urls.length) setImageCache(new Map(cache));
      };
      img.onerror = () => {
        loaded++;
        if (loaded === urls.length) setImageCache(new Map(cache));
      };
      img.src = url;
    });
    if (urls.length === 0) setImageCache(new Map());
  }, [photos]);

  // Fire onComplete after animation
  useEffect(() => {
    if (cells.length === 0) return;
    const timer = setTimeout(() => {
      setAnimComplete(true);
      onComplete?.();
    }, 4500);
    return () => clearTimeout(timer);
  }, [cells.length, onComplete]);

  const cellW = containerSize.w / gridCols;
  const cellH = containerSize.h / gridRows;

  // ─── Export to PNG ───
  const handleDownload = useCallback(() => {
    const scale = 2; // high-res
    const w = containerSize.w * scale;
    const h = containerSize.h * scale;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = colorPalette + "20";
    ctx.fillRect(0, 0, w, h);

    // Draw cells
    cells.forEach(cell => {
      const x = cell.col * cellW * scale;
      const y = cell.row * cellH * scale;
      const cw = cellW * scale;
      const ch = cellH * scale;

      const img = imageCache.get(cell.photo.imageURL);
      if (img) {
        // Center crop
        const ratio = Math.max(cw / img.width, ch / img.height);
        const sw = cw / ratio;
        const sh = ch / ratio;
        const sx = (img.width - sw) / 2;
        const sy = (img.height - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, x, y, cw, ch);
      } else {
        ctx.fillStyle = colorPalette;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(x, y, cw, ch);
        ctx.globalAlpha = 1;
      }

      // Cell border
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cw, ch);
    });

    // Watermark — bottom right, non-removable
    const watermark = `Recognized by ${photos.length} ${photos.length === 1 ? "person" : "people"} on BirthdayCORE`;
    ctx.font = `${12 * scale}px sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(watermark, w - 16 * scale, h - 10 * scale);

    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `birthday-card-${age}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [cells, cellW, cellH, containerSize, colorPalette, imageCache, photos.length, age]);

  // ─── Hover/tap handler ───
  const handleCellHover = (idx: number | null, e?: React.MouseEvent | React.TouchEvent) => {
    setHoveredIdx(idx);
    if (e && idx !== null && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setTooltipPos({ x: clientX - rect.left, y: clientY - rect.top });
    }
  };

  const hoveredPhoto = hoveredIdx !== null ? cells[hoveredIdx]?.photo : null;

  return (
    <div className="w-full">
      {/* Card area */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          height: containerSize.h,
          background: `linear-gradient(135deg, ${colorPalette}15 0%, ${colorPalette}08 100%)`,
        }}
        onMouseLeave={() => handleCellHover(null)}
      >
        {cells.map((cell, i) => {
          const x = cell.col * cellW;
          const y = cell.row * cellH;
          const img = cell.photo.imageURL;

          return (
            <motion.div
              key={`${cell.row}-${cell.col}`}
              initial={{ x: cell.fromX, y: cell.fromY, opacity: 0, scale: 0.3 }}
              animate={{ x, y, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + i * (3 / Math.max(cells.length, 1)),
                ease: "easeOut",
              }}
              className="absolute cursor-pointer overflow-hidden"
              style={{ width: cellW, height: cellH, left: 0, top: 0 }}
              onMouseEnter={(e) => handleCellHover(i, e)}
              onMouseMove={(e) => handleCellHover(i, e)}
              onTouchStart={(e) => handleCellHover(i, e)}
              onTouchEnd={() => handleCellHover(null)}
            >
              {img ? (
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ border: `0.5px solid ${colorPalette}30` }}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: `${colorPalette}30`, border: `0.5px solid ${colorPalette}20` }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredPhoto && hoveredIdx !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-20 pointer-events-none bg-card/95 backdrop-blur border border-border rounded-lg px-3 py-2 shadow-lg"
              style={{
                left: Math.min(tooltipPos.x, containerSize.w - 200),
                top: Math.max(tooltipPos.y - 50, 0),
              }}
            >
              <p className="text-xs text-foreground font-medium whitespace-nowrap">
                A wish from {hoveredPhoto.city ? `${hoveredPhoto.city}, ` : ""}{hoveredPhoto.country}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Watermark overlay */}
        <div className="absolute bottom-2 right-3 z-10">
          <p className="text-[10px] text-white/40 italic">
            Recognized by {photos.length} {photos.length === 1 ? "person" : "people"} on BirthdayCORE
          </p>
        </div>
      </div>

      {/* Download button */}
      {animComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center"
        >
          <Button
            onClick={handleDownload}
            variant="outline"
            className="border-border text-foreground gap-2"
          >
            <Download className="w-4 h-4" /> Download Birthday Card
          </Button>
        </motion.div>
      )}
    </div>
  );
};
