// Simple usage example for WordCloud API
const fetch = require('node-fetch');
const fs = require('fs');

async function generateWordCloud() {
  const words = [
    { text: 'JavaScript', value: 100 },
    { text: 'Python', value: 85 },
    { text: 'React', value: 80 },
    { text: 'Node.js', value: 75 },
    { text: 'API', value: 70 },
    { text: 'TypeScript', value: 65 },
    { text: 'Express', value: 60 },
    { text: 'MongoDB', value: 55 },
    { text: 'REST', value: 50 },
    { text: 'GraphQL', value: 45 }
  ];

  try {
    const response = await fetch('http://localhost:3000/api/wordcloud', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        words: words,
        options: {
          width: 800,
          height: 600,
          backgroundColor: '#f8f9fa',
          colorScheme: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
        }
      })
    });

    if (response.ok) {
      const buffer = await response.buffer();
      fs.writeFileSync('my-wordcloud.png', buffer);
      console.log('✅ WordCloud saved as my-wordcloud.png');
    } else {
      console.error('❌ Error:', await response.text());
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Run if started directly
if (require.main === module) {
  console.log('📊 Generating WordCloud...');
  generateWordCloud();
}

module.exports = { generateWordCloud };
