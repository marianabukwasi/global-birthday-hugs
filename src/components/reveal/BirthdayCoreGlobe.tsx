import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin } from "lucide-react";

// ISO 3166-1 alpha-2 → [lat, lng]
const CC_COORDS: Record<string, [number, number]> = {
  US: [39.8, -98.5], CA: [56.1, -106.3], GB: [55.3, -3.4], FR: [46.2, 2.2],
  DE: [51.1, 10.4], BR: [-14.2, -51.9], AU: [-25.2, 133.7], JP: [36.2, 138.2],
  IN: [20.5, 78.9], NG: [9.0, 8.6], ZA: [-30.5, 22.9], MX: [23.6, -102.5],
  KE: [-0.0, 37.9], EG: [26.8, 30.8], CN: [35.8, 104.1], IT: [41.8, 12.5],
  ES: [40.4, -3.7], AR: [-38.4, -63.6], CO: [4.5, -74.2], GH: [7.9, -1.0],
  MA: [31.7, -7.0], TR: [38.9, 35.2], SE: [60.1, 18.6], NL: [52.1, 5.2],
  PH: [12.8, 121.7], ID: [-0.7, 113.9], TH: [15.8, 100.9], KR: [35.9, 127.7],
  SA: [23.8, 45.0], AE: [23.4, 53.8], NZ: [-40.9, 174.8], PT: [39.3, -8.2],
  PL: [51.9, 19.1], BE: [50.8, 4.4], CH: [46.8, 8.2], AT: [47.5, 14.5],
  NO: [60.4, 8.4], DK: [56.2, 9.5], FI: [61.9, 25.7], IE: [53.4, -8.2],
  GR: [39.0, 21.8], RU: [61.5, 105.3], PK: [30.3, 69.3], BD: [23.6, 90.3],
  VN: [14.0, 108.2], TZ: [-6.3, 34.8], ET: [9.1, 40.4], CM: [7.3, 12.3],
  SN: [14.4, -14.4], UG: [1.3, 32.2], DZ: [28.0, 1.6], TN: [33.8, 9.5],
  LB: [33.8, 35.8], JO: [30.5, 36.2], IL: [31.0, 34.8], PE: [-9.1, -75.0],
  CL: [-35.6, -71.5], EC: [-1.8, -78.1], VE: [6.4, -66.5], CU: [21.5, -77.7],
  JM: [18.1, -77.2], HT: [18.9, -72.2], DO: [18.7, -70.1], CR: [9.7, -83.7],
  PA: [8.5, -80.7], GT: [15.7, -90.2], SG: [1.3, 103.8], MY: [4.2, 101.9],
  TW: [23.6, 121.0], HK: [22.3, 114.1],
};

// Also support full country names
const NAME_COORDS: Record<string, [number, number]> = {
  "United States": [39.8, -98.5], "Canada": [56.1, -106.3], "United Kingdom": [55.3, -3.4],
  "France": [46.2, 2.2], "Germany": [51.1, 10.4], "Brazil": [-14.2, -51.9],
  "Australia": [-25.2, 133.7], "Japan": [36.2, 138.2], "India": [20.5, 78.9],
  "Nigeria": [9.0, 8.6], "South Africa": [-30.5, 22.9], "Mexico": [23.6, -102.5],
  "Kenya": [-0.0, 37.9], "Egypt": [26.8, 30.8], "China": [35.8, 104.1],
  "Italy": [41.8, 12.5], "Spain": [40.4, -3.7], "Argentina": [-38.4, -63.6],
  "South Korea": [35.9, 127.7], "Singapore": [1.3, 103.8], "New Zealand": [-40.9, 174.8],
};

function getCoords(countryCode: string, countryName?: string): [number, number] {
  return CC_COORDS[countryCode] || (countryName ? NAME_COORDS[countryName] : null) || [0, 0];
}

function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

// Compute camera position to face a lat/lng
function latLngToCameraTarget(lat: number, lng: number, distance: number): [number, number, number] {
  const pos = latLngToXYZ(lat, lng, distance);
  return [-pos[0], pos[1], -pos[2]];
}

// ─── 3D Sub-components ───

function GlobeSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0005; });
  return (
    <Sphere ref={ref} args={[2, 64, 64]}>
      <meshStandardMaterial color="#0D1B4B" emissive="#1a2d6b" emissiveIntensity={0.3} roughness={0.8} />
    </Sphere>
  );
}

function GlobeWireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0005; });
  return (
    <Sphere ref={ref} args={[2.01, 36, 36]}>
      <meshBasicMaterial color="#F5C842" wireframe opacity={0.06} transparent />
    </Sphere>
  );
}

function Stars() {
  const points = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 600; i++) {
      pts.push((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25);
    }
    return new Float32Array(pts);
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F5C842" size={0.03} transparent opacity={0.5} />
    </points>
  );
}

function Ping({ position, active, pulsing }: { position: [number, number, number]; active: boolean; pulsing: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const [s, setS] = useState(0);

  useEffect(() => { if (active) setTimeout(() => setS(1), 50); }, [active]);

  useFrame(() => {
    if (ref.current) {
      const target = active ? s : 0;
      const cur = THREE.MathUtils.lerp(ref.current.scale.x, target, 0.12);
      ref.current.scale.set(cur, cur, cur);
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      <mesh ref={ref} scale={0}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#F5C842" emissive="#F5C842" emissiveIntensity={pulsing ? 3 : 1.5} />
      </mesh>
      <mesh scale={active ? 1 : 0}>
        <ringGeometry args={[0.08, 0.14, 32]} />
        <meshBasicMaterial color="#F5C842" transparent opacity={pulsing ? 0.6 : 0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
  autoRotate: boolean;
}

function CameraController({ targetPosition, autoRotate }: CameraControllerProps) {
  const { camera } = useThree();
  const target = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 5.5));

  useFrame(() => {
    if (targetPosition) {
      target.current.set(...targetPosition);
    }
    camera.position.lerp(target.current, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return <OrbitControls enableZoom={false} enablePan={false} autoRotate={autoRotate} autoRotateSpeed={0.2} />;
}

// ─── Types ───

export interface GlobeWish {
  countryCode: string;
  countryName: string;
  city?: string;
  timestamp: string;
  contentType: "photo" | "video";
  contentURL?: string;
  senderName: string;
  quote?: string;
}

interface BirthdayCoreGlobeProps {
  wishes: GlobeWish[];
  receiverName: string;
  receiverAge: number;
  onComplete?: () => void;
}

// ─── WebGL Fallback (2D flat map) ───

function FlatMapFallback({ wishes, receiverName, onComplete }: { wishes: GlobeWish[]; receiverName: string; onComplete?: () => void }) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const totalWishes = wishes.length;
  const countries = new Set(wishes.map(w => w.countryName)).size;

  useEffect(() => {
    if (totalWishes === 0) { onComplete?.(); return; }
    let i = 0;
    const iv = setInterval(() => {
      setActiveIdx(i);
      i++;
      if (i >= totalWishes) { clearInterval(iv); setTimeout(() => onComplete?.(), 2000); }
    }, 3000);
    return () => clearInterval(iv);
  }, [totalWishes, onComplete]);

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden relative" style={{ background: "#080E24" }}>
      {/* Simple dot grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Globe className="w-40 h-40 text-[#0D1B4B]" />
      </div>
      {wishes.map((w, i) => {
        const coords = getCoords(w.countryCode, w.countryName);
        const x = ((coords[1] + 180) / 360) * 100;
        const y = ((90 - coords[0]) / 180) * 100;
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={i <= activeIdx ? { scale: 1, opacity: 1 } : {}}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              background: "#F5C842",
              boxShadow: i === activeIdx ? "0 0 12px #F5C842" : "0 0 4px #F5C84280",
            }}
          />
        );
      })}

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur rounded-xl px-6 py-3 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-bold text-lg">{Math.max(0, activeIdx + 1)}</span>
          <span className="mx-1">/</span>{totalWishes} wishes
        </p>
      </div>

      {activeIdx >= totalWishes - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/60"
        >
          <p className="font-display text-2xl text-foreground text-center px-4">
            Celebrated by <span className="text-primary font-bold">{totalWishes}</span> people from{" "}
            <span className="text-celebration-cyan font-bold">{countries}</span> countries
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Content Panel ───

function ContentPanel({ wish, visible }: { wish: GlobeWish | null; visible: boolean }) {
  if (!wish || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={wish.timestamp + wish.senderName}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="rounded-2xl bg-card/95 backdrop-blur border border-border p-4 max-w-sm w-full"
      >
        {wish.contentType === "video" && wish.contentURL ? (
          <video
            src={wish.contentURL}
            autoPlay
            muted
            playsInline
            className="w-full aspect-video rounded-lg object-cover mb-3"
          />
        ) : wish.contentURL ? (
          <img
            src={wish.contentURL}
            alt={`Wish from ${wish.senderName}`}
            className="w-full aspect-video rounded-lg object-cover mb-3"
          />
        ) : (
          <div className="w-full aspect-video rounded-lg bg-secondary/50 flex items-center justify-center mb-3">
            <MapPin className="w-8 h-8 text-primary/40" />
          </div>
        )}
        {wish.quote && (
          <p className="text-sm text-foreground italic mb-2">"{wish.quote}"</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{wish.senderName}</p>
          <p className="text-xs text-primary font-medium">{wish.countryName}{wish.city ? `, ${wish.city}` : ""}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───

export const BirthdayCoreGlobe = ({ wishes, receiverName, receiverAge, onComplete }: BirthdayCoreGlobeProps) => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [showOutro, setShowOutro] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const totalWishes = wishes.length;
  const countries = new Set(wishes.map(w => w.countryName)).size;

  // Check WebGL support
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const supported = !!(c.getContext("webgl") || c.getContext("webgl2"));
      setWebglSupported(supported);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Sorted wishes
  const sortedWishes = useMemo(
    () => [...wishes].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [wishes]
  );

  // Ping positions
  const pingPositions = useMemo(
    () => sortedWishes.map(w => latLngToXYZ(...getCoords(w.countryCode, w.countryName), 2.08)),
    [sortedWishes]
  );

  // Animation sequence
  useEffect(() => {
    if (totalWishes === 0) {
      setShowOutro(true);
      setTimeout(() => onComplete?.(), 2000);
      return;
    }

    let i = 0;
    const advance = () => {
      if (i >= sortedWishes.length) {
        // Outro
        setCameraTarget(null);
        setTimeout(() => {
          setShowOutro(true);
          setTimeout(() => onComplete?.(), 2000);
        }, 1000);
        return;
      }

      const wish = sortedWishes[i];
      const coords = getCoords(wish.countryCode, wish.countryName);
      setCameraTarget(latLngToCameraTarget(coords[0], coords[1], 5.5));
      setActiveIdx(i);

      // Duration: 3s for photo, estimate video as 5s
      const duration = wish.contentType === "video" ? 5000 : 3000;
      i++;
      setTimeout(advance, duration);
    };

    // Start after a brief intro rotation
    const startTimer = setTimeout(advance, 1500);
    return () => clearTimeout(startTimer);
  }, [sortedWishes, totalWishes, onComplete]);

  if (!webglSupported) {
    return <FlatMapFallback wishes={wishes} receiverName={receiverName} onComplete={onComplete} />;
  }

  return (
    <div className="w-full relative" style={{ height: "60vh", minHeight: 400 }}>
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} style={{ background: "#080E24" }}>
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 10, 10]} intensity={0.7} color="#F5C842" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#5B8DEF" />
        <Stars />
        <GlobeSphere />
        <GlobeWireframe />
        {pingPositions.map((pos, i) => (
          <Ping key={i} position={pos} active={i <= activeIdx} pulsing={i === activeIdx} />
        ))}
        <CameraController targetPosition={cameraTarget} autoRotate={activeIdx < 0 || showOutro} />
      </Canvas>

      {/* Content panel overlay */}
      <div className="absolute top-4 right-4 z-10 hidden md:block">
        <ContentPanel
          wish={activeIdx >= 0 ? sortedWishes[activeIdx] : null}
          visible={activeIdx >= 0 && !showOutro}
        />
      </div>

      {/* Mobile content panel */}
      <div className="absolute bottom-16 left-4 right-4 z-10 md:hidden">
        <ContentPanel
          wish={activeIdx >= 0 ? sortedWishes[activeIdx] : null}
          visible={activeIdx >= 0 && !showOutro}
        />
      </div>

      {/* Counter */}
      {!showOutro && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-card/80 backdrop-blur rounded-xl px-6 py-3 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-bold text-lg">{Math.max(0, activeIdx + 1)}</span>
            <span className="mx-1">/</span>{totalWishes} wishes revealed
          </p>
        </div>
      )}

      {/* Outro overlay */}
      <AnimatePresence>
        {showOutro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center px-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl md:text-4xl font-bold text-foreground"
              >
                Celebrated by{" "}
                <span className="text-primary">{totalWishes}</span> people from{" "}
                <span className="text-celebration-cyan">{countries}</span> countries
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
