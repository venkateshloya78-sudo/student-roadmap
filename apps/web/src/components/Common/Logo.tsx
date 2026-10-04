import React from 'react';
import { Link } from 'react-router-dom';

export interface LogoProps {
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Show the brand text next to the icon */
  showText?: boolean;
  /** Show the "Your Future, Our Guidance" tagline */
  showTagline?: boolean;
  /** Link destination (defaults to /dashboard, or / if not authenticated) */
  href?: string;
  /** Dark mode variant (white text for dark backgrounds) */
  variant?: 'light' | 'dark';
  /** Additional CSS class names */
  className?: string;
  /** If true, only render the SVG icon */
  iconOnly?: boolean;
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        {/* Top-Left Petal: Blue to Indigo Gradient */}
        <linearGradient id="cp-grad-tl" x1="6" y1="6" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Top-Right Petal: Teal to Emerald Gradient */}
        <linearGradient id="cp-grad-tr" x1="42" y1="6" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Bottom-Right Petal: Purple to Pink Gradient */}
        <linearGradient id="cp-grad-br" x1="42" y1="42" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Bottom-Left Petal: Cyan to Blue Gradient */}
        <linearGradient id="cp-grad-bl" x1="6" y1="42" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        {/* Center Glow */}
        <radialGradient id="cp-center-glow" cx="24" cy="24" r="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Top-Left Petal (Curved organic petal) */}
      <path
        d="M23 7 C14.5 7 8 13.5 8 22 C8 24.5 9 24.5 12 24.5 C18 24.5 23 19.5 23 13.5 Z"
        fill="url(#cp-grad-tl)"
        opacity="0.95"
      />

      {/* Top-Right Petal */}
      <path
        d="M41 23 C41 14.5 34.5 8 26 8 C23.5 8 23.5 9 23.5 12 C23.5 18 28.5 23 34.5 23 Z"
        fill="url(#cp-grad-tr)"
        opacity="0.95"
      />

      {/* Bottom-Right Petal */}
      <path
        d="M25 41 C33.5 41 40 34.5 40 26 C40 23.5 39 23.5 36 23.5 C30 23.5 25 28.5 25 34.5 Z"
        fill="url(#cp-grad-br)"
        opacity="0.95"
      />

      {/* Bottom-Left Petal */}
      <path
        d="M7 25 C7 33.5 13.5 40 22 40 C24.5 40 24.5 39 24.5 36 C24.5 30 19.5 25 13.5 25 Z"
        fill="url(#cp-grad-bl)"
        opacity="0.95"
      />

      {/* Modern Center Junction Spark */}
      <circle cx="24" cy="24" r="4.5" fill="#FFFFFF" fillOpacity="0.95" />
      <circle cx="24" cy="24" r="2.2" fill="#4F46E5" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  href,
  variant = 'light',
  className = '',
  iconOnly = false,
}) => {
  const iconSizes = {
    xs: 24,
    sm: 30,
    md: 36,
    lg: 44,
    xl: 52,
  };

  const titleSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const taglineSizes = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const iconPx = iconSizes[size];

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      <div className="relative flex items-center justify-center filter drop-shadow-sm">
        <LogoIcon size={iconPx} />
      </div>

      {showText && !iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center leading-none">
            <span
              className={`font-black tracking-tight ${titleSizes[size]} ${
                variant === 'dark' ? 'text-white' : 'text-slate-900'
              } transition-colors group-hover:text-indigo-600`}
            >
              Career
            </span>
            <span
              className={`font-black tracking-tight ${titleSizes[size]} text-indigo-600`}
            >
              Path
            </span>
          </div>

          {showTagline && (
            <span
              className={`font-medium tracking-tight mt-0.5 leading-none ${taglineSizes[size]} ${
                variant === 'dark' ? 'text-indigo-200/80' : 'text-slate-400'
              }`}
            >
              Your Future, Our Guidance
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="inline-block transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
