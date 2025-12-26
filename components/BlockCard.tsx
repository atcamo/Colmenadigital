import React from 'react';

interface BlockCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'red' | 'yellow';
}

export const BlockCard: React.FC<BlockCardProps> = ({ children, className = "", variant = 'white' }) => {
  const bgClasses = {
    white: 'bg-white',
    red: 'bg-nounRed text-white',
    yellow: 'bg-nounYellow border-white', // Special case usually
  };

  return (
    <div className={`
      border-4 border-black 
      shadow-hard 
      p-6 
      transition-transform duration-200 
      hover:-translate-y-1 hover:shadow-hard-xl
      ${bgClasses[variant]} 
      ${className}
    `}>
      {children}
    </div>
  );
};