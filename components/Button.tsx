import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "border-4 border-black font-bold py-4 px-8 text-xl focus:outline-none transition-all active:translate-y-1 active:shadow-none";
  const variants = {
    primary: "bg-nounRed text-white shadow-hard hover:bg-red-600",
    secondary: "bg-white text-black shadow-hard hover:bg-gray-100",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};