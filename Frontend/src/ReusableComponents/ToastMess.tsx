import React, { useEffect, useState, useCallback, useRef } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  mess: string;
}

interface ToastMessProps {
  message: ToastMessage;
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
  autoClose?: number | false;
  showCloseButton?: boolean;
  showIcon?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const ToastMess: React.FC<ToastMessProps> = ({ 
  message, 
  position = "top-right",
  autoClose = 5000,
  showCloseButton = true,
  showIcon = true,
  onClose,
  className = "",
  style
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | undefined>(undefined);
  const autoCloseTimeoutRef = useRef<number | undefined>(undefined);

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

  const handleClose = useCallback(() => {
    setIsExiting(true);
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    if (autoCloseTimeoutRef.current) {
      window.clearTimeout(autoCloseTimeoutRef.current);
    }
    
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // Enter animation with small delay
    const enterTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Setup progress bar
    if (autoClose !== false) {
      const totalTime = autoClose;
      const interval = 50; // Update every 50ms for smooth progress
      const decrement = (interval / totalTime) * 100;
      
      progressIntervalRef.current = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - decrement;
          if (newProgress <= 0) {
            if (progressIntervalRef.current) {
              window.clearInterval(progressIntervalRef.current);
            }
            return 0;
          }
          return newProgress;
        });
      }, interval);

      // Auto close timer
      autoCloseTimeoutRef.current = window.setTimeout(() => {
        handleClose();
      }, autoClose);
    }

    return () => {
      window.clearTimeout(enterTimer);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      if (autoCloseTimeoutRef.current) {
        window.clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, [autoClose, handleClose]);

  const handleToastClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('.toast-content')) {
      return;
    }
    handleClose();
  };

  // Toast type configurations with dark mode support
  const toastConfig = {
    success: {
      icon: <CheckCircleIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      iconColor: "text-green-500 dark:text-green-400"
    },
    error: {
      icon: <ErrorIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />,
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      iconColor: "text-red-500 dark:text-red-400"
    },
    warning: {
      icon: <WarningIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />,
      gradient: "from-yellow-500 to-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      iconColor: "text-yellow-500 dark:text-yellow-400"
    },
    info: {
      icon: <InfoIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      iconColor: "text-blue-500 dark:text-blue-400"
    }
  };

  const config = toastConfig[message.type] || toastConfig.info;

  // Position styles with responsive offsets
  const positionStyles = {
    "top-right": "top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4",
    "top-left": "top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4",
    "top-center": "top-2 xs:top-3 sm:top-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-2 xs:bottom-3 sm:bottom-4 right-2 xs:right-3 sm:right-4",
    "bottom-left": "bottom-2 xs:bottom-3 sm:bottom-4 left-2 xs:left-3 sm:left-4",
    "bottom-center": "bottom-2 xs:bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2"
  };

  // Responsive width
  const responsiveWidth = "w-[calc(100vw-1rem)] xs:w-auto xs:min-w-[300px] xs:max-w-[400px] sm:min-w-[320px] sm:max-w-[420px] md:min-w-[350px] md:max-w-[450px]";

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={toastRef}
        className={`
          fixed z-50
          ${positionStyles[position]}
          transition-all duration-300 ease-out
          ${isExiting ? 'opacity-0 scale-95 translate-y-[-10px]' : 'opacity-100 scale-100 translate-y-0'}
          ${responsiveWidth}
          ${className}
          touch-manipulation
          select-none
        `}
        onClick={handleToastClick}
        onTouchStart={() => {}}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        style={style}
      >
        <div className={`
          relative
          rounded-lg xs:rounded-xl sm:rounded-2xl
          shadow-lg xs:shadow-xl sm:shadow-2xl
          border
          backdrop-blur-md
          overflow-hidden
          transform transition-all duration-300
          ${!isTouchDevice ? 'hover:scale-[1.02]' : ''}
          ${config.bg}
          ${config.border}
          group
          mx-2 xs:mx-0
        `}>
          {/* Progress bar */}
          {autoClose !== false && (
            <div className="absolute top-0 left-0 w-full h-0.5 xs:h-1 bg-gray-200/30 dark:bg-gray-700/30">
              <div 
                className={`
                  h-full bg-gradient-to-r ${config.gradient}
                  transition-all duration-300 ease-linear
                `}
                style={{ 
                  width: `${progress}%`,
                  transition: isExiting ? 'width 300ms linear' : 'none'
                }}
              />
            </div>
          )}

          {/* Main content */}
          <div className="p-2.5 xs:p-3 sm:p-4 flex items-start gap-2 xs:gap-2.5 sm:gap-3 toast-content">
            {/* Icon */}
            {showIcon && (
              <div className={`shrink-0 mt-0.5 ${config.iconColor}`}>
                {config.icon}
              </div>
            )}

            {/* Message */}
            <div className="flex-1 min-w-0 pr-1 xs:pr-0">
              <div className={`font-semibold text-xs xs:text-sm sm:text-base capitalize mb-0.5 xs:mb-1 ${config.text}`}>
                {message.type === "success" ? "Success!" : 
                 message.type === "error" ? "Error!" :
                 message.type === "warning" ? "Warning!" : "Info!"}
              </div>
              <div className={`text-xs xs:text-sm sm:text-base ${config.text} leading-relaxed break-words overflow-wrap-anywhere`}>
                {message.mess}
              </div>
            </div>

            {/* Close button */}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className={`
                  shrink-0
                  p-0.5 xs:p-1
                  rounded-lg xs:rounded-xl
                  transition-all duration-200
                  ${!isTouchDevice ? 'hover:scale-110' : ''}
                  focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2
                  ${config.text} hover:bg-black/5 dark:hover:bg-white/10
                  focus:ring-gray-400 dark:focus:ring-gray-500
                  min-h-[32px] xs:min-h-[36px] sm:min-h-[40px]
                  min-w-[32px] xs:min-w-[36px] sm:min-w-[40px]
                  flex items-center justify-center
                  touch-manipulation
                `}
                aria-label="Close notification"
                type="button"
              >
                <CloseIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Gradient border effect (desktop only) */}
          {!isTouchDevice && (
            <div className={`
              absolute inset-0 rounded-lg xs:rounded-xl sm:rounded-2xl border border-transparent
              bg-gradient-to-r ${config.gradient}
              opacity-0 group-hover:opacity-10
              transition-opacity duration-300
              pointer-events-none
            `} />
          )}
        </div>
      </div>

      {/* Global Styles */}
      <style>
        {`
          /* Touch device optimizations */
          @media (hover: none) and (pointer: coarse) {
            .hover\\:scale-\\[1\\.02\\]:hover,
            .hover\\:scale-110:hover {
              transform: none !important;
            }
            .group-hover\\:opacity-10:hover {
              opacity: 0 !important;
            }
            
            /* Larger tap targets for mobile */
            button[type="button"] {
              min-height: 44px;
              min-width: 44px;
            }
          }
          
          /* Reduced motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .transition-all,
            .hover\\:scale-\\[1\\.02\\],
            .hover\\:scale-110,
            .group-hover\\:opacity-10 {
              transition: none !important;
              animation: none !important;
            }
            
            .toast-animation {
              animation: none !important;
            }
          }
          
          /* High DPI optimization */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .backdrop-blur-md {
              -webkit-backdrop-filter: blur(12px);
              backdrop-filter: blur(12px);
            }
          }
          
          /* Very small screens (below 320px) */
          @media (max-width: 319px) {
            .toast-extra-small {
              margin: 0.25rem;
              padding: 0.5rem !important;
            }
            
            .toast-text-xs {
              font-size: 0.6875rem !important;
            }
          }
          
          /* Large screen optimization */
          @media (min-width: 1920px) {
            .toast-extra-large {
              max-width: 500px !important;
              padding: 1.25rem !important;
            }
          }
          
          /* Landscape mode optimization */
          @media (max-height: 500px) and (orientation: landscape) {
            .toast-landscape {
              margin: 0.25rem 0 !important;
              padding: 0.75rem !important;
            }
            
            .toast-landscape .toast-content {
              gap: 0.75rem !important;
            }
          }
          
          /* Print styles */
          @media print {
            .toast-print {
              display: none !important;
            }
          }
          
          /* Dark mode specific fixes */
          @media (prefers-color-scheme: dark) {
            .toast-dark-bg {
              background-color: rgba(31, 41, 55, 0.9) !important;
            }
          }
          
          /* High contrast mode */
          @media (prefers-contrast: high) {
            .toast-high-contrast {
              border-width: 2px !important;
            }
            
            .toast-high-contrast button {
              border: 1px solid currentColor !important;
            }
          }
          
          /* Reduced data mode */
          @media (prefers-reduced-data: reduce) {
            .backdrop-blur-md {
              backdrop-filter: none !important;
            }
            
            .bg-gradient-to-r {
              background: currentColor !important;
            }
          }
          
          /* iOS Safari specific fixes */
          @supports (-webkit-touch-callout: none) {
            .toast-ios-safe {
              -webkit-tap-highlight-color: transparent;
            }
            
            .backdrop-blur-md {
              -webkit-backdrop-filter: blur(12px);
            }
          }
          
          /* Safe area insets for notched phones */
          @supports (padding: max(0px)) {
            .toast-safe-area {
              padding-left: max(0.5rem, env(safe-area-inset-left));
              padding-right: max(0.5rem, env(safe-area-inset-right));
              padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
            }
          }
          
          /* Break word utility */
          .overflow-wrap-anywhere {
            overflow-wrap: anywhere;
            word-break: break-word;
          }
          
          /* Animation keyframes */
          @keyframes toastSlideInFromRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes toastSlideInFromLeft {
            from {
              opacity: 0;
              transform: translateX(-100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes toastSlideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes toastSlideInFromBottom {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Toast stacking for multiple toasts */
          .toast-stack {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          /* Toast container styles */
          .toast-container {
            position: fixed;
            z-index: 50;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            pointer-events: none;
          }
          
          .toast-container > * {
            pointer-events: auto;
          }
          
          /* Toast queue animation */
          @keyframes toastQueueSlide {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .toast-queue-enter {
            animation: toastQueueSlide 0.3s ease-out;
          }
          
          /* Mobile swipe to dismiss */
          .toast-swipeable {
            touch-action: pan-y;
          }
        `}
      </style>
    </>
  );
};

// Hook for using toast throughout the app
interface ToastOptions {
  position?: ToastMessProps['position'];
  autoClose?: number | false;
  showCloseButton?: boolean;
  showIcon?: boolean;
  className?: string;
}

interface ToastItem {
  id: string;
  message: ToastMessage;
  options: ToastOptions;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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

  const showToast = useCallback((message: ToastMessage, options: ToastOptions = {}) => {
    const id = Date.now().toString();
    const toast: ToastItem = { id, message, options };
    
    setToasts(prev => {
      // Limit to 5 toasts maximum
      const newToasts = [toast, ...prev].slice(0, 5);
      return newToasts;
    });
    
    // Auto remove if autoClose is enabled
    if (options.autoClose !== false) {
      setTimeout(() => {
        removeToast(id);
      }, options.autoClose || 5000);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const ToastContainer: React.FC = () => {
    // Group toasts by position for better stacking
    const toastsByPosition = toasts.reduce((acc, toast) => {
      const position = toast.options.position || "top-right";
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    }, {} as Record<string, ToastItem[]>);

    return (
      <>
        {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
          <div
            key={position}
            className={`toast-container ${position.replace('-', '-')}`}
            style={{
              [position.includes('top') ? 'top' : 'bottom']: '1rem',
              [position.includes('right') ? 'right' : position.includes('left') ? 'left' : 'left']: 
                position.includes('center') ? '50%' : '1rem',
              transform: position.includes('center') ? 'translateX(-50%)' : 'none',
              maxWidth: isTouchDevice ? 'calc(100vw - 2rem)' : 'auto',
            }}
          >
            {positionToasts.map((toast, index) => (
              <ToastMess
                key={toast.id}
                message={toast.message}
                position={toast.options.position as any || "top-right"}
                autoClose={toast.options.autoClose}
                showCloseButton={toast.options.showCloseButton}
                showIcon={toast.options.showIcon}
                onClose={() => removeToast(toast.id)}
                className={toast.options.className}
                style={{
                  transform: `translateY(${index * 10}px) scale(${1 - index * 0.05})`,
                  zIndex: 50 - index,
                  opacity: 1 - (index * 0.2),
                  marginBottom: index > 0 ? '-10px' : '0'
                }}
              />
            ))}
          </div>
        ))}
      </>
    );
  };

  return {
    showToast,
    removeToast,
    removeAllToasts,
    ToastContainer
  };
};

export default ToastMess;