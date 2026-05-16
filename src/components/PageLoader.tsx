// @ts-nocheck
"use client";
import React from 'react';
import config from '../brand/config';

export default function PageLoader() {
  const brandText = `${config.brand} • ${config.brand} • ${config.brand} • `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-md transition-all duration-500">
      <div className="relative flex items-center justify-center">
        {/* Rotating Text Ring */}
        <div className="animate-spin" style={{ animationDuration: '3s' }}>
          <svg className="w-32 h-32 md:w-40 md:h-40 text-[var(--primary)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
            <text className="text-[12px] font-bold tracking-[0.2em] uppercase" fill="currentColor">
              <textPath href="#circlePath" startOffset="0%">
                {brandText}
              </textPath>
            </text>
          </svg>
        </div>
        {/* Center Pulse Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--secondary)] rounded-full animate-pulse blur-[2px] opacity-80"></div>
        </div>
      </div>
    </div>
  );
}
