// Simplified 2D world map country centroids and basic continent outlines
// Used for highlighting where wishes come from

export interface CountryCoord {
  name: string;
  code: string;
  lat: number;
  lng: number;
  continent: string;
}

export const COUNTRY_COORDS: CountryCoord[] = [
  { name: "United States", code: "US", lat: 39.8, lng: -98.6, continent: "North America" },
  { name: "Canada", code: "CA", lat: 56.1, lng: -106.3, continent: "North America" },
  { name: "Mexico", code: "MX", lat: 23.6, lng: -102.6, continent: "North America" },
  { name: "Brazil", code: "BR", lat: -14.2, lng: -51.9, continent: "South America" },
  { name: "Argentina", code: "AR", lat: -38.4, lng: -63.6, continent: "South America" },
  { name: "Colombia", code: "CO", lat: 4.6, lng: -74.3, continent: "South America" },
  { name: "United Kingdom", code: "GB", lat: 55.4, lng: -3.4, continent: "Europe" },
  { name: "France", code: "FR", lat: 46.2, lng: 2.2, continent: "Europe" },
  { name: "Germany", code: "DE", lat: 51.2, lng: 10.5, continent: "Europe" },
  { name: "Spain", code: "ES", lat: 40.5, lng: -3.7, continent: "Europe" },
  { name: "Italy", code: "IT", lat: 41.9, lng: 12.6, continent: "Europe" },
  { name: "Sweden", code: "SE", lat: 60.1, lng: 18.6, continent: "Europe" },
  { name: "Netherlands", code: "NL", lat: 52.1, lng: 5.3, continent: "Europe" },
  { name: "Poland", code: "PL", lat: 51.9, lng: 19.1, continent: "Europe" },
  { name: "Nigeria", code: "NG", lat: 9.1, lng: 8.7, continent: "Africa" },
  { name: "South Africa", code: "ZA", lat: -30.6, lng: 22.9, continent: "Africa" },
  { name: "Kenya", code: "KE", lat: -0.02, lng: 37.9, continent: "Africa" },
  { name: "Ghana", code: "GH", lat: 7.9, lng: -1.0, continent: "Africa" },
  { name: "Egypt", code: "EG", lat: 26.8, lng: 30.8, continent: "Africa" },
  { name: "Senegal", code: "SN", lat: 14.5, lng: -14.5, continent: "Africa" },
  { name: "Japan", code: "JP", lat: 36.2, lng: 138.3, continent: "Asia" },
  { name: "India", code: "IN", lat: 20.6, lng: 79.0, continent: "Asia" },
  { name: "China", code: "CN", lat: 35.9, lng: 104.2, continent: "Asia" },
  { name: "South Korea", code: "KR", lat: 35.9, lng: 127.8, continent: "Asia" },
  { name: "Thailand", code: "TH", lat: 15.9, lng: 100.9, continent: "Asia" },
  { name: "Indonesia", code: "ID", lat: -0.8, lng: 113.9, continent: "Asia" },
  { name: "Philippines", code: "PH", lat: 12.9, lng: 121.8, continent: "Asia" },
  { name: "UAE", code: "AE", lat: 23.4, lng: 53.8, continent: "Asia" },
  { name: "Saudi Arabia", code: "SA", lat: 23.9, lng: 45.1, continent: "Asia" },
  { name: "Australia", code: "AU", lat: -25.3, lng: 133.8, continent: "Oceania" },
  { name: "New Zealand", code: "NZ", lat: -40.9, lng: 174.9, continent: "Oceania" },
];

export function findCountryByName(name: string): CountryCoord | undefined {
  const lower = name.toLowerCase();
  return COUNTRY_COORDS.find(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      lower.includes(c.name.toLowerCase()) ||
      c.code.toLowerCase() === lower
  );
}

// Convert lat/lng to x/y on a simple equirectangular projection
export function latLngToXY(
  lat: number,
  lng: number,
  width: number,
  height: number,
  padding = 20
): { x: number; y: number } {
  const mapW = width - padding * 2;
  const mapH = height - padding * 2;
  const x = padding + ((lng + 180) / 360) * mapW;
  const y = padding + ((90 - lat) / 180) * mapH;
  return { x, y };
}
