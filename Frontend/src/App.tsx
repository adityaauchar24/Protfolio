import { useState, useEffect, useCallback, useRef } from "react";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Skills from "./Pages/Skills";
import Projects from "./Pages/Projects";
import Contact from "./Pages/Contact";
import { useToast } from "./Components/ToastMess";

// TypeScript interfaces
interface ToastItem {
  id: string;
  message: ToastMessage;
  position?: string;
  autoClose?: number | false;
  showCloseButton?: boolean;
  showIcon?: boolean;
}

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  mess: string;
}

interface NavigationDotsProps {
  activeSection: string;
}

interface ProgressBarProps {
  progress: number;
}

// Custom hook for scroll effects and section tracking
const useScrollEffects = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset;
      const trackLength = docHeight - winHeight;
      
      // Calculate progress
      const progress = Math.floor((scrollTop / trackLength) * 100);
      setScrollProgress(progress);

      // Determine active section with improved logic
      const sections = ["home", "about", "skills", "projects", "contact"];
      const headerHeight = isMobile ? 60 : isTablet ? 70 : 80;
      
      let currentSection = "home";
      let minDistance = Infinity;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - headerHeight);
          
          if (distance < minDistance && rect.top <= headerHeight + 100) {
            minDistance = distance;
            currentSection = section;
          }
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }

      // Handle hide/show header on mobile
      if (isMobile) {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    // Throttle scroll events for better performance
    const throttledScroll = () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(handleScroll, 50);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener('resize', checkScreenSize);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeSection, isMobile, isTablet, lastScrollY]);

  return { activeSection, scrollProgress, isMobile, isTablet, isVisible };
};

// Scroll to top component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const throttledToggle = () => {
      window.requestAnimationFrame(toggleVisibility);
    };

    window.addEventListener("scroll", throttledToggle, { passive: true });
    return () => window.removeEventListener("scroll", throttledToggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-4 sm:bottom-6 md:bottom-8 
            right-4 sm:right-6 md:right-8 
            z-40 
            w-12 h-12 sm:w-14 sm:h-14
            bg-gradient-to-r from-red-600 to-red-600
            text-white 
            rounded-xl sm:rounded-2xl 
            shadow-lg hover:shadow-2xl 
            transition-all duration-300 
            ${!isTouchDevice ? 'hover:scale-110' : ''}
            active:scale-95 
            group 
            touch-manipulation 
            flex items-center justify-center 
            focus:outline-none focus:ring-3 focus:ring-red-500/50 focus:ring-offset-2
            min-h-[48px] sm:min-h-[56px]
            min-w-[48px] sm:min-w-[56px]
          `}
          aria-label="Scroll to top"
          type="button"
        >
          <div className="group-hover:-translate-y-0.5 transition-transform duration-300 text-lg sm:text-2xl">
            ↑
          </div>
        </button>
      )}
    </>
  );
};

// Professional Black Loading Screen component - Enhanced Responsiveness
const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    // Detect device type for responsive adjustments
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    // Show content with delay based on device
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, deviceType === "mobile" ? 200 : 300);

    // Progress animation with smooth increments
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Adjust speed based on device for better UX
        const increment = deviceType === "mobile" ? 
          (prev < 30 ? 20 : prev < 70 ? 15 : prev < 95 ? 8 : 4) :
          (prev < 30 ? 15 : prev < 70 ? 10 : prev < 95 ? 5 : 2);
        return Math.min(prev + increment, 100);
      });
    }, deviceType === "mobile" ? 150 : 200);

    // Adjust loading time based on device
    const loadTime = deviceType === "mobile" ? 1800 : 2000;
    const completeTimer = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.add('loaded');
    }, loadTime);

    return () => {
      clearTimeout(showTimer);
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
      window.removeEventListener('resize', checkDeviceType);
    };
  }, [deviceType]);

  if (!isLoading) return null;

  // Responsive sizes
  const spinnerSize = {
    mobile: "w-20 h-20",
    tablet: "w-24 h-24",
    desktop: "w-28 h-28"
  }[deviceType];

  const dotSize = {
    mobile: "w-1.5 h-1.5",
    tablet: "w-1.5 h-1.5",
    desktop: "w-2 h-2"
  }[deviceType];

  const dotDistance = {
    mobile: 36,
    tablet: 40,
    desktop: 44
  }[deviceType];

  const padding = {
    mobile: "p-4",
    tablet: "p-6",
    desktop: "p-8"
  }[deviceType];

  const marginBottom = {
    mobile: "mb-4",
    tablet: "mb-6",
    desktop: "mb-8"
  }[deviceType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Elegant background pattern - Responsive */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-shimmer animation-delay-1000" />
        
        {/* Subtle grid pattern with responsive sizing */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: deviceType === "mobile" ? '30px 30px' : '40px 40px'
        }} />
      </div>

      <div className={`relative z-10 text-center max-w-[90%] xs:max-w-[85%] sm:max-w-md mx-auto ${padding}`}>
        {/* Main spinner container - Responsive */}
        <div className={`relative mx-auto ${spinnerSize} ${marginBottom}`}>
          {/* Center circle with initials - Responsive */}
          <div className={`absolute ${
            deviceType === "mobile" ? "inset-4" :
            deviceType === "tablet" ? "inset-5" : "inset-6"
          } bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center`}>
            <div className="relative">
              {/* Subtle glow effect */}
              <div className={`absolute ${
                deviceType === "mobile" ? "-inset-3" :
                deviceType === "tablet" ? "-inset-3" : "-inset-4"
              } bg-red-500/10 rounded-full blur-md sm:blur-lg`} />
            </div>
          </div>
        </div>

        {/* Progress dots - Enhanced Responsiveness */}
        <div className={`relative mx-auto w-full max-w-[120px] xs:max-w-[110px] sm:max-w-[140px] ${
          deviceType === "mobile" ? "h-28 mb-3" :
          deviceType === "tablet" ? "h-32 mb-4" : "h-36 mb-4"
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`absolute ${dotSize} bg-white rounded-full transition-all duration-300 ease-out`}
                style={{
                  transform: `rotate(${i * 45}deg) translateX(${dotDistance}px)`,
                  opacity: progress >= (i + 1) * 12.5 ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content with fade-in animation */}
        <div className={`transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Progress section - Enhanced Responsiveness */}
          <div className={`space-y-${deviceType === "mobile" ? "2" : "3"}`}>
            {/* Progress bar with glow - Enhanced Responsiveness */}
            <div className="relative">
              <div className={`h-${deviceType === "mobile" ? "1" : "1.5"} bg-gray-800 rounded-full overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-white via-white to-white rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Glowing edge */}
                  <div className={`absolute right-0 top-0 h-full ${
                    deviceType === "mobile" ? "w-2" : "w-3"
                  } bg-gradient-to-l from-white to-transparent`} />
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-red-500/10 blur-sm sm:blur-md rounded-full" />
            </div>

            {/* Progress info - Enhanced Responsiveness */}
            <div className="flex justify-between items-center px-1">
              <span className={`text-gray-400 ${
                deviceType === "mobile" ? "text-xs" :
                deviceType === "tablet" ? "text-sm" : "text-sm"
              }`}>
                Loading portfolio...
              </span>
              <span className={`font-bold text-white ${
                deviceType === "mobile" ? "text-sm" :
                deviceType === "tablet" ? "text-base" : "text-base"
              }`}>
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation dots component - Enhanced Responsiveness
const NavigationDots = ({ activeSection }: NavigationDotsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Show dots after a delay on page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" }
  ];

  const handleDotClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = isMobile ? 60 : isTablet ? 70 : 80;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Hide on mobile and tablets
  if (isMobile || isTablet) return null;

  return (
    <div 
      className={`fixed right-4 sm:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3 sm:gap-4 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleDotClick(section.id)}
          onMouseEnter={() => setHoveredSection(section.id)}
          onMouseLeave={() => setHoveredSection(null)}
          className="group flex items-center gap-2 sm:gap-3 touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-lg p-1 transition-all duration-300"
          aria-label={`Navigate to ${section.label}`}
          type="button"
        >
          <span className={`text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium transition-all duration-300 ${
            hoveredSection === section.id 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-2'
          } whitespace-nowrap`}>
            {section.label}
          </span>
          <div
            className={`relative transition-all duration-300 ${
              activeSection === section.id
                ? "scale-125"
                : "group-hover:scale-110"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-red-600 dark:bg-red-500 border-red-600 dark:border-red-500"
                  : "bg-transparent border-gray-400 dark:border-gray-600 group-hover:border-red-400 dark:group-hover:border-red-400"
              }`}
            />
            {activeSection === section.id && (
              <div className="absolute -inset-1 rounded-full bg-red-600/10 dark:bg-red-500/10 animate-ping" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

// Progress bar component - Enhanced Responsiveness
const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="fixed top-0 left-0 w-full h-0.5 sm:h-1 bg-gray-200/50 dark:bg-gray-800/50 z-40">
    <div
      className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Footer component - Enhanced Responsiveness
const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200/50 dark:border-gray-700/50 py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-2 sm:mb-3">
            © {currentYear} Aditya Auchar. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-base">
            Crafted with ❤️ using React & Tailwind CSS
          </p>
          
          {/* Additional footer info - Enhanced Responsiveness */}
          <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            <span className="inline-flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Available for opportunities</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Portfolio v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component - Enhanced Responsiveness
function App() {
  const { activeSection, scrollProgress, isMobile, isVisible } = useScrollEffects();
  const { ToastContainer } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile for safe area insets
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check for iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${
        isIOS ? 'pb-safe' : ''
      }`}
      style={isIOS ? { paddingBottom: 'env(safe-area-inset-bottom)' } : {}}
    >
      {/* Professional Black Loading Screen */}
      <LoadingScreen />

      {/* Progress Bar */}
      <ProgressBar progress={scrollProgress} />

      {/* Header with conditional visibility on mobile */}
      <header 
        className={`sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 supports-backdrop-blur:bg-white/90 transition-transform duration-300 ${
          isMobile && !isVisible ? '-translate-y-full' : 'translate-y-0'
        } ${isIOS ? 'pt-safe' : ''}`}
        style={isIOS ? { paddingTop: 'env(safe-area-inset-top)' } : {}}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative overflow-x-hidden">
        {/* Navigation Dots */}
        <NavigationDots activeSection={activeSection} />

        {/* Sections with enhanced responsive scroll margins */}
        <section id="home" className={`scroll-mt-${isMobile ? '16' : '20'}`}>
          <Home />
        </section>

        <section id="about" className={`scroll-mt-${isMobile ? '16' : '20'}`}>
          <About />
        </section>

        <section id="skills" className={`scroll-mt-${isMobile ? '16' : '20'}`}>
          <Skills />
        </section>

        <section id="projects" className={`scroll-mt-${isMobile ? '16' : '20'}`}>
          <Projects />
        </section>

        <section id="contact" className={`scroll-mt-${isMobile ? '16' : '20'}`}>
          <Contact />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Toast Container */}
      <ToastContainer />

      {/* Global Responsive Styles - Enhanced */}
      <style>
        {`
          /* Base styles */
          html {
            scroll-behavior: smooth;
            scroll-padding-top: 5rem;
          }
          
          /* Extra small devices (phones, 320px and up) */
          @media (min-width: 320px) {
            .xs\\:max-w-\\[85\\%\\] {
              max-width: 85% !important;
            }
            
            .xs\\:max-w-\\[110px\\] {
              max-width: 110px !important;
            }
          }
          
          /* Mobile responsive */
          @media (max-width: 767px) {
            html {
              scroll-padding-top: 4rem;
            }
            
            /* Better touch targets */
            button, [role="button"], a {
              min-height: 44px;
              min-width: 44px;
            }
            
            /* Optimize loading screen for mobile */
            .loading-screen .animate-shimmer {
              animation-duration: 3s;
            }
          }
          
          /* Small mobile devices (375px and below) */
          @media (max-width: 375px) {
            .text-xs {
              font-size: 0.75rem;
            }
            
            .text-sm {
              font-size: 0.875rem;
            }
            
            /* Further optimize loading screen for very small screens */
            .max-w-\\[90\\%\\] {
              max-width: 92% !important;
            }
            
            .h-28 {
              height: 24px !important;
            }
          }
          
          /* Very small screens (below 320px) */
          @media (max-width: 319px) {
            .container {
              padding-left: 0.5rem !important;
              padding-right: 0.5rem !important;
            }
            
            .text-xs {
              font-size: 0.625rem !important;
            }
            
            .text-sm {
              font-size: 0.75rem !important;
            }
            
            /* Adjust loading screen for very small screens */
            .max-w-\\[90\\%\\] {
              max-width: 95% !important;
            }
            
            .h-28 {
              height: 20px !important;
            }
            
            .max-w-\\[120px\\] {
              max-width: 100px !important;
            }
            
            .w-20 {
              width: 16px !important;
              height: 16px !important;
            }
          }
          
          /* Prevent zoom on iOS for inputs */
          @media (max-width: 768px) {
            input, select, textarea {
              font-size: 16px;
            }
          }
          
          /* Touch device optimizations */
          @media (hover: none) and (pointer: coarse) {
            .hover\\:scale-110:hover,
            .group-hover\\:scale-110:hover {
              transform: none !important;
            }
            
            /* Improve touch interactions */
            .touch-manipulation {
              -webkit-tap-highlight-color: transparent;
              touch-action: manipulation;
            }
          }
          
          /* Reduced motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .transition-all,
            .animate-spin,
            .animate-ping,
            .animate-shimmer,
            .group-hover\\:scale-110,
            .hover\\:scale-110 {
              transition: none !important;
              animation: none !important;
            }
            
            html {
              scroll-behavior: auto;
            }
            
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          
          /* High DPI optimization */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .backdrop-blur-md {
              -webkit-backdrop-filter: blur(12px);
              backdrop-filter: blur(12px);
            }
          }
          
          /* Large screen optimization */
          @media (min-width: 1920px) {
            .container {
              max-width: 1440px !important;
            }
          }
          
          /* Landscape mode optimization for mobile */
          @media (max-height: 500px) and (orientation: landscape) {
            .navigation-dots,
            .scroll-to-top {
              display: none !important;
            }
            
            section {
              min-height: auto !important;
              padding-top: 1.5rem !important;
              padding-bottom: 1.5rem !important;
            }
            
            /* Reduce loading screen size in landscape */
            .loading-screen {
              padding: 1rem !important;
            }
            
            /* Adjust progress dots in landscape */
            .h-28, .h-32, .h-36 {
              height: 20px !important;
            }
            
            .w-20, .w-24, .w-28 {
              width: 16px !important;
              height: 16px !important;
            }
            
            .max-w-\\[120px\\], .max-w-\\[140px\\] {
              max-width: 100px !important;
            }
          }
          
          /* Tablet specific optimizations */
          @media (min-width: 768px) and (max-width: 1024px) {
            .scroll-mt-20 {
              scroll-margin-top: 5rem;
            }
            
            /* Optimize loading animations for tablets */
            .animate-shimmer {
              animation-duration: 2.5s;
            }
          }
          
          /* Print styles */
          @media print {
            .scroll-to-top,
            .navigation-dots,
            .progress-bar,
            .toast-container,
            header,
            footer {
              display: none !important;
            }
            
            body {
              background: white !important;
              color: black !important;
            }
          }
          
          /* Dark mode specific improvements */
          @media (prefers-color-scheme: dark) {
            .bg-gradient-to-br {
              background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
            }
          }
          
          /* High contrast mode */
          @media (prefers-contrast: high) {
            .border {
              border-width: 2px !important;
            }
            
            button {
              border: 2px solid currentColor !important;
            }
            
            .progress-bar {
              height: 3px !important;
            }
          }
          
          /* Reduced data mode */
          @media (prefers-reduced-data: reduce) {
            .bg-gradient-to-br {
              background: #f9fafb !important;
            }
            
            .backdrop-blur-md {
              backdrop-filter: none !important;
            }
            
            .animate-spin,
            .animate-ping,
            .animate-shimmer {
              animation: none !important;
            }
            
            /* Simplify loading screen */
            .loading-screen .animate-pulse,
            .loading-screen .animate-shimmer {
              animation: none !important;
            }
            
            /* Remove gradients for reduced data */
            .bg-gradient-to-r {
              background: #ef4444 !important;
            }
          }
          
          /* iOS Safari specific fixes */
          @supports (-webkit-touch-callout: none) {
            .min-h-screen {
              min-height: -webkit-fill-available;
            }
            
            /* Fix 100vh issue on iOS */
            .fixed {
              position: fixed;
            }
          }
          
          /* Safe area insets for notched phones */
          @supports (padding: max(0px)) {
            .pb-safe {
              padding-bottom: max(0px, env(safe-area-inset-bottom));
            }
            
            .pt-safe {
              padding-top: max(0px, env(safe-area-inset-top));
            }
            
            .pl-safe {
              padding-left: max(0.75rem, env(safe-area-inset-left));
            }
            
            .pr-safe {
              padding-right: max(0.75rem, env(safe-area-inset-right));
            }
          }
          
          /* Custom animation delays */
          .animation-delay-300 {
            animation-delay: 300ms;
          }
          
          .animation-delay-1000 {
            animation-delay: 1000ms;
          }
          
          /* Custom animations for black loading screen */
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          .animate-shimmer {
            animation: shimmer 3s infinite;
          }
          
          /* Page load animation - responsive timing */
          @media (max-width: 768px) {
            .loaded section {
              animation: fadeInUp 0.4s ease-out forwards;
            }
          }
          
          @media (min-width: 769px) {
            .loaded section {
              animation: fadeInUp 0.6s ease-out forwards;
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Smooth scrolling sections */
          section {
            opacity: 0;
          }
          
          .loaded section {
            opacity: 1;
          }
          
          /* Better scrollbar - responsive */
          @media (min-width: 768px) {
            ::-webkit-scrollbar {
              width: 10px;
            }
            
            ::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 5px;
            }
            
            ::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 5px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
            
            @media (prefers-color-scheme: dark) {
              ::-webkit-scrollbar-track {
                background: #2d3748;
              }
              
              ::-webkit-scrollbar-thumb {
                background: #4a5568;
              }
              
              ::-webkit-scrollbar-thumb:hover {
                background: #718096;
              }
            }
          }
          
          /* Hide scrollbar on mobile for better performance */
          @media (max-width: 767px) {
            ::-webkit-scrollbar {
              display: none;
            }
            
            * {
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
          }
          
          /* Selection color */
          ::selection {
            background-color: rgba(239, 68, 68, 0.3);
            color: inherit;
          }
          
          /* Focus styles for better accessibility */
          *:focus-visible {
            outline: 2px solid #ef4444;
            outline-offset: 2px;
          }
          
          /* Mobile performance optimizations */
          @media (max-width: 768px) {
            .transform {
              will-change: transform;
            }
            
            .animate-ping,
            .animate-pulse {
              animation-duration: 1.5s;
            }
            
            /* Optimize loading screen animations for mobile */
            .loading-screen .animate-shimmer {
              animation-duration: 3s;
            }
          }
          
          /* Performance optimizations for all devices */
          .animate-ping,
          .animate-pulse,
          .animate-shimmer {
            will-change: opacity, transform;
          }
        `}
      </style>
    </div>
  );
}

export default App;