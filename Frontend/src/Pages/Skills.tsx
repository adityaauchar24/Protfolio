import React, { useState, useEffect, useRef } from "react";
import CodeIcon from "@mui/icons-material/Code";
import PaletteIcon from "@mui/icons-material/Palette";
import StorageIcon from "@mui/icons-material/Storage";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Define TypeScript interfaces
interface SkillItem {
  skill: string;
  percentage: number;
  color: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactElement;
  color: string;
  skills: SkillItem[];
}

interface WaterProgressBarProps {
  skill: string;
  percentage: number;
  color: string;
  index: number;
  animatedPercentages: Record<string, number>;
  isVisible: boolean;
}

interface SkillCategoryProps {
  category: SkillCategory;
  index: number;
  isVisible: boolean;
}

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedPercentages, setAnimatedPercentages] = useState<Record<string, number>>({});
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          
          // Staggered water animation
          skillData.forEach((category, categoryIndex) => {
            category.skills.forEach((skill, skillIndex) => {
              const delay = (categoryIndex * 200) + (skillIndex * 150);
              setTimeout(() => {
                setAnimatedPercentages(prev => ({
                  ...prev,
                  [skill.skill]: skill.percentage
                }));
              }, delay);
            });
          });
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '-50px 0px'
      }
    );

    const element = sectionRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasAnimated]);

  const skillData: SkillCategory[] = [
    {
      title: "Frontend Development",
      icon: <CodeIcon className="text-lg sm:text-xl md:text-2xl lg:text-3xl" />,
      color: "from-blue-400 to-blue-500",
      skills: [
        { skill: "React JS", percentage: 95, color: "bg-blue-400" },
        { skill: "JavaScript", percentage: 87, color: "bg-amber-400" },
        { skill: "TypeScript", percentage: 85, color: "bg-blue-500" },
        { skill: "Redux", percentage: 95, color: "bg-purple-400" },
        { skill: "HTML5", percentage: 98, color: "bg-orange-400" },
        { skill: "Next.js", percentage: 80, color: "bg-gray-500" },
      ],
    },
    {
      title: "Styling & UI Libraries",
      icon: <PaletteIcon className="text-lg sm:text-xl md:text-2xl lg:text-3xl" />,
      color: "from-purple-400 to-purple-500",
      skills: [
        { skill: "CSS3", percentage: 98, color: "bg-blue-500" },
        { skill: "Tailwind CSS", percentage: 90, color: "bg-cyan-400" },
        { skill: "Material UI", percentage: 88, color: "bg-blue-400" },
        { skill: "Bootstrap", percentage: 88, color: "bg-purple-400" },
        { skill: "Styled Components", percentage: 82, color: "bg-pink-400" },
        { skill: "SASS/SCSS", percentage: 85, color: "bg-pink-500" },
      ],
    },
    {
      title: "Backend & Tools",
      icon: <StorageIcon className="text-lg sm:text-xl md:text-2xl lg:text-3xl" />,
      color: "from-green-400 to-green-500",
      skills: [
        { skill: "Node.js", percentage: 75, color: "bg-green-400" },
        { skill: "Express.js", percentage: 70, color: "bg-gray-500" },
        { skill: "MongoDB", percentage: 65, color: "bg-green-500" },
        { skill: "Git & GitHub", percentage: 92, color: "bg-gray-600" },
        { skill: "REST APIs", percentage: 88, color: "bg-teal-400" },
        { skill: "Webpack", percentage: 75, color: "bg-blue-500" },
      ],
    },
  ];

  const WaterProgressBar: React.FC<WaterProgressBarProps> = ({ 
    skill, 
    percentage, 
    color, 
    index, 
    animatedPercentages, 
    isVisible 
  }) => {
    const animatedPercentage = animatedPercentages[skill] || 0;
    const [, setIsHovered] = useState(false);
    
    return (
      <div 
        className="mb-4 sm:mb-5 md:mb-6 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-sm sm:text-base md:text-lg truncate pr-2">
            {skill}
          </span>
          <span className="text-sm sm:text-base font-bold text-gray-500 whitespace-nowrap">
            {animatedPercentage}%
          </span>
        </div>
        
        <div className="relative">
          {/* Water container */}
          <div className="w-full bg-gray-50 rounded-full h-2 sm:h-3 md:h-4 overflow-hidden shadow-inner border border-gray-100">
            {/* Water fill with wave animation */}
            <div 
              className={`h-2 sm:h-3 md:h-4 rounded-full ${color} transition-all duration-1000 ease-out overflow-hidden relative ${
                isVisible ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={{ 
                width: `${percentage}%`,
                transitionDelay: `${index * 100 + 300}ms`,
                transformOrigin: 'left'
              }}
            >
              {/* Water wave effect */}
              <div 
                className="absolute top-0 left-0 w-full h-full opacity-30 animate-water-wave"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                  animationDelay: `${index * 200}ms`
                }}
              />
              
              {/* Water bubbles */}
              <div className="absolute inset-0">
                <div className="absolute w-1 h-1 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-water-bubble" style={{ top: '2px', left: '20%', animationDelay: '0s' }} />
                <div className="absolute w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-water-bubble" style={{ top: '4px', left: '45%', animationDelay: '0.7s' }} />
                <div className="absolute w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-water-bubble" style={{ top: '1px', left: '70%', animationDelay: '1.4s' }} />
                <div className="absolute w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-water-bubble" style={{ top: '5px', left: '85%', animationDelay: '2.1s' }} />
              </div>
            </div>
            
            {/* Water reflection layer */}
            <div 
              className={`absolute top-0 left-0 h-2 sm:h-3 md:h-4 rounded-full ${color} opacity-20 transition-all duration-1200 ease-out`}
              style={{ 
                width: `${isVisible ? animatedPercentage : 0}%`,
                transition: `width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 100 + 200}ms`,
                filter: 'blur(0.5px) sm:blur(1px)'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const SkillCategory: React.FC<SkillCategoryProps> = ({ category, index, isVisible }) => (
    <div 
      className={`group bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } hover:-translate-y-0.5`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Category Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className={`p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${category.color} text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-700 group-hover:text-gray-800 transition-colors duration-300 truncate">
            {category.title}
          </h3>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-1 sm:space-y-2">
        {category.skills.map((skillItem, skillIndex) => (
          <WaterProgressBar 
            key={skillItem.skill}
            skill={skillItem.skill}
            percentage={skillItem.percentage}
            color={skillItem.color}
            index={skillIndex}
            animatedPercentages={animatedPercentages}
            isVisible={isVisible}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes soft-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes soft-float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes soft-float-slow {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-6px) scale(1.01); }
          }
          @keyframes water-wave {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes water-bubble {
            0% { 
              transform: translateY(0) scale(1); 
              opacity: 0.6; 
            }
            50% { 
              opacity: 0.8; 
            }
            100% { 
              transform: translateY(-10px) scale(1.2); 
              opacity: 0; 
            }
          }
          .animate-soft-float {
            animation: soft-float 8s ease-in-out infinite;
          }
          .animate-soft-float-delayed {
            animation: soft-float-delayed 10s ease-in-out infinite;
          }
          .animate-soft-float-slow {
            animation: soft-float-slow 12s ease-in-out infinite;
          }
          .animate-water-wave {
            animation: water-wave 4s ease-in-out infinite;
          }
          .animate-water-bubble {
            animation: water-bubble 3s ease-in-out infinite;
          }

          /* Mobile optimizations */
          @media (max-width: 640px) {
            .animate-soft-float,
            .animate-soft-float-delayed,
            .animate-soft-float-slow {
              animation-duration: 12s;
            }
            
            .animate-water-wave,
            .animate-water-bubble {
              animation-duration: 6s;
            }
          }

          /* Reduced motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .animate-soft-float,
            .animate-soft-float-delayed,
            .animate-soft-float-slow,
            .animate-water-wave,
            .animate-water-bubble,
            .transition-all,
            .transition-transform,
            .transition-colors,
            .transition-opacity {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>

      <section id="skills" ref={sectionRef} className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 overflow-hidden">
        {/* Light Background Elements - Responsive */}
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-blue-50 rounded-full mix-blend-multiply opacity-40 animate-soft-float"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-cyan-50 rounded-full mix-blend-multiply opacity-40 animate-soft-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] bg-sky-50 rounded-full mix-blend-multiply opacity-30 animate-soft-float-slow"></div>
        
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 relative z-10">
          {/* Section Header - Responsive */}
          <div className={`text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-6 h-0.5 sm:w-8 sm:h-0.5 md:w-10 md:h-1 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full"></div>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
                Technical Skills
              </span>
              <div className="w-6 h-0.5 sm:w-8 sm:h-0.5 md:w-10 md:h-1 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-gray-700 mb-3 sm:mb-4 px-2 sm:px-4">
              Skills & <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Proficiency</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed px-4 sm:px-6">
              A professional overview of technical skills and proficiency levels.
            </p>
          </div>

          {/* Skills Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            {skillData.map((category, index) => (
              <SkillCategory 
                key={category.title} 
                category={category} 
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Additional Info - Responsive */}
          <div className={`text-center mt-12 sm:mt-16 md:mt-20 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-500 hover:scale-105 max-w-2xl mx-auto">
              <div className="p-2 sm:p-2.5 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full text-white shadow-md">
                <TrendingUpIcon className="text-sm sm:text-base md:text-lg" />
              </div>
              <span className="text-gray-600 font-medium text-sm sm:text-base md:text-lg text-center sm:text-left">
                Continuously learning and adapting to new technologies
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;