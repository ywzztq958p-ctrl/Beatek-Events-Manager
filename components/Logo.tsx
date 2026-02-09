import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    // FIX: Removed invalid quoted class name "text-fuchsia".
    <div className={`font-bold tracking-widest leading-none select-none ${sizeClasses[size]}`}>
      <div className="flex flex-col">
        <span className="text-fuchsia-500">BEA—</span>
        <div className="flex items-center gap-1 ml-auto">
          <span className="bg-fuchsia-500 h-[2px] w-6 block md:w-12"></span>
          <span className="text-fuchsia-500">TEK</span>
        </div>
      </div>
      <div className={`mt-1 text-center font-normal tracking-[0.3em] text-zinc-500 ${size === 'sm' ? 'text-[0.5rem]' : 'text-xs'}`}>
        EVENTS
      </div>
    </div>
  );
};