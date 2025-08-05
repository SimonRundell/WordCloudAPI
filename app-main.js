const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simplified wordcloud generator using Canvas and basic text positioning
const generateSimpleWordCloudHTML = (words, options = {}) => {
  const {
    width = 800,
    height = 600,
    backgroundColor = '#ffffff',
    colorScheme = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
  } = options;

  // Sort words by value (descending)
  const sortedWords = [...words].sort((a, b) => b.value - a.value);
  
  // Generate word placements
  const maxValue = Math.max(...words.map(w => w.value));
  const minValue = Math.min(...words.map(w => w.value));
  
  const wordElements = sortedWords.map((word, index) => {
    // Calculate font size (20px to 60px)
    const normalizedValue = (word.value - minValue) / (maxValue - minValue);
    const fontSize = 20 + (normalizedValue * 40);
    
    // Get color
    const color = colorScheme[index % colorScheme.length];
    
    // Calculate position (simple grid-like positioning for now)
    const cols = Math.ceil(Math.sqrt(sortedWords.length));
    const rows = Math.ceil(sortedWords.length / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const x = (col + 0.5) * (width / cols);
    const y = (row + 0.5) * (height / rows);
    
    // Add some randomness to position
    const randomOffsetX = (Math.random() - 0.5) * 50;
    const randomOffsetY = (Math.random() - 0.5) * 50;
    
    return `
      <div style="
        position: absolute;
        left: ${Math.max(0, Math.min(width - 200, x + randomOffsetX))}px;
        top: ${Math.max(0, Math.min(height - 30, y + randomOffsetY))}px;
        font-size: ${fontSize}px;
        color: ${color};
        font-family: Arial, sans-serif;
        font-weight: bold;
        white-space: nowrap;
        transform: translate(-50%, -50%);
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
      ">${word.text}</div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WordCloud Generator</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: ${backgroundColor};
            overflow: hidden;
        }
        #wordcloud-container {
            width: ${width}px;
            height: ${height}px;
            background-color: ${backgroundColor};
            position: relative;
        }
    </style>
</head>
<body>
    <div id="wordcloud-container">
        ${wordElements}
    </div>
    
    <script>
        // Signal that the page is ready
        setTimeout(() => {
            window.wordCloudReady = true;
        }, 500);
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
    const html = generateSimpleWordCloudHTML(words, options);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    
    // Set viewport size
    const width = options.width || 800;
    const height = options.height || 600;
    await page.setViewport({ width, height });
    
    // Load the HTML content
    await page.setContent(html);
    
    // Wait for the wordcloud to be ready
    await page.waitForFunction(() => window.wordCloudReady === true, {
      timeout: 5000
    });
    
    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    
    console.log(`✅ WordCloud generated successfully! Size: ${screenshot.length} bytes`);
    
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

// Advanced wordcloud endpoint using D3 and d3-cloud
app.post('/api/wordcloud/advanced', async (req, res) => {
  try {
    const { words, options = {} } = req.body;
    
    // Validate input
    if (!words || !Array.isArray(words)) {
      return res.status(400).json({ 
        error: 'Invalid input. Expected an array of words with text and value properties.' 
      });
    }
    
    const {
      width = 800,
      height = 600,
      backgroundColor = '#ffffff',
      colorScheme = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
    } = options;

    console.log(`Generating advanced wordcloud for ${words.length} words...`);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Advanced WordCloud</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/holtzy/D3-graph-gallery@master/LIB/d3.layout.cloud.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: ${backgroundColor};
            font-family: Arial, sans-serif;
        }
        svg {
            background-color: ${backgroundColor};
        }
    </style>
</head>
<body>
    <div id="wordcloud"></div>
    
    <script>
        const words = ${JSON.stringify(words)};
        const colors = ${JSON.stringify(colorScheme)};
        const width = ${width};
        const height = ${height};
        
        // Create SVG
        const svg = d3.select("#wordcloud")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
            
        const g = svg.append("g")
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
        
        // Prepare data for d3-cloud
        const maxValue = d3.max(words, d => d.value);
        const fontScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([12, 60]);
            
        const layout = d3.layout.cloud()
            .size([width, height])
            .words(words.map(d => ({
                text: d.text,
                size: fontScale(d.value),
                value: d.value
            })))
            .padding(2)
            .rotate(() => (Math.random() - 0.5) * 60)
            .font("Arial")
            .fontSize(d => d.size)
            .on("end", draw);
            
        layout.start();
        
        function draw(words) {
            g.selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => d.size + "px")
                .style("font-family", "Arial")
                .style("font-weight", "bold")
                .style("fill", (d, i) => colors[i % colors.length])
                .attr("text-anchor", "middle")
                .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                .text(d => d.text);
                
            // Signal completion
            setTimeout(() => {
                window.wordCloudReady = true;
            }, 100);
        }
    </script>
</body>
</html>`;
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(html);
    
    // Wait for the wordcloud to be ready
    await page.waitForFunction(() => window.wordCloudReady === true, {
      timeout: 10000
    });
    
    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    
    console.log(`✅ Advanced WordCloud generated successfully! Size: ${screenshot.length} bytes`);
    
    // Return the image
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length
    });
    
    res.send(screenshot);
    
  } catch (error) {
    console.error('Error generating advanced wordcloud:', error);
    res.status(500).json({ error: 'Failed to generate advanced wordcloud' });
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
    version: '2.0.0',
    endpoints: {
      'POST /api/wordcloud': {
        description: 'Generate a simple wordcloud image (fast, reliable)',
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
      'POST /api/wordcloud/advanced': {
        description: 'Generate an advanced wordcloud using D3.js (prettier, slower)',
        body: 'Same as simple endpoint',
        response: 'PNG image'
      },
      'GET /health': {
        description: 'Health check endpoint'
      }
    },
    examples: {
      simple: `curl -X POST http://localhost:${PORT}/api/wordcloud -H "Content-Type: application/json" -d '{"words": [{"text": "Hello", "value": 100}, {"text": "World", "value": 80}]}' --output wordcloud.png`,
      advanced: `curl -X POST http://localhost:${PORT}/api/wordcloud/advanced -H "Content-Type: application/json" -d '{"words": [{"text": "Hello", "value": 100}, {"text": "World", "value": 80}]}' --output wordcloud.png`
    }
  });
});

app.listen(PORT, () => {
  console.log(`WordCloud API server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});
