import React from 'react';

interface WorldoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightMode?: boolean; // When true, text is white for dark backgrounds (Footer, Admin, Dark Modals)
  tagline?: string;
  className?: string;
}

export const WorldoraLogo: React.FC<WorldoraLogoProps> = ({
  size = 'md',
  showText = true,
  lightMode = false,
  tagline = 'Marketplace B2B',
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  }[size];

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Vector SVG Brand Emblem */}
      <div className={`${iconDimensions} shrink-0 relative transition-transform duration-200 group-hover:scale-105`}>
        <svg
          viewBox="0 0 128 128"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#020617" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="logoBronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="logoOrbitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Rounded Squircle Container */}
          <rect
            x="6"
            y="6"
            width="116"
            height="116"
            rx="28"
            fill="url(#logoBgGrad)"
            stroke={lightMode ? '#475569' : '#334155'}
            strokeWidth="2.5"
          />

          {/* Globe Latitude & Meridian Grid */}
          <ellipse cx="64" cy="64" rx="46" ry="46" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.22" />
          <ellipse cx="64" cy="64" rx="46" ry="22" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.18" />
          <ellipse cx="64" cy="64" rx="22" ry="46" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.18" />
          <line x1="18" y1="64" x2="110" y2="64" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.18" />

          {/* Golden Orbital Trade Path */}
          <path
            d="M 22 76 C 28 36, 100 24, 106 52 C 108 58, 104 68, 92 78"
            stroke="url(#logoOrbitGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="3 1.5"
            opacity="0.95"
          />

          {/* Orbital Satellites / Trade Hubs */}
          <circle cx="104" cy="50" r="3.5" fill="#fef08a" />
          <circle cx="28" cy="72" r="2.2" fill="#38bdf8" />
          <circle cx="64" cy="30" r="2.5" fill="#f59e0b" />

          {/* High-Precision "W" Monogram (Golden Wings) */}
          <polygon points="26,38 37,38 50,86 40,86" fill="url(#logoGoldGrad)" />
          <polygon points="40,86 50,86 64,52 57,48" fill="url(#logoBronzeGrad)" />
          <polygon points="64,52 71,48 78,86 68,86" fill="url(#logoGoldGrad)" />
          <polygon points="78,86 88,86 102,38 91,38" fill="url(#logoGoldGrad)" />

          {/* Apex Core Node */}
          <polygon points="64,46 69,54 64,62 59,54" fill="#fef08a" />

          {/* Sparkle Accent */}
          <path d="M 98 26 Q 98 32 104 32 Q 98 32 98 38 Q 98 32 92 32 Q 98 32 98 26 Z" fill="#fef08a" opacity="0.9" />
        </svg>
      </div>

      {/* Brand Wordmark & Tagline */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight font-sans ${titleSizes} ${
                lightMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              WORLD<span className="text-amber-500">ORA</span>
            </span>
          </div>
          {tagline && (
            <span
              className={`uppercase font-bold tracking-wider mt-0.5 ${taglineSizes} ${
                lightMode ? 'text-amber-400/90' : 'text-slate-500'
              }`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
