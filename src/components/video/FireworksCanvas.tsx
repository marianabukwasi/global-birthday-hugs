import { useRef, useEffect, useCallback } from "react";

interface FireworksCanvasProps {
  width: number;
  height: number;
  name: string;
  age: number;
  running: boolean;
  onComplete?: () => void;
  duration?: number; // ms
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  color: string;
}

const COLORS = [
  "hsl(330, 85%, 60%)",
  "hsl(260, 60%, 55%)",
  "hsl(45, 95%, 58%)",
  "hsl(185, 70%, 50%)",
  "hsl(155, 65%, 45%)",
  "hsl(25, 95%, 55%)",
  "hsl(0, 80%, 60%)",
  "hsl(200, 80%, 60%)",
];

export const FireworksCanvas = ({
  width,
  height,
  name,
  age,
  running,
  onComplete,
  duration = 5000,
}: FireworksCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const lastRocketRef = useRef<number>(0);

  const createExplosion = useCallback(
    (x: number, y: number, color: string) => {
      const count = 60 + Math.random() * 40;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 1.5 + Math.random() * 3.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          color,
          size: 1.5 + Math.random() * 1.5,
          trail: [],
        });
      }
    },
    []
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
      const progress = Math.min(elapsed / duration, 1);

      // Semi-transparent clear for trailing effect
      ctx.fillStyle = "rgba(10, 10, 20, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Launch rockets periodically
      if (timestamp - lastRocketRef.current > 300 + Math.random() * 400 && progress < 0.85) {
        lastRocketRef.current = timestamp;
        rocketsRef.current.push({
          x: width * 0.15 + Math.random() * width * 0.7,
          y: height,
          targetY: height * 0.15 + Math.random() * height * 0.35,
          vy: -4 - Math.random() * 3,
          exploded: false,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }

      // Update rockets
      rocketsRef.current = rocketsRef.current.filter((r) => {
        if (r.exploded) return false;
        r.y += r.vy;
        // Draw rocket trail
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 8);
        ctx.strokeStyle = "rgba(255, 200, 100, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          r.exploded = true;
          return false;
        }
        return true;
      });

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravity
        p.vx *= 0.99;
        p.vy *= 0.99;

        const alpha = 1 - p.life / p.maxLife;

        // Draw trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = p.color.replace(")", `, ${alpha * 0.3})`).replace("hsl(", "hsla(");
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `, ${alpha})`).replace("hsl(", "hsla(");
        ctx.fill();

        return true;
      });

      // Draw text — fade in from 20% to 100%
      const textAlpha = progress < 0.2 ? progress / 0.2 : 1;
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // "Happy Birthday" text
      ctx.font = `bold ${Math.floor(width * 0.055)}px 'Syne', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "hsl(330, 85%, 60%)";
      ctx.shadowBlur = 30;
      ctx.fillText("Happy Birthday", width / 2, height * 0.42);

      // Name — Age
      ctx.font = `bold ${Math.floor(width * 0.075)}px 'Syne', sans-serif`;
      const gradient = ctx.createLinearGradient(
        width * 0.3,
        height * 0.5,
        width * 0.7,
        height * 0.5
      );
      gradient.addColorStop(0, "hsl(330, 85%, 65%)");
      gradient.addColorStop(0.5, "hsl(45, 95%, 65%)");
      gradient.addColorStop(1, "hsl(260, 60%, 65%)");
      ctx.fillStyle = gradient;
      ctx.shadowColor = "hsl(45, 95%, 58%)";
      ctx.shadowBlur = 40;
      ctx.fillText(`${name} — ${age}`, width / 2, height * 0.55);
      ctx.restore();

      if (progress >= 1) {
        onComplete?.();
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [running, width, height, name, age, duration, onComplete, createExplosion]
  );

  useEffect(() => {
    if (running) {
      startTimeRef.current = 0;
      particlesRef.current = [];
      rocketsRef.current = [];
      lastRocketRef.current = 0;

      // Clear canvas with solid black
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgb(10, 10, 20)";
          ctx.fillRect(0, 0, width, height);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [running, animate, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="block rounded-xl" />;
};
