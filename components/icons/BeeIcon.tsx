import React from 'react';

export const BeeIcon: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <style>{`
            .bee-body { fill: #A3E635; /* lime-400 */ }
            .bee-stripe { fill: #0a0a0f; /* new bg color */ }
            .bee-wing { fill: #E5E7EB; /* gray-200 */ opacity: 0.8; }
            .wing-left { animation: flap-left 0.2s infinite alternate; transform-origin: 50px 35px; }
            .wing-right { animation: flap-right 0.2s infinite alternate; transform-origin: 50px 35px; }
            @keyframes flap-left { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }
            @keyframes flap-right { from { transform: rotate(15deg); } to { transform: rotate(-15deg); } }
        `}</style>
        <g className="wing-left">
            <path className="bee-wing" d="M 50 35 C 20 10, 20 60, 50 35 Z" />
        </g>
        <g className="wing-right">
            <path className="bee-wing" d="M 50 35 C 80 10, 80 60, 50 35 Z" />
        </g>
        <ellipse className="bee-body" cx="50" cy="60" rx="25" ry="20" />
        <path className="bee-stripe" d="M 50 45 C 65 45, 65 75, 50 75 S 35 75, 35 45" transform="scale(0.8, 1) translate(12.5, 0)" />
        <path className="bee-stripe" d="M 50 45 C 65 45, 65 75, 50 75 S 35 75, 35 45" transform="scale(0.6, 1) translate(33.3, 0)" />
        <circle fill="#0a0a0f" cx="40" cy="50" r="2" />
        <circle fill="#0a0a0f" cx="60" cy="50" r="2" />
    </svg>
);