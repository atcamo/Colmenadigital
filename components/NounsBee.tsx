import React, { useState, useEffect, useRef } from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties; // Allow style injection for smooth animations
}

export const NounsBee: React.FC<Props> = ({ className = "w-64 h-auto", style }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBuzzing, setIsBuzzing] = useState(false);
  const beeRef = useRef<SVGSVGElement>(null);

  // Mouse Tracking Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!beeRef.current) return;
      
      const { innerWidth, innerHeight } = window;
      // Calculate percentage from center (-1 to 1)
      const xPct = (e.clientX / innerWidth) - 0.5;
      const yPct = (e.clientY / innerHeight) - 0.5;

      // Body rotation
      setRotation({
        x: xPct * 20, 
        y: yPct * -20
      });

      // Pupil movement (subtle)
      setPupilOffset({
        x: xPct * 3, // Increased movement slightly 
        y: yPct * 3
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = () => {
    setIsBuzzing(true);
    // Stop buzzing after animation
    setTimeout(() => setIsBuzzing(false), 800);
  };

  return (
    <svg 
      ref={beeRef}
      viewBox="0 0 32 32" 
      className={`${className} transition-transform duration-100 ease-out cursor-pointer hover:scale-110 ${isBuzzing ? 'animate-spin' : ''}`}
      style={{
        ...style,
        transform: isBuzzing 
          ? `translate(${Math.random()*4}px, ${Math.random()*4}px)` 
          : `${style?.transform || ''} perspective(500px) rotateY(${rotation.x}deg) rotateX(${rotation.y}deg)`,
      }}
      onClick={handleClick}
      xmlns="http://www.w3.org/2000/svg" 
      shapeRendering="crispEdges"
    >
      <title>Click me to buzz!</title>
      
      {/* Wings Group */}
      <g className={isBuzzing ? "animate-pulse" : "animate-wing-left"}>
        <path d="M2 8h10v6H2z" fill="#D6EFFF" />
        <path d="M2 8h1v6H2z M3 8h9v1H3z M11 9h1v5h-1z M3 13h8v1H3z" fill="black" />
      </g>

      <g className={isBuzzing ? "animate-pulse" : "animate-wing-right"}>
        <path d="M20 8h10v6H20z" fill="#D6EFFF" />
        <path d="M29 8h1v6h-1z M20 8h9v1H20z M20 9h1v5h-1z M21 13h8v1H21z" fill="black" />
      </g>

      {/* Stinger */}
      <rect x="15" y="27" width="2" height="2" fill="black" />
      <rect x="16" y="29" width="1" height="1" fill="black" />

      {/* Body Main (Yellow) */}
      <rect x="8" y="12" width="16" height="15" fill="#FFCC00" />
      
      {/* Body Stripes (Black) */}
      <rect x="8" y="19" width="16" height="2" fill="black" />
      <rect x="8" y="24" width="16" height="1" fill="black" />

      {/* Body Outline */}
      <path d="M8 12h16v1H8z M8 26h16v1H8z M7 12h1v15H7z M24 12h1v15h-1z" fill="black" />

      {/* Feet */}
      <rect x="10" y="27" width="2" height="2" fill="black" />
      <rect x="20" y="27" width="2" height="2" fill="black" />

      {/* Antennae */}
      <rect x="11" y="8" width="1" height="4" fill="black" />
      <rect x="20" y="8" width="1" height="4" fill="black" />
      <rect x="10" y="7" width="3" height="1" fill="black" />
      <rect x="19" y="7" width="3" height="1" fill="black" />

      {/* 
        NEW RED GLASSES (NOGGLES)
        Based on user's red square model with side arm
      */}
      <g transform="translate(0, 0)"> 
        
        {/* Black Outlines / Structure */}
        
        {/* Left Frame Outline */}
        <rect x="5" y="10" width="9" height="9" fill="black" />
        
        {/* Right Frame Outline */}
        <rect x="16" y="10" width="9" height="9" fill="black" />
        
        {/* Bridge */}
        <rect x="14" y="13" width="2" height="3" fill="black" />
        <rect x="14" y="14" width="2" height="1" fill="#E63433" /> {/* Red Bridge fill */}

        {/* The Arm (Temple) - Left Side */}
        {/* Horizontal part going left */}
        <rect x="1" y="13" width="4" height="3" fill="black" />
        {/* Vertical drop at the end */}
        <rect x="1" y="13" width="2" height="7" fill="black" />
        {/* Red fill for arm */}
        <rect x="2" y="14" width="3" height="1" fill="#E63433" />
        <rect x="2" y="14" width="1" height="5" fill="#E63433" />

        {/* LENSES (Red) */}
        {/* Left Lens */}
        <rect x="6" y="11" width="7" height="7" fill="#E63433" />
        {/* Right Lens */}
        <rect x="17" y="11" width="7" height="7" fill="#E63433" />

        {/* PUPILS (Black & White) with tracking */}
        <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }}>
          
          {/* 
             NEW EYES: Friendlier, larger black area (5x5 instead of 3x3)
          */}

          {/* Left Pupil */}
          {/* Black part */}
          <rect x="7" y="12" width="5" height="5" fill="black" />
          {/* Glint (White) */}
          <rect x="8" y="12" width="2" height="2" fill="white" /> 

          {/* Right Pupil */}
          {/* Black part */}
          <rect x="18" y="12" width="5" height="5" fill="black" />
          {/* Glint (White) */}
          <rect x="19" y="12" width="2" height="2" fill="white" /> 

        </g>
      </g>

    </svg>
  );
};