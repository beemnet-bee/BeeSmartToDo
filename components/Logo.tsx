import React from 'react';
import { BeeIcon } from './icons/BeeIcon';

interface LogoProps {
  size?: 'normal' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'normal' }) => {
  const isLarge = size === 'large';
  return (
    <div className="flex items-center gap-3">
      <div className={isLarge ? 'w-24 h-24' : 'w-12 h-12'}>
        <BeeIcon />
      </div>
      <div>
        <h1 className={`font-extrabold tracking-tight bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent ${isLarge ? 'text-4xl' : 'text-3xl'}`}>
          Bee Smart To-Do
        </h1>
        {isLarge && (
            <p className="text-slate-400 mt-1 text-lg">Your hive of productivity</p>
        )}
      </div>
    </div>
  );
};

export default Logo;