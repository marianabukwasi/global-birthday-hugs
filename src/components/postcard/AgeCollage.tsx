import { motion } from "framer-motion";
import { getAgePositions, getAgeGridDimensions } from "./digitMaps";

interface AgeCollageProps {
  age: number;
  photos: string[];
  name: string;
}

export const AgeCollage = ({ age, photos, name }: AgeCollageProps) => {
  const positions = getAgePositions(age);
  const { rows, cols } = getAgeGridDimensions(age);

  // Cycle photos to fill all positions
  const getPhoto = (i: number) => photos[i % photos.length];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6 overflow-hidden">
      <h3 className="font-display text-lg font-semibold text-foreground mb-1 text-center">
        🎂 Turning {age}
      </h3>
      <p className="text-xs text-muted-foreground text-center mb-5">
        {positions.length} photos forming {name}'s age
      </p>
      <div
        className="mx-auto w-fit"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: "3px",
        }}
      >
        {/* Render entire grid, only filled positions get images */}
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const posIndex = positions.findIndex((p) => p.row === r && p.col === c);
            const isFilled = posIndex !== -1;

            return (
              <motion.div
                key={`${r}-${c}`}
                initial={isFilled ? { opacity: 0, scale: 0 } : {}}
                animate={isFilled ? { opacity: 1, scale: 1 } : {}}
                transition={isFilled ? { delay: posIndex * 0.02, duration: 0.3 } : {}}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-sm overflow-hidden"
                style={{ visibility: isFilled ? "visible" : "hidden" }}
              >
                {isFilled && (
                  <img
                    src={getPhoto(posIndex)}
                    alt={`Contributor photo`}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
