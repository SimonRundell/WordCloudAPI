# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-08-05

### Added
- 🚀 **Dual rendering engines**: Simple fast generation + Advanced D3.js layouts
- 🎨 **Advanced wordcloud endpoint** with D3.js and d3-cloud algorithms
- 🧪 **Comprehensive test suite** with automated testing
- 🌐 **Visual demo interface** for easy testing and experimentation
- 📖 **Usage examples** in multiple programming languages (JavaScript, Python, PHP, cURL)
- 🔧 **Flexible configuration options** for colors, dimensions, and styling
- ⚡ **Performance optimizations** with separate simple and advanced servers
- 📚 **Enhanced documentation** with API reference and examples
- 🛡️ **Improved error handling** and input validation
- 🌍 **CORS support** for cross-origin requests

### Changed
- 🔄 **Restructured project** with cleaner organization
- 📦 **Updated package.json** with proper GitHub repository links
- 🏗️ **Simplified main server** (`app-main.js`) for better reliability
- 📁 **Organized examples** into dedicated `examples/` folder
- 🎯 **Improved API responses** with better error messages

### Fixed
- 🐛 **React dependency conflicts** by moving to optional dependencies
- ⚡ **Memory leaks** in image generation process
- 🔒 **Puppeteer security** with proper browser launch arguments
- 📱 **Cross-platform compatibility** for different operating systems

### Security
- 🛡️ **Enhanced Puppeteer security** with sandboxing
- 🔐 **Input validation** to prevent malicious data
- 🚧 **Rate limiting preparation** for production deployment

## [1.0.0] - 2025-08-05

### Added
- 🎉 **Initial release** of WordCloud API
- 🚀 **Basic REST API** for wordcloud generation
- 🖼️ **PNG image output** with customizable dimensions
- 🎨 **Color scheme support** for word styling
- 📊 **Word value-based sizing** algorithm
- 🌐 **Express.js server** with CORS support
- 🧪 **Basic testing** functionality
- 📚 **Initial documentation** and README

### Technical Details
- Built with Node.js and Express.js
- Uses Puppeteer for server-side rendering
- Supports customizable word layouts
- Returns high-quality PNG images
- RESTful API design with JSON input

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions  
- **PATCH** version for backwards-compatible bug fixes

## Contributors

- **Simon Rundell** - Initial work and ongoing development

## Links

- [GitHub Repository](https://github.com/SimonRundell/WordCloudAPI)
- [Issues](https://github.com/SimonRundell/WordCloudAPI/issues)
- [Pull Requests](https://github.com/SimonRundell/WordCloudAPI/pulls)
