import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`text-slate-900 dark:text-white ${className}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 
        Logo ini dirender menggunakan font Super Blocky sebagai alternatif.
      */}
      <text 
        x="100" 
        y="90" 
        textAnchor="middle" 
        fontFamily="'Super Blocky', 'Blocky', 'Orbitron', system-ui, sans-serif" 
        fontWeight="900" 
        fontSize="100" 
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        qu
      </text>
      <text 
        x="100" 
        y="180" 
        textAnchor="middle" 
        fontFamily="'Super Blocky', 'Blocky', 'Orbitron', system-ui, sans-serif" 
        fontWeight="900" 
        fontSize="100" 
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        Pa
      </text>
    </svg>
  );
}
