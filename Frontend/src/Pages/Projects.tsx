import { useState, useEffect } from "react";
import ticTacToeGameImg from "../Images/ticTacToeGameImg.png";
import protfolioWebsiteImg from "../Images/protfolioWebsiteImg.png";
import madiraWebImg from "../Images/madiraWebImg.png";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";

interface Project {
  id: number;
  name: string;
  detail: string;
  img: string;
  gitUrl: string;
  liveUrl: string;
  technologies: string[];
  category: string;
  featured: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('projects');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const projectData: Project[] = [
    {
      id: 1,
      name: "Tic Tac Toe Game",
      detail: "A modern, interactive Tic Tac Toe game built with React featuring real-time gameplay, win detection, and responsive design. Includes game history and player turn indicators.",
      img: ticTacToeGameImg,
      gitUrl: "https://github.com/adityaauchar24/Tic-Tac-Toe-Game",
      liveUrl: "http://localhost:5174/",
      technologies: ["React.js", "Node.js", "MongoDB", "Redux"],
      category: "Game Development",
      featured: true
    },
    {
      id: 2,
      name: "Portfolio Website",
      detail: "A professional portfolio website showcasing projects and skills with modern UI/UX design. Features smooth animations, responsive layout, and contact form integration.",
      img: protfolioWebsiteImg,
      gitUrl: "https://github.com/adityaauchar24/Protfolio",
      liveUrl: "https://protfolio-frontend-ytfj.onrender.com",
      technologies: ["React.js", "Node.js", "MongoDB", "Redux"],
      category: "Web Development",
      featured: true
    },
    {
      id: 3,
      name: "Business Website",
      detail: "A responsive static website for business showcasing services and contact information. Built with modern web standards and optimized for performance across all devices.",
      img: madiraWebImg,
      gitUrl: "https://github.com/adityaauchar24/Mandiri-website",
      liveUrl: "https://papaya-sawine-880e7c.netlify.app/",
      technologies: ["React.js", "Node.js", "MongoDB", "Redux"],
      category: "Business Website",
      featured: false
    },
  ];

  const openInNewTab = (url: string) => {
    if (!url || url.includes('localhost')) {
      alert("This project is not currently deployed");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const ProjectCard = ({ project, index }: ProjectCardProps) => (
    <div 
      className={`group relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] md:hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${300 + index * 100}ms` }}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <img
          src={project.img}
          alt={project.name}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-105 lg:group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-3 sm:left-4 md:left-5 right-3 sm:right-4 md:right-5">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full border border-white/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 sm:top-4 md:top-5 left-3 sm:left-4 md:left-5 px-2 sm:px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg">
            Featured
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5 px-2 sm:px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full">
          {project.category}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2 sm:gap-3 md:gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => openInNewTab(project.liveUrl)}
            className="p-2 sm:p-3 md:p-3.5 bg-white text-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn min-h-10 sm:min-h-11 md:min-h-12 min-w-10 sm:min-w-11 md:min-w-12 flex items-center justify-center"
            title="View Live Demo"
            type="button"
            aria-label={`View ${project.name} live demo`}
          >
            <LaunchIcon className="group-hover/btn:scale-110 transition-transform duration-300 text-base sm:text-lg md:text-xl" />
          </button>
          <button
            onClick={() => openInNewTab(project.gitUrl)}
            className="p-2 sm:p-3 md:p-3.5 bg-gray-900 text-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn min-h-10 sm:min-h-11 md:min-h-12 min-w-10 sm:min-w-11 md:min-w-12 flex items-center justify-center"
            title="View Source Code"
            type="button"
            aria-label={`View ${project.name} source code`}
          >
            <GitHubIcon className="group-hover/btn:scale-110 transition-transform duration-300 text-base sm:text-lg md:text-xl" />
          </button>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-4 sm:p-5 md:p-6 lg:p-7">
        <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
            {project.name}
          </h3>
        </div>
        
        <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 md:mb-5 text-xs sm:text-sm md:text-base lg:text-lg line-clamp-3">
          {project.detail}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-5">
          {project.technologies.slice(0, 3).map((tech, techIndex) => (
            <span 
              key={techIndex}
              className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm md:text-base rounded-full border border-gray-200"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-500 text-xs sm:text-sm md:text-base rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-7 lg:mt-8">
          <button
            onClick={() => openInNewTab(project.liveUrl)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex-1 justify-center min-h-10 sm:min-h-11 md:min-h-12 text-xs sm:text-sm md:text-base lg:text-base"
            type="button"
            aria-label={`Open ${project.name} live demo`}
          >
            <OpenInNewIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span>Live Demo</span>
          </button>
          <button
            onClick={() => openInNewTab(project.gitUrl)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 border border-gray-300 sm:border-2 md:border-2 text-gray-700 font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300 min-h-10 sm:min-h-11 md:min-h-12 min-w-10 sm:min-w-11 md:min-w-12 justify-center"
            type="button"
            aria-label={`View ${project.name} source code`}
          >
            <GitHubIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-transparent group-hover:border-red-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );

  return (
    <section id="projects" className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4 lg:mb-5">
            <div className="w-4 sm:w-5 md:w-6 h-0.5 bg-gradient-to-r from-red-600 to-red-400"></div>
            <span className="text-xs sm:text-sm md:text-base font-semibold text-red-600 uppercase tracking-wider">
              My Work
            </span>
            <div className="w-4 sm:w-5 md:w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-600"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 lg:mb-5">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
            Here are some of my recent projects that showcase my skills in frontend development, 
            responsive design, and modern web technologies.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {projectData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-8 sm:mt-12 md:mt-16 lg:mt-20 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-sm sm:text-base md:text-lg">
            Interested in seeing more? Check out my GitHub for additional projects and code samples.
          </p>
          <button
            onClick={() => openInNewTab("https://github.com/adityaauchar24")}
            className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-3.5 lg:py-4 border border-gray-300 sm:border-2 md:border-2 text-gray-700 font-semibold rounded-lg sm:rounded-xl md:rounded-2xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300 min-h-10 sm:min-h-11 md:min-h-12 text-xs sm:text-sm md:text-base lg:text-lg"
            type="button"
            aria-label="View all projects on GitHub"
          >
            <GitHubIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span>View All Projects on GitHub</span>
          </button>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* Line clamp utility */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Mobile touch optimization */
        @media (max-width: 768px) {
          button {
            min-height: 44px;
            min-width: 44px;
          }
          
          .hover\\:scale-105:hover,
          .group-hover\\:scale-110:hover {
            transform: scale(1.02);
          }
        }

        /* Very small screen optimization */
        @media (max-width: 320px) {
          .container {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
          
          h2 {
            font-size: 1.5rem !important;
          }
          
          p {
            font-size: 0.75rem !important;
          }
        }

        /* Tablet optimization */
        @media (min-width: 768px) and (max-width: 1023px) {
          .container {
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          
          .grid {
            gap: 1rem !important;
          }
        }

        /* Desktop optimization */
        @media (min-width: 1024px) {
          .grid {
            gap: 1.5rem !important;
          }
        }

        /* Large desktop optimization */
        @media (min-width: 1536px) {
          .container {
            max-width: 1280px !important;
          }
          
          .grid {
            gap: 2rem !important;
          }
        }

        /* Landscape mobile optimization */
        @media (max-height: 600px) and (orientation: landscape) {
          #projects {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          
          .project-card img {
            height: 40vh !important;
          }
        }

        /* Print styles */
        @media print {
          #projects {
            padding: 0 !important;
          }
          
          button,
          [type="button"] {
            display: none !important;
          }
          
          .project-card {
            break-inside: avoid !important;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .transition-transform,
          .transition-opacity,
          .transition-colors,
          .animate-pulse {
            transition: none !important;
            animation: none !important;
          }
          
          .hover\\:scale-105,
          .group-hover\\:scale-110 {
            transform: none !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .bg-gradient-to-r {
            background: linear-gradient(to right, #000, #333) !important;
          }
          
          .text-gray-600 {
            color: #333 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;