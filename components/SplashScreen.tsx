import React from 'react';
import { BeeIcon } from './icons/BeeIcon';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-50 animate-fadeOut">
      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
          }
          .animate-fadeOut {
            animation: fadeOut 2.5s forwards;
          }
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-popIn {
            animation: popIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
          }
        `}
      </style>
      <div className="text-center animate-popIn">
        <div className="mx-auto mb-4 w-24 h-24">
         <BeeIcon />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent pb-2">
          Bee Smart To-Do
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Your hive of productivity</p>
      </div>
    </div>
  );
};

export default SplashScreen;