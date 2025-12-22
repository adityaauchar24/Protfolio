import { useState, useEffect } from "react";
import profileImg from "../Images/AjayAucharPhoto.png";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CodeIcon from "@mui/icons-material/Code";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Import your CV file
import cvFile from "../cv/Aditya_Auchar_React.js&Nodejs_Developer.pdf";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const roles = [
    "Full Stack Developer", 
    "MERN Stack Developer", 
    "React & Node.js", 
    "Frontend Architect",
    "Backend Developer",
    "UI/UX Engineer"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-typing effect for roles with smooth transitions
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % roles.length);
        setIsTransitioning(false);
      }, 500); // Transition duration
    }, 3000); // Increased interval for slower transitions

    return () => clearInterval(interval);
  }, [roles.length]);

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadCV = () => {
    // Create a link element
    const link = document.createElement('a');
    
    // Use the imported CV file
    link.href = cvFile;
    
    // Set the download attribute with a clean file name
    link.download = 'Aditya_Auchar_Full_Stack_Developer_CV.pdf';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { number: "1+", label: "Years Experience", icon: <TrendingUpIcon /> },
    { number: "15+", label: "Projects Completed", icon: <CodeIcon /> },
    { number: "10+", label: "Technologies", icon: <CodeIcon /> },
  ];

  const technologies = ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'Tailwind'];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-20 xl:pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute top-1/4 left-4 sm:left-6 md:left-1/4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-72 xl:h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-4 sm:right-6 md:right-1/4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-72 xl:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-72 xl:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 md:py-10 lg:py-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Text Content */}
          <div className={`text-center lg:text-left transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} order-2 lg:order-1 mt-8 sm:mt-10 md:mt-12 lg:mt-0`}>
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 bg-red-50 border border-red-200 rounded-full mb-6 sm:mb-7 md:mb-8 lg:mb-10 xl:mb-12">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-red-700">Welcome to my portfolio</span>
            </div>

            {/* Animated Role Text with Smooth Transition - Fixed responsive height */}
            <div className="min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] lg:min-h-[4.5rem] xl:min-h-[5rem] mb-4 sm:mb-5 md:mb-6 flex items-center justify-center lg:justify-start">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-gray-800 leading-tight">
                <span 
                  className={`
                    bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent
                    transition-all duration-500 ease-in-out
                    ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}
                    block
                  `}
                >
                  {roles[textIndex]}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl text-gray-600 leading-relaxed sm:leading-loose mb-4 sm:mb-5 md:mb-6 max-w-2xl mx-auto lg:mx-0">
              I'm a {" "}
              <strong className="text-gray-900">Full Stack Developer</strong> with{" "}
              <strong className="text-red-600">1+ years</strong> of experience building 
              end-to-end web applications. I specialize in the{" "}
              <strong>MERN Stack (MongoDB, Express.js, React, Node.js)</strong> and modern 
              technologies like{" "}
              <strong>TypeScript, Tailwind CSS, Material UI,</strong> and{" "}
              <strong>RESTful APIs</strong> to create scalable, high-performance, and 
              user-friendly digital solutions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 mb-6 max-w-md mx-auto lg:mx-0 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/70 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1 md:mt-1.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 justify-center lg:justify-start mb-6 sm:mb-8 md:mb-10 lg:mb-12 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
              <button
                onClick={() => handleNavigation('#projects')}
                className="group flex items-center justify-center gap-2 px-4 py-3 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base md:text-lg flex-1 sm:flex-none min-h-[44px]"
              >
                <span>View My Work</span>
                <div className="group-hover:translate-x-1 transition-transform duration-300">→</div>
              </button>

              <button
                onClick={() => handleNavigation('#contact')}
                className="group flex items-center justify-center gap-2 px-4 py-3 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-3.5 border border-gray-300 md:border-2 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base md:text-lg flex-1 sm:flex-none min-h-[44px]"
              >
                <span>Contact Me</span>
              </button>

              <button
                onClick={handleDownloadCV}
                className="group flex items-center justify-center gap-2 px-4 py-3 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-3.5 text-gray-700 font-semibold rounded-lg sm:rounded-xl border border-gray-300 hover:border-red-300 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base md:text-lg flex-1 sm:flex-none min-h-[44px]"
              >
                <DownloadIcon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>Download CV</span>
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 justify-center lg:justify-start">
              {technologies.map((tech) => (
                <div
                  key={tech}
                  className="px-3 py-1.5 sm:px-3 sm:py-1.5 md:px-3.5 md:py-2 lg:px-4 lg:py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg sm:rounded-full text-xs sm:text-sm md:text-base text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-300 font-medium"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Profile Image - Large Circular Design */}
          <div className={`flex justify-center lg:justify-end transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} order-1 lg:order-2`}>
            <div className="relative">
              {/* Background Gradient Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 rounded-full blur-xl sm:blur-2xl opacity-20 animate-pulse"></div>
              
              {/* Main Circular Image Container */}
              <div className="relative group">
                {/* Outer Glow Effect */}
                <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 lg:-inset-5 xl:-inset-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                
                {/* Responsive Circular Image Container */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 2xl:w-[28rem] 2xl:h-[28rem] rounded-full shadow-2xl border-4 sm:border-5 md:border-6 lg:border-7 xl:border-8 border-white bg-white overflow-hidden">
                  <img 
                    src={profileImg}
                    alt="Aditya Auchar - Full Stack Developer"
                    className="w-full h-full object-cover object-center scale-110 sm:scale-115 md:scale-120 lg:scale-125 xl:scale-130"
                    loading="eager"
                  />
                  
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </div>

              </div>

              {/* Responsive Animated Rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[15rem] h-[15rem] sm:w-[17rem] sm:h-[17rem] md:w-[19rem] md:h-[19rem] lg:w-[22rem] lg:h-[22rem] xl:w-[26rem] xl:h-[26rem] 2xl:w-[32rem] 2xl:h-[32rem] border-2 border-blue-300/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[17rem] h-[17rem] sm:w-[19rem] sm:h-[19rem] md:w-[21rem] md:h-[21rem] lg:w-[24rem] lg:h-[24rem] xl:w-[28rem] xl:h-[28rem] 2xl:w-[34rem] 2xl:h-[34rem] border-2 border-purple-300/20 rounded-full animate-pulse delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute -bottom-12 sm:-bottom-14 md:-bottom-16 lg:-bottom-18 xl:-bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce mt-8 sm:mt-10 md:mt-12 -mb-5 ml-31">
          <button
            onClick={() => handleNavigation('#about')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-red-600 transition-colors duration-300 min-h-[44px] min-w-[44px] justify-center"
            aria-label="Scroll to next section"
          >
            <span className="text-xs font-medium">Explore More</span>
            <ArrowDownwardIcon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <style>
        {`
          /* Touch-friendly buttons for mobile */
          @media (hover: none) and (pointer: coarse) {
            button {
              min-height: 44px;
              min-width: 44px;
            }
          }
          
          /* Prevent zoom on input focus for iOS */
          @media (max-width: 768px) {
            input, textarea, select {
              font-size: 16px;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Home;