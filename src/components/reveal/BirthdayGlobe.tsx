import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

// Country coordinates (lat, lng) for major countries
const COUNTRY_COORDS: Record<string, [number, number]> = {
  "United States": [39.8, -98.5], "Canada": [56.1, -106.3], "United Kingdom": [55.3, -3.4],
  "France": [46.2, 2.2], "Germany": [51.1, 10.4], "Brazil": [-14.2, -51.9],
  "Australia": [-25.2, 133.7], "Japan": [36.2, 138.2], "India": [20.5, 78.9],
  "Nigeria": [9.0, 8.6], "South Africa": [-30.5, 22.9], "Mexico": [23.6, -102.5],
  "Kenya": [-0.0, 37.9], "Egypt": [26.8, 30.8], "China": [35.8, 104.1],
  "Italy": [41.8, 12.5], "Spain": [40.4, -3.7], "Argentina": [-38.4, -63.6],
  "Colombia": [4.5, -74.2], "Ghana": [7.9, -1.0], "Morocco": [31.7, -7.0],
  "Turkey": [38.9, 35.2], "Sweden": [60.1, 18.6], "Netherlands": [52.1, 5.2],
  "Philippines": [12.8, 121.7], "Indonesia": [-0.7, 113.9], "Thailand": [15.8, 100.9],
  "South Korea": [35.9, 127.7], "Saudi Arabia": [23.8, 45.0], "UAE": [23.4, 53.8],
  "New Zealand": [-40.9, 174.8], "Portugal": [39.3, -8.2], "Poland": [51.9, 19.1],
  "Belgium": [50.8, 4.4], "Switzerland": [46.8, 8.2], "Austria": [47.5, 14.5],
  "Norway": [60.4, 8.4], "Denmark": [56.2, 9.5], "Finland": [61.9, 25.7],
  "Ireland": [53.4, -8.2], "Greece": [39.0, 21.8], "Russia": [61.5, 105.3],
  "Pakistan": [30.3, 69.3], "Bangladesh": [23.6, 90.3], "Vietnam": [14.0, 108.2],
  "Tanzania": [-6.3, 34.8], "Ethiopia": [9.1, 40.4], "Cameroon": [7.3, 12.3],
  "Ivory Coast": [7.5, -5.5], "Senegal": [14.4, -14.4], "DR Congo": [-4.0, 21.7],
  "Uganda": [1.3, 32.2], "Algeria": [28.0, 1.6], "Tunisia": [33.8, 9.5],
  "Lebanon": [33.8, 35.8], "Jordan": [30.5, 36.2], "Israel": [31.0, 34.8],
  "Peru": [-9.1, -75.0], "Chile": [-35.6, -71.5], "Ecuador": [-1.8, -78.1],
  "Venezuela": [6.4, -66.5], "Cuba": [21.5, -77.7], "Jamaica": [18.1, -77.2],
  "Trinidad and Tobago": [10.6, -61.2], "Haiti": [18.9, -72.2],
  "Dominican Republic": [18.7, -70.1], "Costa Rica": [9.7, -83.7],
  "Panama": [8.5, -80.7], "Guatemala": [15.7, -90.2],
};

function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

interface PingData {
  country: string;
  message?: string;
  senderName?: string;
  position: [number, number, number];
  delay: number;
}

function GlobeMesh() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <Sphere ref={ref} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#0D1B4B"
        emissive="#1a2d6b"
        emissiveIntensity={0.3}
        roughness={0.8}
        wireframe={false}
      />
    </Sphere>
  );
}

function WireframeGlobe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <Sphere ref={ref} args={[2.01, 32, 32]}>
      <meshBasicMaterial color="#F5C842" wireframe opacity={0.08} transparent />
    </Sphere>
  );
}

function Ping({ data, isActive }: { data: PingData; isActive: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setScale(1);
        setShowLabel(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  useFrame(() => {
    if (ref.current && isActive) {
      const s = THREE.MathUtils.lerp(ref.current.scale.x, scale, 0.1);
      ref.current.scale.set(s, s, s);
    }
  });

  if (!isActive) return null;

  return (
    <group position={data.position}>
      <mesh ref={ref} scale={0}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#F5C842" emissive="#F5C842" emissiveIntensity={2} />
      </mesh>
      {/* Glow ring */}
      <mesh scale={scale}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color="#F5C842" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {showLabel && (
        <Html distanceFactor={8} center style={{ pointerEvents: "none" }}>
          <div className="bg-card/90 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-1.5 text-center whitespace-nowrap shadow-glow-gold">
            <p className="text-xs font-semibold text-primary">{data.country}</p>
            {data.message && (
              <p className="text-[10px] text-muted-foreground max-w-[120px] truncate">{data.message}</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function Stars() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 500; i++) {
      pts.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
    }
    return new Float32Array(pts);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F5C842" size={0.03} transparent opacity={0.6} />
    </points>
  );
}

interface BirthdayGlobeProps {
  wishes: Array<{ country: string; message?: string; senderName?: string; created_at: string }>;
  onPingComplete?: () => void;
}

export const BirthdayGlobe = ({ wishes, onPingComplete }: BirthdayGlobeProps) => {
  const [activePingIndex, setActivePingIndex] = useState(-1);

  const pings: PingData[] = useMemo(() => {
    return wishes
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((wish, i) => {
        const coords = COUNTRY_COORDS[wish.country] || [0, 0];
        return {
          country: wish.country || "Unknown",
          message: wish.message,
          senderName: wish.senderName,
          position: latLngToXYZ(coords[0], coords[1], 2.08),
          delay: i * 1500,
        };
      });
  }, [wishes]);

  useEffect(() => {
    if (pings.length === 0) return;
    let idx = 0;
    const interval = setInterval(() => {
      setActivePingIndex(idx);
      idx++;
      if (idx >= pings.length) {
        clearInterval(interval);
        onPingComplete?.();
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [pings.length, onPingComplete]);

  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#F5C842" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#5B8DEF" />
        <Stars />
        <GlobeMesh />
        <WireframeGlobe />
        {pings.map((ping, i) => (
          <Ping key={i} data={ping} isActive={i <= activePingIndex} />
        ))}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
      {/* Counter overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-xl px-6 py-3 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-bold text-lg">{Math.max(0, activePingIndex + 1)}</span>
          <span className="mx-1">/</span>
          <span>{pings.length}</span> wishes revealed
        </p>
      </div>
    </div>
  );
};
