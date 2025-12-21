import React, { useState, useEffect, useRef, useCallback, JSX } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloudIcon from "@mui/icons-material/Cloud";
import SyncIcon from "@mui/icons-material/Sync";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import StorageIcon from "@mui/icons-material/Storage";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";

// Environment configuration - FIXED
const API_URL = import.meta.env.VITE_API_URL || "https://protfolio-backend-8p47.onrender.com";
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "https://protfolio-frontend-ytfj.onrender.com";
const IS_RENDER = import.meta.env.VITE_RENDER === "true";

// TypeScript interfaces
interface ContactInfo {
  title: string;
  detail: string;
  icon: React.ReactElement;
  color: string;
  link: string;
}

interface FormErrors {
  fullname?: string;
  email?: string;
  address?: string;
  message?: string;
}

interface Message {
  type: "success" | "error" | "info" | "warning";
  mess: string;
}

interface ContactForm {
  fullname: string;
  email: string;
  address: string;
  message: string;
}

interface BackendStatus {
  status: "checking" | "connected" | "disconnected" | "sleeping";
  details: string;
  totalSubmissions?: number;
  lastChecked?: Date;
  responseTime?: number;
  uptime?: number;
}

interface DeploymentInfo {
  platform: "Render" | "Local";
  frontendUrl: string;
  backendUrl: string;
  database: string;
  status: "active" | "sleeping" | "offline";
}

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ type: "info", mess: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    status: "checking",
    details: "Checking backend connection...",
    totalSubmissions: 0
  });
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo>({
    platform: IS_RENDER ? "Render" : "Local",
    frontendUrl: FRONTEND_URL,
    backendUrl: API_URL,
    database: "MongoDB Atlas",
    status: "active"
  });
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const sectionRef = useRef<HTMLElement>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          checkBackendConnection();
        }
      },
      { threshold: 0.3 }
    );

    const element = sectionRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto message dismissal
  useEffect(() => {
    if (message.type && message.mess) {
      const timer = setTimeout(() => {
        setMessage({ type: "info", mess: "" });
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Auto-retry connection on mount
  useEffect(() => {
    const initialCheck = async () => {
      await checkBackendConnection();
      
      // Schedule periodic checks for Render free tier (spins down after inactivity)
      checkTimeoutRef.current = setInterval(() => {
        if (backendStatus.status !== "connected" && isOnline) {
          checkBackendConnection();
        }
      }, 60000); // Check every minute
    };

    initialCheck();

    return () => {
      if (checkTimeoutRef.current) {
        clearInterval(checkTimeoutRef.current);
        checkTimeoutRef.current = null;
      }
    };
  }, [isOnline]);

  const contactInfo: ContactInfo[] = [
    { 
      title: "Email", 
      detail: "adityaauchar40@gmail.com", 
      icon: <EmailIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-blue-500 to-cyan-400",
      link: "mailto:adityaauchar40@gmail.com"
    },
    { 
      title: "Phone", 
      detail: "+91 8097459014", 
      icon: <LocalPhoneIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-green-500 to-emerald-400",
      link: "tel:+918097459014"
    },
    {
      title: "LinkedIn",
      detail: "aditya-auchar-390147334",
      icon: <LinkedInIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-blue-600 to-blue-400",
      link: "https://www.linkedin.com/in/aditya-auchar-390147334/"
    },
    {
      title: "Location",
      detail: "Airoli, Navi Mumbai, Maharashtra, India",
      icon: <LocationPinIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-purple-500 to-pink-400",
      link: "https://maps.google.com/?q=Airoli,Navi+Mumbai"
    },
  ];

  const initialForm: ContactForm = {
    fullname: "",
    email: "",
    address: "",
    message: "",
  };

  const [contactForm, setContactForm] = useState<ContactForm>(initialForm);

  const checkBackendConnection = useCallback(async (): Promise<void> => {
    if (isCheckingBackend || !isOnline) return;
    
    setIsCheckingBackend(true);
    const startTime = performance.now();
    
    try {
      console.log(`🔗 [${new Date().toISOString()}] Checking backend connection to: ${API_URL}/api/health`);
      
      setBackendStatus(prev => ({
        ...prev,
        status: "checking",
        details: "Connecting to backend server...",
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      const responseTime = Math.round(performance.now() - startTime);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend connected:", data);
        
        setBackendStatus({
          status: "connected",
          details: `Connected to MongoDB Atlas | ${data.totalUsers || 0} submissions`,
          totalSubmissions: data.totalUsers || 0,
          lastChecked: new Date(),
          responseTime,
          uptime: data.server?.uptime
        });
        
        setConnectionRetries(0);
        
        if (connectionRetries > 0) {
          setMessage({ 
            type: "success", 
            mess: "Backend server reconnected successfully!" 
          });
        }
      } else {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
    } catch (error: unknown) {
      const responseTime = Math.round(performance.now() - startTime);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      console.error(`❌ Backend connection failed:`, errorMessage);
      
      const newRetries = connectionRetries + 1;
      setConnectionRetries(newRetries);
      
      let status: BackendStatus["status"] = "disconnected";
      let details = `Connection failed: ${errorMessage}`;
      
      if (errorMessage.includes("abort") || errorMessage.includes("timeout")) {
        status = "sleeping";
        details = "Backend server is waking up (Render free tier)...";
      }
      
      setBackendStatus({
        status,
        details,
        totalSubmissions: backendStatus.totalSubmissions,
        lastChecked: new Date(),
        responseTime
      });
      
      if (newRetries <= 3) {
        setMessage({ 
          type: "warning", 
          mess: `Backend connection attempt ${newRetries}/3. Retrying in 5 seconds...` 
        });
        
        // Auto-retry after delay
        setTimeout(() => {
          if (backendStatus.status !== "connected") {
            checkBackendConnection();
          }
        }, 5000);
      } else {
        setMessage({ 
          type: "error", 
          mess: "Backend server unavailable. Using fallback email method." 
        });
      }
    } finally {
      setIsCheckingBackend(false);
    }
  }, [isCheckingBackend, isOnline, connectionRetries, backendStatus.totalSubmissions, backendStatus.status]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!contactForm.fullname.trim()) {
      errors.fullname = "Full name is required";
    } else if (contactForm.fullname.trim().length < 2) {
      errors.fullname = "Full name should be at least 2 characters";
    } else if (contactForm.fullname.trim().length > 100) {
      errors.fullname = "Full name should not exceed 100 characters";
    }
    
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Please enter a valid email";
    } else if (contactForm.email.trim().length > 255) {
      errors.email = "Email should not exceed 255 characters";
    }
    
    if (!contactForm.address.trim()) {
      errors.address = "Address is required";
    } else if (contactForm.address.trim().length < 5) {
      errors.address = "Address should be at least 5 characters";
    } else if (contactForm.address.trim().length > 500) {
      errors.address = "Address should not exceed 500 characters";
    }
    
    if (!contactForm.message.trim()) {
      errors.message = "Message is required";
    } else if (contactForm.message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters";
    } else if (contactForm.message.trim().length > 2000) {
      errors.message = "Message should not exceed 2000 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field: keyof ContactForm, value: string): void => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getPlaceholderText = (field: string): string => {
    if (field === 'fullname') return 'Enter your full name (min 2 chars)';
    if (field === 'email') return 'Enter your email address';
    if (field === 'address') return 'Enter your address (min 5 chars)';
    if (field === 'message') return 'Enter your message (min 10 chars)';
    return `Enter your ${field}`;
  };

  const submitToBackend = async (): Promise<{success: boolean; message: string}> => {
    try {
      console.log("📤 Submitting to backend:", `${API_URL}/api/contact`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: contactForm.fullname.trim(),
          email: contactForm.email.trim().toLowerCase(),
          address: contactForm.address.trim(),
          message: contactForm.message.trim(),
          timestamp: new Date().toISOString(),
          source: "Render Frontend"
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Backend submission successful:", data);
        return { success: true, message: data._message || data.message || "Message sent successfully!" };
      } else {
        console.error("❌ Backend submission failed:", data);
        return { 
          success: false, 
          message: data._message || data.error || data.message || "Submission failed" 
        };
      }
    } catch (error) {
      console.error("❌ Backend submission error:", error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Network error occurred" 
      };
    }
  };

  const openEmailFallback = (): void => {
    const subject = `Portfolio Contact from ${contactForm.fullname.trim()}`;
    const body = `
Name: ${contactForm.fullname.trim()}
Email: ${contactForm.email.trim()}
Address: ${contactForm.address.trim()}

Message:
${contactForm.message.trim()}

---
Sent from Aditya Auchar's Portfolio Website
Frontend: ${FRONTEND_URL}
Backend: ${API_URL}
Timestamp: ${new Date().toISOString()}
    `.trim();

    const mailtoLink = `mailto:adityaauchar40@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open in new tab
    const newWindow = window.open(mailtoLink, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Fallback to current window
      window.location.href = mailtoLink;
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!isOnline) {
      setMessage({ 
        type: "error", 
        mess: "You are offline. Please check your internet connection and try again." 
      });
      return;
    }
    
    if (!validateForm()) {
      setMessage({ type: "error", mess: "Please fix the validation errors above" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Try backend first if connected or sleeping (Render might wake up)
      if (backendStatus.status === "connected" || backendStatus.status === "sleeping") {
        const result = await submitToBackend();
        
        if (result.success) {
          setMessage({ 
            type: "success", 
            mess: `${result.message} Your data has been saved to MongoDB database. I'll get back to you soon!` 
          });
          setContactForm(initialForm);
          setFormErrors({});
          
          // Refresh backend status to get updated count
          setTimeout(() => checkBackendConnection(), 2000);
          return;
        } else {
          // Backend failed, try email fallback
          setMessage({ 
            type: "warning", 
            mess: `Backend submission failed: ${result.message}. Trying email fallback...` 
          });
        }
      }
      
      // Fallback to email
      openEmailFallback();
      
      setMessage({ 
        type: backendStatus.status === "connected" ? "warning" : "info", 
        mess: backendStatus.status === "connected" 
          ? "Backend submission failed. Opened email client as fallback. Please send your message from there."
          : "Backend is unavailable. Opened email client. Please send your message from there."
      });
      
      setContactForm(initialForm);
      setFormErrors({});
      
    } catch (error: unknown) {
      console.error("❌ Form submission error:", error);
      setMessage({ 
        type: "error", 
        mess: "Failed to submit form. Please try again or email me directly at adityaauchar40@gmail.com" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CustomToast = (): JSX.Element | null => {
    if (!message.mess) return null;

    return (
      <div className={`
        fixed top-24 right-6 z-50
        flex items-center gap-3
        px-6 py-4
        rounded-2xl
        shadow-2xl
        border-l-4
        backdrop-blur-md
        transform transition-all duration-500 ease-out
        ${message.type === "success" 
          ? "bg-green-50/95 border-green-500 text-green-800" 
          : message.type === "error"
          ? "bg-red-50/95 border-red-500 text-red-800"
          : message.type === "warning"
          ? "bg-yellow-50/95 border-yellow-500 text-yellow-800"
          : "bg-blue-50/95 border-blue-500 text-blue-800"
        }
        ${message.mess ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        max-w-md
      `}>
        <div className="flex-shrink-0">
          {message.type === "success" ? (
            <CheckCircleIcon sx={{ fontSize: "1.5rem" }} className="text-green-500" />
          ) : message.type === "error" ? (
            <ErrorIcon sx={{ fontSize: "1.5rem" }} className="text-red-500" />
          ) : message.type === "warning" ? (
            <ErrorIcon sx={{ fontSize: "1.5rem" }} className="text-yellow-500" />
          ) : (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">
            {message.type === "success" ? "Success!" : 
             message.type === "error" ? "Error!" : 
             message.type === "warning" ? "Warning!" : "Processing..."}
          </div>
          <div className="text-sm break-words mt-1">{message.mess}</div>
        </div>
      </div>
    );
  };

  const getBackendStatusIcon = () => {
    switch (backendStatus.status) {
      case "connected":
        return <CloudIcon className="text-green-500 animate-pulse" />;
      case "checking":
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case "sleeping":
        return <SyncIcon className="text-yellow-500 animate-spin" />;
      case "disconnected":
        return <WifiOffIcon className="text-red-500" />;
      default:
        return <SyncIcon className="text-gray-500" />;
    }
  };

  const getBackendStatusColor = () => {
    switch (backendStatus.status) {
      case "connected":
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800";
      case "checking":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-800";
      case "sleeping":
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-yellow-800";
      case "disconnected":
        return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-800";
    }
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return backendStatus.status === "connected" ? "Sending to Database..." : "Opening Email...";
    }
    
    if (backendStatus.status === "connected") {
      return "Send Message (Database)";
    } else if (backendStatus.status === "sleeping") {
      return "Wake Up & Send (Database)";
    } else {
      return "Send Message (Email)";
    }
  };

  const getSubmitButtonColor = () => {
    if (isSubmitting) {
      return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
    
    switch (backendStatus.status) {
      case "connected":
        return "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";
      case "sleeping":
        return "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700";
      case "checking":
        return "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700";
    }
  };

  const formatResponseTime = (time?: number) => {
    if (!time) return "N/A";
    return `${time}ms`;
  };

  return (
    <>
      <style>
        {`
          @keyframes gentle-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-4px) scale(1.02); }
          }
          @keyframes soft-pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          @keyframes icon-glow {
            0%, 100% { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            50% { box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .animate-gentle-float {
            animation: gentle-float 4s ease-in-out infinite;
          }
          .animate-soft-pulse {
            animation: soft-pulse 6s ease-in-out infinite;
          }
          .animate-icon-glow {
            animation: icon-glow 3s ease-in-out infinite;
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 1000px 100%;
          }
        `}
      </style>

      <section id="contact" ref={sectionRef} className="relative overflow-hidden py-16 lg:py-24">
        {/* Background animations */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse delay-2000 blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full mix-blend-multiply opacity-25 animate-soft-pulse delay-4000 blur-xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                Get In Touch
              </span>
              <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Let's Work Together
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              Ready to bring your ideas to life? Let's discuss your project and create something amazing together. 
              <span className="block mt-2 text-sm text-gray-500">
                Powered by React + Node.js + MongoDB on Render
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Contact Info */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 lg:p-10 shadow-2xl border border-gray-100/50">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Contact <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Information</span>
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  I am currently open to new opportunities and collaborative projects where I can contribute my skills and experience in full-stack development. Let's connect and build something great together.
                </p>

                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target={item.link.startsWith('http') ? "_blank" : "_self"}
                      rel={item.link.startsWith('http') ? "noopener noreferrer" : ""}
                      className="group flex items-center gap-4 p-5 rounded-2xl border border-gray-200/80 hover:border-blue-200 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-md group-hover:shadow-lg transition-all duration-500 animate-gentle-float`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                          {item.title}
                        </div>
                        <div className="text-gray-800 font-semibold group-hover:text-gray-900 transition-colors duration-300 truncate">
                          {item.detail}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 transition-all duration-500 text-blue-500 text-xl font-light">
                        →
                      </div>
                    </a>
                  ))}
                </div>

                {/* Deployment Status Card */}
                <div className="mt-8">
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${getBackendStatusColor()} shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getBackendStatusIcon()}
                        <div>
                          <div className="font-bold text-lg">
                            Deployment Status
                          </div>
                          <div className="text-sm font-medium">
                            Status:{" "}
                            <span className={
                              backendStatus.status === "connected" 
                                ? "text-green-600" 
                                : backendStatus.status === "checking" 
                                ? "text-blue-600"
                                : backendStatus.status === "sleeping"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }>
                              {backendStatus.status.charAt(0).toUpperCase() + backendStatus.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {backendStatus.status === "connected" && backendStatus.totalSubmissions !== undefined && backendStatus.totalSubmissions > 0 && (
                          <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1.5 rounded-full shadow-sm">
                            {backendStatus.totalSubmissions} submissions
                          </span>
                        )}
                        <button
                          onClick={checkBackendConnection}
                          disabled={isCheckingBackend}
                          className="p-2 rounded-lg bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                          title="Check connection"
                        >
                          {isCheckingBackend ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <SyncIcon sx={{ fontSize: "1rem" }} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm">
                        {backendStatus.details}
                        {backendStatus.lastChecked && (
                          <span className="text-xs text-gray-500 ml-2">
                            (Last: {backendStatus.lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        )}
                      </div>
                      
                      {/* Performance metrics */}
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50">
                          <div className="text-xs text-gray-500 mb-1">Response Time</div>
                          <div className="font-bold text-gray-800">{formatResponseTime(backendStatus.responseTime)}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50">
                          <div className="text-xs text-gray-500 mb-1">Retry Attempts</div>
                          <div className="font-bold text-gray-800">{connectionRetries}</div>
                        </div>
                      </div>
                      
                      {/* Deployment info */}
                      <div className="mt-4 pt-4 border-t border-gray-200/50">
                        <div className="text-xs text-gray-600 space-y-2">
                          <div className="flex items-center gap-2">
                            <RocketLaunchIcon sx={{ fontSize: "0.8rem" }} />
                            <span>Platform: <strong>{deploymentInfo.platform}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StorageIcon sx={{ fontSize: "0.8rem" }} />
                            <span>Database: <strong>{deploymentInfo.database}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <SpeedIcon sx={{ fontSize: "0.8rem" }} />
                            <span>Network: <strong>{isOnline ? "Online" : "Offline"}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <SecurityIcon sx={{ fontSize: "0.8rem" }} />
                            <span>Security: <strong>HTTPS Enabled</strong></span>
                          </div>
                        </div>
                        
                        {/* Render free tier notice */}
                        {backendStatus.status === "sleeping" && (
                          <div className="mt-3 p-3 bg-yellow-50/80 border border-yellow-200/50 rounded-lg">
                            <div className="text-xs text-yellow-800 font-medium">
                              ⚡ Render Free Tier Notice
                            </div>
                            <div className="text-xs text-yellow-600 mt-1">
                              Backend spins down after 15 minutes of inactivity. First request may take 30-45 seconds to wake up.
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 text-xs text-gray-400">
                          {backendStatus.status === "connected" 
                            ? "✅ Form submissions are being saved to cloud database"
                            : backendStatus.status === "sleeping"
                            ? "🔄 Backend server is waking up... Please wait"
                            : "⚠️ Using secure email fallback method"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 lg:p-10 shadow-2xl border border-gray-100/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                      Send Me a <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Message</span>
                    </h3>
                    <p className="text-gray-600">
                      {backendStatus.status === "connected" 
                        ? "📊 Your message will be saved to MongoDB database"
                        : backendStatus.status === "sleeping"
                        ? "⏳ Backend is waking up... First submission may be slower"
                        : "📧 Your message will be sent via secure email"
                      }
                    </p>
                  </div>
                  {!isOnline && (
                    <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
                      <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                        <WifiOffIcon sx={{ fontSize: "0.8rem" }} />
                        Offline
                      </span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {['fullname', 'email', 'address', 'message'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 capitalize">
                        {field === 'fullname' ? 'Full Name' : field}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      {field === 'message' ? (
                        <textarea
                          rows={6}
                          value={contactForm[field as keyof ContactForm]}
                          onChange={(e) => handleFormChange(field as keyof ContactForm, e.target.value)}
                          className={`
                            w-full px-5 py-4
                            rounded-2xl
                            border-2
                            bg-white/70
                            backdrop-blur-sm
                            transition-all duration-300
                            focus:outline-none focus:ring-4 focus:ring-opacity-20
                            placeholder-gray-400
                            resize-none
                            shadow-sm
                            ${formErrors[field as keyof FormErrors] 
                              ? "border-red-200 focus:border-red-400 focus:ring-red-400/20" 
                              : "border-gray-200/80 focus:border-blue-400 focus:ring-blue-400/20"
                            }
                          `}
                          placeholder={getPlaceholderText(field)}
                          disabled={!isOnline}
                        />
                      ) : (
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          value={contactForm[field as keyof ContactForm]}
                          onChange={(e) => handleFormChange(field as keyof ContactForm, e.target.value)}
                          className={`
                            w-full px-5 py-4
                            rounded-2xl
                            border-2
                            bg-white/70
                            backdrop-blur-sm
                            transition-all duration-300
                            focus:outline-none focus:ring-4 focus:ring-opacity-20
                            placeholder-gray-400
                            shadow-sm
                            ${formErrors[field as keyof FormErrors] 
                              ? "border-red-200 focus:border-red-400 focus:ring-red-400/20" 
                              : "border-gray-200/80 focus:border-blue-400 focus:ring-blue-400/20"
                            }
                          `}
                          placeholder={getPlaceholderText(field)}
                          disabled={!isOnline}
                        />
                      )}
                      {formErrors[field as keyof FormErrors] && (
                        <div className="text-red-500 text-sm flex items-center gap-1 animate-pulse">
                          <ErrorIcon sx={{ fontSize: "1rem" }} />
                          {formErrors[field as keyof FormErrors]}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={isSubmitting || !isOnline}
                    className={`
                      group
                      w-full
                      flex items-center justify-center gap-3
                      px-8 py-5
                      font-bold
                      rounded-2xl
                      shadow-lg
                      transition-all duration-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${getSubmitButtonColor()}
                      text-white
                      hover:shadow-xl
                      hover:scale-[1.02]
                      active:scale-[0.98]
                      transform
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{getSubmitButtonText()}</span>
                      </>
                    ) : (
                      <>
                        <SendIcon className="group-hover:animate-gentle-float" />
                        <span>{getSubmitButtonText()}</span>
                        <div className="group-hover:translate-x-2 transition-transform duration-300">→</div>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 space-y-4">
                  {/* Status Indicator */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full ${
                      backendStatus.status === "connected" 
                        ? "text-green-600 bg-green-50 border border-green-200" 
                        : backendStatus.status === "sleeping"
                        ? "text-yellow-600 bg-yellow-50 border border-yellow-200"
                        : backendStatus.status === "checking"
                        ? "text-blue-600 bg-blue-50 border border-blue-200"
                        : "text-gray-600 bg-gray-50 border border-gray-200"
                    }`}>
                      {backendStatus.status === "connected" ? (
                        <>
                          <CloudIcon sx={{ fontSize: "1rem" }} />
                          Connected to cloud database
                        </>
                      ) : backendStatus.status === "sleeping" ? (
                        <>
                          <SyncIcon sx={{ fontSize: "1rem" }} className="animate-spin" />
                          Backend server waking up
                        </>
                      ) : backendStatus.status === "checking" ? (
                        <>
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          Checking connection
                        </>
                      ) : (
                        <>
                          <EmailIcon sx={{ fontSize: "1rem" }} />
                          Using email fallback
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Deployment Info */}
                  <div className="text-center text-xs text-gray-500 space-y-1">
                    <p className="font-medium">Deployment Information</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="p-2 rounded-lg bg-gray-50/50 border border-gray-200/50">
                        <div className="font-semibold text-gray-700">Frontend</div>
                        <div className="text-gray-600 truncate" title={deploymentInfo.frontendUrl}>
                          {deploymentInfo.frontendUrl.replace('https://', '')}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-50/50 border border-gray-200/50">
                        <div className="font-semibold text-gray-700">Backend</div>
                        <div className="text-gray-600 truncate" title={deploymentInfo.backendUrl}>
                          {deploymentInfo.backendUrl.replace('https://', '')}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50">
                      <div className="font-semibold text-gray-700">Technology Stack</div>
                      <div className="text-gray-600">React + Node.js + MongoDB on Render</div>
                    </div>
                    {!isOnline && (
                      <div className="mt-2 p-2 rounded-lg bg-red-50/50 border border-red-200/50 animate-pulse">
                        <div className="font-semibold text-red-600">⚠️ Offline Mode</div>
                        <div className="text-red-500">Please check your internet connection</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CustomToast />
      </section>
    </>
  );
};

export default Contact;