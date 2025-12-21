import { useState, useEffect } from "react";
import profileImg from "../Images/AjayAucharPhoto.png";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";
import CodeIcon from "@mui/icons-material/Code";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";

// Import your CV file
import cvFile from "../cv/Aditya_Auchar_React.js&Nodejs_Developer.pdf";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const InfoDetail = [
    { 
      title: "Name", 
      detail: "Aditya Auchar", 
      icon: <PersonIcon className="text-xl sm:text-2xl" />,
      color: "from-blue-50 to-blue-100",
      iconColor: "text-blue-500",
      link: null
    },
    { 
      title: "Email", 
      detail: "adityaauchar40@gmail.com", 
      icon: <EmailIcon className="text-xl sm:text-2xl" />,
      color: "from-green-50 to-green-100",
      iconColor: "text-green-500",
      link: "mailto:adityaauchar40@gmail.com"
    },
    { 
      title: "Phone", 
      detail: "+91 8097459014", 
      icon: <LocalPhoneIcon className="text-xl sm:text-2xl" />,
      color: "from-purple-50 to-purple-100",
      iconColor: "text-purple-500",
      link: "tel:+918097459014"
    },
    {
      title: "LinkedIn",
      detail: "aditya-auchar-390147334",
      icon: <LinkedInIcon className="text-xl sm:text-2xl" />,
      color: "from-cyan-50 to-cyan-100",
      iconColor: "text-cyan-500",
      link: "https://www.linkedin.com/in/aditya-auchar-390147334/"
    },
  ];

  const stats = [
    { number: "1+", label: "Years Experience", icon: <WorkspacePremiumIcon /> },
    { number: "10+", label: "Projects Completed", icon: <CodeIcon /> },
    { number: "100%", label: "Client Satisfaction", icon: <TrendingUpIcon /> },
  ];

  const experiences = [
    {
      title: "Meta",
      role: "Frontend Developer Intern",
      description: "Working on international trade platform development with real-time data communication and REST API integration.",
      technologies: ["React.js", "TypeScript", "Node.js", "MongoDB", "Material UI"],
      icon: <BusinessIcon className="text-lg sm:text-xl" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Freelance Projects",
      role: "Full Stack Developer",
      description: "Developed multiple full-stack applications with modern UI/UX, focusing on scalability and performance optimization.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      icon: <WorkIcon className="text-lg sm:text-xl" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Mesbro Projects",
      role: "Full Stack Developer",
      description: "Built various web applications and systems as part of chat Application, focusing on software engineering principles.",
      technologies: ["JavaScript", "HTML/CSS", "Python", "MySQL", "Bootstrap"],
      icon: <SchoolIcon className="text-lg sm:text-xl" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  const handleConnectClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = cvFile;
    link.download = 'Aditya_Auchar_Full_Stack_Developer_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="about" className="relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="w-4 md:w-6 h-0.5 bg-gradient-to-r from-red-600 to-red-400"></div>
            <span className="text-xs md:text-sm font-semibold text-red-600 uppercase tracking-wider">
              About Me
            </span>
            <div className="w-4 md:w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-600"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent px-4">
            Know Me Better
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-3 md:mt-4 max-w-2xl mx-auto px-4">
            Full Stack Developer crafting digital experiences that make a difference
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-12 lg:gap-16">
          {/* Image Section */}
          <div className={`flex-1 flex justify-start transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} lg:mt-0 order-2 lg:order-1 translate-y-10`}>
            <div className="relative">
              {/* Background Gradient Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 rounded-full blur-xl md:blur-2xl opacity-20 animate-pulse"></div>
              
              {/* Main Circular Image Container */}
              <div className="relative group">
                {/* Outer Glow Effect */}
                <div className="absolute -inset-3 md:-inset-4 lg:-inset-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                
                {/* Responsive Circular Image Container */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full shadow-2xl border-4 md:border-6 lg:border-8 border-white bg-white overflow-hidden">
                  <img
                    src={profileImg}
                    alt="Aditya Auchar - Full Stack Developer"
                    className="w-full h-full object-cover object-center scale-110 sm:scale-115 md:scale-120 lg:scale-125"
                  />
                  
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </div>
              </div>

              {/* Responsive Animated Rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[17rem] h-[17rem] sm:w-[19rem] sm:h-[19rem] md:w-[22rem] md:h-[22rem] lg:w-[26rem] lg:h-[26rem] border-2 border-blue-300/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[19rem] h-[19rem] sm:w-[21rem] sm:h-[21rem] md:w-[24rem] md:h-[24rem] lg:w-[28rem] lg:h-[28rem] border-2 border-purple-300/20 rounded-full animate-pulse delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`flex-1 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} order-1 lg:order-2`}>
            {/* Title & Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 md:mb-8">
              <div className="px-4 py-1.5 md:px-5 md:py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white font-semibold text-xs md:text-sm shadow-lg whitespace-nowrap">
                Full Stack Developer
              </div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Introduction */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center lg:text-left px-4 lg:px-0">
              Crafting Digital Experiences with <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">Precision</span>
            </h3>

            {/* Description */}
            <div className="space-y-4 md:space-y-6 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-4 lg:px-0">
              <p>
                I'm <strong className="text-gray-900">Aditya Auchar</strong>, a results-oriented 
                Full Stack Developer with over 1 year of experience in designing and 
                building high-performance web applications.
              </p>
              <p>
                I specialize in developing modern, interactive user interfaces using 
                cutting-edge technologies like <strong>React.js, Node.js, MongoDB, 
                TypeScript</strong>, and popular UI libraries including 
                <strong> Material UI</strong> and <strong>Tailwind CSS</strong>.
              </p>
              <p>
                My work focuses on delivering clean, scalable, and maintainable code 
                that enhances both user experience and system performance. I have 
                created <strong>Full-stack, International Trade platform during Meta 
                internship</strong>, with hands-on experience in real-time data communication, 
                efficient REST API integration, and managing complex application states.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6 my-8 md:my-10 px-4 lg:px-0">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12 px-4 lg:px-0">
              {InfoDetail.map((item, index) => (
                <a
                  key={index}
                  href={item.link || '#'}
                  onClick={(e) => !item.link && e.preventDefault()}
                  className={`group p-4 md:p-5 rounded-lg md:rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-400 hover:border-transparent hover:shadow-md ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  <div className="flex flex-col items-center text-center gap-3 md:gap-4">
                    {/* Professional Icon with Subtle Animations */}
                    <div className={`relative p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${item.color} transition-all duration-400 group-hover:scale-105`}>
                      <div className={`${item.iconColor} transition-all duration-400 group-hover:scale-110`}>
                        {item.icon}
                      </div>
                      
                      {/* Subtle Pulse Effect */}
                      <div className={`absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 custom-ping-slow`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="text-xs md:text-sm font-medium text-gray-500 mb-1 transition-all duration-400 group-hover:text-gray-600">
                        {item.title}
                      </div>
                      <div className="text-gray-800 font-semibold text-xs md:text-sm transition-all duration-400 group-hover:text-gray-900 truncate">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle Background Glow on Hover */}
                  <div className={`absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-all duration-400 -z-10`}></div>
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start items-center px-4 lg:px-0">
              {/* Let's Connect Button */}
              <button
                onClick={handleConnectClick}
                className="group relative flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 lg:px-10 py-3 md:py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Button Content */}
                <span className="relative z-10 text-sm md:text-base">Let's Connect</span>
                <div className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</div>
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-red-400 opacity-0 group-hover:opacity-100 transition-all duration-500 custom-pulse-slow"></div>
              </button>
              
              {/* Download CV Button */}
              <button
                onClick={handleDownloadCV}
                className="group relative flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 lg:px-10 py-3 md:py-4 border border-gray-300 md:border-2 text-gray-700 font-semibold rounded-xl md:rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Button Content */}
                <DownloadIcon className="relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:text-red-600 w-4 h-4 md:w-5 md:h-5" />
                <span className="relative z-10 transition-all duration-300 group-hover:text-red-600 text-sm md:text-base">Download CV</span>
                
                {/* Border Animation */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-red-300 transition-all duration-500"></div>
                
                {/* Download Animation Effect */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-700 group-hover:w-full"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Experience Timeline - Added at the bottom */}
        <div className={`mt-16 md:mt-20 lg:mt-24 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-4 md:w-6 h-0.5 bg-gradient-to-r from-red-600 to-red-400"></div>
              <span className="text-xs md:text-sm font-semibold text-red-600 uppercase tracking-wider">
                Journey
              </span>
              <div className="w-4 md:w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-600"></div>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent px-4">
              Professional Timeline
            </h3>
            <p className="text-gray-600 mt-2 md:mt-4 max-w-2xl mx-auto text-sm md:text-base px-4">
              My career progression and key milestones in web development
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line - Hidden on mobile, visible on md+ */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-red-500"></div>
            
            <div className="space-y-8 md:space-y-12">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row md:items-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}
                >
                  {/* Timeline node - Hidden on mobile */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-white shadow-lg bg-white">
                    <div className={`w-full h-full rounded-full ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`} />
                  </div>
                  
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 lg:pr-12 text-left' : 'md:pl-8 lg:pl-12'}`}>
                    <div 
                      className="group bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${index === 0 ? 'bg-blue-50 text-blue-600' : index === 1 ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                          {exp.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base md:text-lg">{exp.title}</h4>
                          <p className="text-xs md:text-sm text-red-600 font-medium">{exp.role}</p>
                          
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm leading-relaxed">{exp.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {exp.technologies.map((tech) => (
                          <span 
                            key={tech}
                            className="px-2 md:px-3 py-0.5 md:py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Hover gradient effect */}
                      <div className={`absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-5 transition-all duration-300 -z-10`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 md:w-72 md:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* Add CSS animations to your global CSS file or use this style tag */}
      <style>
        {`
          @keyframes ping-slow {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.02);
            }
          }
          .custom-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .custom-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
        `}
      </style> 
    </section>
  );
};

export default About;