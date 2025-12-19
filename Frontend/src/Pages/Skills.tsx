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
      icon: <CodeIcon sx={{ fontSize: "2rem" }} />,
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
      icon: <PaletteIcon sx={{ fontSize: "2rem" }} />,
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
      icon: <StorageIcon sx={{ fontSize: "2rem" }} />,
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
        className="mb-6 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
            {skill}
          </span>
          <span className="text-sm font-bold text-gray-500">
            {animatedPercentage}%
          </span>
        </div>
        
        <div className="relative">
          {/* Water container */}
          <div className="w-full bg-gray-50 rounded-full h-4 overflow-hidden shadow-inner border border-gray-100">
            {/* Water fill with wave animation */}
            <div 
              className={`h-4 rounded-full ${color} transition-all duration-1000 ease-out overflow-hidden relative ${
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
                <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-water-bubble" style={{ top: '8px', left: '20%', animationDelay: '0s' }} />
                <div className="absolute w-1 h-1 bg-white rounded-full animate-water-bubble" style={{ top: '10px', left: '45%', animationDelay: '0.7s' }} />
                <div className="absolute w-2 h-2 bg-white rounded-full animate-water-bubble" style={{ top: '6px', left: '70%', animationDelay: '1.4s' }} />
                <div className="absolute w-1 h-1 bg-white rounded-full animate-water-bubble" style={{ top: '12px', left: '85%', animationDelay: '2.1s' }} />
              </div>
            </div>
            
            {/* Water reflection layer */}
            <div 
              className={`absolute top-0 left-0 h-4 rounded-full ${color} opacity-20 transition-all duration-1200 ease-out`}
              style={{ 
                width: `${isVisible ? animatedPercentage : 0}%`,
                transition: `width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 100 + 200}ms`,
                filter: 'blur(1px)'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const SkillCategory: React.FC<SkillCategoryProps> = ({ category, index, isVisible }) => (
    <div 
      className={`group bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } hover:-translate-y-0.5`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-2xl bg-linear-to-r ${category.color} text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
          {category.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
            {category.title}
          </h3>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-2">
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
        `}
      </style>

      <section id="skills" ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden ">
        {/* Light Background Elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply opacity-40 animate-soft-float"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-50 rounded-full mix-blend-multiply opacity-40 animate-soft-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-50 rounded-full mix-blend-multiply opacity-30 animate-soft-float-slow"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-linear-to-r from-blue-300 to-cyan-300 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">
                Technical Skills
              </span>
              <div className="w-8 h-0.5 bg-linear-to-r from-cyan-300 to-blue-300 rounded-full"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-700 mb-4">
              Skills & <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Proficiency</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              A professional overview of technical skills and proficiency levels.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {skillData.map((category, index) => (
              <SkillCategory 
                key={category.title} 
                category={category} 
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Additional Info */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-500 hover:scale-105">
              <div className="p-2 bg-linear-to-r from-blue-300 to-cyan-400 rounded-full text-white shadow-md">
                <TrendingUpIcon className="text-lg" />
              </div>
              <span className="text-gray-600 font-medium text-lg">
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