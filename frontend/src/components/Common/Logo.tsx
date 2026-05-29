import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        className={`${sizes[size]} w-auto`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bank building icon */}
        <rect x="40" y="80" width="120" height="100" fill="#1E40AF" rx="4" />
        <rect x="50" y="90" width="20" height="30" fill="white" />
        <rect x="80" y="90" width="20" height="30" fill="white" />
        <rect x="110" y="90" width="20" height="30" fill="white" />
        <rect x="140" y="90" width="20" height="30" fill="white" />
        <rect x="50" y="130" width="20" height="30" fill="white" />
        <rect x="80" y="130" width="20" height="30" fill="white" />
        <rect x="110" y="130" width="20" height="30" fill="white" />
        <rect x="140" y="130" width="20" height="30" fill="white" />
        
        {/* Roof/Triangle */}
        <path d="M100 40 L30 80 L170 80 Z" fill="#1E40AF" />
        
        {/* Door */}
        <rect x="85" y="150" width="30" height="30" fill="#3B82F6" rx="2" />
        
        {/* Base */}
        <rect x="30" y="180" width="140" height="10" fill="#1E40AF" />
      </svg>
      
      <div className="flex flex-col">
        <span className="text-primary-600 font-bold text-xl leading-tight">
          BankLopes
        </span>
        <span className="text-primary-500 font-semibold text-sm leading-tight">
          Next
        </span>
      </div>
    </div>
  );
};

export default Logo;

