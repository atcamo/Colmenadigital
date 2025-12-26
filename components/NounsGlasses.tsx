
import React from 'react';

interface Props {
  className?: string;
  color?: string; // The main color (e.g. red)
}

export const NounsGlasses: React.FC<Props> = ({ className = "w-24 h-auto", color = "#E63433" }) => {
  return (
    <svg 
      viewBox="0 7 28 11" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges" // Important for pixel art
    >
        {/* Bridge */}
        <rect x="14" y="11" width="4" height="4" fill="black" />
        <rect x="14" y="12" width="4" height="2" fill={color} />

        {/* Left Frame Outline */}
        <rect x="4" y="7" width="11" height="11" fill="black" />
        
        {/* Right Frame Outline */}
        <rect x="17" y="7" width="11" height="11" fill="black" />
        
        {/* The Arm (Temple) - Left Side */}
        <rect x="0" y="10" width="4" height="4" fill="black" />
        <rect x="0" y="10" width="2" height="8" fill="black" />
        <rect x="1" y="11" width="3" height="2" fill={color} />
        <rect x="1" y="11" width="1" height="6" fill={color} />

        {/* LENSES */}
        <rect x="5" y="8" width="9" height="9" fill={color} />
        <rect x="18" y="8" width="9" height="9" fill={color} />

        {/* PUPILS (Centered and larger for visibility) */}
        <rect x="7" y="10" width="5" height="5" fill="black" />
        <rect x="7" y="10" width="2" height="2" fill="white" /> 

        <rect x="20" y="10" width="5" height="5" fill="black" />
        <rect x="20" y="10" width="2" height="2" fill="white" />
    </svg>
  );
};
