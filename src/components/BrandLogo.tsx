import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg 
      viewBox="130 115 400 170" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qGrad" x1="145" y1="275" x2="295" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <clipPath id="circle-clip">
          <polygon points="-1000,-1000 1405,-1000 -1000,1405" />
        </clipPath>
      </defs>
      
      {/* Circle Part (Top-Left) */}
      <circle cx="220" cy="200" r="60" fill="none" stroke="url(#qGrad)" strokeWidth="30" clipPath="url(#circle-clip)" />
      
      {/* Triangle Part (Bottom-Right) */}
      <path d="M 170 275 L 295 275 L 295 140 Z M 232.4 245 L 265 245 L 265 212.4 Z" fill="url(#qGrad)" fillRule="evenodd" />
      
      {/* Text Part */}
      <text x="315" y="195" fontFamily="Montserrat, Inter, sans-serif" fontWeight="900" fontSize="115" letterSpacing="-0.03em" className="fill-slate-900 dark:fill-white" dominantBaseline="central">upa</text>
    </svg>
  );
}
