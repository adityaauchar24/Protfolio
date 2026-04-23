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
    
    // Updated MongoDB connection options (remove deprecated ones)
    const options = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5
    };
    
    console.log("🔄 Establishing connection...");
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📈 Ready State: ${conn.connection.readyState}`);
    
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
    console.log("💡 Please check:");
    console.log("   - MongoDB Atlas connection string in .env file");
    console.log("   - Network connectivity and firewall settings");
    console.log("   - IP whitelist in MongoDB Atlas dashboard (add 0.0.0.0/0 for all IPs)");
    console.log("   - Database user permissions in MongoDB Atlas");
    console.log("   - MongoDB cluster status in Atlas dashboard");
    console.log("   - Run 'node test-db.js' to test connection independently");
    
    if (error.name === 'MongoServerSelectionError') {
      console.log("🔧 Specific issue: Cannot reach MongoDB server - check network/whitelist");
    } else if (error.name === 'MongoNetworkError') {
      console.log("🔧 Specific issue: Network error - check internet connection");
    } else if (error.name === 'MongoAuthenticationError') {
      console.log("🔧 Specific issue: Authentication failed - check username/password");
    } else if (error.name === 'MongoParseError') {
      console.log("🔧 Specific issue: Invalid connection string format");
    }
    
    process.exit(1);
  }
};

export default connectDB;