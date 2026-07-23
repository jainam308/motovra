import React from 'react';
import { motion } from 'framer-motion';

interface WheelSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export const WheelSpinner: React.FC<WheelSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${currentSizeClass} flex items-center justify-center`}>
        {/* Glow ambient circle */}
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md animate-pulse" />

        {/* Outer Wheel Tire & Rim */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-full h-full relative"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            {/* Outer Tire Tread */}
            <circle cx="50" cy="50" r="46" fill="#090a0f" stroke="#27272a" strokeWidth="6" />
            
            {/* Inner Metallic Alloy Rim Edge */}
            <circle cx="50" cy="50" r="39" stroke="#e5a910" strokeWidth="3" fill="none" strokeDasharray="6 3" />
            
            {/* 5-Spoke Supercar Alloy Wheel */}
            {/* Spoke 1 (Top) */}
            <path d="M50 50 L50 14" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            {/* Spoke 2 (Top Right) */}
            <path d="M50 50 L84 25" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            {/* Spoke 3 (Bottom Right) */}
            <path d="M50 50 L71 80" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            {/* Spoke 4 (Bottom Left) */}
            <path d="M50 50 L29 80" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            {/* Spoke 5 (Top Left) */}
            <path d="M50 50 L16 25" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />

            {/* Inner Hub Cap with Motovra Gold Badge */}
            <circle cx="50" cy="50" r="12" fill="#000000" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="50" cy="50" r="6" fill="#f59e0b" />
          </svg>
        </motion.div>
      </div>

      {label && (
        <span className="mt-3 text-xs font-bold uppercase tracking-widest text-amber-400 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};
