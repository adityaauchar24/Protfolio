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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const InfoDetail = [
    { 
      title: "Name", 
      detail: "Aditya Auchar", 
      icon: <PersonIcon className="text-2xl sm:text-3xl md:text-4xl" />,
      color: "from-blue-50 to-blue-100",
      iconColor: "text-blue-500",
      link: null
    },
    { 
      title: "Email", 
      detail: "adityaauchar40@gmail.com", 
      icon: <EmailIcon className="text-2xl sm:text-3xl md:text-4xl" />,
      color: "from-green-50 to-green-100",
      iconColor: "text-green-500",
      link: "mailto:adityaauchar40@gmail.com"
    },
    { 
      title: "Phone", 
      detail: "+91 8097459014", 
      icon: <LocalPhoneIcon className="text-2xl sm:text-3xl md:text-4xl" />,
      color: "from-purple-50 to-purple-100",
      iconColor: "text-purple-500",
      link: "tel:+918097459014"
    },
    {
      title: "LinkedIn",
      detail: "aditya-auchar-390147334",
      icon: <LinkedInIcon className="text-2xl sm:text-3xl md:text-4xl" />,
      color: "from-cyan-50 to-cyan-100",
      iconColor: "text-cyan-500",
      link: "https://www.linkedin.com/in/aditya-auchar-390147334/"
    },
  ];

  const stats = [
    { number: "1+", label: "Years Experience", icon: <WorkspacePremiumIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
    { number: "10+", label: "Projects Completed", icon: <CodeIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
    { number: "100%", label: "Client Satisfaction", icon: <TrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
  ];

  const experiences = [
    {
      title: "Meta",
      role: "Frontend Developer Intern",
      description: "Working on international trade platform development with real-time data communication and REST API integration.",
      technologies: ["React.js", "TypeScript", "Node.js", "MongoDB", "Material UI"],
      icon: <BusinessIcon className="text-xl sm:text-2xl md:text-3xl" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Freelance Projects",
      role: "Full Stack Developer",
      description: "Developed multiple full-stack applications with modern UI/UX, focusing on scalability and performance optimization.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      icon: <WorkIcon className="text-xl sm:text-2xl md:text-3xl" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Mesbro Projects",
      role: "Full Stack Developer",
      description: "Built various web applications and systems as part of chat Application, focusing on software engineering principles.",
      technologies: ["JavaScript", "HTML/CSS", "Python", "MySQL", "Bootstrap"],
      icon: <SchoolIcon className="text-xl sm:text-2xl md:text-3xl" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  const handleConnectClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <section id="about" className="relative overflow-hidden w-full">
      <div className="container mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 w-full">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5">
            <div className="w-4 sm:w-5 md:w-6 h-0.5 bg-gradient-to-r from-red-600 to-red-400"></div>
            <span className="text-xs sm:text-sm md:text-base font-semibold text-red-600 uppercase tracking-wider">
              About Me
            </span>
            <div className="w-4 sm:w-5 md:w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-600"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent px-2 sm:px-4">
            Know Me Better
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-3 sm:mt-4 md:mt-5 max-w-2xl mx-auto px-2 sm:px-4">
            Full Stack Developer crafting digital experiences that make a difference
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 w-full">
          {/* Image Section */}
          <div className={`flex-1 flex justify-center lg:justify-start transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} order-2 lg:order-1 w-full mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-10`}>
            <div className="relative">
              {/* Background Gradient Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 rounded-full blur-xl sm:blur-2xl md:blur-3xl opacity-20 animate-pulse"></div>
              
              {/* Main Circular Image Container */}
              <div className="relative group">
                {/* Outer Glow Effect */}
                <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 lg:-inset-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                
                {/* Responsive Circular Image Container */}
                <div className="relative w-56 h-56 xs:w-60 xs:h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] rounded-full shadow-xl sm:shadow-2xl border-4 sm:border-6 md:border-8 border-white bg-white overflow-hidden">
                  <img
                    src={profileImg}
                    alt="Aditya Auchar - Full Stack Developer"
                    className="w-full h-full object-cover object-center scale-110 sm:scale-115 md:scale-120 lg:scale-125"
                    loading="eager"
                  />
                  
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </div>
              </div>

              {/* Responsive Animated Rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[16rem] h-[16rem] xs:w-[18rem] xs:h-[18rem] sm:w-[20rem] sm:h-[20rem] md:w-[22rem] md:h-[22rem] lg:w-[26rem] lg:h-[26rem] xl:w-[28rem] xl:h-[28rem] border-2 border-blue-300/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[18rem] h-[18rem] xs:w-[20rem] xs:h-[20rem] sm:w-[22rem] sm:h-[22rem] md:w-[24rem] md:h-[24rem] lg:w-[28rem] lg:h-[28rem] xl:w-[30rem] xl:h-[30rem] border-2 border-purple-300/20 rounded-full animate-pulse delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`flex-1 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} order-1 lg:order-2 w-full`}>
            {/* Title & Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 w-full">
              <div className="px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white font-semibold text-lg sm:text-base md:text-sm shadow-lg sm:shadow-xl whitespace-nowrap">
                Full Stack Developer
              </div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Introduction */}
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center lg:text-left px-2 sm:px-4 lg:px-0">
              Crafting Digital Experiences with <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">Precision</span>
            </h3>

            {/* Description */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5 text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed sm:leading-loose px-2 sm:px-4 lg:px-0">
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
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 my-6 sm:my-8 md:my-10 px-2 sm:px-4 lg:px-0">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${isVisible ? 'opacity-100' : 'opacity-0'} touch-manipulation`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-red-50 to-red-100 text-red-500">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-4 lg:px-0">
              {InfoDetail.map((item, index) => (
                <a
                  key={index}
                  href={item.link || '#'}
                  onClick={(e) => !item.link && e.preventDefault()}
                  className={`group p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-400 hover:border-transparent hover:shadow-lg active:scale-95 ${isVisible ? 'opacity-100' : 'opacity-0'} touch-manipulation`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                  target={item.link?.startsWith('http') ? '_blank' : undefined}
                  rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <div className="flex flex-col items-center text-center gap-2 sm:gap-3 md:gap-4">
                    {/* Professional Icon with Subtle Animations */}
                    <div className={`relative p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.color} transition-all duration-400 group-hover:scale-105`}>
                      <div className={`${item.iconColor} transition-all duration-400 group-hover:scale-110`}>
                        {item.icon}
                      </div>
                      
                      {/* Subtle Pulse Effect */}
                      <div className={`absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 custom-ping-slow`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="text-xs sm:text-sm md:text-base font-medium text-gray-500 mb-1 transition-all duration-400 group-hover:text-gray-600">
                        {item.title}
                      </div>
                      <div className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg transition-all duration-400 group-hover:text-gray-900 break-words overflow-wrap-anywhere">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle Background Glow on Hover */}
                  <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-all duration-400 -z-10`}></div>
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center lg:justify-start items-center px-2 sm:px-4 lg:px-0 w-full">
              {/* Let's Connect Button */}
              <button
                onClick={handleConnectClick}
                className="group relative flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto min-h-[48px] sm:min-h-[52px] md:min-h-[56px] touch-manipulation"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Button Content */}
                <span className="relative z-10 text-sm sm:text-base md:text-lg">Let's Connect</span>
                <div className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</div>
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-red-400 opacity-0 group-hover:opacity-100 transition-all duration-500 custom-pulse-slow"></div>
              </button>
              
              {/* Download CV Button */}
              <button
                onClick={handleDownloadCV}
                className="group relative flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto min-h-[48px] sm:min-h-[52px] md:min-h-[56px] touch-manipulation"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Button Content */}
                <DownloadIcon className="relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:text-red-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="relative z-10 transition-all duration-300 group-hover:text-red-600 text-sm sm:text-base md:text-lg">Download CV</span>
                
                {/* Border Animation */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-red-300 transition-all duration-500"></div>
                
                {/* Download Animation Effect */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-700 group-hover:w-full"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className={`mt-12 sm:mt-14 md:mt-16 lg:mt-20 xl:mt-24 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
              <div className="w-4 sm:w-5 md:w-6 h-0.5 bg-gradient-to-r from-red-600 to-red-400"></div>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-red-600 uppercase tracking-wider">
                Journey
              </span>
              <div className="w-4 sm:w-5 md:w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-600"></div>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent px-2 sm:px-4">
              Professional Timeline
            </h3>
            <p className="text-gray-600 mt-2 sm:mt-3 md:mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2 sm:px-4">
              My career progression and key milestones in web development
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line - Hidden on mobile, visible on md+ */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-red-500"></div>
            
            <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row md:items-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}
                >
                  {/* Timeline node - Hidden on mobile */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border-4 border-white shadow-lg bg-white">
                    <div className={`w-full h-full rounded-full ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`} />
                  </div>
                  
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 lg:pr-10 xl:pr-12 text-left' : 'md:pl-8 lg:pl-10 xl:pl-12'}`}>
                    <div 
                      className="group bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 touch-manipulation"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl ${index === 0 ? 'bg-blue-50 text-blue-600' : index === 1 ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                          {exp.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">{exp.title}</h4>
                          <p className="text-xs sm:text-sm md:text-base text-red-600 font-medium">{exp.role}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose">{exp.description}</p>
                      
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                        {exp.technologies.map((tech) => (
                          <span 
                            key={tech}
                            className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Hover gradient effect */}
                      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-5 transition-all duration-300 -z-10`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* Add CSS animations */}
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
          
          /* Responsive font scaling */
          @media (max-width: 360px) {
            .text-responsive {
              font-size: 0.875rem;
            }
          }
          
          /* Safe area insets for notched devices */
          @supports (padding: max(0px)) {
            .container {
              padding-left: max(1rem, env(safe-area-inset-left));
              padding-right: max(1rem, env(safe-area-inset-right));
            }
          }
          
          /* Touch device optimizations */
          @media (hover: none) and (pointer: coarse) {
            .hover\:scale-105:hover {
              transform: none;
            }
            .group:hover .group-hover\:scale-105 {
              transform: none;
            }
          }
          
          /* Reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .transition-all,
            .animate-pulse,
            .custom-ping-slow,
            .custom-pulse-slow {
              transition: none;
              animation: none;
            }
          }
        `}
      </style> 
    </section>
  );
};

export default About;