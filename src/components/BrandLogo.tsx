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

      <text 
        x="96" 
        y="95" 
        textAnchor="end" 
        fontFamily="'AlienBlock', 'Orbitron', system-ui, sans-serif" 
        fontWeight="400" 
        fontSize="100" 
        fill="currentColor"
      >
        Q
      </text>
      <text 
        x="104" 
        y="95" 
        textAnchor="start" 
        fontFamily="'AlienBlock', 'Orbitron', system-ui, sans-serif" 
        fontWeight="400" 
        fontSize="100" 
        fill="currentColor"
      >
        U
      </text>
      <text 
        x="96" 
        y="175" 
        textAnchor="end" 
        fontFamily="'AlienBlock', 'Orbitron', system-ui, sans-serif" 
        fontWeight="400" 
        fontSize="100" 
        fill="currentColor"
      >
        P
      </text>
      <text 
        x="104" 
        y="175" 
        textAnchor="start" 
        fontFamily="'AlienBlock', 'Orbitron', system-ui, sans-serif" 
        fontWeight="400" 
        fontSize="100" 
        fill="currentColor"
      >
        A
      </text>
    </svg>
  );
}
