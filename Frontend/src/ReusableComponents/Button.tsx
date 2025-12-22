import React, { useState, useEffect, useRef } from "react";

interface ButtonProps {
  name: string;
  routeId?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  pill?: boolean;
  withShadow?: boolean;
  withRipple?: boolean;
  ariaLabel?: string;
}

// Define proper props for icon elements
interface IconProps {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
  [key: string]: any;
}

type IconElement = React.ReactElement<IconProps>;

const Button: React.FC<ButtonProps> = ({
  name,
  routeId,
  className = "",
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  type = "button",
  pill = false,
  withShadow = true,
  withRipple = true,
  ariaLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

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

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5
    font-medium xs:font-semibold
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
    active:scale-[0.98]
    disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
    disabled:active:scale-100 disabled:hover:scale-100
    relative overflow-hidden
    touch-manipulation
    select-none
    border
    ${fullWidth ? "w-full" : "w-auto"}
    min-h-[44px] xs:min-h-[44px] sm:min-h-[46px] lg:min-h-[48px]
    ${pill ? "rounded-full" : "rounded-lg xs:rounded-xl sm:rounded-2xl"}
    ${withShadow ? "shadow-sm hover:shadow-md active:shadow-sm" : "shadow-none"}
    group
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600
      active:from-red-800 active:to-red-700
      text-white
      border-transparent
      focus:ring-red-500
      dark:from-red-700 dark:to-red-600 dark:hover:from-red-800 dark:hover:to-red-700
    `,
    secondary: `
      bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700
      active:from-gray-900 active:to-gray-800
      text-white
      border-transparent
      focus:ring-gray-600
      dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800
    `,
    outline: `
      border border-gray-300 dark:border-gray-600
      text-gray-700 dark:text-gray-300
      bg-transparent dark:bg-transparent
      hover:border-red-400 hover:bg-red-50 hover:text-red-600
      active:border-red-500 active:bg-red-100
      focus:ring-red-400
      dark:hover:border-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400
      dark:active:border-red-600 dark:active:bg-red-900/30
    `,
    ghost: `
      border border-transparent
      text-gray-600 dark:text-gray-400
      bg-transparent dark:bg-transparent
      hover:bg-gray-100 hover:text-gray-900
      active:bg-gray-200 active:text-gray-900
      focus:ring-gray-400
      dark:hover:bg-gray-800 dark:hover:text-gray-300
      dark:active:bg-gray-700 dark:active:text-gray-200
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600
      active:from-red-700 active:to-rose-700
      text-white
      border-transparent
      focus:ring-red-500
      dark:from-rose-600 dark:to-red-600 dark:hover:from-rose-700 dark:hover:to-red-700
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
      active:from-green-700 active:to-emerald-700
      text-white
      border-transparent
      focus:ring-green-500
      dark:from-emerald-600 dark:to-green-600 dark:hover:from-emerald-700 dark:hover:to-green-700
    `,
  };

  // Size styles with responsive scaling
  const sizeStyles = {
    xs: "px-2.5 xs:px-3 py-1.5 text-xs xs:text-xs sm:text-sm",
    sm: "px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm sm:text-sm",
    md: "px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5 text-sm xs:text-base sm:text-base",
    lg: "px-5 xs:px-6 sm:px-8 py-3 xs:py-4 sm:py-5 text-base xs:text-lg sm:text-lg",
    xl: "px-6 xs:px-8 sm:px-10 py-3.5 xs:py-5 sm:py-6 text-lg xs:text-xl sm:text-xl",
  };

  // Icon size based on button size
  const iconSizes = {
    xs: "w-3 h-3 xs:w-3.5 xs:h-3.5",
    sm: "w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4",
    md: "w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5",
    lg: "w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6",
    xl: "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8",
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
      <div className={`${iconSizes[size]} border-2 border-white/30 border-t-white rounded-full animate-spin`}></div>
    </div>
  );

  // Enhanced ripple effect handler
  const handleRipple = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled || loading || !withRipple || isTouchDevice) return;
    
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    
    const sizeVal = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - sizeVal / 2;
    const y = event.clientY - rect.top - sizeVal / 2;
    
    ripple.style.width = ripple.style.height = `${sizeVal}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "absolute bg-white/40 dark:bg-white/20 rounded-full animate-ripple pointer-events-none";
    
    // Remove existing ripples
    const existingRipples = button.querySelectorAll('.animate-ripple');
    existingRipples.forEach(existingRipple => existingRipple.remove());
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode === button) {
        ripple.remove();
      }
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    if (withRipple && !isTouchDevice) {
      handleRipple(event);
    }
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) {
      onClick(event);
    }
    
    // Smooth scroll for internal links
    if (routeId && routeId.startsWith("#")) {
      event.preventDefault();
      const targetId = routeId.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  // Helper function to clone icon with className
  const renderIcon = (iconNode: React.ReactNode, position: "left" | "right") => {
    if (!iconNode) return null;
    
    const spacingClass = position === 'left' ? 'mr-0.5' : 'ml-0.5';
    const iconSizeClass = iconSizes[size];
    
    if (React.isValidElement(iconNode)) {
      const iconElement = iconNode as IconElement;
      const existingProps = iconElement.props || {};
      const existingClassName = existingProps.className || "";
      const iconClassName = `${existingClassName} ${iconSizeClass} ${spacingClass}`.trim();
      
      // Create new props object preserving all existing props
      const newProps: IconProps = {
        ...existingProps,
        className: iconClassName,
      };
      
      // Add aria-hidden if not already present (for decorative icons)
      if (newProps['aria-hidden'] === undefined) {
        newProps['aria-hidden'] = 'true';
      }
      
      return React.cloneElement(iconElement, newProps);
    }
    
    // For non-element icons (string, number, etc.)
    return (
      <span 
        className={`${iconSizeClass} ${spacingClass}`}
        aria-hidden="true"
      >
        {iconNode}
      </span>
    );
  };

  const buttonContent = (
    <>
      {loading && <LoadingSpinner />}
      
      <span className={`inline-flex items-center gap-1.5 xs:gap-2 transition-all duration-200 ${
        loading ? "opacity-0" : "opacity-100"
      }`}>
        {icon && iconPosition === "left" && renderIcon(icon, "left")}
        
        <span className="whitespace-nowrap truncate max-w-full px-0.5">
          {name}
        </span>
        
        {icon && iconPosition === "right" && renderIcon(icon, "right")}
      </span>

      {/* Hover indicator for non-touch devices */}
      {!isTouchDevice && (variant === "primary" || variant === "secondary" || variant === "success" || variant === "danger") && !icon && (
        <span 
          className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 xs:group-hover:translate-x-1 transition-all duration-300 text-base xs:text-lg"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </>
  );

  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${isPressed && !isTouchDevice ? 'scale-[0.98]' : ''}
    ${isHovered && !isTouchDevice ? 'scale-[1.02]' : ''}
    ${className}
  `.replace(/\s+/g, " ").trim();

  // Add CSS for animations and responsive styles
  useEffect(() => {
    const styleId = 'button-responsive-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 600ms linear;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 0.6s linear infinite;
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .group:hover {
            transform: none !important;
          }
          .hover\\:scale-\\[1\\.02\\]:hover,
          .group-hover\\:scale-\\[1\\.02\\]:hover {
            transform: none !important;
          }
          .active\\:scale-\\[0\\.98\\]:active {
            transform: scale(0.98) !important;
          }
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .animate-ripple,
          .animate-spin,
          .group-hover\\:translate-x-1 {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
          .active\\:scale-\\[0\\.98\\] {
            transform: none !important;
          }
        }
        
        /* High DPI screens optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .button-gradient {
            background-image: linear-gradient(to right, var(--tw-gradient-stops));
          }
        }
        
        /* Very small screens (below 320px) */
        @media (max-width: 319px) {
          .button-xs-optimized {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }
        }
        
        /* Large screens optimization */
        @media (min-width: 1920px) {
          .button-xxl-optimized {
            padding: 1rem 2.5rem;
            font-size: 1.125rem;
          }
        }
        
        /* Landscape mode optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          .button-landscape {
            min-height: 40px !important;
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
        }
        
        /* Dark mode specific optimizations */
        @media (prefers-color-scheme: dark) {
          .button-outline-dark {
            border-color: #4b5563;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .button-high-contrast {
            border-width: 2px !important;
          }
        }
        
        /* Reduced data mode */
        @media (prefers-reduced-data: reduce) {
          .button-gradient {
            background: #ef4444 !important;
          }
        }
        
        /* Print styles */
        @media print {
          .button-print {
            background: none !important;
            color: black !important;
            border: 1px solid black !important;
            box-shadow: none !important;
          }
        }
        
        /* Focus visible for better accessibility */
        .focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .button-ios {
            -webkit-tap-highlight-color: transparent;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const styleElement = document.getElementById(styleId);
      const buttons = document.querySelectorAll('[data-button-component]');
      if (styleElement && buttons.length <= 1) {
        styleElement.remove();
      }
    };
  }, []);

  // Handle touch and hover states
  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => setTimeout(() => setIsPressed(false), 150);
  const handleMouseEnter = () => !isTouchDevice && setIsHovered(true);
  const handleMouseLeave = () => !isTouchDevice && setIsHovered(false);

  // If routeId is provided and it's an external link, render as anchor
  if (routeId && !routeId.startsWith("#")) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={disabled ? undefined : routeId}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClasses} ${disabled ? 'pointer-events-none' : ''}`}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          if (disabled || loading) {
            e.preventDefault();
            return;
          }
          if (withRipple && !isTouchDevice) {
            handleRipple(e);
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-disabled={disabled || loading}
        tabIndex={disabled || loading ? -1 : 0}
        aria-label={ariaLabel || name}
        data-button-component="true"
      >
        {buttonContent}
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled || loading}
      aria-label={ariaLabel || name}
      aria-busy={loading}
      tabIndex={disabled || loading ? -1 : 0}
      data-button-component="true"
    >
      {buttonContent}
    </button>
  );
};

export default Button;