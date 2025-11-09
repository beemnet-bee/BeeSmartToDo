import React from 'react';
import Logo from './Logo';

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
           @keyframes pulse-glow {
            0%, 100% {
              filter: drop-shadow(0 0 5px rgba(163, 230, 53, 0.4));
            }
            50% {
              filter: drop-shadow(0 0 20px rgba(163, 230, 53, 0.8));
            }
          }
          .animate-pulse-glow {
              animation: pulse-glow 2s ease-in-out infinite;
          }
        `}
      </style>
      <div className="text-center animate-popIn">
        <div className="animate-pulse-glow">
          <Logo size="large" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;