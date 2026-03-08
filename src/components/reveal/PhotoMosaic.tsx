import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface MosaicTile {
  imageUrl: string;
  country: string;
  senderName?: string;
}

interface PhotoMosaicProps {
  tiles: MosaicTile[];
  age: number;
  watermarkCount: number;
  isTeaser?: boolean;
}

// Generate a simple pixel grid for a digit
const DIGIT_GRIDS: Record<string, number[][]> = {
  "0": [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ],
  "1": [
    [0,1,0,0],
    [1,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [1,1,1,0],
  ],
  "2": [
    [0,1,1,0],
    [1,0,0,1],
    [0,0,1,0],
    [0,1,0,0],
    [1,0,0,0],
    [1,1,1,1],
  ],
  "3": [
    [1,1,1,0],
    [0,0,0,1],
    [0,1,1,0],
    [0,0,0,1],
    [0,0,0,1],
    [1,1,1,0],
  ],
  "4": [
    [1,0,0,1],
    [1,0,0,1],
    [1,1,1,1],
    [0,0,0,1],
    [0,0,0,1],
    [0,0,0,1],
  ],
  "5": [
    [1,1,1,1],
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,1],
    [0,0,0,1],
    [1,1,1,0],
  ],
  "6": [
    [0,1,1,0],
    [1,0,0,0],
    [1,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ],
  "7": [
    [1,1,1,1],
    [0,0,0,1],
    [0,0,1,0],
    [0,0,1,0],
    [0,1,0,0],
    [0,1,0,0],
  ],
  "8": [
    [0,1,1,0],
    [1,0,0,1],
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
  ],
  "9": [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,1],
    [0,0,0,1],
    [0,1,1,0],
  ],
};

function getAgeGrid(age: number): { grid: boolean[][]; cols: number } {
  const digits = String(age).split("");
  const grids = digits.map(d => DIGIT_GRIDS[d] || DIGIT_GRIDS["0"]);
  const rows = 6;
  const totalCols = grids.reduce((sum, g) => sum + g[0].length, 0) + (grids.length - 1); // 1 col gap
  
  const combined: boolean[][] = Array.from({ length: rows }, () => Array(totalCols).fill(false));
  let colOffset = 0;
  grids.forEach((grid, gi) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        combined[r][colOffset + c] = grid[r][c] === 1;
      }
    }
    colOffset += grid[0].length + 1;
  });

  return { grid: combined, cols: totalCols };
}

export const PhotoMosaic = ({ tiles, age, watermarkCount, isTeaser = false }: PhotoMosaicProps) => {
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  
  const { grid, cols } = useMemo(() => getAgeGrid(age), [age]);
  const rows = grid.length;

  // Map tiles to active cells
  const activeCells = useMemo(() => {
    const cells: { row: number; col: number; tile: MosaicTile }[] = [];
    let tileIdx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          cells.push({
            row: r,
            col: c,
            tile: tiles[tileIdx % Math.max(tiles.length, 1)],
          });
          tileIdx++;
        }
      }
    }
    return cells;
  }, [grid, rows, cols, tiles]);

  const teaserLimit = Math.ceil(activeCells.length * 0.3);

  return (
    <div className="w-full">
      <div
        className="mx-auto max-w-2xl"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: "3px",
          aspectRatio: `${cols} / ${rows}`,
        }}
      >
        {Array.from({ length: rows * cols }, (_, idx) => {
          const r = Math.floor(idx / cols);
          const c = idx % cols;
          const cellIndex = activeCells.findIndex(ac => ac.row === r && ac.col === c);
          const isActive = cellIndex !== -1;
          const isBlurred = isTeaser && cellIndex >= teaserLimit;

          if (!isActive) return <div key={idx} />;

          const cell = activeCells[cellIndex];
          const hasImage = cell.tile?.imageUrl;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: cellIndex * 0.05, duration: 0.3 }}
              className={`relative rounded-sm overflow-hidden cursor-pointer group ${
                isBlurred ? "blur-sm" : ""
              }`}
              onMouseEnter={() => setHoveredTile(cellIndex)}
              onMouseLeave={() => setHoveredTile(null)}
            >
              {hasImage ? (
                <img
                  src={cell.tile.imageUrl}
                  alt={`Wish from ${cell.tile.country}`}
                  className="w-full h-full object-cover aspect-square"
                />
              ) : (
                <div className="w-full h-full aspect-square bg-gradient-to-br from-primary/40 to-celebration-pink/40" />
              )}
              
              {/* Hover tooltip */}
              {hoveredTile === cellIndex && !isBlurred && (
                <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center p-1 z-10">
                  <p className="text-[10px] text-center text-foreground font-medium leading-tight">
                    A wish from<br />
                    <span className="text-primary">{cell.tile.country || "Unknown"}</span>
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Watermark */}
      <div className="text-center mt-6">
        <p className="text-xs text-white/40 italic">
          Recognized by {watermarkCount} {watermarkCount === 1 ? "person" : "people"} on BirthdayCORE
        </p>
      </div>

      {isTeaser && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            🔒 Full mosaic unlocked with a birthday contribution
          </p>
        </div>
      )}
    </div>
  );
};
