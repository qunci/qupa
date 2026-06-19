import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg 
      viewBox="130 115 450 170" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <mask id="tail-gap">
          <rect width="800" height="400" fill="white" />
          <circle cx="220" cy="200" r="82" fill="black" />
        </mask>
      </defs>
      <circle cx="220" cy="200" r="60" fill="none" stroke="url(#qGrad)" strokeWidth="30" />
      <polygon points="301.5,191.2 349.9,275 253.1,275" fill="url(#qGrad)" mask="url(#tail-gap)" />
      <text x="365" y="195" fontFamily="Montserrat, Inter, sans-serif" fontWeight="900" fontSize="115" letterSpacing="-0.03em" className="fill-slate-900 dark:fill-white" dominantBaseline="central">upa</text>
    </svg>
  );
}
