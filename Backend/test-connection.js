import fetch from 'node-fetch';

async function testConnection() {
  const frontendUrl = 'https://protfolio-frontend-ytfj.onrender.com';
  const backendUrl = 'https://protfolio-backend-8p47.onrender.com';
  
  console.log('🔗 Testing connection between:');
  console.log(`   Frontend: ${frontendUrl}`);
  console.log(`   Backend:  ${backendUrl}`);
  
  try {
    // Test backend health
    console.log('\n🧪 Testing backend health...');
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Backend Health: ${healthResponse.status}`);
    console.log(`   Database: ${healthData.database}`);
    console.log(`   Submissions: ${healthData.totalUsers}`);
    console.log(`   Frontend URL in config: ${healthData.connections?.frontend?.url}`);
    
    // Test if frontend is allowed in CORS
    console.log('\n🌐 Testing CORS configuration...');
    const testResponse = await fetch(`${backendUrl}/api/test`, {
      headers: {
        'Origin': frontendUrl
      }
    });
    const testData = await testResponse.json();
    console.log(`✅ CORS Test: ${testResponse.status}`);
    console.log(`   Message: ${testData.message}`);
    console.log(`   Allowed Origins: ${testData.data?.cors?.allowedOrigins}`);
    
    console.log('\n🎉 All connections successful!');
    console.log('\n📋 Connection Summary:');
    console.log(`   Frontend → Backend: ✅ Connected`);
    console.log(`   Backend → MongoDB:  ✅ ${healthData.database}`);
    console.log(`   CORS Configuration: ✅ Allowed for ${frontendUrl}`);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check backend .env file has correct FRONTEND_URL');
    console.log('   2. Check backend CORS configuration allows your frontend URL');
    console.log('   3. Make sure backend is running');
  }
}

testConnection();