"use client";

import { cn } from "../../lib/utils";

const WaveText = ({ text, className }) => {
  const words = text.split(" ");

  return (
    <span className="inline-block">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-3">
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className={cn("inline-block animate-wave", className)}
              style={{
                animationDelay: `${(wordIndex * word.length + charIndex) * 0.05}s`,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default WaveText;
