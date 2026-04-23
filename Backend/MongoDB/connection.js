import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("🔗 Connecting to MongoDB Atlas...");
    console.log(`📁 Database: ${process.env.DB_NAME || 'aditya-protfolio'}`);
    
    // Mask the password for security in logs
    const maskedURI = process.env.MONGO_URI.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log(`🌐 Connection String: ${maskedURI}`);
    
    // Updated MongoDB connection options with DNS fix
    const options = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      family: 4, // Force IPv4 to avoid DNS issues
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 2000
    };
    
    console.log("🔄 Establishing connection...");
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📈 Ready State: ${conn.connection.readyState}`);
    console.log(`🔢 Port: ${conn.connection.port || 27017}`);
    
    // Test the connection with a simple operation
    try {
      const db = conn.connection.db;
      const collections = await db.listCollections().toArray();
      console.log(`📁 Collections found: ${collections.length}`);
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
      
      // Check if users collection exists
      const usersCollectionExists = collections.some(c => c.name === 'users');
      if (usersCollectionExists) {
        const usersCount = await db.collection('users').countDocuments();
        console.log(`👥 Total users in database: ${usersCount}`);
      } else {
        console.log("📝 'users' collection will be created automatically on first submission");
      }
    } catch (testError) {
      console.log("⚠️ Could not list collections:", testError.message);
    }
    
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    
    // Specific error handling for DNS resolution issue
    if (error.message.includes("ENOTFOUND") || error.message.includes("querySrv")) {
      console.log("\n💡 DNS RESOLUTION ERROR DETECTED!");
      console.log("   This usually means you're using mongodb+srv:// in your connection string.");
      console.log("   SOLUTION: Change your MONGO_URI from mongodb+srv:// to mongodb:// format");
      console.log("   Example: mongodb://username:password@cluster0.ffacq4b.mongodb.net:27017/database?authSource=admin");
      console.log("\n   Your connection string should NOT have '+srv' in it for Render deployment.");
    } else {
      console.log("\n💡 Please check:");
      console.log("   - MongoDB Atlas connection string in .env file");
      console.log("   - Network connectivity and firewall settings");
      console.log("   - IP whitelist in MongoDB Atlas dashboard (add 0.0.0.0/0 for all IPs)");
      console.log("   - Database user permissions in MongoDB Atlas");
      console.log("   - MongoDB cluster status in Atlas dashboard");
      console.log("   - Run 'node test-connection.js' to test connection independently");
    }
    
    if (error.name === 'MongoServerSelectionError') {
      console.log("\n🔧 Specific issue: Cannot reach MongoDB server - check network/whitelist");
      console.log("   → Go to MongoDB Atlas → Network Access → Add IP Address → Add 0.0.0.0/0");
    } else if (error.name === 'MongoNetworkError') {
      console.log("\n🔧 Specific issue: Network error - check internet connection");
      console.log("   → Verify Render can access external services");
    } else if (error.name === 'MongoAuthenticationError') {
      console.log("\n🔧 Specific issue: Authentication failed - check username/password");
      console.log("   → Verify the database user exists and has correct permissions");
    } else if (error.name === 'MongoParseError') {
      console.log("\n🔧 Specific issue: Invalid connection string format");
      console.log("   → Make sure there are no special characters in password that need encoding");
    }
    
    // Don't exit the process - let the server try to reconnect
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Atlas');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🏠 Host: ${mongoose.connection.host}`);
  console.log(`🔗 Connection State: ${mongoose.connection.readyState}`);
  console.log('🎯 Database is ready to accept connections!');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err.message);
  console.log('💡 Troubleshooting tips:');
  console.log('   1. Check MongoDB Atlas connection string in .env');
  console.log('   2. Verify network connectivity');
  console.log('   3. Check IP whitelist in MongoDB Atlas');
  console.log('   4. Ensure you are using standard connection string (not SRV)');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
  console.log('🔄 Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully!');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

export default connectDB;