import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  console.log("🧪 Testing MongoDB Connection...\n");
  
  const mongoURI = process.env.MONGO_URI;
  
  if (!mongoURI) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    console.log("\n💡 Please set MONGO_URI in your .env file");
    process.exit(1);
  }
  
  console.log("📝 Connection String (masked):", mongoURI.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@'));
  console.log("📁 Database Name:", process.env.DB_NAME || "aditya-protfolio");
  console.log("🔧 Connection Options:", {
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 10000,
    family: 4
  });
  
  try {
    console.log("\n🔄 Attempting to connect...");
    
    const conn = await mongoose.connect(mongoURI, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      family: 4,
      connectTimeoutMS: 10000
    });
    
    console.log("\n✅ SUCCESS! Connected to MongoDB Atlas\n");
    console.log("📊 Connection Details:");
    console.log(`   - Host: ${conn.connection.host}`);
    console.log(`   - Port: ${conn.connection.port || 27017}`);
    console.log(`   - Database: ${conn.connection.name}`);
    console.log(`   - Ready State: ${conn.connection.readyState}`);
    
    // Test database operations
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📁 Collections (${collections.length}):`);
    if (collections.length === 0) {
      console.log("   - No collections found yet (will be created on first data insertion)");
    } else {
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }
    
    // Check users collection
    const usersCollectionExists = collections.some(c => c.name === 'users');
    if (usersCollectionExists) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`\n👥 Users collection has ${usersCount} document(s)`);
    } else {
      console.log("\n📝 'users' collection doesn't exist yet (will be created on first submission)");
    }
    
    console.log("\n🎉 All tests passed! MongoDB connection is working properly.\n");
    
    await mongoose.disconnect();
    console.log("🔌 Connection closed successfully.");
    
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED!\n");
    console.error("Error Message:", error.message);
    
    // Specific error analysis
    if (error.message.includes("ENOTFOUND") || error.message.includes("querySrv")) {
      console.error("\n🔍 DNS RESOLUTION ERROR DETECTED!");
      console.error("   This happens when using mongodb+srv:// connection string.");
      console.error("\n✅ SOLUTION:");
      console.error("   Change your MONGO_URI from:");
      console.error("   mongodb+srv://username:password@cluster0.ffacq4b.mongodb.net/database");
      console.error("\n   To:");
      console.error("   mongodb://username:password@cluster0.ffacq4b.mongodb.net:27017/database?authSource=admin");
      console.error("\n   The key differences:");
      console.error("   - Remove '+srv' from protocol");
      console.error("   - Add ':27017' after the hostname");
      console.error("   - Add '?authSource=admin' at the end");
    } else if (error.message.includes("Authentication failed")) {
      console.error("\n🔍 AUTHENTICATION ERROR!");
      console.error("   Username or password is incorrect.");
      console.error("\n✅ SOLUTION:");
      console.error("   Check your database username and password in MongoDB Atlas.");
      console.error("   Verify the user has read/write permissions.");
    } else if (error.message.includes("whitelist")) {
      console.error("\n🔍 IP WHITELIST ERROR!");
      console.error("   Your IP address is not allowed in MongoDB Atlas.");
      console.error("\n✅ SOLUTION:");
      console.error("   Go to MongoDB Atlas → Network Access → Add IP Address");
      console.error("   Add '0.0.0.0/0' to allow access from anywhere (for testing)");
    } else if (error.message.includes("timed out")) {
      console.error("\n🔍 CONNECTION TIMEOUT!");
      console.error("   Cannot reach MongoDB Atlas servers.");
      console.error("\n✅ SOLUTION:");
      console.error("   Check your internet connection.");
      console.error("   Verify MongoDB Atlas cluster is running.");
      console.error("   Check firewall/proxy settings.");
    }
    
    console.error("\n💡 Current Connection String Format Check:");
    if (mongoURI.includes("mongodb+srv://")) {
      console.error("   ⚠️ You are using SRV format (mongodb+srv://)");
      console.error("   ✅ Change to standard format (mongodb://)");
    } else if (mongoURI.includes("mongodb://")) {
      console.error("   ✅ You are using standard format (mongodb://)");
      console.error("   ✅ This is correct for Render deployment");
    }
    
    process.exit(1);
  }
};

// Run the test
testConnection();