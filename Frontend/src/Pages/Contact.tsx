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

// Dynamic environment configuration
const API_URL = import.meta.env.VITE_API_URL || "https://protfolio-backend-8p47.onrender.com";
const IS_PRODUCTION = import.meta.env.VITE_NODE_ENV === "production";

// TypeScript interfaces
interface ContactInfo {
  title: string;
  detail: string;
  icon: React.ReactElement;
  color: string;
  link: string;
  description?: string;
}

interface FormErrors {
  fullname?: string;
  email?: string;
  address?: string;
  message?: string;
  company?: string;
  projectType?: string;
}

interface Message {
  type: "success" | "error" | "info" | "warning";
  mess: string;
  id?: string;
  timestamp?: Date;
}

interface ContactForm {
  fullname: string;
  email: string;
  address: string;
  message: string;
  company?: string;
  projectType?: string;
}

interface BackendStatus {
  status: "checking" | "connected" | "disconnected" | "sleeping";
  details: string;
  lastChecked?: Date;
  responseTime?: number;
}

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ type: "info", mess: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    status: "checking",
    details: "Checking backend connection..."
  });
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [formData, setFormData] = useState<ContactForm>({
    fullname: "",
    email: "",
    address: "",
    message: "",
    company: "",
    projectType: "general"
  });
  const [typingStatus, setTypingStatus] = useState<{[key: string]: boolean}>({});
  
  const sectionRef = useRef<HTMLElement>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimeoutRef = useRef<{[key: string]: ReturnType<typeof setTimeout>}>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Add message helper function
  const addMessage = (type: Message["type"], mess: string) => {
    setMessage({ type, mess });
  };

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          // Check backend connection when section becomes visible
          checkBackendConnection();
        }
      },
      { threshold: 0.3, rootMargin: "50px" }
    );

    const element = sectionRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Network: Online");
      setIsOnline(true);
      addMessage("success", "Network connection restored.");
      
      // Retry connection when coming back online
      if (backendStatus.status !== "connected") {
        setTimeout(() => checkBackendConnection(), 1000);
      }
    };
    
    const handleOffline = () => {
      console.log("🌐 Network: Offline");
      setIsOnline(false);
      addMessage("error", "Network connection lost. Working in offline mode.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [backendStatus.status]);

  // Auto message dismissal
  useEffect(() => {
    if (message.mess) {
      const timer = setTimeout(() => {
        setMessage({ type: "info", mess: "" });
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Auto-retry connection
  useEffect(() => {
    const initialCheck = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await checkBackendConnection();
      
      // Schedule periodic checks
      checkTimeoutRef.current = setInterval(() => {
        if (backendStatus.status !== "connected" && isOnline) {
          checkBackendConnection();
        }
      }, 30000);
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
      link: "mailto:adityaauchar40@gmail.com",
      description: "Direct email for inquiries"
    },
    { 
      title: "Phone", 
      detail: "+91 8097459014", 
      icon: <LocalPhoneIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-green-500 to-emerald-400",
      link: "tel:+918097459014",
      description: "Available for calls"
    },
    {
      title: "LinkedIn",
      detail: "aditya-auchar-390147334",
      icon: <LinkedInIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-blue-600 to-blue-400",
      link: "https://www.linkedin.com/in/aditya-auchar-390147334/",
      description: "Professional network"
    },
    {
      title: "Location",
      detail: "Airoli, Navi Mumbai",
      icon: <LocationPinIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-purple-500 to-pink-400",
      link: "https://maps.google.com/?q=Airoli,Navi+Mumbai",
      description: "Based in Maharashtra, India"
    },
  ];

  const projectTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "web", label: "Web Development" },
    { value: "mobile", label: "Mobile App" },
    { value: "backend", label: "Backend System" },
    { value: "consulting", label: "Consulting" },
    { value: "collaboration", label: "Collaboration" }
  ];

  const checkBackendConnection = useCallback(async (): Promise<void> => {
    if (isCheckingBackend || !isOnline) {
      console.log("⏸️ Backend check skipped:", { isCheckingBackend, isOnline });
      return;
    }
    
    setIsCheckingBackend(true);
    const startTime = performance.now();
    
    try {
      console.log(`🔗 Checking backend connection to: ${API_URL}/api/health`);
      
      setBackendStatus(prev => ({
        ...prev,
        status: "checking",
        details: "Establishing connection...",
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);
      
      const responseTime = Math.round(performance.now() - startTime);
      
      if (response.ok) {
        setBackendStatus({
          status: "connected",
          details: "Backend connected successfully",
          lastChecked: new Date(),
          responseTime,
        });
        
        setConnectionRetries(0);
        
        if (connectionRetries > 0) {
          addMessage("success", "Backend server reconnected successfully!");
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: unknown) {
      const responseTime = Math.round(performance.now() - startTime);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      console.error(`❌ Backend connection failed:`, errorMessage);
      
      const newRetries = connectionRetries + 1;
      setConnectionRetries(newRetries);
      
      let status: BackendStatus["status"] = "disconnected";
      let details = "Connection failed";
      
      if (errorMessage.includes("abort") || errorMessage.includes("timeout")) {
        status = "sleeping";
        details = "Backend server is waking up...";
      }
      
      setBackendStatus({
        status,
        details,
        lastChecked: new Date(),
        responseTime,
      });
      
      if (newRetries <= 3) {
        const delay = newRetries * 2000;
        addMessage("info", `Connection attempt ${newRetries}/3. Retrying in ${delay/1000}s...`);
        
        setTimeout(() => {
          if (backendStatus.status !== "connected") {
            checkBackendConnection();
          }
        }, delay);
      } else {
        addMessage("warning", "Backend server unavailable. Using email fallback.");
      }
    } finally {
      setIsCheckingBackend(false);
    }
  }, [isCheckingBackend, isOnline, connectionRetries, backendStatus.status]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;
    
    const validations = [
      {
        field: 'fullname' as keyof FormErrors,
        value: formData.fullname.trim(),
        rules: [
          { condition: !formData.fullname.trim(), message: "Full name is required" },
          { condition: formData.fullname.trim().length < 2, message: "Full name should be at least 2 characters" },
          { condition: formData.fullname.trim().length > 100, message: "Full name should not exceed 100 characters" }
        ]
      },
      {
        field: 'email' as keyof FormErrors,
        value: formData.email.trim(),
        rules: [
          { condition: !formData.email.trim(), message: "Email is required" },
          { condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), message: "Please enter a valid email address" }
        ]
      },
      {
        field: 'address' as keyof FormErrors,
        value: formData.address.trim(),
        rules: [
          { condition: !formData.address.trim(), message: "Address is required" },
          { condition: formData.address.trim().length < 5, message: "Address should be at least 5 characters" }
        ]
      },
      {
        field: 'message' as keyof FormErrors,
        value: formData.message.trim(),
        rules: [
          { condition: !formData.message.trim(), message: "Message is required" },
          { condition: formData.message.trim().length < 10, message: "Message should be at least 10 characters" }
        ]
      }
    ];
    
    validations.forEach(({ field, rules }) => {
      for (const rule of rules) {
        if (rule.condition) {
          errors[field] = rule.message;
          isValid = false;
          break;
        }
      }
    });
    
    setFormErrors(errors);
    
    if (!isValid) {
      addMessage("error", "Please fix the validation errors above");
    }
    
    return isValid;
  };

  const handleFormChange = (field: keyof ContactForm, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field as keyof FormErrors]: "" }));
    }
    
    // Set typing status
    setTypingStatus(prev => ({ ...prev, [field]: true }));
    
    // Clear previous timeout
    if (typingTimeoutRef.current[field]) {
      clearTimeout(typingTimeoutRef.current[field]);
    }
    
    // Set timeout to clear typing status
    typingTimeoutRef.current[field] = setTimeout(() => {
      setTypingStatus(prev => ({ ...prev, [field]: false }));
    }, 500);
  };

  const getPlaceholderText = (field: string): string => {
    const placeholders: {[key: string]: string} = {
      'fullname': 'John Doe',
      'email': 'john@example.com',
      'address': '123 Main St, City, Country',
      'message': 'Describe your project or inquiry...',
      'company': 'Optional: Your company name',
      'projectType': 'Select project type'
    };
    return placeholders[field] || `Enter your ${field}`;
  };

  const submitToBackend = async (): Promise<{success: boolean; message: string; data?: any}> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const payload = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        message: formData.message.trim(),
        company: formData.company?.trim() || undefined,
        projectType: formData.projectType,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (response.ok) {
        return { 
          success: true, 
          message: data.message || "Message sent successfully!",
          data 
        };
      } else {
        return { 
          success: false, 
          message: data.error || data.message || "Submission failed",
          data 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Network error occurred" 
      };
    }
  };

  const openEmailFallback = (): void => {
    const subject = `Portfolio Contact from ${formData.fullname.trim()}`;
    const body = `
Name: ${formData.fullname.trim()}
Email: ${formData.email.trim()}
Address: ${formData.address.trim()}
Company: ${formData.company?.trim() || 'Not provided'}
Project Type: ${formData.projectType}

Message:
${formData.message.trim()}

---
Sent from Portfolio Contact Form
Timestamp: ${new Date().toISOString()}
    `.trim();

    const mailtoLink = `mailto:adityaauchar40@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!isOnline) {
      addMessage("error", "You are offline. Please check your internet connection.");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    addMessage("info", "Sending your message...");

    try {
      // Try backend first if connected
      if (backendStatus.status === "connected") {
        const result = await submitToBackend();
        
        if (result.success) {
          addMessage("success", 
            `${result.message} I'll get back to you soon!`
          );
          
          // Reset form
          setFormData({
            fullname: "",
            email: "",
            address: "",
            message: "",
            company: "",
            projectType: "general"
          });
          setFormErrors({});
          return;
        } else {
          addMessage("warning", 
            `Backend submission failed: ${result.message}. Trying email fallback...`
          );
        }
      }
      
      // Fallback to email
      openEmailFallback();
      
      addMessage("info", 
        backendStatus.status === "connected" 
          ? "Opened email client as fallback."
          : "Backend unavailable. Opened email client."
      );
      
      // Reset form after fallback
      setFormData({
        fullname: "",
        email: "",
        address: "",
        message: "",
        company: "",
        projectType: "general"
      });
      setFormErrors({});
      
    } catch (error: unknown) {
      console.error("❌ Form submission error:", error);
      addMessage("error", 
        "Failed to submit form. Please try again or email directly at adityaauchar40@gmail.com"
      );
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

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return backendStatus.status === "connected" ? "Sending..." : "Opening Email...";
    }
    
    if (backendStatus.status === "connected") {
      return "Send Message";
    } else {
      return "Send via Email";
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      address: "",
      message: "",
      company: "",
      projectType: "general"
    });
    setFormErrors({});
    addMessage("info", "Form reset successfully.");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addMessage("success", `${label} copied to clipboard!`);
    }).catch(() => {
      addMessage("error", "Failed to copy to clipboard");
    });
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
          .animate-gentle-float {
            animation: gentle-float 4s ease-in-out infinite;
          }
          .animate-soft-pulse {
            animation: soft-pulse 6s ease-in-out infinite;
          }
        `}
      </style>

      <section id="contact" ref={sectionRef} className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-gray-50/50 to-white">
        {/* Background animations */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse delay-2000 blur-xl"></div>
        
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
                    <div
                      key={index}
                      className="group flex items-center gap-4 p-5 rounded-2xl border border-gray-200/80 hover:border-blue-200 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      onClick={() => copyToClipboard(item.detail, item.title)}
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-md group-hover:shadow-lg transition-all duration-500 animate-gentle-float group-hover:animate-none`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                          {item.title}
                        </div>
                        <div className="text-gray-800 font-semibold group-hover:text-gray-900 transition-colors duration-300 truncate">
                          {item.detail}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 transition-all duration-500 text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connection Status */}
                <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {backendStatus.status === "connected" ? (
                        <CloudIcon className="text-green-500" />
                      ) : backendStatus.status === "checking" ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : backendStatus.status === "sleeping" ? (
                        <SyncIcon className="text-yellow-500 animate-spin" />
                      ) : (
                        <WifiOffIcon className="text-red-500" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">
                          {backendStatus.status === "connected" ? "Online" : 
                           backendStatus.status === "checking" ? "Checking..." :
                           backendStatus.status === "sleeping" ? "Connecting..." : "Offline"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {backendStatus.details}
                        </div>
                      </div>
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
                        ? "Your message will be saved to the database"
                        : "Your message will be sent via email"
                      }
                    </p>
                  </div>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {['fullname', 'email'].map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 capitalize">
                          {field === 'fullname' ? 'Full Name' : 'Email Address'}
                          <span className="text-red-500 ml-1">*</span>
                          {typingStatus[field] && (
                            <span className="ml-2 text-xs text-blue-500 animate-pulse">Typing...</span>
                          )}
                        </label>
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          name={field}
                          value={formData[field as keyof ContactForm] as string}
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
                              : "border-gray-200/80 focus:border-blue-400 focus:ring-blue-400/20 hover:border-gray-300"
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                          placeholder={getPlaceholderText(field)}
                          disabled={!isOnline || isSubmitting}
                        />
                        {formErrors[field as keyof FormErrors] && (
                          <div className="text-red-500 text-sm flex items-center gap-1 animate-pulse">
                            <ErrorIcon sx={{ fontSize: "1rem" }} />
                            {formErrors[field as keyof FormErrors]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Address
                      <span className="text-red-500 ml-1">*</span>
                      {typingStatus.address && (
                        <span className="ml-2 text-xs text-blue-500 animate-pulse">Typing...</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
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
                        ${formErrors.address
                          ? "border-red-200 focus:border-red-400 focus:ring-red-400/20" 
                          : "border-gray-200/80 focus:border-blue-400 focus:ring-blue-400/20 hover:border-gray-300"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      placeholder={getPlaceholderText('address')}
                      disabled={!isOnline || isSubmitting}
                    />
                    {formErrors.address && (
                      <div className="text-red-500 text-sm flex items-center gap-1 animate-pulse">
                        <ErrorIcon sx={{ fontSize: "1rem" }} />
                        {formErrors.address}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleFormChange('company', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200/80 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 placeholder-gray-400 shadow-sm hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={getPlaceholderText('company')}
                        disabled={!isOnline || isSubmitting}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => handleFormChange('projectType', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200/80 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 shadow-sm hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                        disabled={!isOnline || isSubmitting}
                      >
                        {projectTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Message
                      <span className="text-red-500 ml-1">*</span>
                      {typingStatus.message && (
                        <span className="ml-2 text-xs text-blue-500 animate-pulse">Typing...</span>
                      )}
                      <span className="ml-2 text-xs text-gray-500">
                        {formData.message.length}/2000 characters
                      </span>
                    </label>
                    <textarea
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={(e) => handleFormChange('message', e.target.value)}
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
                        ${formErrors.message
                          ? "border-red-200 focus:border-red-400 focus:ring-red-400/20" 
                          : "border-gray-200/80 focus:border-blue-400 focus:ring-blue-400/20 hover:border-gray-300"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      placeholder={getPlaceholderText('message')}
                      disabled={!isOnline || isSubmitting}
                    />
                    {formErrors.message && (
                      <div className="text-red-500 text-sm flex items-center gap-1 animate-pulse">
                        <ErrorIcon sx={{ fontSize: "1rem" }} />
                        {formErrors.message}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isOnline}
                      className={`
                        group
                        flex-1
                        flex items-center justify-center gap-3
                        px-8 py-5
                        font-bold
                        rounded-2xl
                        shadow-lg
                        transition-all duration-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
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
                    
                    <button
                      type="button"
                      onClick={handleResetForm}
                      disabled={isSubmitting}
                      className="px-6 py-5 rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reset
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center text-xs text-gray-500">
                  <p className="mb-2">
                    Your information is secure and will only be used to respond to your inquiry.
                  </p>
                  <p>
                    Response time: Usually within 24-48 hours
                  </p>
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