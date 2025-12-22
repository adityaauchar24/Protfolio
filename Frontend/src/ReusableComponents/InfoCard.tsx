import React, { useState, useEffect } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import LaunchIcon from "@mui/icons-material/Launch";

interface InfoCardData {
  title: string;
  detail: string;
  icon?: React.ReactNode;
  link?: string;
}

interface InfoCardProps {
  data: InfoCardData;
  variant?: "default" | "gradient" | "filled" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  clickable?: boolean;
  showCopyButton?: boolean;
  className?: string;
  onCopy?: (text: string) => void;
  onClick?: (data: InfoCardData) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  data, 
  variant = "default",
  size = "md",
  clickable = false,
  showCopyButton = false,
  className = "",
  onCopy,
  onClick
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      const touchDevice = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;
      setIsTouchDevice(touchDevice);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Handle copy to clipboard
  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(data.detail);
      setIsCopied(true);
      
      if (onCopy) {
        onCopy(data.detail);
      }
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = data.detail;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle click for clickable cards
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(data);
    }

    if (data.link) {
      if (data.link.startsWith('http')) {
        window.open(data.link, '_blank', 'noopener,noreferrer');
      } else if (data.link.startsWith('mailto:') || data.link.startsWith('tel:')) {
        window.location.href = data.link;
      }
    } else if (clickable && data.detail && !showCopyButton) {
      handleCopy(event);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((clickable || data.link) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick(event as unknown as React.MouseEvent);
    }
  };

  // Handle touch interactions
  const handleTouchStart = () => {
    if (clickable || data.link) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsPressed(false), 150);
  };

  // Variant styles
  const variantStyles = {
    default: `
      bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
      ${!isTouchDevice ? 'hover:border-red-300 dark:hover:border-red-400 hover:shadow-md' : ''}
    `,
    gradient: `
      bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700
      ${!isTouchDevice ? 'hover:border-red-200 dark:hover:border-red-300 hover:shadow-lg' : ''}
    `,
    filled: `
      bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800
      ${!isTouchDevice ? 'hover:border-red-200 dark:hover:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30' : ''}
    `,
    outline: `
      bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600
      ${!isTouchDevice ? 'hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : ''}
    `
  };

  // Size styles
  const sizeStyles = {
    xs: "p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl",
    sm: "p-3 xs:p-4 sm:p-5 rounded-lg xs:rounded-xl sm:rounded-2xl",
    md: "p-4 xs:p-5 sm:p-6 md:p-6 rounded-xl xs:rounded-2xl",
    lg: "p-5 xs:p-6 sm:p-7 md:p-8 rounded-xl xs:rounded-2xl sm:rounded-3xl",
    xl: "p-6 xs:p-7 sm:p-8 md:p-10 rounded-2xl xs:rounded-3xl"
  };

  // Icon size based on card size
  const iconSizes = {
    xs: "text-xs xs:text-sm sm:text-base p-1 xs:p-1.5 rounded-md xs:rounded-lg",
    sm: "text-sm xs:text-base sm:text-lg p-1.5 xs:p-2 rounded-lg xs:rounded-xl",
    md: "text-base xs:text-lg sm:text-xl p-2 xs:p-2.5 rounded-lg xs:rounded-xl",
    lg: "text-lg xs:text-xl sm:text-2xl p-2.5 xs:p-3 rounded-xl xs:rounded-2xl",
    xl: "text-xl xs:text-2xl sm:text-3xl p-3 xs:p-4 rounded-xl xs:rounded-2xl"
  };

  // Title size based on card size
  const titleSizes = {
    xs: "text-xs xs:text-sm sm:text-sm",
    sm: "text-xs xs:text-sm sm:text-base",
    md: "text-sm xs:text-base sm:text-lg",
    lg: "text-base xs:text-lg sm:text-xl",
    xl: "text-lg xs:text-xl sm:text-2xl"
  };

  // Detail size based on card size
  const detailSizes = {
    xs: "text-xs xs:text-xs sm:text-sm",
    sm: "text-xs xs:text-sm sm:text-sm",
    md: "text-sm xs:text-base sm:text-base",
    lg: "text-base xs:text-lg sm:text-lg",
    xl: "text-lg xs:text-xl sm:text-xl"
  };

  // Copy button size based on card size
  const copyButtonSizes = {
    xs: "w-6 h-6 xs:w-7 xs:h-7",
    sm: "w-7 h-7 xs:w-8 xs:h-8",
    md: "w-8 h-8 xs:w-9 xs:h-9",
    lg: "w-9 h-9 xs:w-10 xs:h-10",
    xl: "w-10 h-10 xs:w-11 xs:h-11"
  };

  const cardClasses = `
    group
    relative
    border-2
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 xs:focus:ring-3 focus:ring-red-500/50 focus:ring-offset-2
    backdrop-blur-sm
    touch-manipulation
    select-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${(clickable || data.link) ? 'cursor-pointer' : ''}
    ${(clickable || data.link) && !isTouchDevice ? 'hover:scale-[1.02] lg:hover:scale-[1.03]' : ''}
    ${(clickable || data.link) ? 'active:scale-[0.98]' : ''}
    ${isPressed ? 'scale-[0.98]' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role={(clickable || data.link) ? "button" : "article"}
      tabIndex={(clickable || data.link) ? 0 : -1}
      aria-label={data.title}
      data-info-card="true"
    >
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className={`
            ${iconSizes[size]}
            bg-gradient-to-r from-red-600 to-red-500 dark:from-red-700 dark:to-red-600
            text-white
            shadow-lg
            transition-transform duration-300
            ${!isTouchDevice ? 'group-hover:scale-110' : ''}
            shrink-0
            flex items-center justify-center
          `}>
            {data?.icon && (
              <span className="leading-none">
                {data.icon}
              </span>
            )}
          </div>
          <h3 className={`
            font-semibold xs:font-bold
            bg-gradient-to-r from-red-700 to-red-500 dark:from-red-500 dark:to-red-400 bg-clip-text text-transparent
            ${titleSizes[size]}
            truncate
            min-w-0
            pr-1
          `}>
            {data.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className={`flex items-center gap-0.5 xs:gap-1 transition-opacity duration-300 shrink-0 ml-1 xs:ml-2 ${
          !isTouchDevice ? 'opacity-0 group-hover:opacity-100 group-focus:opacity-100' : 'opacity-70'
        }`}>
          {/* Copy button */}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={`
                ${copyButtonSizes[size]}
                rounded-lg xs:rounded-xl
                text-gray-400 hover:text-red-600 dark:hover:text-red-400 
                hover:bg-red-50 dark:hover:bg-red-900/30 
                transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-red-500/50
                flex items-center justify-center
                touch-manipulation
              `}
              title="Copy to clipboard"
              aria-label="Copy to clipboard"
              type="button"
            >
              {isCopied ? 
                <CheckIcon className="text-green-500 dark:text-green-400" fontSize="inherit" /> : 
                <ContentCopyIcon fontSize="inherit" />
              }
            </button>
          )}

          {/* External link indicator */}
          {data?.link && data.link.startsWith('http') && (
            <div className={`
              ${copyButtonSizes[size]}
              flex items-center justify-center
              text-gray-400 dark:text-gray-500
              shrink-0
            `}>
              <LaunchIcon fontSize="inherit" />
            </div>
          )}
        </div>
      </div>

      {/* Detail content */}
      <div className={`
        font-medium text-gray-700 dark:text-gray-300
        transition-colors duration-300
        ${!isTouchDevice ? 'group-hover:text-gray-900 dark:group-hover:text-gray-100' : ''}
        ${detailSizes[size]}
        wrap-break-word
        overflow-hidden
        line-clamp-1 xs:line-clamp-2 sm:line-clamp-3
        leading-relaxed
      `}>
        {data.detail}
      </div>

      {/* Hover effect border */}
      {!isTouchDevice && (
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/20 group-focus:border-red-500/30 transition-all duration-300 pointer-events-none"></div>
      )}

      {/* Touch feedback overlay */}
      {(clickable || data.link) && isTouchDevice && (
        <div className="absolute inset-0 rounded-2xl bg-red-500/0 active:bg-red-500/10 transition-colors duration-150 pointer-events-none"></div>
      )}

      {/* Success feedback */}
      {isCopied && (
        <div className="absolute top-1 xs:top-2 sm:top-3 right-1 xs:right-2 sm:right-3 px-2 py-0.5 xs:px-2.5 xs:py-1 bg-green-500 text-white text-[10px] xs:text-xs sm:text-sm rounded-full animate-pulse shadow-lg z-10">
          Copied!
        </div>
      )}

      {/* CSS Styles */}
      <style>
        {`
          /* Line clamp utilities */
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          /* Touch device optimizations */
          @media (hover: none) and (pointer: coarse) {
            .group-hover\\:scale-\\[1\\.02\\]:hover,
            .lg\\:group-hover\\:scale-\\[1\\.03\\]:hover,
            .group-hover\\:scale-110:hover {
              transform: none !important;
            }
            
            .group-hover\\:opacity-100:hover {
              opacity: 0.7 !important;
            }
            
            button, [role="button"] {
              min-height: 44px;
              min-width: 44px;
            }
          }
          
          /* Reduced motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .transition-all,
            .group-hover\\:scale-\\[1\\.02\\],
            .group-hover\\:scale-110,
            .animate-pulse {
              transition: none !important;
              animation: none !important;
              transform: none !important;
            }
            
            .active\\:scale-\\[0\\.98\\] {
              transform: none !important;
            }
          }
          
          /* High DPI optimization */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .backdrop-blur-sm {
              -webkit-backdrop-filter: blur(8px);
              backdrop-filter: blur(8px);
            }
          }
          
          /* Very small screens (below 320px) */
          @media (max-width: 319px) {
            [data-info-card] {
              padding: 0.75rem;
            }
            
            .text-xs {
              font-size: 0.625rem;
            }
          }
          
          /* Large screen optimization */
          @media (min-width: 1920px) {
            [data-info-card] {
              max-width: 28rem;
            }
          }
          
          /* Landscape mode optimization */
          @media (max-height: 500px) and (orientation: landscape) {
            [data-info-card] {
              min-height: auto;
              padding: 0.75rem 1rem;
            }
            
            .line-clamp-3 {
              -webkit-line-clamp: 2;
            }
          }
          
          /* Print styles */
          @media print {
            [data-info-card] {
              break-inside: avoid;
              border: 1px solid #ddd !important;
              box-shadow: none !important;
              background: white !important;
              color: black !important;
            }
            
            .backdrop-blur-sm {
              backdrop-filter: none !important;
            }
            
            .group-hover\\:scale-\\[1\\.02\\],
            .group-hover\\:scale-110,
            .transition-all {
              transform: none !important;
              transition: none !important;
            }
          }
          
          /* Dark mode specific fixes */
          @media (prefers-color-scheme: dark) {
            .bg-gradient-to-br {
              background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
            }
          }
          
          /* High contrast mode */
          @media (prefers-contrast: high) {
            [data-info-card] {
              border-width: 2px;
            }
            
            button {
              border: 1px solid currentColor;
            }
          }
          
          /* Reduced data mode */
          @media (prefers-reduced-data: reduce) {
            .backdrop-blur-sm {
              backdrop-filter: none;
            }
            
            .bg-gradient-to-br {
              background: #f9fafb;
            }
          }
          
          /* iOS Safari fixes */
          @supports (-webkit-touch-callout: none) {
            .touch-manipulation {
              -webkit-tap-highlight-color: transparent;
            }
          }
          
          /* Windows scrollbar styling */
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
          }
          
          /* Webkit scrollbar styling */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
          }
          
          @media (prefers-color-scheme: dark) {
            ::-webkit-scrollbar-thumb {
              background-color: rgba(255, 255, 255, 0.1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default InfoCard;