import React, { useState, useEffect, useCallback } from "react";
import { 
  Home, 
  User, 
  Code, 
  Briefcase, 
  Mail, 
  Menu, 
  X, 
  ChevronRight,
  Zap,
  Github,
  Linkedin,
  Twitter,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface FloatingNavbarProps {
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

const FloatingNavbar = ({ onThemeToggle, isDarkMode = false }: FloatingNavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Enhanced navigation data with larger font sizes
  const navData: NavItem[] = [
    {
      name: "Home",
      id: "home",
      icon: <Home size={22} className="sm:size-20 md:size-22" />,
      color: "from-blue-500 to-cyan-500",
      description: "Welcome section"
    },
    {
      name: "About",
      id: "about",
      icon: <User size={22} className="sm:size-20 md:size-22" />,
      color: "from-green-500 to-emerald-500",
      description: "About me & experience"
    },
    {
      name: "Skills",
      id: "skills",
      icon: <Code size={22} className="sm:size-20 md:size-22" />,
      color: "from-purple-500 to-pink-500",
      description: "Technical expertise"
    },
    {
      name: "Projects",
      id: "projects",
      icon: <Briefcase size={22} className="sm:size-20 md:size-22" />,
      color: "from-orange-500 to-red-500",
      description: "My work portfolio"
    },
    {
      name: "Contact",
      id: "contact",
      icon: <Mail size={22} className="sm:size-20 md:size-22" />,
      color: "from-indigo-500 to-blue-500",
      description: "Get in touch"
    },
  ];

  // Social links with larger icons
  const socialLinks = [
    { icon: <Github size={20} className="sm:size-21 md:size-22" />, href: "https://github.com", label: "GitHub" },
    { icon: <Linkedin size={20} className="sm:size-21 md:size-22" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Twitter size={20} className="sm:size-21 md:size-22" />, href: "https://twitter.com", label: "Twitter" },
  ];

  // Handle scroll effects
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Update active section
          let currentSection = "home";
          let minDistance = Infinity;

          navData.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
              const rect = element.getBoundingClientRect();
              const distance = Math.abs(rect.top);
              
              if (distance < minDistance && rect.top <= 150) {
                minDistance = distance;
                currentSection = item.id;
              }
            }
          });

          if (currentSection !== activeSection) {
            setActiveSection(currentSection);
          }

          // Handle navbar visibility
          setIsScrolled(currentScrollY > 50);
          
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // Handle body scroll lock
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Smooth scroll function
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, []);

  // Desktop Navigation Item
  const DesktopNavItem = React.memo(({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setShowTooltip(item.id)}
      onMouseLeave={() => setShowTooltip(null)}
    >
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToSection(item.id);
        }}
        className={`
          group relative
          flex items-center gap-3
          px-4 py-3
          rounded-2xl
          font-medium
          transition-all duration-300
          cursor-pointer
          select-none
          text-base md:text-lg lg:text-[17px]
          ${isActive
            ? `text-white bg-gradient-to-r ${item.color} shadow-lg shadow-current/25`
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50"
          }
        `}
        aria-label={`Navigate to ${item.name} section`}
        aria-current={isActive ? "page" : undefined}
      >
        <motion.div
          animate={{ scale: isActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className={isActive ? "text-white" : "text-gray-500 group-hover:text-current"}
        >
          {item.icon}
        </motion.div>
        
        <span className="whitespace-nowrap font-medium">{item.name}</span>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="navActiveIndicator"
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-white rounded-full"
          />
        )}
        
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip === item.id && !isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-sm md:text-base rounded-lg whitespace-nowrap pointer-events-none z-50"
            >
              {item.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800" />
            </motion.div>
          )}
        </AnimatePresence>
      </a>
    </motion.div>
  ));

  // Mobile Navigation Item
  const MobileNavItem = React.memo(({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <motion.a
      href={`#${item.id}`}
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(item.id);
        setMenuOpen(false);
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className={`
        group
        flex items-center gap-4
        px-5 py-4
        rounded-2xl
        font-medium
        transition-all duration-300
        cursor-pointer
        border-2
        text-base sm:text-lg
        min-h-[60px] sm:min-h-[68px]
        ${isActive
          ? `text-white bg-gradient-to-r ${item.color} border-transparent shadow-lg`
          : "text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-current/30 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }
      `}
      aria-label={`Navigate to ${item.name} section`}
    >
      <motion.div
        animate={{ scale: isActive ? 1.2 : 1 }}
        transition={{ duration: 0.2 }}
        className={isActive ? "text-white" : "text-gray-500 group-hover:text-current"}
      >
        {item.icon}
      </motion.div>
      
      <div className="flex-1">
        <div className="font-semibold text-base sm:text-lg">{item.name}</div>
        <div className="text-sm sm:text-base opacity-75">{item.description}</div>
      </div>
      
      <ChevronRight size={22} className="sm:size-24 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </motion.a>
  ));

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-[90%] md:w-[85%] lg:w-auto max-w-[1800px] mx-auto px-2 sm:px-4"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Desktop Navigation */}
      <div className={`
        hidden lg:flex items-center gap-2
        p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
        rounded-3xl
        shadow-2xl shadow-black/10 dark:shadow-black/30
        border border-gray-200/50 dark:border-gray-800/50
        transition-all duration-500
        ${isScrolled ? 'scale-95' : 'scale-100'}
        w-full
      `}>
        {/* Social Links */}
        <div className="flex items-center gap-1 px-2 sm:px-3 border-r border-gray-200 dark:border-gray-800">
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`Visit my ${social.label}`}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>

        {/* Navigation Items */}
        {navData.map((item) => (
          <DesktopNavItem 
            key={item.id} 
            item={item} 
            isActive={activeSection === item.id}
          />
        ))}

        {/* Theme Toggle */}
        {onThemeToggle && (
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={onThemeToggle}
            className="p-3 sm:p-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun size={22} className="sm:size-24" /> : <Moon size={22} className="sm:size-24" />}
          </motion.button>
        )}

        {/* Hire Me Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollToSection("contact")}
          className="px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 text-base sm:text-lg"
        >
          <Zap size={20} className="sm:size-22" />
          <span>Hire Me</span>
        </motion.button>
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className={`
            flex items-center justify-center
            w-16 h-16 sm:w-18 sm:h-18
            rounded-2xl sm:rounded-3xl
            backdrop-blur-xl
            border-2
            shadow-2xl
            transition-all duration-300
            ml-auto
            ${menuOpen
              ? "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              : "bg-white/95 dark:bg-gray-900/95 border-gray-200/50 dark:border-gray-800/50"
            }
          `}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={28} className="sm:size-30" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={28} className="sm:size-30" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-50"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-[480px] h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] bg-white dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      Navigation
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mt-1 sm:mt-2">
                      Explore my portfolio
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {onThemeToggle && (
                      <button
                        onClick={onThemeToggle}
                        className="p-2.5 sm:p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                      >
                        {isDarkMode ? <Sun size={22} className="sm:size-24" /> : <Moon size={22} className="sm:size-24" />}
                      </button>
                    )}
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 sm:p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      aria-label="Close menu"
                    >
                      <X size={22} className="sm:size-24" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 sm:space-y-3">
                {navData.map((item, index) => (
                  <MobileNavItem 
                    key={item.id} 
                    item={item} 
                    isActive={activeSection === item.id}
                  />
                ))}
              </div>
              
              {/* Menu Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-4 sm:mb-5">
                    Let's build something amazing together! 🚀
                  </p>
                  <div className="flex justify-center gap-3 sm:gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 sm:p-3.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={`Visit my ${social.label}`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default FloatingNavbar;