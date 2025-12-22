import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Navigation items data
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Handle scroll effects and active section
  useEffect(() => {
    const handleScroll = () => {
      // Scroll detection with throttle
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 100; // Offset for header height

      let currentSection = '';
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = section;
          }
        }
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [navItems]);

  // Handle mobile menu body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isMobileMenuOpen]);

  // Smooth scroll to section
  const handleNavigation = (href: string, isMobile = false) => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerHeight = 80; // Approximate header height
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const menuButton = document.querySelector('.mobile-menu-button');
      
      if (isMobileMenuOpen && 
          mobileMenu && 
          !mobileMenu.contains(event.target as Node) &&
          !menuButton?.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Navigation component for both desktop and mobile
  const Navigation = ({ isMobile = false }) => (
    <nav 
      className={`
        ${isMobile 
          ? 'flex flex-col space-y-2 w-full' 
          : 'hidden lg:flex items-center space-x-1 lg:space-x-2 xl:space-x-3'
        }
      `}
      role="navigation"
      aria-label={isMobile ? "Mobile navigation" : "Main navigation"}
    >
      {navItems.map((item) => {
        const isActive = activeSection === item.href.substring(1);
        
        return (
          <a
            key={item.name}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(item.href, isMobile);
            }}
            className={`
              group
              transition-all duration-300 ease-out
              font-medium
              rounded-xl
              border border-transparent
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 focus:ring-offset-2
              active:scale-95
              ${
                isMobile
                  ? `
                    flex items-center justify-between
                    py-3 px-4
                    text-base sm:text-lg
                    text-gray-700 hover:text-red-600
                    hover:bg-red-50
                    hover:border-red-100
                    active:bg-red-100
                    ${isActive ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white/80'}
                    touch-manipulation
                  `
                  : `
                    flex items-center
                    py-2 px-3 lg:py-2.5 lg:px-4 xl:py-3 xl:px-4
                    text-sm lg:text-base
                    text-gray-600 hover:text-red-600
                    hover:bg-red-50
                    hover:border-red-100
                    active:bg-red-100
                    relative
                    ${isActive ? 'text-red-600 bg-red-50 border-red-200' : ''}
                    ${isTouchDevice ? 'touch-manipulation' : ''}
                  `
              }
            `}
            aria-label={`Navigate to ${item.name} section`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={`
              ${isMobile ? 'font-semibold' : 'font-medium'}
              transition-transform duration-200
              group-hover:translate-x-0.5
            `}>
              {item.name}
            </span>
            
            {/* Desktop active indicator */}
            {!isMobile && (
              <span className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2
                h-0.5 bg-gradient-to-r from-red-600 to-red-400
                transition-all duration-300
                ${isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4'}
              `} 
                aria-hidden="true"
              />
            )}
            
            {/* Mobile active indicator */}
            {isMobile && (
              <div className="flex items-center space-x-2">
                {isActive && (
                  <span 
                    className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                    aria-hidden="true"
                  />
                )}
                <span 
                  className="text-gray-400 transform transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            )}
          </a>
        );
      })}
    </nav>
  );

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-500 ease-out
        border-b
        w-full
        ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 sm:py-3 border-gray-200/30' 
            : 'bg-white/90 backdrop-blur-sm py-3 sm:py-4 border-transparent'
        }
        ${
          isMobileMenuOpen 
            ? 'bg-white border-gray-200/50 shadow-lg' 
            : ''
        }
      `}
      role="banner"
      aria-label="Main navigation header"
    >
      {/* Main Header Container */}
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
        <div className="flex items-center justify-between ">
          
          {/* Logo/Brand Section - Left Side */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div 
              className="
                flex items-center space-x-1 sm:space-x-2
                text-lg xs:text-xl sm:text-2xl font-bold 
                cursor-pointer
                select-none
                group
                touch-manipulation
                min-w-0
              "
              onClick={() => handleNavigation('#home')}
              role="button"
              tabIndex={0}
              aria-label="Navigate to home section"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigation('#home');
                }
              }}
            >
              {/* Brand Text */}
              <div className="
                bg-gradient-to-r from-red-700 via-red-600 to-red-500 
                bg-clip-text text-transparent 
                transition-all duration-300 
                group-hover:scale-105
                group-active:scale-95
                flex items-baseline space-x-1
              ">
                <span className="text-red-700 drop-shadow-sm text-base xs:text-lg sm:text-2xl">Dev.</span>
                <span className="text-gray-900 font-semibold text-sm xs:text-base sm:text-2xl truncate max-w-[120px] xs:max-w-[140px] sm:max-w-none">
                  Portfolio
                </span>
              </div>
            </div>
            
            {/* Status Indicator - Hidden on smallest screens */}
            <div 
              className="
                relative
                w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5
                bg-gradient-to-r from-green-400 to-green-500 
                rounded-full 
                shadow-sm
                hidden xs:block
                animate-pulse
                flex-shrink-0
              " 
              title="Available for work"
              aria-label="Available for work"
            />
          </div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden lg:flex items-center justify-end flex-1 ml-220">
            <Navigation />
          </div>

          {/* Mobile Menu Button - Right Side */}
          <div className="lg:hidden flex-shrink-0">
            <button
              className="
                flex flex-col items-center justify-center
                w-10 h-10 xs:w-12 xs:h-12
                rounded-2xl
                transition-all duration-300
                hover:bg-gray-100
                active:bg-gray-200
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 focus:ring-offset-2
                group
                mobile-menu-button
                touch-manipulation
              "
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span className={`
                block w-5 xs:w-6 h-0.5 bg-gray-700 rounded-full
                transition-all duration-300
                group-hover:bg-red-600
                group-active:bg-red-700
                ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5 xs:translate-y-2 bg-red-600' : ''}
              `} 
                aria-hidden="true"
              />
              <span className={`
                block w-5 xs:w-6 h-0.5 bg-gray-700 rounded-full
                transition-all duration-300
                my-1.5
                group-hover:bg-red-600
                group-active:bg-red-700
                ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
              `} 
                aria-hidden="true"
              />
              <span className={`
                block w-5 xs:w-6 h-0.5 bg-gray-700 rounded-full
                transition-all duration-300
                group-hover:bg-red-600
                group-active:bg-red-700
                ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5 xs:-translate-y-2 bg-red-600' : ''}
              `} 
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          id="mobile-navigation"
          className={`
            lg:hidden
            overflow-hidden
            transition-all duration-500 ease-in-out
            mobile-menu
            w-full
            ${
              isMobileMenuOpen 
                ? 'max-h-96 opacity-100 py-3 mt-2' 
                : 'max-h-0 opacity-0'
            }
          `}
        >
          <div className="
            bg-white/95 backdrop-blur-md
            rounded-2xl
            p-4 sm:p-6
            shadow-xl
            border border-gray-200/50
            touch-manipulation
            w-full
          ">
            <Navigation isMobile={true} />
            
            {/* Additional Mobile Menu Footer */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200/50">
              <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    aria-hidden="true"
                  />
                  <span>Available for Opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive CSS for various screen sizes */}
      <style>{`
        /* Extra small devices (phones, 320px and down) */
        @media (max-width: 320px) {
          .ml-30 {
            margin-left: 0.5rem;
          }
        }
        
        /* Small phones (375px and up) */
        @media (min-width: 375px) {
          .ml-30 {
            margin-left: 0.75rem;
          }
        }
        
        /* Small devices (landscape phones, 576px and up) */
        @media (min-width: 576px) {
          .ml-30 {
            margin-left: 1rem;
          }
        }
        
        /* Medium devices (tablets, 768px and up) */
        @media (min-width: 768px) {
          .ml-30 {
            margin-left: 1.5rem;
          }
        }
        
        /* Large devices (desktops, 992px and up) */
        @media (min-width: 992px) {
          .ml-30 {
            margin-left: 2rem;
          }
          
          .ml-220 {
            margin-left: auto;
          }
        }
        
        /* Extra large devices (large desktops, 1200px and up) */
        @media (min-width: 1200px) {
          .ml-30 {
            margin-left: 2.5rem;
          }
          
          .ml-220 {
            margin-left: auto;
          }
        }
        
        /* 2XL devices (larger desktops, 1536px and up) */
        @media (min-width: 1536px) {
          .ml-30 {
            margin-left: 3rem;
          }
        }
        
        /* Container responsive padding */
        @media (max-width: 320px) {
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
        
        @media (min-width: 321px) and (max-width: 375px) {
          .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }
        
        @media (min-width: 376px) and (max-width: 475px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        @media (min-width: 576px) {
          .container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
        
        @media (min-width: 768px) {
          .container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
        
        /* Prevent zoom on mobile devices for inputs */
        @media (max-width: 768px) {
          input, select, textarea {
            font-size: 16px;
          }
          
          /* Ensure touch targets are large enough */
          a, button {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* High DPI screens optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .header {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover-scale:hover {
            transform: none;
          }
          .group-hover\\:scale-105:hover {
            transform: none;
          }
          
          /* Better touch feedback */
          a:active, button:active {
            background-color: rgba(254, 226, 226, 0.5);
            transform: scale(0.98);
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .animate-pulse,
          .group-hover\\:translate-x-0\\.5:hover {
            transition: none;
            animation: none;
          }
          
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Large screen optimization */
        @media (min-width: 1920px) {
          .container {
            max-width: 1800px;
          }
          
          .ml-30 {
            margin-left: 4rem;
          }
        }

        /* Print styles */
        @media print {
          .header {
            position: relative;
            background: white;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: none;
          }
          
          .ml-30 {
            margin-left: 0;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .header-dark {
            background-color: rgba(255, 255, 255, 0.95);
          }
          
          .mobile-menu-content {
            background-color: rgba(255, 255, 255, 0.98);
          }
        }
        
        /* Foldable devices support */
        @media (max-width: 280px) {
          .ml-30 {
            margin-left: 0.25rem;
          }
          
          .brand-text {
            font-size: 0.75rem;
          }
        }
        
        /* Landscape orientation for mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .mobile-menu {
            max-height: 70vh !important;
            overflow-y: auto;
          }
        }
        
        /* Very large screens */
        @media (min-width: 2560px) {
          .container {
            max-width: 2400px;
          }
          
          .ml-30 {
            margin-left: 6rem;
          }
        }
        
        /* Responsive font sizes for logo */
        @media (max-width: 360px) {
          .logo-text {
            font-size: 0.875rem;
          }
        }
        
        @media (min-width: 361px) and (max-width: 414px) {
          .logo-text {
            font-size: 1rem;
          }
        }
        
        /* Safe area insets for notched devices */
        @supports (padding: max(0px)) {
          .header {
            padding-left: max(0.75rem, env(safe-area-inset-left));
            padding-right: max(0.75rem, env(safe-area-inset-right));
          }
        }
      `}</style>
    </header>
  );
};

export default Header;