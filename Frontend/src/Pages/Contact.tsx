import React, { useState, useEffect, useRef, JSX } from "react";
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

// Use your deployed backend URL
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
  status: "checking" | "connected" | "disconnected";
  details: string;
  totalSubmissions?: number;
  lastChecked?: Date;
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
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    };
  }, []);

  useEffect(() => {
    if (message.type) {
      const timer = setTimeout(() => {
        setMessage({ type: "info", mess: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

  const checkBackendConnection = async (): Promise<void> => {
    if (isCheckingBackend) return;
    
    setIsCheckingBackend(true);
    try {
      console.log(`🔗 Checking backend connection to: ${API_URL}/api/health`);
      
      setBackendStatus({
        status: "checking",
        details: "Connecting to backend server...",
        totalSubmissions: backendStatus.totalSubmissions
      });

      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Set a timeout for the request
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend connected:", data);
        
        setBackendStatus({
          status: "connected",
          details: `Connected to MongoDB Atlas | Total Submissions: ${data.totalUsers || 0}`,
          totalSubmissions: data.totalUsers || 0,
          lastChecked: new Date()
        });
        
        setMessage({ 
          type: "success", 
          mess: "Backend server connected successfully!" 
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: unknown) {
      console.error("❌ Backend connection failed:", error);
      
      setBackendStatus({
        status: "disconnected",
        details: error instanceof Error ? error.message : "Cannot connect to backend server",
        totalSubmissions: backendStatus.totalSubmissions,
        lastChecked: new Date()
      });
      
      setMessage({ 
        type: "error", 
        mess: "Backend server is not available. Using fallback method." 
      });
    } finally {
      setIsCheckingBackend(false);
    }
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

  const submitToBackend = async (): Promise<boolean> => {
    try {
      console.log("📤 Submitting to backend:", `${API_URL}/api/contact`);
      
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: contactForm.fullname.trim(),
          email: contactForm.email.trim().toLowerCase(),
          address: contactForm.address.trim(),
          message: contactForm.message.trim()
        }),
        signal: AbortSignal.timeout(15000)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Backend submission successful:", data);
        return true;
      } else {
        console.error("❌ Backend submission failed:", data);
        return false;
      }
    } catch (error) {
      console.error("❌ Backend submission error:", error);
      return false;
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
    `.trim();

    const mailtoLink = `mailto:adityaauchar40@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: "error", mess: "Please fix the validation errors above" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Try backend first if connected
      if (backendStatus.status === "connected") {
        const backendSuccess = await submitToBackend();
        
        if (backendSuccess) {
          setMessage({ 
            type: "success", 
            mess: "Message sent successfully! Your data has been saved to MongoDB database. I'll get back to you soon!" 
          });
          setContactForm(initialForm);
          
          // Refresh backend status to get updated count
          setTimeout(() => checkBackendConnection(), 1000);
          return;
        }
      }
      
      // Fallback to email if backend fails or disconnected
      openEmailFallback();
      
      setMessage({ 
        type: backendStatus.status === "connected" ? "warning" : "info", 
        mess: backendStatus.status === "connected" 
          ? "Backend submission failed. Opened email client as fallback. Please send your message from there."
          : "Backend is disconnected. Opened email client. Please send your message from there."
      });
      
      setContactForm(initialForm);
      
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
        transform transition-all duration-500
        ${message.type === "success" 
          ? "bg-green-50 border-green-500 text-green-800" 
          : message.type === "error"
          ? "bg-red-50 border-red-500 text-red-800"
          : message.type === "warning"
          ? "bg-yellow-50 border-yellow-500 text-yellow-800"
          : "bg-blue-50 border-blue-500 text-blue-800"
        }
        ${message.mess ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}>
        {message.type === "success" ? (
          <CheckCircleIcon sx={{ fontSize: "1.5rem" }} />
        ) : message.type === "error" ? (
          <ErrorIcon sx={{ fontSize: "1.5rem" }} />
        ) : message.type === "warning" ? (
          <ErrorIcon sx={{ fontSize: "1.5rem" }} className="text-yellow-600" />
        ) : (
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
        <div>
          <div className="font-semibold">
            {message.type === "success" ? "Success!" : 
             message.type === "error" ? "Error!" : 
             message.type === "warning" ? "Warning!" : "Processing..."}
          </div>
          <div className="text-sm">{message.mess}</div>
        </div>
      </div>
    );
  };

  const getBackendStatusIcon = () => {
    switch (backendStatus.status) {
      case "connected":
        return <CloudIcon className="text-green-500" />;
      case "checking":
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case "disconnected":
        return <WifiOffIcon className="text-red-500" />;
      default:
        return <SyncIcon className="text-yellow-500" />;
    }
  };

  const getBackendStatusColor = () => {
    switch (backendStatus.status) {
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

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return backendStatus.status === "connected" ? "Sending to Database..." : "Opening Email...";
    }
    
    return backendStatus.status === "connected" 
      ? "Send Message to Database" 
      : "Send Message via Email";
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
              <div className="w-6 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200"></div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <div className="w-6 h-0.5 bg-gradient-to-r from-blue-200 to-blue-300"></div>
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
                  Contact <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Information</span>
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
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-sm animate-gentle-float`}>
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
                            backendStatus.status === "connected" 
                              ? "text-green-600" 
                              : backendStatus.status === "checking" 
                              ? "text-blue-600" 
                              : "text-red-600"
                          }>
                            {backendStatus.status.charAt(0).toUpperCase() + backendStatus.status.slice(1)}
                          </span>
                        </span>
                      </div>
                      {backendStatus.status === "connected" && backendStatus.totalSubmissions !== undefined && backendStatus.totalSubmissions > 0 && (
                        <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {backendStatus.totalSubmissions} submissions
                        </span>
                      )}
                      <button
                        onClick={checkBackendConnection}
                        disabled={isCheckingBackend}
                        className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Check connection"
                      >
                        {isCheckingBackend ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <SyncIcon sx={{ fontSize: "1rem" }} />
                        )}
                      </button>
                    </div>
                    
                    <div className="text-sm mb-3">
                      {backendStatus.details}
                      {backendStatus.lastChecked && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Last checked: {backendStatus.lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <CloudIcon sx={{ fontSize: "0.8rem" }} />
                        Backend URL: {API_URL}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                        Database: MongoDB Atlas (Cloud)
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                        Hosting: Render (Free Tier)
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {backendStatus.status === "connected" 
                          ? "✅ Form submissions will be saved to database"
                          : backendStatus.status === "checking"
                          ? "🔄 Checking backend availability..."
                          : "⚠️ Using email fallback method"
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  Send Me a <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Message</span>
                </h3>
                <p className="text-gray-600 mb-8">
                  {backendStatus.status === "connected" 
                    ? "Your message will be saved to MongoDB database"
                    : "Your message will be sent via email (backend fallback)"
                  }
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                    disabled={isSubmitting}
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
                      ${backendStatus.status === "connected"
                        ? "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:shadow-lg hover:scale-102 active:scale-98"
                        : "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:shadow-lg hover:scale-102 active:scale-98"
                      }
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
                        <div className="group-hover:translate-x-1 transition-transform duration-300">→</div>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 space-y-3">
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
                      backendStatus.status === "connected" 
                        ? "text-green-600 bg-green-50" 
                        : backendStatus.status === "checking"
                        ? "text-blue-600 bg-blue-50"
                        : "text-yellow-600 bg-yellow-50"
                    }`}>
                      {backendStatus.status === "connected" ? (
                        <>
                          <CloudIcon sx={{ fontSize: "0.8rem" }} />
                          Connected to backend database
                        </>
                      ) : backendStatus.status === "checking" ? (
                        <>
                          <SyncIcon sx={{ fontSize: "0.8rem" }} className="animate-spin" />
                          Checking backend connection
                        </>
                      ) : (
                        <>
                          <EmailIcon sx={{ fontSize: "0.8rem" }} />
                          Using email fallback method
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center text-xs text-gray-400">
                    <p>Powered by: React + Node.js + MongoDB</p>
                    <p className="mt-1">
                      {backendStatus.status === "connected" 
                        ? "Backend: https://protfolio-backend-8p47.onrender.com"
                        : "Frontend: Static React App"
                      }
                    </p>
                    <p className="mt-1">
                      {backendStatus.status === "connected"
                        ? "Data storage: MongoDB Atlas Cloud Database"
                        : "Communication: Direct email via mailto links"
                      }
                    </p>
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