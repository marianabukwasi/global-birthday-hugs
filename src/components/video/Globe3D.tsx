import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Html, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";
import { COUNTRY_COORDS, findCountryByName } from "./countryData";

export interface GlobeWish {
  id: string;
  senderName: string;
  country: string;
  message: string;
  imageUrl?: string;
}

interface Globe3DProps {
  wishes: GlobeWish[];
  running: boolean;
  currentIndex: number;
  onComplete?: () => void;
}

function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

const GlobeGrid = ({ radius }: { radius: number }) => {
  const lines = useMemo(() => {
    const result: [number, number, number][][] = [];
    for (let lat = -60; lat <= 80; lat += 20) {
      const points: [number, number, number][] = [];
      for (let lng = -180; lng <= 180; lng += 5) {
        points.push(latLngToVector3(lat, lng, radius + 0.01));
      }
      result.push(points);
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const points: [number, number, number][] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLngToVector3(lat, lng, radius + 0.01));
      }
      result.push(points);
    }
    return result;
  }, [radius]);

  return (
    <>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#b8a070" opacity={0.15} transparent lineWidth={0.5} />
      ))}
    </>
  );
};

const CONTINENT_OUTLINES: [number, number][][] = [
  [[-130,50],[-125,60],[-100,65],[-80,60],[-65,45],[-80,30],[-100,20],[-105,25],[-115,30],[-125,45],[-130,50]],
  [[-80,10],[-70,5],[-60,-5],[-50,-10],[-45,-20],[-50,-30],[-55,-35],[-65,-50],[-70,-45],[-75,-20],[-80,-5],[-80,10]],
  [[-10,35],[0,40],[5,45],[10,55],[20,60],[30,70],[40,65],[35,50],[25,40],[15,37],[5,37],[-10,35]],
  [[-15,35],[-15,15],[-5,5],[5,5],[10,0],[15,-5],[25,-15],[35,-30],[30,-35],[20,-35],[15,-25],[10,-10],[5,5],[-5,5],[-15,15],[-15,35]],
  [[30,35],[40,40],[50,40],[60,45],[70,50],[80,60],[100,65],[120,60],[130,55],[140,45],[145,35],[130,25],[120,20],[110,10],[100,15],[90,20],[80,25],[70,30],[60,35],[50,35],[40,35],[30,35]],
  [[115,-12],[130,-12],[150,-15],[155,-25],[150,-35],[140,-37],[130,-32],[115,-22],[115,-12]],
];

const ContinentOutlines = ({ radius }: { radius: number }) => {
  const outlines = useMemo(() => {
    return CONTINENT_OUTLINES.map((outline) =>
      outline.map(([lng, lat]) => latLngToVector3(lat, lng, radius + 0.015))
    );
  }, [radius]);

  return (
    <>
      {outlines.map((pts, i) => (
        <Line key={i} points={pts} color="#c9a96e" opacity={0.5} transparent lineWidth={1.5} />
      ))}
    </>
  );
};

const CountryDots = ({ radius, highlightedCountries }: { radius: number; highlightedCountries: Set<string> }) => {
  return (
    <>
      {COUNTRY_COORDS.map((c) => {
        const pos = latLngToVector3(c.lat, c.lng, radius + 0.02);
        const isHighlighted = highlightedCountries.has(c.name);
        return (
          <mesh key={c.code} position={pos}>
            <sphereGeometry args={[isHighlighted ? 0.04 : 0.02, 8, 8]} />
            <meshBasicMaterial
              color={isHighlighted ? "#c9a96e" : "#a89070"}
              opacity={isHighlighted ? 1 : 0.3}
              transparent
            />
          </mesh>
        );
      })}
    </>
  );
};

const WishCard = ({ wish, radius, visible }: { wish: GlobeWish; radius: number; visible: boolean }) => {
  const country = findCountryByName(wish.country);
  if (!country || !visible) return null;

  const pos = latLngToVector3(country.lat, country.lng, radius + 0.15);

  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#c9a96e" />
      </mesh>

      <mesh>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color="#c9a96e" opacity={0.4} transparent side={THREE.DoubleSide} />
      </mesh>

      <Html
        position={[0, 0.15, 0]}
        center
        distanceFactor={3}
        style={{ pointerEvents: "none" }}
      >
        <div className="flex flex-col items-center gap-1" style={{ width: 180, animation: "fadeIn 0.5s ease" }}>
          {wish.imageUrl && (
            <img
              src={wish.imageUrl}
              alt={wish.senderName}
              className="w-24 h-24 rounded-lg object-cover shadow-lg"
              style={{ border: "2px solid #c9a96e" }}
            />
          )}
          <div
            className="rounded-lg px-3 py-2 text-center shadow-lg max-w-[180px]"
            style={{ background: "rgba(255,252,245,0.95)", border: "1px solid #e0d5c0" }}
          >
            <p className="text-xs font-semibold" style={{ color: "#3d3830" }}>{wish.senderName}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "#8a7e6d" }}>{wish.country}</p>
            {wish.message && (
              <p className="text-[10px] mt-1 italic leading-tight" style={{ color: "#5a5040" }}>
                "{wish.message.length > 60 ? wish.message.slice(0, 57) + "..." : wish.message}"
              </p>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};

const ConnectionArc = ({ fromCoords, toCoords, radius }: { fromCoords: [number, number, number]; toCoords: [number, number, number]; radius: number }) => {
  const points = useMemo(() => {
    const from = new THREE.Vector3(...fromCoords);
    const to = new THREE.Vector3(...toCoords);
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(radius * 1.3);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    return curve.getPoints(40).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [fromCoords, toCoords, radius]);

  return <Line points={points} color="#c9a96e" opacity={0.3} transparent lineWidth={1} />;
};

const GlobeScene = ({ wishes, currentIndex }: { wishes: GlobeWish[]; currentIndex: number }) => {
  const globeRef = useRef<THREE.Group>(null);
  const radius = 1.5;

  const highlightedCountries = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i <= currentIndex && i < wishes.length; i++) {
      const country = findCountryByName(wishes[i].country);
      if (country) set.add(country.name);
    }
    return set;
  }, [wishes, currentIndex]);

  useFrame((_, delta) => {
    if (!globeRef.current) return;
    if (currentIndex >= 0 && currentIndex < wishes.length) {
      const wish = wishes[currentIndex];
      const country = findCountryByName(wish.country);
      if (country) {
        const targetY = -(country.lng * Math.PI) / 180;
        const currentY = globeRef.current.rotation.y;
        globeRef.current.rotation.y += (targetY - currentY) * delta * 1.5;
      }
    } else {
      globeRef.current.rotation.y += delta * 0.1;
    }
  });

  const currentWish = currentIndex >= 0 && currentIndex < wishes.length ? wishes[currentIndex] : null;

  return (
    <group ref={globeRef}>
      <Sphere args={[radius, 64, 64]}>
        <meshPhongMaterial
          color="#f5f0e8"
          emissive="#d4c5a0"
          emissiveIntensity={0.05}
          shininess={20}
          opacity={0.85}
          transparent
        />
      </Sphere>
      <Sphere args={[radius * 0.98, 32, 32]}>
        <meshBasicMaterial color="#e8dcc8" opacity={0.3} transparent />
      </Sphere>

      <GlobeGrid radius={radius} />
      <ContinentOutlines radius={radius} />
      <CountryDots radius={radius} highlightedCountries={highlightedCountries} />

      {wishes.slice(0, currentIndex + 1).map((wish, i) => {
        if (i === 0) return null;
        const prevCountry = findCountryByName(wishes[i - 1].country);
        const curCountry = findCountryByName(wish.country);
        if (!prevCountry || !curCountry) return null;
        return (
          <ConnectionArc
            key={i}
            fromCoords={latLngToVector3(prevCountry.lat, prevCountry.lng, radius + 0.02)}
            toCoords={latLngToVector3(curCountry.lat, curCountry.lng, radius + 0.02)}
            radius={radius}
          />
        );
      })}

      {currentWish && <WishCard wish={currentWish} radius={radius} visible={true} />}
    </group>
  );
};

export const Globe3D = ({ wishes, running, currentIndex }: Globe3DProps) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border shadow-card bg-card" style={{ height: 450 }}>
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(180deg, #f8f4ec, #f0e8d8)" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fff5e0" />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#d4c5a0" />
        <pointLight position={[0, 3, 0]} intensity={0.4} color="#c9a96e" />

        <Suspense fallback={null}>
          <GlobeScene wishes={wishes} currentIndex={currentIndex} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!running}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
        />
      </Canvas>
    </div>
  );
};
