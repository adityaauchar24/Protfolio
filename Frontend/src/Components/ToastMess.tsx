// src/Components/ToastMess.tsx
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

export const ToastMess: React.FC<ToastMessProps> = ({ 
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
  const [isMobile, setIsMobile] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | undefined>(undefined);
  const autoCloseTimeoutRef = useRef<number | undefined>(undefined);

  // Detect device type and screen size
  useEffect(() => {
    const checkDevice = () => {
      const touchDevice = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;
      setIsTouchDevice(touchDevice);
      
      // Check for mobile screen
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
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

  const handleTouchStart = useCallback(() => {
    // Optional: Pause auto-close on touch
    if (autoCloseTimeoutRef.current && autoClose !== false) {
      window.clearTimeout(autoCloseTimeoutRef.current);
    }
  }, [autoClose]);

  // Toast type configurations with dark mode support and responsive sizes
  const toastConfig = {
    success: {
      icon: <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      iconColor: "text-green-500 dark:text-green-400"
    },
    error: {
      icon: <ErrorIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      iconColor: "text-red-500 dark:text-red-400"
    },
    warning: {
      icon: <WarningIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      gradient: "from-yellow-500 to-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      iconColor: "text-yellow-500 dark:text-yellow-400"
    },
    info: {
      icon: <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      iconColor: "text-blue-500 dark:text-blue-400"
    }
  };

  const config = toastConfig[message.type] || toastConfig.info;

  // Responsive position styles with safe area insets
  const positionStyles = {
    "top-right": "top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6",
    "top-left": "top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6",
    "top-center": "top-3 sm:top-4 md:top-6 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6",
    "bottom-left": "bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6",
    "bottom-center": "bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2"
  };

  // Responsive width with maximum constraints
  const responsiveWidth = `
    w-[calc(100vw-2rem)]
    xs:w-[calc(100vw-3rem)]
    sm:w-auto sm:min-w-[320px] sm:max-w-[400px]
    md:min-w-[340px] md:max-w-[440px]
    lg:min-w-[360px] lg:max-w-[480px]
  `;

  // Responsive height and spacing
  const responsiveSpacing = `
    p-3
    sm:p-4
    md:p-5
    gap-3
    sm:gap-4
  `;

  // Responsive font sizes
  const titleFontSize = `
    text-sm
    sm:text-base
    md:text-lg
  `;

  const messageFontSize = `
    text-xs
    sm:text-sm
    md:text-base
  `;

  // Responsive close button size
  const closeButtonSize = `
    min-h-[36px]
    sm:min-h-[40px]
    md:min-h-[44px]
    min-w-[36px]
    sm:min-w-[40px]
    md:min-w-[44px]
  `;

  // Responsive border radius
  const borderRadius = `
    rounded-xl
    sm:rounded-2xl
  `;

  // Responsive shadow
  const shadow = `
    shadow-lg
    sm:shadow-xl
    md:shadow-2xl
  `;

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
          mx-2
          sm:mx-0
        `}
        onClick={handleToastClick}
        onTouchStart={handleTouchStart}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        aria-describedby={`toast-message-${message.type}`}
        style={style}
      >
        <div className={`
          relative
          ${borderRadius}
          ${shadow}
          border
          backdrop-blur-md
          overflow-hidden
          transform transition-all duration-300
          ${!isTouchDevice ? 'hover:scale-[1.02]' : ''}
          ${config.bg}
          ${config.border}
          group
        `}>
          {/* Progress bar */}
          {autoClose !== false && (
            <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-gray-200/30 dark:bg-gray-700/30">
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
          <div className={`${responsiveSpacing} flex items-start gap-3 sm:gap-4 toast-content`}>
            {/* Icon */}
            {showIcon && (
              <div className={`shrink-0 mt-0.5 sm:mt-1 ${config.iconColor}`}>
                {config.icon}
              </div>
            )}

            {/* Message */}
            <div className="flex-1 min-w-0 pr-1 sm:pr-0">
              <div 
                id={`toast-message-${message.type}`}
                className={`
                  font-semibold 
                  ${titleFontSize}
                  capitalize 
                  mb-1 
                  sm:mb-1.5
                  ${config.text}
                `}
              >
                {message.type === "success" ? "Success!" : 
                 message.type === "error" ? "Error!" :
                 message.type === "warning" ? "Warning!" : "Info!"}
              </div>
              <div className={`
                ${messageFontSize}
                ${config.text} 
                leading-relaxed 
                break-words 
                overflow-wrap-anywhere
                line-clamp-3
                sm:line-clamp-none
              `}>
                {message.mess}
              </div>
            </div>

            {/* Close button */}
            {showCloseButton && (
              <button
                onClick={handleClose}
                onTouchStart={handleTouchStart}
                className={`
                  shrink-0
                  p-1
                  sm:p-1.5
                  ${borderRadius}
                  transition-all duration-200
                  ${!isTouchDevice ? 'hover:scale-110' : 'active:scale-95'}
                  focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2
                  ${config.text} 
                  hover:bg-black/5 
                  dark:hover:bg-white/10
                  active:bg-black/10
                  dark:active:bg-white/20
                  focus:ring-gray-400 
                  dark:focus:ring-gray-500
                  ${closeButtonSize}
                  flex items-center justify-center
                  touch-manipulation
                  -mr-1
                `}
                aria-label="Close notification"
                type="button"
              >
                <CloseIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            )}
          </div>

          {/* Gradient border effect (desktop only) */}
          {!isTouchDevice && (
            <div className={`
              absolute inset-0 ${borderRadius} border border-transparent
              bg-gradient-to-r ${config.gradient}
              opacity-0 group-hover:opacity-10
              transition-opacity duration-300
              pointer-events-none
            `} />
          )}
        </div>
      </div>
    </>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const touchDevice = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;
      setIsTouchDevice(touchDevice);
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const showToast = useCallback((message: ToastMessage, options: ToastOptions = {}) => {
    const id = Date.now().toString();
    const toast: ToastItem = { id, message, options };
    
    setToasts(prev => {
      // Limit to 4 toasts maximum on mobile, 5 on desktop
      const maxToasts = isMobile ? 3 : 5;
      const newToasts = [toast, ...prev].slice(0, maxToasts);
      return newToasts;
    });
    
    // Auto remove if autoClose is enabled
    if (options.autoClose !== false) {
      setTimeout(() => {
        removeToast(id);
      }, options.autoClose || 5000);
    }
    
    return id;
  }, [isMobile]);

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
            className="toast-container"
            style={{
              position: 'fixed',
              zIndex: 50,
              [position.includes('top') ? 'top' : 'bottom']: isMobile ? '1rem' : '1.5rem',
              [position.includes('right') ? 'right' : position.includes('left') ? 'left' : 'left']: 
                position.includes('center') ? '50%' : (isMobile ? '1rem' : '1.5rem'),
              transform: position.includes('center') ? 'translateX(-50%)' : 'none',
              width: isMobile ? 'calc(100% - 2rem)' : 'auto',
              maxWidth: isMobile ? '100%' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: position.includes('right') ? 'flex-end' : position.includes('left') ? 'flex-start' : 'center',
              gap: '0.5rem',
            }}
          >
            {positionToasts.map((toast, index) => (
              <ToastMess
                key={toast.id}
                message={toast.message}
                position={toast.options.position as any || "top-right"}
                autoClose={toast.options.autoClose}
                showCloseButton={toast.options.showCloseButton !== undefined ? toast.options.showCloseButton : isMobile ? true : true}
                showIcon={toast.options.showIcon !== undefined ? toast.options.showIcon : true}
                onClose={() => removeToast(toast.id)}
                className={toast.options.className}
                style={{
                  transform: `translateY(${index * (isMobile ? 5 : 10)}px)`,
                  zIndex: 50 - index,
                  opacity: 1 - (index * 0.1),
                  marginBottom: isMobile ? '-8px' : '-10px',
                  ...(isMobile && position.includes('center') ? { 
                    left: '50%',
                    transform: `translateX(-50%) translateY(${index * 5}px)`
                  } : {})
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