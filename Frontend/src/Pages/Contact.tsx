import React, { useState, useEffect, useRef, JSX } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import StorageIcon from "@mui/icons-material/Storage";

// Use your actual Render backend URL
const API_URL = import.meta.env.VITE_API_URL || "https://protfolio-backend-8p47.onrender.com";

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
  type: string;
  mess: string;
}

interface ContactForm {
  fullname: string;
  email: string;
  address: string;
  message: string;
}

interface BackendResponse {
  _message?: string;
  message?: string;
  data?: any;
  error?: string;
  id?: string;
  success?: boolean;
  details?: string[];
}

interface BackendHealth {
  status: string;
  database: string;
  databaseName: string;
  totalUsers: number;
  timestamp: string;
  environment: string;
  server: {
    port: number;
    nodeVersion: string;
    platform: string;
    renderUrl?: string;
  };
}

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ type: "", mess: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [backendDetails, setBackendDetails] = useState<string>("Checking backend connection...");
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [backendUrl, setBackendUrl] = useState<string>(API_URL);
  const [isRetrying, setIsRetrying] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = sectionRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    if (message.type) {
      const timer = setTimeout(() => {
        setMessage({ type: "", mess: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const contactInfo: ContactInfo[] = [
    { 
      title: "Email", 
      detail: "adityaauchar40@gmail.com", 
      icon: <EmailIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-blue-300 to-blue-400",
      link: "mailto:adityaauchar40@gmail.com"
    },
    { 
      title: "Phone", 
      detail: "+91 8097459014", 
      icon: <LocalPhoneIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-green-300 to-green-400",
      link: "tel:+918097459014"
    },
    {
      title: "LinkedIn",
      detail: "aditya-auchar-390147334",
      icon: <LinkedInIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-blue-400 to-blue-500",
      link: "https://www.linkedin.com/in/aditya-auchar-390147334/"
    },
    {
      title: "Location",
      detail: "Airoli, Navi Mumbai, Maharashtra, India",
      icon: <LocationPinIcon sx={{ fontSize: "1.5rem" }} />,
      color: "from-purple-300 to-purple-400",
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

  const testBackendConnection = async (): Promise<boolean> => {
    try {
      console.log(`🧪 Testing backend connection to: ${backendUrl}/api/test`);
      console.log(`🔄 Connection attempt: ${connectionAttempts + 1}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(`${backendUrl}/api/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend test successful:", data);
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error("❌ Backend test failed:", error);
      return false;
    }
  };

  const checkBackendConnection = async (): Promise<boolean> => {
    try {
      setConnectionAttempts(prev => prev + 1);
      setBackendStatus("checking");
      setBackendDetails("Checking backend connection...");
      
      console.log(`🔗 Testing backend connection to: ${backendUrl}/api/health`);
      console.log(`🌐 Current API URL: ${backendUrl}`);
      console.log(`📊 Environment: ${import.meta.env.MODE}`);
      console.log(`🎯 VITE_API_URL from env: ${import.meta.env.VITE_API_URL}`);
      
      if (connectionAttempts === 0) {
        setBackendDetails("First connection attempt (Render free tier may take 30-60s to start)...");
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${backendUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`📡 Response status: ${response.status}`);
      
      if (response.ok) {
        const data: BackendHealth = await response.json();
        console.log("✅ Backend health check successful:", data);
        
        setBackendStatus("connected");
        setBackendDetails(`Database: ${data.database} | Total Submissions: ${data.totalUsers || 0}`);
        setTotalSubmissions(data.totalUsers || 0);
        
        if (data.server?.renderUrl) {
          setBackendUrl(data.server.renderUrl);
        }
        
        return true;
      } else {
        console.error("❌ Backend health check failed:", response.status);
        setBackendStatus("disconnected");
        setBackendDetails(`HTTP ${response.status} - Backend not responding properly`);
        return false;
      }
    } catch (error: unknown) {
      console.error("❌ Backend connection error:", error);
      setBackendStatus("disconnected");
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setBackendDetails("Connection timeout (30s). The backend server is starting up. Render free tier has cold starts.");
        } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          setBackendDetails("Network error. Please check your internet connection and try again.");
        } else {
          setBackendDetails(`Cannot connect to backend: ${error.message || 'Unknown error'}`);
        }
      } else if (typeof error === 'string') {
        setBackendDetails(`Cannot connect to backend: ${error}`);
      } else {
        setBackendDetails("Cannot connect to backend: Unknown error occurred");
      }
      
      if (connectionAttempts < 3) {
        setBackendDetails(prev => prev + " Retrying in 5 seconds...");
        setTimeout(() => {
          if (backendStatus === "disconnected") {
            retryBackendConnection();
          }
        }, 5000);
      }
      
      return false;
    } finally {
      setIsRetrying(false);
    }
  };

  const retryBackendConnection = async () => {
    setIsRetrying(true);
    await checkBackendConnection();
  };

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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log("📝 Form submitted");
    console.log("🌐 Using API URL:", backendUrl);
    
    if (!validateForm()) {
      setMessage({ type: "error", mess: "Please fix the validation errors above" });
      return;
    }

    if (backendStatus !== "connected") {
      const isConnected = await checkBackendConnection();
      if (!isConnected) {
        setMessage({ 
          type: "error", 
          mess: "Backend server is not reachable. Please wait a moment and try again. Render free tier servers spin down after inactivity." 
        });
        return;
      }
    }

    setIsSubmitting(true);
    console.log("🔄 Submitting form...");

    try {
      console.log("🌐 API URL:", backendUrl);
      
      const requestData = {
        fullname: contactForm.fullname.trim(),
        email: contactForm.email.trim().toLowerCase(),
        address: contactForm.address.trim(),
        message: contactForm.message.trim()
      };

      console.log("📤 Sending data to backend:", requestData);

      const endpoints = [
        "/api/contact",
        "/users",
        "/contact",
        "/api/send-message",
        "/send-message",
        "/api/messages",
        "/api/submit"
      ];

      let lastError = "Failed to send message. Please try again later.";
      let success = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${backendUrl}${endpoint}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);
          
          const response = await fetch(`${backendUrl}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          
          console.log(`📨 Response from ${endpoint}:`, response.status);
          
          const data: BackendResponse = await response.json();
          console.log(`📊 Response data from ${endpoint}:`, data);

          if (response.ok && (data.success || data._message === "Successfully submitted" || data.message?.includes("success"))) {
            console.log("✅ Data successfully saved to MongoDB Atlas with ID:", data.id);
            setMessage({ 
              type: "success", 
              mess: data._message || data.message || "Message sent successfully! Your data has been permanently saved to MongoDB Atlas database." 
            });
            setContactForm(initialForm);
            setFormErrors({});
            
            if (formRef.current) {
              formRef.current.reset();
            }
            
            setTimeout(() => checkBackendConnection(), 1500);
            success = true;
            break;
          } else {
            lastError = data._message || data.error || data.message || `Request failed with status ${response.status}`;
            console.error(`❌ Endpoint ${endpoint} failed:`, lastError);
            
            if (response.status === 409) {
              setMessage({
                type: "error",
                mess: "You have already submitted a similar message recently. Please wait before submitting again."
              });
              break;
            }
          }
        } catch (endpointError: unknown) {
          console.error(`❌ Endpoint ${endpoint} failed:`, endpointError);
          
          if (endpointError instanceof Error) {
            if (endpointError.name === 'AbortError') {
              lastError = "Request timeout (30s). The backend is starting up. Please try again in a moment.";
            } else {
              lastError = `Network error: ${endpointError.message || 'Cannot connect to server'}`;
            }
          } else if (typeof endpointError === 'string') {
            lastError = `Error: ${endpointError}`;
          } else {
            lastError = "Network error: Cannot connect to server";
          }
        }
      }

      if (!success) {
        setMessage({ 
          type: "error", 
          mess: lastError
        });
      }

    } catch (error: unknown) {
      console.error("❌ API call failed:", error);
      
      let errorMessage = "Please check your connection and try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setMessage({ 
        type: "error", 
        mess: `Error: ${errorMessage}` 
      });
    } finally {
      setIsSubmitting(false);
      console.log("✅ Submission completed");
    }
  };

  const CustomToast = (): JSX.Element | null => {
    if (!message.type) return null;

    return (
      <div className={`
        fixed top-24 right-6 z-50
        flex items-center gap-3
        px-6 py-4
        rounded-2xl
        shadow-2xl
        border-l-4
        backdrop-blur-md
        transform transition-all duration-500
        ${message.type === "success" 
          ? "bg-green-50 border-green-500 text-green-800" 
          : "bg-red-50 border-red-500 text-red-800"
        }
        ${message.mess ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}>
        {message.type === "success" ? (
          <CheckCircleIcon sx={{ fontSize: "1.5rem" }} />
        ) : (
          <ErrorIcon sx={{ fontSize: "1.5rem" }} />
        )}
        <div>
          <div className="font-semibold">
            {message.type === "success" ? "Success!" : "Error!"}
          </div>
          <div className="text-sm">{message.mess}</div>
        </div>
      </div>
    );
  };

  const getBackendStatusIcon = () => {
    switch (backendStatus) {
      case "connected":
        return <StorageIcon className="text-green-500" />;
      case "checking":
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case "disconnected":
        return <CloudOffIcon className="text-red-500" />;
      default:
        return <WifiOffIcon className="text-yellow-500" />;
    }
  };

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case "connected":
        return "bg-green-50 border-green-200 text-green-800";
      case "checking":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "disconnected":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes gentle-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-3px) scale(1.02); }
          }
          @keyframes soft-pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          @keyframes icon-glow {
            0%, 100% { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            50% { box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
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
        `}
      </style>

      <section id="contact" ref={sectionRef} className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-50 rounded-full mix-blend-multiply opacity-30 animate-soft-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-sky-50 rounded-full mix-blend-multiply opacity-25 animate-soft-pulse delay-4000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-0.5 bg-linear-to-r from-blue-300 to-blue-200"></div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <div className="w-6 h-0.5 bg-linear-to-r from-blue-200 to-blue-300"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Let's Work Together
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's discuss your project and create something amazing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                  Contact <span className="bg-linear-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Information</span>
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  I am currently open to new opportunities and collaborative projects where I can contribute my skills and experience in frontend development. Let's connect and build something great together.
                </p>

                <div className="space-y-5">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target={item.link.startsWith('http') ? "_blank" : "_self"}
                      rel={item.link.startsWith('http') ? "noopener noreferrer" : ""}
                      className="group flex items-center gap-4 p-5 rounded-2xl border border-gray-200/60 hover:border-blue-200/80 bg-white/60 hover:bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-md"
                    >
                      <div className={`p-3 rounded-xl bg-linear-to-r ${item.color} text-white shadow-sm animate-gentle-float`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                          {item.title}
                        </div>
                        <div className="text-gray-700 font-semibold group-hover:text-gray-800 transition-colors duration-300">
                          {item.detail}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 transition-all duration-500 text-blue-400 text-lg font-light">
                        ›
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-8">
                  <div className={`p-4 rounded-2xl border transition-all duration-300 ${getBackendStatusColor()}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getBackendStatusIcon()}
                        <span className="font-semibold">
                          Backend Status:{" "}
                          <span className={
                            backendStatus === "connected" 
                              ? "text-green-600" 
                              : backendStatus === "checking" 
                              ? "text-blue-600" 
                              : "text-red-600"
                          }>
                            {backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1)}
                          </span>
                        </span>
                      </div>
                      {backendStatus === "connected" && totalSubmissions > 0 && (
                        <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {totalSubmissions} submissions
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm mb-3">
                      {backendDetails}
                      {connectionAttempts > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Attempt {connectionAttempts})
                        </span>
                      )}
                    </div>
                    
                    {backendStatus === "disconnected" && (
                      <div className="space-y-2">
                        <p className="text-xs text-red-600">
                          ⚠️ Important: Render free tier spins down after 15 minutes of inactivity.
                          First request may take 30-60 seconds to wake up the server.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={retryBackendConnection}
                            disabled={isRetrying}
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                          >
                            {isRetrying ? (
                              <>
                                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                Retrying...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Retry Connection
                              </>
                            )}
                          </button>
                          <span className="text-xs text-gray-500">
                            Will auto-retry...
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <StorageIcon sx={{ fontSize: "0.8rem" }} />
                        Database: MongoDB Atlas
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 14h-12v-4h12v4z"/>
                        </svg>
                        Backend: Render (Node.js) - Free Tier
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-1" title={backendUrl}>
                        URL: {backendUrl}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Frontend: taupe-scone-358de8.netlify.app
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  Send Me a <span className="bg-linear-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Message</span>
                </h3>
                <p className="text-gray-600 mb-8">I'll get back to you as soon as possible</p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {['fullname', 'email', 'address', 'message'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {field === 'fullname' ? 'Full Name' : field}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      {field === 'message' ? (
                        <textarea
                          rows={5}
                          value={contactForm[field as keyof ContactForm]}
                          onChange={(e) => handleFormChange(field as keyof ContactForm, e.target.value)}
                          className={`
                            w-full px-4 py-3
                            rounded-2xl
                            border-2
                            bg-white/50
                            backdrop-blur-sm
                            transition-all duration-300
                            focus:outline-none focus:ring-4
                            placeholder-gray-400
                            resize-none
                            ${formErrors[field as keyof FormErrors] 
                              ? "border-red-200 focus:border-red-400 focus:ring-red-400/20" 
                              : "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                            }
                          `}
                          placeholder={getPlaceholderText(field)}
                        />
                      ) : (
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          value={contactForm[field as keyof ContactForm]}
                          onChange={(e) => handleFormChange(field as keyof ContactForm, e.target.value)}
                          className={`
                            w-full px-4 py-3
                            rounded-2xl
                            border-2
                            bg-white/50
                            backdrop-blur-sm
                            transition-all duration-300
                            focus:outline-none focus:ring-4
                            placeholder-gray-400
                            ${formErrors[field as keyof FormErrors] 
                              ? "border-red-200 focus:border-red-400 focus:ring-red-400/20" 
                              : "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                            }
                          `}
                          placeholder={getPlaceholderText(field)}
                        />
                      )}
                      {formErrors[field as keyof FormErrors] && (
                        <div className="text-red-500 text-sm flex items-center gap-1">
                          <ErrorIcon sx={{ fontSize: "1rem" }} />
                          {formErrors[field as keyof FormErrors]}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={isSubmitting || backendStatus !== "connected"}
                    className={`
                      group
                      w-full
                      flex items-center justify-center gap-3
                      px-8 py-4
                      font-semibold
                      rounded-2xl
                      shadow-md
                      transition-all duration-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${isSubmitting || backendStatus !== "connected"
                        ? "bg-gray-400 text-white cursor-not-allowed" 
                        : "bg-linear-to-r from-blue-400 to-blue-500 text-white hover:shadow-lg hover:scale-102 active:scale-98"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : backendStatus !== "connected" ? (
                      <>
                        <ErrorIcon sx={{ fontSize: "1.2rem" }} />
                        <span>Backend Disconnected</span>
                      </>
                    ) : (
                      <>
                        <SendIcon className="group-hover:animate-gentle-float" />
                        <span>Send Message</span>
                        <div className="group-hover:translate-x-1 transition-transform duration-300">→</div>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 space-y-3">
                  <div className="text-xs text-gray-500 text-center">
                    {backendStatus === "connected" 
                      ? "✅ Form data will be permanently saved to MongoDB Atlas database (aditya-protfolio)"
                      : "❌ Backend server required to save data permanently"
                    }
                  </div>
                  
                  {backendStatus === "connected" && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <StorageIcon sx={{ fontSize: "0.8rem" }} />
                        Connected to MongoDB Atlas
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center text-xs text-gray-400">
                    <p>Powered by: React + Node.js + MongoDB</p>
                    <p className="mt-1">Frontend: Netlify (taupe-scone-358de8.netlify.app)</p>
                    <p className="mt-1">Backend: Render (protfolio-backend-8p47.onrender.com)</p>
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