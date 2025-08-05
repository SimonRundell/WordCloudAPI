const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// WordCloud component wrapper for server-side rendering
const generateWordCloudHTML = (words, options = {}) => {
  const {
    width = 800,
    height = 600,
    backgroundColor = '#ffffff',
    colorScheme = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
  } = options;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WordCloud Generator</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/d3@7"></script>
    <script src="https://unpkg.com/d3-cloud@1"></script>
    <script src="https://unpkg.com/react-wordcloud@1.2.7/dist/react-wordcloud.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: ${backgroundColor};
        }
        #wordcloud-container {
            width: ${width}px;
            height: ${height}px;
            border: 1px solid #ddd;
            background-color: ${backgroundColor};
        }
    </style>
</head>
<body>
    <div id="wordcloud-container"></div>
    
    <script>
        const { useState, useEffect } = React;
        const { createRoot } = ReactDOM;
        
        const words = ${JSON.stringify(words)};
        const colorScheme = ${JSON.stringify(colorScheme)};
        
        const WordCloudApp = () => {
            const [isReady, setIsReady] = useState(false);
            
            useEffect(() => {
                // Signal that the component is ready
                setTimeout(() => {
                    setIsReady(true);
                    window.wordCloudReady = true;
                }, 1000);
            }, []);
            
            const options = {
                colors: colorScheme,
                enableTooltip: false,
                deterministic: true,
                fontFamily: 'Arial',
                fontSizes: [10, 60],
                fontStyle: 'normal',
                fontWeight: 'normal',
                padding: 1,
                rotations: 3,
                rotationAngles: [0, 90],
                scale: 'sqrt',
                spiral: 'archimedean',
                transitionDuration: 0
            };
            
            return React.createElement(
                'div',
                { style: { width: '100%', height: '100%' } },
                React.createElement(ReactWordcloud.default, {
                    words: words,
                    options: options
                })
            );
        };
        
        const container = document.getElementById('wordcloud-container');
        const root = createRoot(container);
        root.render(React.createElement(WordCloudApp));
    </script>
</body>
</html>`;
};

// API endpoint to generate wordcloud
app.post('/api/wordcloud', async (req, res) => {
  try {
    const { words, options = {} } = req.body;
    
    // Validate input
    if (!words || !Array.isArray(words)) {
      return res.status(400).json({ 
        error: 'Invalid input. Expected an array of words with text and value properties.' 
      });
    }
    
    // Validate word format
    const validWords = words.every(word => 
      word && typeof word.text === 'string' && typeof word.value === 'number'
    );
    
    if (!validWords) {
      return res.status(400).json({ 
        error: 'Each word must have "text" (string) and "value" (number) properties.' 
      });
    }
    
    console.log(`Generating wordcloud for ${words.length} words...`);
    
    // Generate HTML
    const html = generateWordCloudHTML(words, options);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport size
    const width = options.width || 800;
    const height = options.height || 600;
    await page.setViewport({ width: width + 40, height: height + 40 });
    
    // Load the HTML content
    await page.setContent(html);
    
    // Wait for the wordcloud to be ready
    await page.waitForFunction(() => window.wordCloudReady === true, {
      timeout: 10000
    });
    
    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      clip: {
        x: 20,
        y: 20,
        width: width,
        height: height
      }
    });
    
    await browser.close();
    
    // Return the image
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length
    });
    
    res.send(screenshot);
    
  } catch (error) {
    console.error('Error generating wordcloud:', error);
    res.status(500).json({ error: 'Failed to generate wordcloud' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'WordCloud API',
    version: '1.0.0',
    endpoints: {
      'POST /api/wordcloud': {
        description: 'Generate a wordcloud image from an array of words',
        body: {
          words: [
            { text: 'example', value: 100 },
            { text: 'word', value: 50 }
          ],
          options: {
            width: 800,
            height: 600,
            backgroundColor: '#ffffff',
            colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c']
          }
        },
        response: 'PNG image'
      },
      'GET /health': {
        description: 'Health check endpoint'
      }
    },
    example: `
curl -X POST http://localhost:${PORT}/api/wordcloud \\
  -H "Content-Type: application/json" \\
  -d '{
    "words": [
      {"text": "JavaScript", "value": 100},
      {"text": "React", "value": 80},
      {"text": "Node.js", "value": 70},
      {"text": "API", "value": 60},
      {"text": "WordCloud", "value": 90}
    ]
  }' \\
  --output wordcloud.png
    `
  });
});

app.listen(PORT, () => {
  console.log(`WordCloud API server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});
