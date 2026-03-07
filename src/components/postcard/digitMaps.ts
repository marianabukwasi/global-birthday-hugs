// Pixel maps for digits 0-9 on a 5x7 grid (1 = filled, 0 = empty)
const digitMaps: Record<string, number[][]> = {
  "0": [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,1,1],
    [1,0,1,0,1],
    [1,1,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  "1": [
    [0,0,1,0,0],
    [0,1,1,0,0],
    [1,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  "2": [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  "3": [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  "4": [
    [0,0,0,1,0],
    [0,0,1,1,0],
    [0,1,0,1,0],
    [1,0,0,1,0],
    [1,1,1,1,1],
    [0,0,0,1,0],
    [0,0,0,1,0],
  ],
  "5": [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  "6": [
    [0,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  "7": [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  "8": [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  "9": [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,1,1,1,0],
  ],
};

export const getDigitMap = (digit: string): number[][] => {
  return digitMaps[digit] || digitMaps["0"];
};

// Get all filled positions for a full age number (e.g. "28" -> positions for "2" and "8" side by side)
export const getAgePositions = (age: number): { row: number; col: number }[] => {
  const digits = age.toString().split("");
  const positions: { row: number; col: number }[] = [];
  const gap = 1; // gap between digits

  digits.forEach((digit, digitIndex) => {
    const map = getDigitMap(digit);
    const colOffset = digitIndex * (5 + gap);
    map.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          positions.push({ row: rowIndex, col: colIndex + colOffset });
        }
      });
    });
  });

  return positions;
};

// Total grid dimensions for given age
export const getAgeGridDimensions = (age: number) => {
  const digits = age.toString().split("");
  const gap = 1;
  const totalCols = digits.length * 5 + (digits.length - 1) * gap;
  const totalRows = 7;
  return { rows: totalRows, cols: totalCols };
};
