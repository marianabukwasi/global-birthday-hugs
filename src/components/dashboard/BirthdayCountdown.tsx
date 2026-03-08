import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BirthdayCountdownProps {
  birthdayMonth: number;
  birthdayDay: number;
  timezone?: string;
  onBirthdayReached?: () => void;
}

const BirthdayCountdown = ({ birthdayMonth, birthdayDay, timezone, onBirthdayReached }: BirthdayCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const thisYear = now.getFullYear();
      let birthday = new Date(thisYear, birthdayMonth - 1, birthdayDay);
      if (birthday < now) {
        birthday = new Date(thisYear + 1, birthdayMonth - 1, birthdayDay);
      }

      const diff = birthday.getTime() - now.getTime();
      const hoursRemaining = diff / (1000 * 60 * 60);

      if (hoursRemaining <= 24 && hoursRemaining > 0) {
        setIsActive(true);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else if (hoursRemaining <= 0) {
        setIsActive(false);
        onBirthdayReached?.();
      } else {
        setIsActive(false);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [birthdayMonth, birthdayDay, timezone, onBirthdayReached]);

  if (!isActive) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <p className="text-muted-foreground text-lg mb-4 font-sans">
        Your birthday is almost here. The world has been waiting.
      </p>
      <div className="flex items-center justify-center gap-4">
        {[
          { value: pad(timeLeft.hours), label: "Hours" },
          { value: pad(timeLeft.minutes), label: "Minutes" },
          { value: pad(timeLeft.seconds), label: "Seconds" },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="font-display text-5xl sm:text-6xl font-bold text-primary animate-pulse-glow rounded-xl px-4 py-2">
              {value}
            </div>
            <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export { BirthdayCountdown };
export type { BirthdayCountdownProps };
