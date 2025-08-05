const fetch = require('node-fetch');
const fs = require('fs');

// Test data - sample words for the wordcloud
const testWords = [
  { text: 'JavaScript', value: 100 },
  { text: 'React', value: 80 },
  { text: 'Node.js', value: 70 },
  { text: 'API', value: 60 },
  { text: 'WordCloud', value: 90 },
  { text: 'Express', value: 55 },
  { text: 'Puppeteer', value: 45 },
  { text: 'D3.js', value: 65 },
  { text: 'Web Development', value: 85 },
  { text: 'Server-side Rendering', value: 40 },
  { text: 'Image Generation', value: 50 },
  { text: 'REST API', value: 35 },
  { text: 'TypeScript', value: 75 },
  { text: 'GitHub', value: 30 },
  { text: 'VS Code', value: 25 }
];

async function testWordCloudAPI(endpoint = '/api/wordcloud', filename = 'wordcloud') {
  const apiUrl = `http://localhost:3000${endpoint}`;
  
  try {
    console.log(`Testing ${endpoint}...`);
    console.log(`Sending ${testWords.length} words to generate wordcloud`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        words: testWords,
        options: {
          width: 800,
          height: 600,
          backgroundColor: '#f8f9fa',
          colorScheme: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']
        }
      })
    });
    
    if (response.ok) {
      const buffer = await response.buffer();
      const outputFilename = `${filename}-${Date.now()}.png`;
      
      fs.writeFileSync(outputFilename, buffer);
      console.log(`✅ WordCloud generated successfully!`);
      console.log(`📁 Saved as: ${outputFilename}`);
      console.log(`📊 Image size: ${buffer.length} bytes`);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('💡 Make sure the server is running: npm start');
    return false;
  }
}

// Test health endpoint
async function testHealthEndpoint() {
  try {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('🔍 Health check:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Test API documentation endpoint
async function testDocumentationEndpoint() {
  try {
    const response = await fetch('http://localhost:3000/');
    const data = await response.json();
    console.log('📚 API Documentation:');
    console.log(`   Name: ${data.name}`);
    console.log(`   Version: ${data.version}`);
    console.log(`   Endpoints: ${Object.keys(data.endpoints).length}`);
    return true;
  } catch (error) {
    console.error('❌ Documentation endpoint failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting WordCloud API Tests\n');
  
  let passed = 0;
  let total = 0;
  
  // Test health check
  total++;
  if (await testHealthEndpoint()) passed++;
  console.log('');
  
  // Test documentation
  total++;
  if (await testDocumentationEndpoint()) passed++;
  console.log('');
  
  // Test simple wordcloud
  total++;
  if (await testWordCloudAPI('/api/wordcloud', 'simple-wordcloud')) passed++;
  console.log('');
  
  // Test advanced wordcloud
  total++;
  if (await testWordCloudAPI('/api/wordcloud/advanced', 'advanced-wordcloud')) passed++;
  
  console.log(`\n✨ Tests completed! ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your WordCloud API is working perfectly.');
  } else {
    console.log('⚠️  Some tests failed. Check the error messages above.');
  }
}

// Execute if run directly
if (require.main === module) {
  runTests();
}

module.exports = { testWordCloudAPI, testHealthEndpoint, testWords };
