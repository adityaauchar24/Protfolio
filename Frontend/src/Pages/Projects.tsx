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
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105 lg:group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
            Featured
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
          {project.category}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => openInNewTab(project.liveUrl)}
            className="p-2 sm:p-3 bg-white text-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn min-h-10 sm:min-h-11 min-w-10 sm:min-w-11 flex items-center justify-center"
            title="View Live Demo"
            type="button"
            aria-label={`View ${project.name} live demo`}
          >
            <LaunchIcon className="group-hover/btn:scale-110 transition-transform duration-300 text-base sm:text-lg lg:text-xl" />
          </button>
          <button
            onClick={() => openInNewTab(project.gitUrl)}
            className="p-2 sm:p-3 bg-gray-900 text-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn min-h-10 sm:min-h-11 min-w-10 sm:min-w-11 flex items-center justify-center"
            title="View Source Code"
            type="button"
            aria-label={`View ${project.name} source code`}
          >
            <GitHubIcon className="group-hover/btn:scale-110 transition-transform duration-300 text-base sm:text-lg lg:text-xl" />
          </button>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
            {project.name}
          </h3>
        </div>
        
        <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base line-clamp-3">
          {project.detail}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {project.technologies.slice(0, 3).map((tech, techIndex) => (
            <span 
              key={techIndex}
              className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full border border-gray-200"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-500 text-xs sm:text-sm rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 lg:mt-8">
          <button
            onClick={() => openInNewTab(project.liveUrl)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex-1 justify-center min-h-10 sm:min-h-11 text-xs sm:text-sm lg:text-base"
            type="button"
            aria-label={`Open ${project.name} live demo`}
          >
            <OpenInNewIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span>Live Demo</span>
          </button>
          <button
            onClick={() => openInNewTab(project.gitUrl)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 sm:border-2 text-gray-700 font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300 min-h-10 sm:min-h-11 min-w-10 sm:min-w-11 justify-center"
            type="button"
            aria-label={`View ${project.name} source code`}
          >
            <GitHubIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-transparent group-hover:border-red-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );

  return (
    <section id="projects" className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
            <div className="w-4 sm:w-5 lg:w-6 h-0.5 bg-gradient-to-r from-red-600 to-red-400"></div>
            <span className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wider">
              My Work
            </span>
            <div className="w-4 sm:w-5 lg:w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-600"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 sm:mb-3 lg:mb-4">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
            Here are some of my recent projects that showcase my skills in frontend development, 
            responsive design, and modern web technologies.
          </p>
        </div>

        {/* Projects Grid - Fixed the fixed width/height issue */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {projectData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-8 sm:mt-12 lg:mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-gray-600 mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">
            Interested in seeing more? Check out my GitHub for additional projects and code samples.
          </p>
          <button
            onClick={() => openInNewTab("https://github.com/adityaauchar24")}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 border border-gray-300 sm:border-2 text-gray-700 font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-300 min-h-10 sm:min-h-11 text-xs sm:text-sm lg:text-base"
            type="button"
            aria-label="View all projects on GitHub"
          >
            <GitHubIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
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

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:scale-105:hover,
          .group-hover\\:scale-110:hover {
            transform: scale(1.02);
          }
          
          .group-hover\\:opacity-100:hover {
            opacity: 0.8;
          }
          
          /* Remove hover effects on touch devices */
          .group:hover .group-hover\\:opacity-100 {
            opacity: 0.8;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          .transition-transform,
          .transition-opacity,
          .transition-colors,
          .hover\\:scale-105,
          .group-hover\\:scale-110,
          .animate-pulse {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
          
          .group:hover .group-hover\\:opacity-100,
          .group:hover .group-hover\\:scale-110 {
            opacity: 1;
            transform: none;
          }
        }

        /* High DPI optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }

        /* Very small screens optimization */
        @media (max-width: 320px) {
          .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .project-card {
            margin: 0.125rem;
          }
        }

        /* Large screen optimization */
        @media (min-width: 1920px) {
          .container {
            max-width: 1440px;
          }
          
          .project-card {
            max-width: 28rem;
          }
        }

        /* Landscape mode optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          #projects {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          
          .project-card {
            max-height: 24rem;
          }
        }

        /* Print styles */
        @media print {
          button,
          [type="button"] {
            display: none;
          }
          
          .project-card {
            break-inside: avoid;
            margin-bottom: 1rem;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          
          img {
            max-height: 200px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .dark\\:bg-gray-800 {
            background-color: #1f2937;
          }
          
          .dark\\:border-gray-700 {
            border-color: #374151;
          }
          
          .dark\\:text-gray-200 {
            color: #e5e7eb;
          }
          
          .dark\\:text-gray-400 {
            color: #9ca3af;
          }
          
          .dark\\:bg-gray-900 {
            background-color: #111827;
          }
        }

        /* Reduced data mode */
        @media (prefers-reduced-data: reduce) {
          img {
            loading: lazy;
          }
          
          .animate-pulse {
            display: none;
          }
          
          .bg-blur {
            backdrop-filter: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;