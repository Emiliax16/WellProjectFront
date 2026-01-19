"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const SparklesText = ({
  text,
  colors = { first: "#9E7AFF", second: "#FE8BBB" },
  className,
  sparklesCount = 10,
}) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const generateSparks = () => {
      const newSparkles = Array.from({ length: sparklesCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1 + Math.random() * 2,
      }));
      setSparkles(newSparkles);
    };

    generateSparks();
    const interval = setInterval(generateSparks, 3000);
    return () => clearInterval(interval);
  }, [sparklesCount]);

  return (
    <span className="relative inline-block">
      <span className={cn("relative z-10", className)}>{text}</span>
      <span className="absolute inset-0 overflow-visible pointer-events-none">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute inline-block animate-sparkle"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 0L4.89806 2.76393H7.80423L5.45308 4.47214L6.35114 7.23607L4 5.52786L1.64886 7.23607L2.54692 4.47214L0.195774 2.76393H3.10194L4 0Z"
                fill={Math.random() > 0.5 ? colors.first : colors.second}
                opacity="0.6"
              />
            </svg>
          </span>
        ))}
      </span>
    </span>
  );
};

export default SparklesText;
