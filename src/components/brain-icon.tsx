'use client'

import { useState } from 'react'

interface BrainIconProps {
  isProcessing?: boolean
  size?: number
}

export function BrainIcon({ isProcessing = false, size = 64 }: BrainIconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {/* Head shape - grey circle */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="drop-shadow-lg"
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="#6B7280"
          stroke="#4B5563"
          strokeWidth="2"
        />
      </svg>

      {/* Brain processing strands */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Top brain waves */}
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-400 rounded-full opacity-60 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '0s', animationDuration: '2s' }} />
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-green-400 rounded-full opacity-50 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
          <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-400 rounded-full opacity-40 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '1s', animationDuration: '3s' }} />

          {/* Left side processing */}
          <div className={`absolute top-1/2 left-4 transform -translate-y-1/2 w-6 h-1 bg-yellow-400 rounded-full opacity-50 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '0.2s', animationDuration: '2.2s' }} />
          <div className={`absolute top-1/2 left-6 transform -translate-y-1/2 w-4 h-1 bg-red-400 rounded-full opacity-40 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '0.7s', animationDuration: '2.8s' }} />

          {/* Right side processing */}
          <div className={`absolute top-1/2 right-4 transform -translate-y-1/2 w-6 h-1 bg-cyan-400 rounded-full opacity-50 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '0.3s', animationDuration: '2.3s' }} />
          <div className={`absolute top-1/2 right-6 transform -translate-y-1/2 w-4 h-1 bg-pink-400 rounded-full opacity-40 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '0.8s', animationDuration: '2.9s' }} />

          {/* Bottom brain waves */}
          <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-indigo-400 rounded-full opacity-55 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '0.4s', animationDuration: '2.4s' }} />
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-orange-400 rounded-full opacity-45 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '0.9s', animationDuration: '2.7s' }} />
          <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-teal-400 rounded-full opacity-35 ${isProcessing ? 'animate-pulse' : ''}`}
               style={{ animationDelay: '1.2s', animationDuration: '3.2s' }} />

          {/* Central processing core */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full ${isProcessing ? 'animate-ping' : 'opacity-30'}`}
               style={{ animationDelay: '0s', animationDuration: '1.5s' }} />
        </div>
      </div>
    </div>
  )
}