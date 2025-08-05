# WordCloud API

[![npm version](https://badge.fury.io/js/wordcloud-api.svg)](https://badge.fury.io/js/wordcloud-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

> A powerful Node.js API that generates beautiful WordCloud images with multiple rendering options.

## 🌟 Features

- **🚀 Fast & Reliable** - Multiple rendering engines for different use cases
- **🎨 Beautiful Output** - Professional-quality PNG images
- **⚙️ Highly Customizable** - Colors, fonts, layouts, and dimensions
- **🔧 Easy Integration** - RESTful API works with any programming language
- **📦 Production Ready** - Error handling, validation, CORS support
- **🧪 Well Tested** - Comprehensive test suite included

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SimonRundell/WordCloudAPI.git
cd WordCloudAPI

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on `http://localhost:3000`

## 📖 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Usage Examples](#-usage-examples)
- [Configuration](#-configuration)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## 📚 API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/wordcloud` | Generate simple wordcloud (fast, reliable) |
| `POST` | `/api/wordcloud/advanced` | Generate advanced wordcloud (D3.js layouts) |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/` | API documentation |

### Request Format

```json
{
  "words": [
    {"text": "JavaScript", "value": 100},
    {"text": "React", "value": 80},
    {"text": "Node.js", "value": 70}
  ],
  "options": {
    "width": 800,
    "height": 600,
    "backgroundColor": "#ffffff",
    "colorScheme": ["#e74c3c", "#3498db", "#2ecc71"]
  }
}
```

### Response

- **Content-Type**: `image/png`
- **Body**: PNG image data (binary)

## � Usage Examples

## 💡 Usage Examples

### cURL
```bash
curl -X POST http://localhost:3000/api/wordcloud \
  -H "Content-Type: application/json" \
  -d '{
    "words": [
      {"text": "Hello", "value": 100},
      {"text": "World", "value": 80}
    ]
  }' \
  --output wordcloud.png
```

### JavaScript/Node.js
```javascript
const fetch = require('node-fetch');
const fs = require('fs');

async function generateWordCloud() {
  const response = await fetch('http://localhost:3000/api/wordcloud', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      words: [
        {text: 'JavaScript', value: 100},
        {text: 'API', value: 80}
      ]
    })
  });

  if (response.ok) {
    const buffer = await response.buffer();
    fs.writeFileSync('wordcloud.png', buffer);
    console.log('WordCloud saved!');
  }
}
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/api/wordcloud', 
  json={
    'words': [
      {'text': 'Python', 'value': 100},
      {'text': 'API', 'value': 80}
    ]
  }
)

if response.status_code == 200:
    with open('wordcloud.png', 'wb') as f:
        f.write(response.content)
    print('WordCloud saved!')
```

### PHP
```php
<?php
$data = [
    'words' => [
        ['text' => 'PHP', 'value' => 100],
        ['text' => 'API', 'value' => 80]
    ]
];

$ch = curl_init('http://localhost:3000/api/wordcloud');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

file_put_contents('wordcloud.png', $result);
echo "WordCloud saved!";
?>
```

## ⚙️ Configuration

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | number | 800 | Image width in pixels |
| `height` | number | 600 | Image height in pixels |
| `backgroundColor` | string | '#ffffff' | Background color (hex/named) |
| `colorScheme` | array | ['#1f77b4', ...] | Array of colors for words |

### Word Format

Each word object must contain:
- `text` (string): The word to display
- `value` (number): Weight/importance (affects font size)

## 🚀 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
git clone https://github.com/SimonRundell/WordCloudAPI.git
cd WordCloudAPI
npm install
```

### Available Scripts
```bash
npm start              # Start main server
npm run start:advanced # Start advanced D3.js server  
npm test              # Run test suite
npm run dev           # Development mode with auto-restart
npm run demo          # Open demo interface
```

### Project Structure
```
WordCloudAPI/
├── app-main.js          # 🚀 Main server (fast & reliable)
├── app.js              # 🎨 Advanced server (D3.js layouts)
├── test.js             # 🧪 Complete test suite
├── examples/           # 📖 Usage examples & demos
│   ├── demo.html       # 🌐 Visual demo interface
│   └── simple-usage.js # 📄 Basic usage example
├── package.json        # 📦 Dependencies & scripts
├── LICENSE            # 📄 MIT License
└── README.md          # 📚 This file
```

## 🧪 Testing

The project includes comprehensive tests:

```bash
npm test
```

Tests cover:
- ✅ Health check endpoint
- ✅ API documentation endpoint  
- ✅ Simple wordcloud generation
- ✅ Advanced wordcloud generation
- ✅ Error handling and validation

## 🚀 Deployment

### Docker (Recommended)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Production Considerations
- Use PM2 for process management
- Set up proper logging
- Add rate limiting
- Configure HTTPS
- Use environment variables for configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- [D3.js](https://d3js.org/) - Data visualization library
- [Puppeteer](https://pptr.dev/) - Headless Chrome automation
- [Express.js](https://expressjs.com/) - Web framework for Node.js

## 📞 Support

If you have any questions or need help, please:
- 📝 [Open an issue](https://github.com/SimonRundell/WordCloudAPI/issues)
- ⭐ Star this repository if you find it helpful!

---

Made with ❤️ by [Simon Rundell](https://github.com/SimonRundell)
