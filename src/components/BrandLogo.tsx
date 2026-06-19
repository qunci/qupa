import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <svg 
      viewBox="0 0 400 400" 
      className={`text-slate-900 dark:text-white ${className}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        {/* Top-Left: "Q" */}
        <path d="
          M 40 0 L 150 0 Q 190 0 190 40 L 190 140 L 140 190 L 40 190 Q 0 190 0 150 L 0 40 Q 0 0 40 0 Z 
          M 30 160 Q 70 70 160 30 Q 120 120 30 160 Z
        " fillRule="evenodd" />
        <path d="M 160 190 L 190 190 L 190 160 Z" />

        {/* Top-Right: "u" */}
        <path d="
          M 210 0 L 400 0 L 400 190 L 300 190 Q 210 190 210 100 Z 
          M 270 0 Q 330 70 380 150 Q 300 80 290 0 Z
        " fillRule="evenodd" />

        {/* Bottom-Left: "P" */}
        <path d="
          M 0 210 L 190 210 L 190 300 Q 190 400 100 400 L 50 400 L 0 350 Z
          M 60 210 Q 120 280 170 350 Q 100 290 80 210 Z
        " fillRule="evenodd" />

        {/* Bottom-Right: "a" */}
        <path d="
          M 300 210 L 400 210 L 400 400 L 300 400 Q 210 400 210 310 L 210 300 Q 210 210 300 210 Z
          M 370 210 Q 310 280 230 340 Q 290 260 340 210 Z
          M 400 260 Q 340 330 260 380 Q 330 310 380 260 Z
        " fillRule="evenodd" />
      </g>
    </svg>
  );
}
