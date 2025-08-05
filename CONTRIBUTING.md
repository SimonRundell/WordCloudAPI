# Contributing to WordCloud API

Thank you for your interest in contributing to WordCloud API! We welcome contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Make your changes
5. Test your changes
6. Submit a pull request

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include system information** (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **Include examples of how the feature would work**

### Contributing Code

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to let others know you're working on it
3. Fork the repository and create a feature branch
4. Make your changes with clear commit messages
5. Add tests for new functionality
6. Ensure all tests pass
7. Submit a pull request

## 🛠️ Development Setup

```bash
# Clone your fork
git clone https://github.com/YourUsername/WordCloudAPI.git
cd WordCloudAPI

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## 📝 Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Add tests** for new functionality

4. **Ensure tests pass**:
   ```bash
   npm test
   ```

5. **Update documentation** if needed

6. **Commit your changes** with descriptive messages:
   ```bash
   git commit -m "Add new wordcloud layout algorithm"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (if applicable)
   - List of changes made

## 📐 Coding Standards

### JavaScript Style

- Use ES6+ features where appropriate
- Use `const` and `let` instead of `var`
- Use arrow functions for short functions
- Use async/await instead of callbacks
- Add JSDoc comments for functions
- Follow existing code formatting

### Example:
```javascript
/**
 * Generate a wordcloud from an array of words
 * @param {Array} words - Array of word objects with text and value
 * @param {Object} options - Configuration options
 * @returns {Promise<Buffer>} PNG image buffer
 */
async function generateWordCloud(words, options = {}) {
  // Implementation
}
```

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when applicable

Examples:
```
Add advanced D3.js wordcloud layout
Fix memory leak in image generation
Update dependencies to latest versions
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting
- Include both positive and negative test cases
- Test error handling scenarios

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `documentation` - Improvements to docs
- `performance` - Performance improvements

## 🔄 Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create release notes
4. Tag release on GitHub
5. Publish to npm (maintainers only)

## ❓ Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing documentation

Thank you for contributing to WordCloud API! 🎉
