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
  const [characterCount, setCharacterCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionMessageType, setSubmissionMessageType] = useState<"success" | "error" | "info" | "warning">("info");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimeoutRef = useRef<{[key: string]: ReturnType<typeof setTimeout>}>({});
  const formRef = useRef<HTMLFormElement>(null);
  const submissionMessageRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect device type for responsive behavior
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Add message helper function
  const addMessage = (type: Message["type"], mess: string) => {
    setMessage({ type, mess });
  };

  // Setup intersection observer with responsive thresholds
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: isMobile ? 0.1 : isTablet ? 0.2 : 0.3,
        rootMargin: isMobile ? "20px" : isTablet ? "40px" : "50px"
      }
    );

    const element = sectionRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [isMobile, isTablet]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addMessage("success", "Network connection restored.");
      if (backendStatus.status !== "connected") {
        checkBackendConnection();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      addMessage("error", "Network connection lost. Please reconnect to submit messages.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [backendStatus.status]);

  // Auto message dismissal with responsive timing
  useEffect(() => {
    if (message.mess) {
      const timer = setTimeout(() => {
        setMessage({ type: "info", mess: "" });
      }, isMobile ? 4000 : 7000);
      return () => clearTimeout(timer);
    }
  }, [message, isMobile]);

  // Auto dismissal for submission message
  useEffect(() => {
    if (showSubmissionMessage) {
      const timer = setTimeout(() => {
        setShowSubmissionMessage(false);
      }, isMobile ? 5000 : 8000);
      return () => clearTimeout(timer);
    }
  }, [showSubmissionMessage, isMobile]);

  // Scroll to submission message when it appears
  useEffect(() => {
    if (showSubmissionMessage && submissionMessageRef.current && isMobile) {
      submissionMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [showSubmissionMessage, isMobile]);

  // Initial backend check on mount with responsive delay
  useEffect(() => {
    const initialCheck = () => {
      setTimeout(() => {
        checkBackendConnection();
      }, isMobile ? 1500 : 1000);
    };

    initialCheck();

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
        checkTimeoutRef.current = null;
      }
    };
  }, [isMobile]);

  const contactInfo: ContactInfo[] = [
    { 
      title: "Email", 
      detail: "adityaauchar40@gmail.com", 
      icon: <EmailIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      color: "from-blue-500 to-cyan-500",
      link: "mailto:adityaauchar40@gmail.com",
      description: "Direct email for inquiries"
    },
    { 
      title: "Phone", 
      detail: "+91 8097459014", 
      icon: <LocalPhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      color: "from-green-500 to-emerald-500",
      link: "tel:+918097459014",
      description: "Available for calls"
    },
    {
      title: "LinkedIn",
      detail: "aditya-auchar-390147334",
      icon: <LinkedInIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      color: "from-blue-600 to-blue-400",
      link: "https://www.linkedin.com/in/aditya-auchar-390147334/",
      description: "Professional network"
    },
    {
      title: "Location",
      detail: "Airoli, Navi Mumbai",
      icon: <LocationPinIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      color: "from-purple-500 to-pink-500",
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
      return;
    }
    
    setIsCheckingBackend(true);
    const startTime = performance.now();
    
    try {
      setBackendStatus(prev => ({
        ...prev,
        status: "checking",
        details: "Establishing connection...",
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), isMobile ? 8000 : 5000);

      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
        setRetryCount(0);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: unknown) {
      const responseTime = Math.round(performance.now() - startTime);
      
      const newRetries = connectionRetries + 1;
      setConnectionRetries(newRetries);
      
      let status: BackendStatus["status"] = "disconnected";
      let details = "Connection failed";
      
      if (error instanceof Error && (error.message.includes("abort") || error.message.includes("timeout"))) {
        status = "sleeping";
        details = "Backend server is waking up...";
      }
      
      setBackendStatus({
        status,
        details,
        lastChecked: new Date(),
        responseTime,
      });
      
      // Only show warning after multiple failures
      if (newRetries >= 2) {
        addMessage("warning", "Backend server is currently unavailable. Please try again later.");
      }
    } finally {
      setIsCheckingBackend(false);
    }
  }, [isCheckingBackend, isOnline, connectionRetries, isMobile]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;
    
    if (!formData.fullname.trim()) {
      errors.fullname = "Full name is required";
      isValid = false;
    } else if (formData.fullname.trim().length < 2) {
      errors.fullname = "Full name should be at least 2 characters";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    } else if (formData.address.trim().length < 5) {
      errors.address = "Address should be at least 5 characters";
      isValid = false;
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters";
      isValid = false;
    }
    
    setFormErrors(errors);
    
    if (!isValid) {
      showFormMessage("error", "Please fix the validation errors above");
    }
    
    return isValid;
  };

  const handleFormChange = (field: keyof ContactForm, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update character count for message field
    if (field === 'message') {
      setCharacterCount(value.length);
    }
    
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
      const timeoutId = setTimeout(() => controller.abort(), isMobile ? 15000 : 10000);

      const payload = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        message: formData.message.trim(),
        company: formData.company?.trim() || undefined,
        projectType: formData.projectType,
        timestamp: new Date().toISOString(),
        source: "portfolio_website",
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      };

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'same-origin',
      });

      clearTimeout(timeoutId);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }
      
      const data = await response.json();
      
      if (response.ok) {
        return { 
          success: true, 
          message: data.message || "Message sent successfully!",
          data 
        };
      } else {
        // Handle specific HTTP status codes
        if (response.status === 400) {
          return {
            success: false,
            message: data.error || data.message || "Invalid form data. Please check your inputs."
          };
        } else if (response.status === 429) {
          return {
            success: false,
            message: "Too many requests. Please try again in a few minutes."
          };
        } else if (response.status >= 500) {
          return {
            success: false,
            message: "Server error. Please try again later."
          };
        } else {
          return { 
            success: false, 
            message: data.error || data.message || `Submission failed (HTTP ${response.status})`
          };
        }
      }
    } catch (error) {
      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            message: "Request timeout. The server is taking too long to respond."
          };
        }
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          return {
            success: false,
            message: "Network error. Please check your internet connection."
          };
        }
        return {
          success: false,
          message: error.message
        };
      }
      return { 
        success: false, 
        message: "An unexpected error occurred. Please try again."
      };
    }
  };

  const retryBackendConnection = async (): Promise<void> => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    showFormMessage("info", `Attempting to reconnect... (Attempt ${retryCount + 1})`);
    
    try {
      await checkBackendConnection();
      
      if (backendStatus.status === "connected") {
        showFormMessage("success", "Backend reconnected! You can now submit your message.");
      } else {
        showFormMessage("warning", "Still unable to connect. Please try again later.");
      }
    } catch (error) {
      showFormMessage("error", "Reconnection failed. Please check your network connection.");
    } finally {
      setIsRetrying(false);
    }
  };

  const showFormMessage = (type: "success" | "error" | "info" | "warning", message: string) => {
    setSubmissionMessage(message);
    setSubmissionMessageType(type);
    setShowSubmissionMessage(true);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!isOnline) {
      showFormMessage("error", "You are offline. Please check your internet connection and try again.");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    // Check if backend is connected before submitting
    if (backendStatus.status !== "connected") {
      showFormMessage("error", "Backend server is not available. Please try again later.");
      addMessage("warning", "Server connection required to send messages.");
      return;
    }

    setIsSubmitting(true);
    showFormMessage("info", "Sending your message to the database...");

    try {
      const result = await submitToBackend();
      
      if (result.success) {
        showFormMessage("success", 
          `✅ ${result.message} Your message has been saved to the database. I'll get back to you soon!`
        );
        
        // Also show a toast notification
        addMessage("success", "Message successfully saved to database!");
        
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
        setCharacterCount(0);
        setRetryCount(0);
      } else {
        // Handle submission failure
        showFormMessage("error", `❌ ${result.message}`);
        
        // If it's a network/server error, suggest retrying
        if (result.message.includes("Network") || 
            result.message.includes("Server") || 
            result.message.includes("timeout")) {
          showFormMessage("warning", "Please try again in a moment or check your connection.");
        }
      }
    } catch (error: unknown) {
      showFormMessage("error", 
        "❌ An unexpected error occurred. Please try again later."
      );
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CustomToast = (): JSX.Element | null => {
    if (!message.mess) return null;

    return (
      <div className={`
        fixed top-4 sm:top-6 right-2 sm:right-4 md:right-6 z-50
        flex items-start sm:items-center gap-3
        px-4 sm:px-5 py-3 sm:py-4
        rounded-lg sm:rounded-xl md:rounded-2xl
        shadow-lg sm:shadow-xl
        border-l-4
        backdrop-blur-md
        transform transition-all duration-500 ease-out
        w-[calc(100vw-1rem)] sm:w-auto sm:max-w-md
        ${message.type === "success" 
          ? "bg-green-50/95 border-green-500 text-green-800" 
          : message.type === "error"
          ? "bg-red-50/95 border-red-500 text-red-800"
          : message.type === "warning"
          ? "bg-yellow-50/95 border-yellow-500 text-yellow-800"
          : "bg-blue-50/95 border-blue-500 text-blue-800"
        }
      `}>
        <div className="flex-shrink-0 mt-0.5 sm:mt-0">
          {message.type === "success" ? (
            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />
          ) : message.type === "error" ? (
            <ErrorIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />
          ) : message.type === "warning" ? (
            <ErrorIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />
          ) : (
            <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm sm:text-base md:text-lg truncate">
            {message.type === "success" ? "Success!" : 
             message.type === "error" ? "Error!" : 
             message.type === "warning" ? "Warning!" : "Processing..."}
          </div>
          <div className="text-xs sm:text-sm md:text-base break-words mt-0.5 sm:mt-1">{message.mess}</div>
        </div>
        <button
          onClick={() => setMessage({ type: "info", mess: "" })}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 text-lg sm:text-xl"
          aria-label="Close message"
        >
          ×
        </button>
      </div>
    );
  };

  const SubmissionMessage = (): JSX.Element | null => {
    if (!showSubmissionMessage) return null;

    return (
      <div 
        ref={submissionMessageRef}
        className={`
          w-full
          px-4 sm:px-6 md:px-8
          py-3 sm:py-4 md:py-5
          rounded-lg sm:rounded-xl md:rounded-2xl
          border
          shadow-lg
          transition-all duration-300
          animate-fadeIn
          ${submissionMessageType === "success" 
            ? "bg-green-50/95 border-green-200 text-green-800" 
            : submissionMessageType === "error"
            ? "bg-red-50/95 border-red-200 text-red-800"
            : submissionMessageType === "warning"
            ? "bg-yellow-50/95 border-yellow-200 text-yellow-800"
            : "bg-blue-50/95 border-blue-200 text-blue-800"
          }
        `}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {submissionMessageType === "success" ? (
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />
            ) : submissionMessageType === "error" ? (
              <ErrorIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />
            ) : submissionMessageType === "warning" ? (
              <ErrorIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />
            ) : (
              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm sm:text-base md:text-lg mb-1">
              {submissionMessageType === "success" ? "Message Sent!" : 
               submissionMessageType === "error" ? "Submission Error" : 
               submissionMessageType === "warning" ? "Notice" : "Processing..."}
            </div>
            <div className="text-xs sm:text-sm md:text-base break-words">{submissionMessage}</div>
            
            {/* Show retry option for backend connection errors */}
            {submissionMessageType === "error" && backendStatus.status !== "connected" && retryCount < 3 && (
              <button
                onClick={retryBackendConnection}
                disabled={isRetrying}
                className="mt-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isRetrying ? (
                  <>
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Retrying...
                  </>
                ) : (
                  "↻ Try Reconnecting"
                )}
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSubmissionMessage(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 text-lg sm:text-xl"
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return "Saving to Database...";
    }
    
    return "Send Message";
  };

  const getSubmitButtonStatus = () => {
    if (!isOnline) {
      return {
        text: "Offline",
        disabled: true,
        tooltip: "Please connect to the internet"
      };
    }
    
    if (backendStatus.status !== "connected") {
      return {
        text: "Server Offline",
        disabled: true,
        tooltip: "Backend server is not available"
      };
    }
    
    if (isSubmitting) {
      return {
        text: "Saving...",
        disabled: true,
        tooltip: "Saving your message to database"
      };
    }
    
    return {
      text: "Send Message",
      disabled: false,
      tooltip: "Send message to backend database"
    };
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
    setCharacterCount(0);
    showFormMessage("info", "Form reset successfully.");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addMessage("success", `${label} copied to clipboard!`);
    }).catch(() => {
      addMessage("error", "Failed to copy to clipboard");
    });
  };

  const checkConnectionAndSubmit = () => {
    if (backendStatus.status !== "connected") {
      showFormMessage("warning", "Checking server connection before submission...");
      checkBackendConnection().then(() => {
        if (backendStatus.status === "connected") {
          // Auto-submit after successful connection check
          formRef.current?.requestSubmit();
        } else {
          showFormMessage("error", "Unable to connect to server. Please try again later.");
        }
      });
    }
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
          @keyframes line-expand {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes line-expand-reverse {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            70% { transform: scale(1.2); opacity: 0; }
            100% { transform: scale(1.2); opacity: 0; }
          }
          .animate-gentle-float {
            animation: gentle-float 4s ease-in-out infinite;
          }
          .animate-soft-pulse {
            animation: soft-pulse 6s ease-in-out infinite;
          }
          .animate-line-expand {
            animation: line-expand 0.8s ease-out forwards;
          }
          .animate-line-expand-reverse {
            animation: line-expand-reverse 0.8s ease-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
          .animate-pulse-ring {
            animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
          
          /* Mobile optimizations */
          @media (max-width: 640px) {
            input, textarea, select {
              font-size: 16px !important;
            }
            
            .container {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          }
          
          /* Tablet optimizations */
          @media (min-width: 768px) and (max-width: 1023px) {
            .container {
              max-width: 100% !important;
              padding-left: 2rem !important;
              padding-right: 2rem !important;
            }
          }
          
          /* Touch-friendly buttons for mobile */
          @media (hover: none) and (pointer: coarse) {
            button, a, .cursor-pointer {
              min-height: 44px;
              min-width: 44px;
            }
            
            input, textarea, select {
              font-size: 16px;
            }
          }
          
          /* Safe area insets for notched devices */
          @supports (padding: max(0px)) {
            .safe-area-padding {
              padding-left: max(1rem, env(safe-area-inset-left));
              padding-right: max(1rem, env(safe-area-inset-right));
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

      <section 
        id="contact" 
        ref={sectionRef} 
        className="relative overflow-hidden py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 bg-gradient-to-b from-gray-50/50 to-white safe-area-padding"
      >
        {/* Background animations - Responsive sizing */}
        <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mix-blend-multiply opacity-20 sm:opacity-25 md:opacity-30 animate-soft-pulse blur-xl md:blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full mix-blend-multiply opacity-20 sm:opacity-25 md:opacity-30 animate-soft-pulse delay-2000 blur-xl md:blur-2xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
          {/* Section Header */}
          <div className={`text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5">
              <div className="w-4 sm:w-5 md:w-6 h-0.5 bg-gradient-to-r from-red-600 to-red-400"></div>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-red-600 uppercase tracking-wider">
                Get In Touch
              </span>
              <div className="w-4 sm:w-5 md:w-6 h-0.5 bg-gradient-to-r from-red-600 to-red-400"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-4">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Let's Work <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">Together</span>
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-3 sm:mt-4 md:mt-5 max-w-2xl mx-auto px-2 sm:px-4">
              Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            {/* Left Column - Contact Info */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl border border-gray-100/50">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Contact <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Information</span>
                </h3>
                
                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                  I am currently open to new opportunities and collaborative projects where I can contribute my skills and experience in full-stack development. Let's connect and build something great together.
                </p>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200/80 hover:border-blue-200 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      onClick={() => copyToClipboard(item.detail, item.title)}
                    >
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${item.color} text-white shadow-md group-hover:shadow-lg transition-all duration-500 animate-gentle-float group-hover:animate-none`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                          {item.title}
                        </div>
                        <div className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg group-hover:text-gray-900 transition-colors duration-300 truncate">
                          {item.detail}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 transition-all duration-500 text-blue-500">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connection Status - Responsive */}
                <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {backendStatus.status === "connected" ? (
                        <div className="relative">
                          <CloudIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500 relative z-10" />
                          <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full animate-pulse-ring"></div>
                        </div>
                      ) : backendStatus.status === "checking" ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : backendStatus.status === "sleeping" ? (
                        <SyncIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500 animate-spin" />
                      ) : (
                        <WifiOffIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />
                      )}
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-gray-800">
                          {backendStatus.status === "connected" ? "Database Connected" : 
                           backendStatus.status === "checking" ? "Checking..." :
                           backendStatus.status === "sleeping" ? "Connecting..." : "Database Offline"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {backendStatus.status === "connected" ? "Ready to save messages" : "Cannot save messages"}
                        </div>
                      </div>
                    </div>
                    {!isOnline && (
                      <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-50 border border-red-200 rounded-full self-start sm:self-auto">
                        <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                          <WifiOffIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          Offline
                        </span>
                      </div>
                    )}
                    {backendStatus.status !== "connected" && isOnline && (
                      <button
                        onClick={retryBackendConnection}
                        disabled={isRetrying}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-xs font-medium text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {isRetrying ? (
                          <>
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Retrying...</span>
                          </>
                        ) : (
                          "↻ Retry"
                        )}
                      </button>
                    )}
                  </div>
                  {backendStatus.responseTime && backendStatus.status === "connected" && (
                    <div className="mt-2 text-xs text-gray-500">
                      Response time: {backendStatus.responseTime}ms
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 shadow-lg sm:shadow-xl md:shadow-2xl border border-gray-100/50 h-full">
                <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Send Me a <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Message</span>
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
                    Fill out the form below and your message will be saved directly to our database.
                  </p>
                </div>

                {/* Submission Message - Aligned to form */}
                {showSubmissionMessage && (
                  <div className="mb-4 sm:mb-5 md:mb-6 animate-fadeIn">
                    <SubmissionMessage />
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                  {/* Name & Email - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {['fullname', 'email'].map((field) => (
                      <div key={field} className="space-y-2 sm:space-y-3">
                        <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 capitalize">
                          {field === 'fullname' ? 'Full Name' : 'Email Address'}
                          <span className="text-red-500 ml-1">*</span>
                          {typingStatus[field] && (
                            <span className="ml-2 text-xs text-blue-500 animate-pulse flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                              <span className="hidden sm:inline">Typing...</span>
                            </span>
                          )}
                        </label>
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          name={field}
                          value={formData[field as keyof ContactForm] as string}
                          onChange={(e) => handleFormChange(field as keyof ContactForm, e.target.value)}
                          className={`
                            w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4
                            rounded-lg sm:rounded-xl md:rounded-2xl
                            border-2
                            bg-white/80
                            backdrop-blur-sm
                            transition-all duration-200
                            focus:outline-none focus:ring-2 sm:focus:ring-3 md:focus:ring-4 focus:ring-opacity-20
                            placeholder-gray-400
                            shadow-sm
                            text-sm sm:text-base md:text-lg
                            ${formErrors[field as keyof FormErrors] 
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                              : "border-gray-300/80 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400/80"
                            }
                            disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100/50
                            touch-manipulation
                          `}
                          placeholder={getPlaceholderText(field)}
                          disabled={!isOnline || isSubmitting}
                          autoComplete={field === 'email' ? 'email' : 'name'}
                        />
                        {formErrors[field as keyof FormErrors] && (
                          <div className="text-red-500 text-xs sm:text-sm flex items-center gap-1.5 animate-pulse">
                            <ErrorIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            {formErrors[field as keyof FormErrors]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                      Address
                      <span className="text-red-500 ml-1">*</span>
                      {typingStatus.address && (
                        <span className="ml-2 text-xs text-blue-500 animate-pulse flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                          <span className="hidden sm:inline">Typing...</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      className={`
                        w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4
                        rounded-lg sm:rounded-xl md:rounded-2xl
                        border-2
                        bg-white/80
                        backdrop-blur-sm
                        transition-all duration-200
                        focus:outline-none focus:ring-2 sm:focus:ring-3 md:focus:ring-4 focus:ring-opacity-20
                        placeholder-gray-400
                        shadow-sm
                        text-sm sm:text-base md:text-lg
                        ${formErrors.address
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                          : "border-gray-300/80 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400/80"
                        }
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100/50
                        touch-manipulation
                      `}
                      placeholder={getPlaceholderText('address')}
                      disabled={!isOnline || isSubmitting}
                      autoComplete="street-address"
                    />
                    {formErrors.address && (
                      <div className="text-red-500 text-xs sm:text-sm flex items-center gap-1.5 animate-pulse">
                        <ErrorIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        {formErrors.address}
                      </div>
                    )}
                  </div>

                  {/* Company & Project Type - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleFormChange('company', e.target.value)}
                        className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-gray-300/80 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 sm:focus:ring-3 md:focus:ring-4 focus:ring-blue-500/20 placeholder-gray-400 shadow-sm hover:border-gray-400/80 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100/50 text-sm sm:text-base md:text-lg touch-manipulation"
                        placeholder={getPlaceholderText('company')}
                        disabled={!isOnline || isSubmitting}
                        autoComplete="organization"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => handleFormChange('projectType', e.target.value)}
                        className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-gray-300/80 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 sm:focus:ring-3 md:focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-400/80 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100/50 text-sm sm:text-base md:text-lg appearance-none touch-manipulation"
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

                  {/* Message Field with Character Counter */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                        Message
                        <span className="text-red-500 ml-1">*</span>
                        {typingStatus.message && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                            <span className="hidden sm:inline">Typing...</span>
                          </span>
                        )}
                      </label>
                      <span className={`text-xs sm:text-sm font-medium ${characterCount > 1800 ? 'text-red-500' : characterCount > 1500 ? 'text-yellow-500' : 'text-gray-500'}`}>
                        {characterCount}/2000
                      </span>
                    </div>
                    <textarea
                      rows={isMobile ? 4 : isTablet ? 5 : 6}
                      name="message"
                      value={formData.message}
                      onChange={(e) => handleFormChange('message', e.target.value)}
                      className={`
                        w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4
                        rounded-lg sm:rounded-xl md:rounded-2xl
                        border-2
                        bg-white/80
                        backdrop-blur-sm
                        transition-all duration-200
                        focus:outline-none focus:ring-2 sm:focus:ring-3 md:focus:ring-4 focus:ring-opacity-20
                        placeholder-gray-400
                        resize-vertical
                        shadow-sm
                        text-sm sm:text-base md:text-lg
                        ${formErrors.message
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                          : "border-gray-300/80 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400/80"
                        }
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100/50
                        touch-manipulation
                      `}
                      placeholder={getPlaceholderText('message')}
                      disabled={!isOnline || isSubmitting}
                      maxLength={2000}
                    />
                    {formErrors.message && (
                      <div className="text-red-500 text-xs sm:text-sm flex items-center gap-1.5 animate-pulse">
                        <ErrorIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        {formErrors.message}
                      </div>
                    )}
                  </div>

                  {/* Form Buttons - Responsive Stack */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-5 lg:pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isOnline || backendStatus.status !== "connected"}
                      className={`
                        group
                        flex-1
                        flex items-center justify-center gap-1 sm:gap-2 md:gap-3
                        px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10
                        py-2.5 sm:py-3 md:py-3.5 lg:py-4 xl:py-5
                        font-bold
                        rounded-lg sm:rounded-xl md:rounded-2xl
                        shadow-lg sm:shadow-xl
                        transition-all duration-300
                        disabled:opacity-60 disabled:cursor-not-allowed
                        ${backendStatus.status === "connected"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-xl sm:hover:shadow-2xl"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-100 cursor-not-allowed"
                        }
                        hover:scale-[1.02] active:scale-[0.98]
                        text-xs sm:text-sm md:text-base lg:text-lg
                        touch-manipulation
                        min-h-[40px] sm:min-h-[44px] md:min-h-[48px] lg:min-h-[52px]
                        relative
                      `}
                      title={getSubmitButtonStatus().tooltip}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{getSubmitButtonText()}</span>
                        </>
                      ) : (
                        <>
                          <SendIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 group-hover:animate-gentle-float" />
                          <span>{getSubmitButtonStatus().text}</span>
                          {backendStatus.status === "connected" && (
                            <div className="transform transition-transform duration-300 group-hover:translate-x-0.5 sm:group-hover:translate-x-1 md:group-hover:translate-x-2">→</div>
                          )}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleResetForm}
                      disabled={isSubmitting}
                      className="px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-gray-300 bg-white hover:bg-gray-50 font-semibold text-gray-700 transition-all duration-300 hover:border-gray-400 hover:shadow disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base lg:text-lg touch-manipulation min-h-[40px] sm:min-h-[44px] md:min-h-[48px] lg:min-h-[52px]"
                    >
                      Reset
                    </button>
                  </div>
                </form>

                {/* Footer Note */}
                <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t border-gray-200/50">
                  <div className="text-center text-xs sm:text-sm md:text-base text-gray-500 space-y-0.5 sm:space-y-1">
                    <p className="mb-0.5 sm:mb-1">
                      Your message is securely saved to our database. I'll review it and get back to you soon.
                    </p>
                    <p className="flex items-center justify-center gap-1">
                      <span className="inline-flex items-center gap-0.5">
                        <CloudIcon className="w-3 h-3 text-green-500" />
                        <span>Database Storage</span>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>Response time: Usually within 24-48 hours</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className={`mt-6 sm:mt-8 md:mt-12 lg:mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-1 sm:mb-2">
              All messages are securely stored in our database ✨
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              © {new Date().getFullYear()} Aditya Auchar. All rights reserved.
            </p>
          </div>
        </div>

        <CustomToast />
      </section>
    </>
  );
};

export default Contact;