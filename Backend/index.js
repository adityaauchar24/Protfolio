// Load environment variables and MongoDB connection
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import net from "net";
import connectDB from "./MongoDB/connection.js";
import userRoutes from "./Routes/users.js";

const app = express();
dotenv.config();

// Connect to MongoDB
connectDB();

const DEFAULT_PORT = process.env.PORT || 10000;

// Function to check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
};

// Find available port
const findAvailablePort = async (startPort) => {
  let port = parseInt(startPort);
  const maxPort = port + 10;
  
  while (port <= maxPort) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    console.log(`⚠️  Port ${port} is busy, trying next port...`);
    port++;
  }
  
  throw new Error(`❌ No available ports found between ${startPort} and ${maxPort}`);
};

// Dynamic CORS configuration for production with your specific Netlify URL
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or server-to-server)
    if (!origin) {
      console.log('📨 Request with no origin detected (likely server-to-server)');
      return callback(null, true);
    }
    
    // List of allowed origins
    const allowedOrigins = [
      // Local development
      "http://localhost:3000", 
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:4000",
      
      // Your specific Netlify deployment
      "https://taupe-scone-358de8.netlify.app",
      
      // Generic Netlify patterns
      "https://*.netlify.app",
      /\.netlify\.app$/,
      
      // Development previews
      "https://*.netlify.app",
      /^https:\/\/[a-zA-Z0-9-]+\.netlify\.app$/,
      
      // From environment variable (fallback)
      process.env.CORS_ORIGIN
    ].filter(Boolean); // Remove any undefined/null values
    
    console.log(`🌐 Checking CORS for origin: ${origin}`);
    console.log(`📋 Allowed origins:`, allowedOrigins);
    
    // Check if the origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        const isMatch = origin === allowedOrigin;
        if (isMatch) console.log(`✅ Exact match found: ${allowedOrigin}`);
        return isMatch;
      } else if (allowedOrigin instanceof RegExp) {
        const isMatch = allowedOrigin.test(origin);
        if (isMatch) console.log(`✅ Regex match found for pattern: ${allowedOrigin}`);
        return isMatch;
      }
      return false;
    });
    
    if (isAllowed) {
      console.log(`✅ CORS allowed for: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked for: ${origin}`);
      console.log(`💡 Add this URL to allowed origins if needed`);
      
      // For development/debugging, you can temporarily allow all origins
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Development mode: Allowing origin temporarily');
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
      }
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  credentials: true,
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "X-API-Key",
    "Cache-Control",
    "Pragma"
  ],
  exposedHeaders: [
    "Content-Range",
    "X-Content-Range",
    "X-Total-Count",
    "Content-Disposition"
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Enhanced request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  console.log(`📨 ${new Date().toISOString()} ${req.method} ${req.path}`, {
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    origin: req.headers.origin || 'No origin header',
    userAgent: req.get('User-Agent') || 'No User-Agent',
    contentType: req.headers['content-type'] || 'No content-type'
  });
  
  // Log response details after sending
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    console.log(`📤 ${new Date().toISOString()} ${req.method} ${req.path} ${res.statusCode} - ${responseTime}ms`);
    
    if (res.statusCode >= 400) {
      console.log(`⚠️ Error Response:`, typeof data === 'string' ? data : JSON.stringify(data));
    }
    
    return originalSend.apply(res, arguments);
  };
  
  next();
});

// Use user routes (MongoDB version)
app.use("/users", userRoutes);

// Add specific contact form endpoints with proper routing
app.use("/api/contact", userRoutes);
app.use("/contact", userRoutes);
app.use("/api/send-message", userRoutes);
app.use("/send-message", userRoutes);
app.use("/api/messages", userRoutes);
app.use("/api/submit", userRoutes);

// Enhanced health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    let userCount = 0;
    let databaseName = "Not connected";
    let databaseStats = {};
    
    if (dbStatus === "Connected") {
      databaseName = mongoose.connection.name || "aditya-protfolio";
      try {
        // Check if users collection exists and count documents
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const usersCollectionExists = collections.some(c => c.name === 'users');
        
        if (usersCollectionExists) {
          userCount = await db.collection('users').countDocuments();
        }
        
        // Get database statistics
        databaseStats = await db.stats();
      } catch (error) {
        console.log("⚠️ Could not count users:", error.message);
      }
    }
    
    // Get deployment information
    const deploymentInfo = {
      platform: process.env.RENDER_EXTERNAL_URL ? "Render" : "Local/Other",
      url: process.env.RENDER_EXTERNAL_URL || "Not deployed on Render",
      serviceId: process.env.RENDER_SERVICE_ID || "Not available",
      instanceId: process.env.RENDER_INSTANCE_ID || "Not available"
    };
    
    // Get CORS configuration info
    const corsInfo = {
      frontendUrl: "https://taupe-scone-358de8.netlify.app",
      allowedOrigins: [
        "https://taupe-scone-358de8.netlify.app",
        "*.netlify.app",
        "localhost:3000",
        "localhost:5173"
      ]
    };
    
    res.json({ 
      status: "Server is running perfectly! 🚀",
      database: dbStatus,
      databaseName: databaseName,
      totalUsers: userCount,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      deployment: deploymentInfo,
      cors: corsInfo,
      server: {
        port: process.env.SERVER_PORT || DEFAULT_PORT,
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime()
      },
      databaseStats: {
        collections: databaseStats.collections || 0,
        dataSize: databaseStats.dataSize || 0,
        storageSize: databaseStats.storageSize || 0,
        indexSize: databaseStats.indexSize || 0
      },
      endpoints: {
        contact: [
          "POST /users",
          "POST /api/contact",
          "POST /contact", 
          "POST /api/send-message",
          "POST /send-message",
          "POST /api/messages",
          "POST /api/submit"
        ],
        getUsers: "GET /users",
        userCount: "GET /users/count",
        health: "GET /api/health",
        test: "GET /api/test",
        dbTest: "GET /api/db-test",
        hello: "GET /api/hello"
      },
      frontend: {
        url: "https://taupe-scone-358de8.netlify.app",
        status: "Connected via CORS"
      }
    });
  } catch (error) {
    console.error("❌ Health check error:", error);
    res.status(500).json({
      status: "Error",
      error: error.message,
      timestamp: new Date().toISOString(),
      suggestion: "Check MongoDB connection and environment variables"
    });
  }
});

// Test endpoint for frontend connection testing
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is working correctly! ✅",
    timestamp: new Date().toISOString(),
    data: {
      server: "Express.js",
      database: "MongoDB Atlas",
      status: "Operational",
      connection: "aditya-protfolio database",
      deployment: "Hosted on Render",
      frontend: "https://taupe-scone-358de8.netlify.app",
      cors: {
        enabled: true,
        allowedOrigins: ["https://taupe-scone-358de8.netlify.app", "*.netlify.app"]
      }
    },
    instructions: {
      frontend: "Set VITE_API_URL to https://protfolio-backend-8p47.onrender.com",
      test: "Use the contact form on the Netlify site to test submission"
    }
  });
});

// Database connection test endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    
    if (dbStatus !== "Connected") {
      return res.status(500).json({
        success: false,
        message: "Database not connected",
        error: "MongoDB connection is not established",
        readyState: mongoose.connection.readyState,
        suggestion: "Check MONGO_URI in .env file and MongoDB Atlas connection"
      });
    }
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const usersCount = collections.some(c => c.name === 'users') 
      ? await db.collection('users').countDocuments() 
      : 0;
    
    // Try to insert and delete a test document
    const testDocument = {
      test: true,
      message: "Database connection test",
      timestamp: new Date(),
      source: "Connection test endpoint"
    };
    
    const insertResult = await db.collection('test_connections').insertOne(testDocument);
    const foundDocument = await db.collection('test_connections').findOne({ _id: insertResult.insertedId });
    await db.collection('test_connections').deleteOne({ _id: insertResult.insertedId });
    
    res.json({
      success: true,
      message: "Database connection test successful! ✅",
      database: {
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        collections: collections.map(c => c.name),
        totalUsers: usersCount,
        readyState: mongoose.connection.readyState,
        writeTest: "Passed - Document inserted and deleted successfully"
      },
      timestamp: new Date().toISOString(),
      connection: {
        mongodb: "MongoDB Atlas",
        database: "aditya-protfolio",
        status: "Healthy"
      }
    });
  } catch (error) {
    console.error("❌ Database test error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection test failed",
      error: error.message,
      timestamp: new Date().toISOString(),
      troubleshooting: [
        "Check MongoDB Atlas connection string",
        "Verify IP whitelist in MongoDB Atlas",
        "Check database user permissions",
        "Ensure network connectivity"
      ]
    });
  }
});

// Legacy health endpoint for compatibility
app.get("/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  let userCount = 0;
  
  try {
    if (dbStatus === "Connected") {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      if (collections.some(c => c.name === 'users')) {
        userCount = await db.collection('users').countDocuments();
      }
    }
  } catch (error) {
    console.error("Error counting users:", error);
  }
  
  res.json({ 
    status: "OK", 
    database: dbStatus,
    databaseName: mongoose.connection.name || "Not connected",
    totalUsers: userCount,
    timestamp: new Date().toISOString(),
    message: "Backend server is running with MongoDB Atlas! 🎉",
    deployment: "Hosted on Render",
    frontend: "https://taupe-scone-358de8.netlify.app",
    apiVersion: "2.0.0"
  });
});

// Basic hello endpoint
app.get("/api/hello", (req, res) => { 
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({ 
    msg: "Backend API is running perfectly with MongoDB! 🚀",
    database: dbStatus,
    databaseName: mongoose.connection.name || "Not connected",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    hostedOn: "Render",
    frontendUrl: "https://taupe-scone-358de8.netlify.app",
    backendUrl: process.env.RENDER_EXTERNAL_URL || "https://protfolio-backend-8p47.onrender.com",
    endpoints: {
      contact: "POST /api/contact",
      health: "GET /api/health",
      test: "GET /api/test"
    }
  });
});

// Root endpoint
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌";
  const deploymentInfo = process.env.RENDER_EXTERNAL_URL 
    ? `Render (${process.env.RENDER_EXTERNAL_URL})` 
    : "Local Development";
  
  res.json({
    message: "🚀 Aditya Auchar Portfolio Backend API",
    status: "Running",
    version: "2.0.0",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    deployment: deploymentInfo,
    frontend: {
      url: "https://taupe-scone-358de8.netlify.app",
      name: "Aditya Auchar Portfolio",
      hosting: "Netlify"
    },
    backend: {
      url: "https://protfolio-backend-8p47.onrender.com",
      hosting: "Render",
      database: "MongoDB Atlas"
    },
    endpoints: {
      health: "GET /api/health",
      contact: "POST /api/contact",
      users: "GET /users",
      test: "GET /api/test",
      dbTest: "GET /api/db-test",
      documentation: "Check /api/health for all endpoints"
    },
    quickStart: {
      testConnection: "Visit /api/test",
      checkHealth: "Visit /api/health",
      submitContact: "POST to /api/contact",
      testDatabase: "Visit /api/db-test"
    }
  });
});

// Connection test endpoint specifically for frontend
app.get("/api/connection-test", (req, res) => {
  const origin = req.headers.origin || 'No origin header';
  const isAllowed = origin.includes('netlify.app') || origin.includes('localhost');
  
  res.json({
    success: true,
    message: "Connection test successful!",
    timestamp: new Date().toISOString(),
    connection: {
      from: origin,
      to: "protfolio-backend-8p47.onrender.com",
      status: "Connected",
      cors: isAllowed ? "Allowed" : "Not configured for this origin",
      allowed: isAllowed
    },
    services: {
      frontend: "https://taupe-scone-358de8.netlify.app",
      backend: "https://protfolio-backend-8p47.onrender.com",
      database: "MongoDB Atlas"
    }
  });
});

// Enhanced 404 handler
app.use("*", (req, res) => {
  const requestedUrl = req.originalUrl;
  
  res.status(404).json({
    success: false,
    error: `Route ${requestedUrl} not found`,
    availableEndpoints: {
      health: "GET /api/health",
      contact: "POST /api/contact",
      users: "GET /users",
      test: "GET /api/test",
      dbTest: "GET /api/db-test",
      hello: "GET /api/hello",
      connectionTest: "GET /api/connection-test",
      root: "GET /"
    },
    timestamp: new Date().toISOString(),
    suggestion: "Check /api/health for all available endpoints",
    deploymentInfo: {
      frontend: "https://taupe-scone-358de8.netlify.app",
      backend: "https://protfolio-backend-8p47.onrender.com"
    }
  });
});

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  console.error("🚨 Server Error:", {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
  
  // Handle CORS errors specifically
  if (error.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'CORS Error',
      message: error.message,
      suggestion: "Ensure your frontend URL (https://taupe-scone-358de8.netlify.app) is allowed in CORS configuration",
      timestamp: new Date().toISOString(),
      requestOrigin: req.headers.origin
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong. Please try again later.',
    timestamp: new Date().toISOString(),
    requestId: req.id || Date.now().toString(36) + Math.random().toString(36).substr(2)
  });
});

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Atlas');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🏠 Host: ${mongoose.connection.host}`);
  console.log(`🔗 Connection State: ${mongoose.connection.readyState}`);
  console.log('🎯 Database is ready to accept connections!');
  console.log('🔗 Your frontend (https://taupe-scone-358de8.netlify.app) can now connect to this backend');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err.message);
  console.log('💡 Troubleshooting tips:');
  console.log('   1. Check MongoDB Atlas connection string in .env');
  console.log('   2. Verify network connectivity');
  console.log('   3. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for all)');
  console.log('   4. Run node test-db.js to test connection');
  console.log('   5. Ensure MongoDB Atlas cluster is running');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
  console.log('🔄 Attempting to reconnect...');
});

// Start server with auto port detection
const startServer = async () => {
  try {
    const availablePort = await findAvailablePort(DEFAULT_PORT);
    
    // Store the actual port being used
    process.env.SERVER_PORT = availablePort.toString();
    
    app.listen(availablePort, () => {
      console.log(`\n🎉 SUCCESS: Server started successfully!`);
      console.log(`🚀 Server running on port ${availablePort}`);
      console.log(`📍 Health check: http://localhost:${availablePort}/api/health`);
      console.log(`👥 Users API: http://localhost:${availablePort}/users`);
      console.log(`📧 Contact form: http://localhost:${availablePort}/api/contact`);
      console.log(`🧪 Test endpoint: http://localhost:${availablePort}/api/test`);
      console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Server started at: ${new Date().toISOString()}`);
      
      // Deployment information
      if (process.env.RENDER_EXTERNAL_URL) {
        console.log(`🔗 Render URL: ${process.env.RENDER_EXTERNAL_URL}`);
        console.log(`🌍 Your backend is publicly accessible at: ${process.env.RENDER_EXTERNAL_URL}`);
      } else {
        console.log(`🔗 Local URL: http://localhost:${availablePort}`);
      }
      
      // Frontend connection info
      console.log(`\n🔗 Frontend Connection Info:`);
      console.log(`   Frontend URL: https://taupe-scone-358de8.netlify.app`);
      console.log(`   Backend URL: https://protfolio-backend-8p47.onrender.com`);
      console.log(`   CORS configured for Netlify domains`);
      console.log(`   Contact form endpoints are ready`);
      
      console.log(`\n📋 Quick Test:`);
      console.log(`   1. Visit: https://taupe-scone-358de8.netlify.app`);
      console.log(`   2. Check backend status in Contact section`);
      console.log(`   3. Test form submission`);
      
      console.log(`\n=========================================`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check if port 10000-10010 is available');
    console.log('   2. Try changing PORT in .env file');
    console.log('   3. Check for other running Node.js processes');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  console.log('📝 Closing MongoDB connection...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed.');
  console.log('👋 Server shutdown complete.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received termination signal...');
  console.log('📝 Closing MongoDB connection...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed.');
  console.log('👋 Server shutdown complete.');
  process.exit(0);
});

// Start the server
startServer();

export default app;