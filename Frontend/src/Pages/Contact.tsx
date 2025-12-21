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
import WarningIcon from "@mui/icons-material/Warning";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PsychologyIcon from "@mui/icons-material/Psychology";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import TerminalIcon from "@mui/icons-material/Terminal";
import ApiIcon from "@mui/icons-material/Api";
import BackupIcon from "@mui/icons-material/Backup";
import CachedIcon from "@mui/icons-material/Cached";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";

// Dynamic environment configuration - Automatically populated by Render Blueprint
const API_URL = import.meta.env.VITE_API_URL || "https://protfolio-backend-8p47.onrender.com";
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "https://protfolio-frontend-ytfj.onrender.com";
const IS_RENDER = import.meta.env.VITE_RENDER === "true";
const IS_PRODUCTION = import.meta.env.VITE_NODE_ENV === "production";
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "2.0.0";
const BUILD_TIMESTAMP = import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString();

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
  type: "success" | "error" | "info" | "warning" | "system";
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
  status: "checking" | "connected" | "disconnected" | "sleeping" | "configuring" | "maintenance";
  details: string;
  totalSubmissions?: number;
  lastChecked?: Date;
  responseTime?: number;
  uptime?: number;
  deploymentType?: "production" | "preview" | "local" | "staging";
  version?: string;
  health?: {
    database: boolean;
    api: boolean;
    memory: number;
  };
}

interface DeploymentInfo {
  platform: "Render" | "Local" | "Preview" | "Staging";
  frontendUrl: string;
  backendUrl: string;
  database: string;
  status: "active" | "sleeping" | "offline" | "configuring" | "maintenance";
  serviceId?: string;
  isPreview?: boolean;
  version?: string;
  region?: string;
}

interface SystemMetrics {
  online: boolean;
  connectionStrength: number;
  browserCompatibility: boolean;
  localStorageAvailable: boolean;
  serviceWorker?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    downlink?: number;
    addEventListener?: (type: string, listener: () => void) => void;
    removeEventListener?: (type: string, listener: () => void) => void;
  };
}

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: "system", mess: "System initialized. Ready to connect.", id: "init", timestamp: new Date() }
  ]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    status: "configuring",
    details: "Configuring backend connection from Render Blueprint...",
    totalSubmissions: 0,
    deploymentType: IS_PRODUCTION ? "production" : "preview",
    version: "1.0.0"
  });
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo>({
    platform: IS_RENDER ? "Render" : "Local",
    frontendUrl: FRONTEND_URL,
    backendUrl: API_URL,
    database: "MongoDB Atlas",
    status: "active",
    isPreview: !IS_PRODUCTION,
    version: APP_VERSION,
    region: "North America"
  });
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    online: navigator.onLine,
    connectionStrength: 100,
    browserCompatibility: true,
    localStorageAvailable: true
  });
  const [envError, setEnvError] = useState<string | null>(null);
  const [corsError, setCorsError] = useState<string | null>(null);
  const [blueprintStatus, setBlueprintStatus] = useState<"discovering" | "configured" | "error" | "optimized">("discovering");
  const [showAdvanced, setShowAdvanced] = useState(false);
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
  const addMessage = (type: Message["type"], mess: string, id?: string) => {
    const newMessage: Message = {
      type,
      mess,
      id: id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    setMessages(prev => {
      const updated = [newMessage, ...prev.slice(0, 4)];
      return updated;
    });
  };

  // Check environment variables on mount
  useEffect(() => {
    console.log("🔍 Advanced System Check Initializing...");
    console.log("🔗 API_URL from blueprint:", API_URL);
    console.log("🎨 FRONTEND_URL from blueprint:", FRONTEND_URL);
    console.log("📦 App Version:", APP_VERSION);
    console.log("🏗️ Build Timestamp:", BUILD_TIMESTAMP);
    
    // Check system capabilities
    const checkSystem = () => {
      try {
        localStorage.setItem("portfolio_test", "test");
        localStorage.removeItem("portfolio_test");
        setSystemMetrics(prev => ({ ...prev, localStorageAvailable: true }));
      } catch (e) {
        setSystemMetrics(prev => ({ ...prev, localStorageAvailable: false }));
        addMessage("warning", "Local storage not available. Some features may be limited.");
      }
      
      // Check browser compatibility
      const isModernBrowser = 'IntersectionObserver' in window && 
                               'fetch' in window && 
                               'Promise' in window;
      setSystemMetrics(prev => ({ ...prev, browserCompatibility: isModernBrowser }));
      
      if (!isModernBrowser) {
        addMessage("error", "Your browser may not support all features. Consider updating.");
      }
    };
    
    checkSystem();
    
    // Determine deployment type
    const isPreviewDeployment = FRONTEND_URL.includes('-pr-') || API_URL.includes('-pr-');
    const isStagingDeployment = FRONTEND_URL.includes('staging') || API_URL.includes('staging');
    
    let platform: DeploymentInfo["platform"] = IS_RENDER ? "Render" : "Local";
    if (isPreviewDeployment) platform = "Preview";
    if (isStagingDeployment) platform = "Staging";
    
    setDeploymentInfo(prev => ({
      ...prev,
      platform,
      isPreview: isPreviewDeployment,
      version: APP_VERSION
    }));
    
    if (!import.meta.env.VITE_API_URL) {
      const errorMsg = "⚠️ VITE_API_URL not set. Using default backend URL.";
      console.warn(errorMsg);
      setEnvError(errorMsg);
      addMessage("warning", "Backend URL configured via Render Blueprint.");
    } else {
      console.log("✅ VITE_API_URL configured via Render Blueprint:", import.meta.env.VITE_API_URL);
      setBlueprintStatus("configured");
      addMessage("system", "Render Blueprint configuration loaded successfully.");
    }
    
    // Update deployment info with detected URLs
    setDeploymentInfo(prev => ({
      ...prev,
      frontendUrl: FRONTEND_URL,
      backendUrl: API_URL
    }));
    
    // Check initial backend connection with delay
    setTimeout(() => {
      checkBackendConnection();
      addMessage("info", "Initiating backend connection...");
    }, 1500);
    
  }, []);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          addMessage("system", "Contact section now visible. Monitoring active.");
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

  // Online/offline detection with connection quality
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Network: Online");
      setSystemMetrics(prev => ({ ...prev, online: true }));
      addMessage("success", "Network connection restored.");
      
      // Retry connection when coming back online
      if (backendStatus.status !== "connected") {
        setTimeout(() => checkBackendConnection(), 1000);
      }
    };
    
    const handleOffline = () => {
      console.log("🌐 Network: Offline");
      setSystemMetrics(prev => ({ ...prev, online: false }));
      addMessage("error", "Network connection lost. Working in offline mode.");
    };
    
    // Monitor connection quality
    const updateConnectionStrength = () => {
      const navWithConnection = navigator as NavigatorWithConnection;
      if (navWithConnection.connection && navWithConnection.connection.downlink !== undefined) {
        const downlink = navWithConnection.connection.downlink || 0;
        const strength = downlink ? Math.min(100, (downlink / 10) * 100) : 100;
        setSystemMetrics(prev => ({ ...prev, connectionStrength: strength }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Type-safe connection event listener
    const navWithConnection = navigator as NavigatorWithConnection;
    if (navWithConnection.connection && navWithConnection.connection.addEventListener) {
      navWithConnection.connection.addEventListener('change', updateConnectionStrength);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      const navWithConnection = navigator as NavigatorWithConnection;
      if (navWithConnection.connection && navWithConnection.connection.removeEventListener) {
        navWithConnection.connection.removeEventListener('change', updateConnectionStrength);
      }
    };
  }, [backendStatus.status]);

  // Auto message rotation
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        setMessages(prev => prev.slice(0, -1));
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Auto-retry connection with exponential backoff
  useEffect(() => {
    const initialCheck = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await checkBackendConnection();
      
      // Schedule periodic checks with intelligent timing
      checkTimeoutRef.current = setInterval(() => {
        if (backendStatus.status !== "connected" && systemMetrics.online) {
          checkBackendConnection();
        }
      }, backendStatus.status === "sleeping" ? 30000 : 60000);
    };

    initialCheck();

    return () => {
      if (checkTimeoutRef.current) {
        clearInterval(checkTimeoutRef.current);
        checkTimeoutRef.current = null;
      }
    };
  }, [systemMetrics.online]);

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
    if (isCheckingBackend || !systemMetrics.online) {
      console.log("⏸️ Backend check skipped:", { isCheckingBackend, online: systemMetrics.online });
      return;
    }
    
    setIsCheckingBackend(true);
    const startTime = performance.now();
    setCorsError(null);
    
    try {
      console.log(`🔗 [${new Date().toISOString()}] Advanced backend check to: ${API_URL}/api/health`);
      
      setBackendStatus(prev => ({
        ...prev,
        status: "checking",
        details: `Establishing secure connection to ${API_URL.replace('https://', '')}...`,
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Origin': FRONTEND_URL,
          'X-Requested-With': 'XMLHttpRequest'
        },
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });

      clearTimeout(timeoutId);
      
      const responseTime = Math.round(performance.now() - startTime);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend connected:", data);
        
        setBackendStatus({
          status: "connected",
          details: `✅ Connected to MongoDB Atlas | ${data.totalUsers || 0} submissions processed`,
          totalSubmissions: data.totalUsers || 0,
          lastChecked: new Date(),
          responseTime,
          uptime: data.server?.uptime,
          deploymentType: deploymentInfo.isPreview ? "preview" : "production",
          version: data.version || "1.0.0",
          health: {
            database: data.database === "connected",
            api: true,
            memory: data.memoryUsage || 0
          }
        });
        
        setConnectionRetries(0);
        setBlueprintStatus("optimized");
        
        if (connectionRetries > 0) {
          addMessage("success", "Backend server reconnected successfully!");
        } else {
          addMessage("success", "Backend connection established with MongoDB Atlas.");
        }
      } else {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
    } catch (error: unknown) {
      const responseTime = Math.round(performance.now() - startTime);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      console.error(`❌ Backend connection failed:`, errorMessage);
      
      // Enhanced error detection
      let status: BackendStatus["status"] = "disconnected";
      let details = `Network error detected. Checking ${API_URL.replace('https://', '')}`;
      
      if (errorMessage.includes("abort") || errorMessage.includes("timeout")) {
        status = "sleeping";
        details = "Backend server is waking up (Render free tier standby)...";
        addMessage("warning", "Backend is spinning up. First request may take 30-45 seconds.");
      } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("CORS")) {
        status = "configuring";
        details = "CORS configuration in progress...";
        setCorsError("CORS policy needs configuration for this origin");
        addMessage("warning", "CORS configuration required. Check backend settings.");
      } else if (errorMessage.includes("503") || errorMessage.includes("502")) {
        status = "maintenance";
        details = "Backend undergoing maintenance...";
        addMessage("info", "Backend maintenance in progress. Please try again shortly.");
      }
      
      const newRetries = connectionRetries + 1;
      setConnectionRetries(newRetries);
      
      setBackendStatus({
        status,
        details,
        totalSubmissions: backendStatus.totalSubmissions,
        lastChecked: new Date(),
        responseTime,
        deploymentType: deploymentInfo.isPreview ? "preview" : "production"
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
        addMessage("error", "Backend server unavailable. Using resilient fallback system.");
      }
    } finally {
      setIsCheckingBackend(false);
    }
  }, [isCheckingBackend, systemMetrics.online, connectionRetries, backendStatus.totalSubmissions, backendStatus.status, deploymentInfo.isPreview]);

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
          { condition: formData.fullname.trim().length > 100, message: "Full name should not exceed 100 characters" },
          { condition: !/^[a-zA-Z\s.'-]+$/.test(formData.fullname.trim()), message: "Full name contains invalid characters" }
        ]
      },
      {
        field: 'email' as keyof FormErrors,
        value: formData.email.trim(),
        rules: [
          { condition: !formData.email.trim(), message: "Email is required" },
          { condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), message: "Please enter a valid email address" },
          { condition: formData.email.trim().length > 255, message: "Email should not exceed 255 characters" },
          { condition: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email), message: "Email format is invalid" }
        ]
      },
      {
        field: 'address' as keyof FormErrors,
        value: formData.address.trim(),
        rules: [
          { condition: !formData.address.trim(), message: "Address is required" },
          { condition: formData.address.trim().length < 5, message: "Address should be at least 5 characters" },
          { condition: formData.address.trim().length > 500, message: "Address should not exceed 500 characters" }
        ]
      },
      {
        field: 'message' as keyof FormErrors,
        value: formData.message.trim(),
        rules: [
          { condition: !formData.message.trim(), message: "Message is required" },
          { condition: formData.message.trim().length < 10, message: "Message should be at least 10 characters" },
          { condition: formData.message.trim().length > 2000, message: "Message should not exceed 2000 characters" },
          { condition: formData.message.trim().split(/\s+/).length < 3, message: "Please provide more details in your message" }
        ]
      }
    ];
    
    validations.forEach(({ field, value, rules }) => {
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
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
      'fullname': 'John Doe (min 2 characters)',
      'email': 'john@example.com',
      'address': '123 Main St, City, Country (min 5 characters)',
      'message': 'Describe your project or inquiry in detail (min 10 characters)',
      'company': 'Optional: Your company name',
      'projectType': 'Select project type'
    };
    return placeholders[field] || `Enter your ${field}`;
  };

  const submitToBackend = async (): Promise<{success: boolean; message: string; data?: any}> => {
    try {
      console.log("📤 Submitting to backend:", `${API_URL}/api/contact`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const payload = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        message: formData.message.trim(),
        company: formData.company?.trim() || undefined,
        projectType: formData.projectType,
        timestamp: new Date().toISOString(),
        source: "Render Frontend v2",
        frontendUrl: FRONTEND_URL,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "portfolio-contact-v2",
          "X-Request-ID": `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Backend submission successful:", data);
        return { 
          success: true, 
          message: data.message || "Message received successfully!",
          data 
        };
      } else {
        console.error("❌ Backend submission failed:", data);
        return { 
          success: false, 
          message: data.error || data.message || "Submission failed. Please try again.",
          data 
        };
      }
    } catch (error) {
      console.error("❌ Backend submission error:", error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Network error occurred. Please check connection." 
      };
    }
  };

  const openEmailFallback = (): void => {
    const subject = `Portfolio Contact from ${formData.fullname.trim()} - ${formData.projectType}`;
    const body = `
CONTACT FORM SUBMISSION
=======================

Name: ${formData.fullname.trim()}
Email: ${formData.email.trim()}
Address: ${formData.address.trim()}
Company: ${formData.company?.trim() || 'Not provided'}
Project Type: ${formData.projectType}

MESSAGE:
${formData.message.trim()}

---
TECHNICAL DETAILS
Frontend: ${FRONTEND_URL}
Backend: ${API_URL}
Submission Time: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
    `.trim();

    const mailtoLink = `mailto:adityaauchar40@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    console.log("📧 Opening email fallback:", mailtoLink);
    
    // Enhanced email fallback with multiple strategies
    try {
      const newWindow = window.open(mailtoLink, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Try iframe method
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = mailtoLink;
        document.body.appendChild(iframe);
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }
    } catch (e) {
      // Final fallback
      window.location.href = mailtoLink;
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!systemMetrics.online) {
      addMessage("error", "You are offline. Please check your internet connection and try again.");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    addMessage("info", "Processing your submission...");

    try {
      // Try backend first if connected or sleeping
      if (backendStatus.status === "connected" || backendStatus.status === "sleeping") {
        const result = await submitToBackend();
        
        if (result.success) {
          addMessage("success", 
            `${result.message} Your data has been saved to MongoDB database. I'll respond within 24 hours!`
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
          
          // Refresh backend status
          setTimeout(() => checkBackendConnection(), 1000);
          return;
        } else {
          addMessage("warning", 
            `Backend submission failed: ${result.message}. Trying email fallback...`
          );
        }
      }
      
      // Fallback to email
      openEmailFallback();
      
      addMessage(backendStatus.status === "connected" ? "warning" : "info", 
        backendStatus.status === "connected" 
          ? "Backend unavailable. Opening email client as fallback."
          : "Backend is sleeping. Opening email client. Please send from there."
      );
      
      // Reset form after fallback
      setTimeout(() => {
        setFormData({
          fullname: "",
          email: "",
          address: "",
          message: "",
          company: "",
          projectType: "general"
        });
        setFormErrors({});
      }, 1000);
      
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
    if (messages.length === 0) return null;

    return (
      <div className="fixed top-24 right-6 z-50 space-y-3 max-w-md">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`
              flex items-start gap-3
              px-5 py-4
              rounded-2xl
              shadow-2xl
              border-l-4
              backdrop-blur-md
              transform transition-all duration-500 ease-out
              ${msg.type === "success" 
                ? "bg-gradient-to-r from-green-50/95 to-emerald-50/95 border-green-500 text-green-800" 
                : msg.type === "error"
                ? "bg-gradient-to-r from-red-50/95 to-rose-50/95 border-red-500 text-red-800"
                : msg.type === "warning"
                ? "bg-gradient-to-r from-yellow-50/95 to-amber-50/95 border-yellow-500 text-yellow-800"
                : msg.type === "system"
                ? "bg-gradient-to-r from-blue-50/95 to-cyan-50/95 border-blue-500 text-blue-800"
                : "bg-gradient-to-r from-gray-50/95 to-slate-50/95 border-gray-500 text-gray-800"
              }
              animate-slide-in
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-shrink-0 pt-0.5">
              {msg.type === "success" ? (
                <CheckCircleIcon sx={{ fontSize: "1.25rem" }} className="text-green-500" />
              ) : msg.type === "error" ? (
                <ErrorIcon sx={{ fontSize: "1.25rem" }} className="text-red-500" />
              ) : msg.type === "warning" ? (
                <WarningIcon sx={{ fontSize: "1.25rem" }} className="text-yellow-500" />
              ) : msg.type === "system" ? (
                <TerminalIcon sx={{ fontSize: "1.25rem" }} className="text-blue-500" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm mb-1 flex justify-between items-center">
                <span>
                  {msg.type === "success" ? "Success!" : 
                   msg.type === "error" ? "Error!" : 
                   msg.type === "warning" ? "Warning!" : 
                   msg.type === "system" ? "System" : "Processing..."}
                </span>
                {msg.timestamp && (
                  <span className="text-xs font-normal opacity-75">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <div className="text-sm break-words">{msg.mess}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getBackendStatusIcon = () => {
    switch (backendStatus.status) {
      case "connected":
        return <CloudQueueIcon className="text-green-500 animate-pulse" />;
      case "checking":
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case "sleeping":
        return <CachedIcon className="text-yellow-500 animate-spin" />;
      case "configuring":
        return <SyncIcon className="text-purple-500 animate-spin" />;
      case "maintenance":
        return <BackupIcon className="text-orange-500" />;
      case "disconnected":
        return <WifiOffIcon className="text-red-500" />;
      default:
        return <CloudIcon className="text-gray-500" />;
    }
  };

  const getBackendStatusColor = () => {
    switch (backendStatus.status) {
      case "connected":
        return "bg-gradient-to-r from-green-50/90 to-emerald-50/90 border-green-300 text-green-900";
      case "checking":
        return "bg-gradient-to-r from-blue-50/90 to-cyan-50/90 border-blue-300 text-blue-900";
      case "sleeping":
        return "bg-gradient-to-r from-yellow-50/90 to-amber-50/90 border-yellow-300 text-yellow-900";
      case "configuring":
        return "bg-gradient-to-r from-purple-50/90 to-indigo-50/90 border-purple-300 text-purple-900";
      case "maintenance":
        return "bg-gradient-to-r from-orange-50/90 to-amber-50/90 border-orange-300 text-orange-900";
      case "disconnected":
        return "bg-gradient-to-r from-red-50/90 to-rose-50/90 border-red-300 text-red-900";
      default:
        return "bg-gradient-to-r from-gray-50/90 to-slate-50/90 border-gray-300 text-gray-900";
    }
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return backendStatus.status === "connected" 
        ? "Saving to Database..." 
        : backendStatus.status === "sleeping"
        ? "Waking Backend..."
        : "Opening Email...";
    }
    
    if (backendStatus.status === "connected") {
      return "Send Message (Cloud Database)";
    } else if (backendStatus.status === "sleeping") {
      return "Wake & Send (Database)";
    } else if (backendStatus.status === "checking") {
      return "Checking Connection...";
    } else {
      return "Send Message (Email)";
    }
  };

  const getSubmitButtonColor = () => {
    if (isSubmitting) {
      return "bg-gradient-to-r from-gray-400 to-gray-500 cursor-wait";
    }
    
    switch (backendStatus.status) {
      case "connected":
        return "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";
      case "sleeping":
        return "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700";
      case "checking":
        return "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";
      case "configuring":
        return "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700";
      case "maintenance":
        return "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700";
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700";
    }
  };

  const formatResponseTime = (time?: number) => {
    if (!time) return "N/A";
    return time < 100 ? `${time}ms 🚀` : `${time}ms`;
  };

  const handleManualRetry = () => {
    console.log("🔄 Manual retry triggered");
    addMessage("system", "Manual connection check initiated...");
    checkBackendConnection();
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

  const handleTestConnection = async () => {
    addMessage("system", "Running comprehensive connection test...");
    await checkBackendConnection();
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
            50% { transform: translateY(-6px) scale(1.03); }
          }
          @keyframes soft-pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.05); }
          }
          @keyframes icon-glow {
            0%, 100% { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }
            50% { filter: drop-shadow(0 6px 20px rgba(0,0,0,0.15)); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes progress-bar {
            from { width: 0%; }
            to { width: 100%; }
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
          .animate-slide-in {
            animation: slide-in 0.5s ease-out forwards;
          }
          .animate-progress-bar {
            animation: progress-bar 2s ease-in-out infinite;
          }
          .backdrop-blur-xl {
            backdrop-filter: blur(24px);
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <section id="contact" ref={sectionRef} className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-gray-50/50 to-white">
        {/* Advanced background animations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full mix-blend-multiply opacity-40 animate-soft-pulse blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-teal-200/20 rounded-full mix-blend-multiply opacity-40 animate-soft-pulse delay-3000 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-r from-sky-200/20 to-blue-200/20 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse delay-1000 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full mix-blend-multiply opacity-25 animate-soft-pulse delay-2000 blur-3xl"></div>
        
        {/* Connection status indicator */}
        <div className="fixed top-4 right-4 z-40">
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${
            systemMetrics.online 
              ? "bg-green-100/90 text-green-800 border-green-300" 
              : "bg-red-100/90 text-red-800 border-red-300"
          }`}>
            {systemMetrics.online ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Offline
              </span>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full shadow-sm border border-blue-100 backdrop-blur-sm">
                {deploymentInfo.isPreview ? "🚀 Preview Deployment" : "🤝 Get In Touch"}
              </span>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Let's Create Something{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Amazing
              </span>
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              Ready to bring your ideas to life? Let's discuss your project and create something amazing together. 
              <span className="block mt-2 text-sm text-gray-500">
                Powered by React + Node.js + MongoDB on Render • Version {APP_VERSION}
                {deploymentInfo.isPreview && " • Preview Environment"}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Contact Info & Status */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-gray-100/50 hover:border-gray-200/70 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Contact <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Information</span>
                  </h3>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300"
                  >
                    {showAdvanced ? "Hide Details" : "Show Details"}
                  </button>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  I am currently open to new opportunities and collaborative projects where I can contribute my skills and experience in full-stack development. Let's connect and build something great together.
                </p>

                <div className="space-y-4 mb-8">
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

                {/* Deployment Status Card */}
                <div className="mb-6">
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${getBackendStatusColor()} shadow-lg hover:shadow-xl`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getBackendStatusIcon()}
                        <div>
                          <div className="font-bold text-lg">
                            {deploymentInfo.isPreview ? "🚧 Preview Deployment" : "🌐 Deployment Status"}
                          </div>
                          <div className="text-sm font-medium">
                            Status:{" "}
                            <span className={
                              backendStatus.status === "connected" 
                                ? "text-green-600 font-bold" 
                                : backendStatus.status === "checking" 
                                ? "text-blue-600"
                                : backendStatus.status === "sleeping"
                                ? "text-yellow-600"
                                : backendStatus.status === "configuring"
                                ? "text-purple-600"
                                : backendStatus.status === "maintenance"
                                ? "text-orange-600"
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
                        {blueprintStatus === "optimized" && (
                          <span className="text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1.5 rounded-full shadow-sm">
                            Optimized ✓
                          </span>
                        )}
                        <button
                          onClick={handleManualRetry}
                          disabled={isCheckingBackend}
                          className="p-2 rounded-lg bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                          title="Check connection"
                        >
                          {isCheckingBackend ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CachedIcon sx={{ fontSize: "1rem" }} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm">
                        {backendStatus.details}
                        {backendStatus.lastChecked && (
                          <span className="text-xs text-gray-500 ml-2">
                            (Last check: {backendStatus.lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
                          </span>
                        )}
                      </div>
                      
                      {/* Performance metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50">
                          <div className="text-xs text-gray-500 mb-1">Response Time</div>
                          <div className="font-bold text-gray-800 flex items-center gap-1">
                            {formatResponseTime(backendStatus.responseTime)}
                            {backendStatus.responseTime && backendStatus.responseTime < 100 && (
                              <span className="text-green-500">⚡</span>
                            )}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50">
                          <div className="text-xs text-gray-500 mb-1">Retry Attempts</div>
                          <div className="font-bold text-gray-800">{connectionRetries}</div>
                        </div>
                      </div>
                      
                      {showAdvanced && (
                        <>
                          {/* Render Blueprint Status */}
                          <div className="p-3 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border border-purple-200/50 rounded-lg">
                            <div className="text-xs text-purple-800 font-medium mb-1 flex items-center gap-2">
                              <IntegrationInstructionsIcon sx={{ fontSize: "1rem" }} />
                              Render Blueprint Configuration
                            </div>
                            <div className="text-xs text-purple-600 space-y-1">
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <strong className={
                                  blueprintStatus === "optimized" ? "text-green-600" :
                                  blueprintStatus === "configured" ? "text-blue-600" :
                                  blueprintStatus === "error" ? "text-red-600" :
                                  "text-yellow-600"
                                }>
                                  {blueprintStatus.toUpperCase()}
                                </strong>
                              </div>
                              <div className="truncate" title={FRONTEND_URL}>
                                <span className="opacity-75">Frontend:</span> {FRONTEND_URL.replace('https://', '')}
                              </div>
                              <div className="truncate" title={API_URL}>
                                <span className="opacity-75">Backend:</span> {API_URL.replace('https://', '')}
                              </div>
                            </div>
                            {deploymentInfo.isPreview && (
                              <div className="mt-2 text-xs text-purple-700 font-medium flex items-center gap-1">
                                <AutoFixHighIcon sx={{ fontSize: "0.8rem" }} />
                                Pull Request Preview Environment
                              </div>
                            )}
                          </div>
                          
                          {/* System Metrics */}
                          <div className="p-3 bg-gradient-to-r from-gray-50/80 to-slate-50/80 border border-gray-200/50 rounded-lg">
                            <div className="text-xs text-gray-800 font-medium mb-1 flex items-center gap-2">
                              <PsychologyIcon sx={{ fontSize: "1rem" }} />
                              System Metrics
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div className="flex justify-between">
                                <span>Connection:</span>
                                <span className={
                                  systemMetrics.connectionStrength > 80 ? "text-green-600" :
                                  systemMetrics.connectionStrength > 50 ? "text-yellow-600" :
                                  "text-red-600"
                                }>
                                  {systemMetrics.connectionStrength}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Browser:</span>
                                <span className={systemMetrics.browserCompatibility ? "text-green-600" : "text-red-600"}>
                                  {systemMetrics.browserCompatibility ? "Compatible" : "Limited"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Storage:</span>
                                <span className={systemMetrics.localStorageAvailable ? "text-green-600" : "text-red-600"}>
                                  {systemMetrics.localStorageAvailable ? "Available" : "Unavailable"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Render free tier notice */}
                          {backendStatus.status === "sleeping" && (
                            <div className="p-3 bg-gradient-to-r from-yellow-50/80 to-amber-50/80 border border-yellow-200/50 rounded-lg">
                              <div className="text-xs text-yellow-800 font-medium flex items-center gap-2">
                                <SpeedIcon sx={{ fontSize: "1rem" }} />
                                Render Free Tier Notice
                              </div>
                              <div className="text-xs text-yellow-600 mt-1">
                                Backend spins down after 15 minutes of inactivity. First request may take 30-45 seconds to wake up.
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Connection progress bar */}
                    {backendStatus.status === "checking" && (
                      <div className="mt-3">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-progress-bar rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-1">
                          Establishing connection...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Connection Button */}
                <button
                  onClick={handleTestConnection}
                  disabled={isCheckingBackend || !systemMetrics.online}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ApiIcon sx={{ fontSize: "1rem" }} />
                  <span className="font-medium">Test Connection</span>
                </button>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-gray-100/50 hover:border-gray-200/70 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                      Send Me a{" "}
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        Message
                      </span>
                    </h3>
                    <p className="text-gray-600">
                      {backendStatus.status === "connected" 
                        ? "📊 Your message will be securely saved to MongoDB database"
                        : backendStatus.status === "sleeping"
                        ? "⏳ Backend is waking up... First submission may take a moment"
                        : backendStatus.status === "configuring"
                        ? "⚙️ Configuring backend connection..."
                        : backendStatus.status === "maintenance"
                        ? "🔧 Backend under maintenance. Using email fallback"
                        : "📧 Your message will be sent via secure email fallback"
                      }
                    </p>
                  </div>
                  {!systemMetrics.online && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-full">
                      <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                        <WifiOffIcon sx={{ fontSize: "0.8rem" }} />
                        Offline Mode
                      </span>
                    </div>
                  )}
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
                          disabled={!systemMetrics.online || isSubmitting}
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
                      disabled={!systemMetrics.online || isSubmitting}
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
                        disabled={!systemMetrics.online || isSubmitting}
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
                        disabled={!systemMetrics.online || isSubmitting}
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
                      disabled={!systemMetrics.online || isSubmitting}
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
                      disabled={isSubmitting || !systemMetrics.online}
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

                <div className="mt-8 space-y-4">
                  {/* Status Indicator */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm ${
                      backendStatus.status === "connected" 
                        ? "text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" 
                        : backendStatus.status === "sleeping"
                        ? "text-yellow-600 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200"
                        : backendStatus.status === "checking"
                        ? "text-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200"
                        : backendStatus.status === "configuring"
                        ? "text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200"
                        : backendStatus.status === "maintenance"
                        ? "text-orange-600 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200"
                        : "text-gray-600 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200"
                    }`}>
                      {backendStatus.status === "connected" ? (
                        <>
                          <CloudQueueIcon sx={{ fontSize: "1rem" }} />
                          Connected to cloud database
                        </>
                      ) : backendStatus.status === "sleeping" ? (
                        <>
                          <CachedIcon sx={{ fontSize: "1rem" }} className="animate-spin" />
                          Backend server waking up
                        </>
                      ) : backendStatus.status === "checking" ? (
                        <>
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          Checking connection
                        </>
                      ) : backendStatus.status === "configuring" ? (
                        <>
                          <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          Configuring connection
                        </>
                      ) : backendStatus.status === "maintenance" ? (
                        <>
                          <BackupIcon sx={{ fontSize: "1rem" }} />
                          Maintenance in progress
                        </>
                      ) : (
                        <>
                          <EmailIcon sx={{ fontSize: "1rem" }} />
                          Using secure email fallback
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Deployment Info */}
                  <div className="text-center text-xs text-gray-500 space-y-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-slate-50/50 border border-gray-200/50">
                      <p className="font-semibold text-gray-700 mb-2">Deployment Information</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-white/50 border border-gray-200/50">
                          <div className="font-semibold text-gray-700">Frontend</div>
                          <div className="text-gray-600 truncate" title={deploymentInfo.frontendUrl}>
                            {deploymentInfo.frontendUrl.replace('https://', '')}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/50 border border-gray-200/50">
                          <div className="font-semibold text-gray-700">Backend</div>
                          <div className="text-gray-600 truncate" title={deploymentInfo.backendUrl}>
                            {deploymentInfo.backendUrl.replace('https://', '')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50">
                      <div className="font-semibold text-gray-700">Technology Stack</div>
                      <div className="text-gray-600">React 18 + Node.js + MongoDB Atlas on Render</div>
                      <div className="text-xs text-gray-500 mt-1">Version: {APP_VERSION}</div>
                    </div>
                    
                    {deploymentInfo.isPreview && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-200/50">
                        <div className="font-semibold text-gray-700">Preview Environment</div>
                        <div className="text-gray-600">Pull Request Preview • Auto-linked Services • Instant Deploy</div>
                      </div>
                    )}
                    
                    {!systemMetrics.online && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-rose-50/50 border border-red-200/50 animate-pulse">
                        <div className="font-semibold text-red-600 flex items-center justify-center gap-2">
                          <WifiOffIcon sx={{ fontSize: "0.8rem" }} />
                          ⚠️ Offline Mode
                        </div>
                        <div className="text-red-500">Please check your internet connection</div>
                      </div>
                    )}
                    
                    {/* Security Badge */}
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200/50">
                      <div className="flex items-center justify-center gap-2">
                        <SecurityIcon sx={{ fontSize: "0.8rem" }} className="text-green-600" />
                        <span className="text-xs text-green-700 font-medium">Secure Connection • Data Encrypted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Note */}
          <div className={`mt-12 text-center text-gray-500 text-sm transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <p className="max-w-2xl mx-auto">
              This contact system features automatic fallback mechanisms, connection resilience, 
              and real-time monitoring. Built with React 18, TypeScript, and deployed via Render Blueprint.
              {deploymentInfo.isPreview && " This is a preview deployment for testing purposes."}
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Operational
              </span>
              <span>•</span>
              <span>Response Guarantee: 24-48 hours</span>
              <span>•</span>
              <span>Data Retention: 90 days</span>
            </div>
          </div>
        </div>

        <CustomToast />
      </section>
    </>
  );
};

export default Contact;